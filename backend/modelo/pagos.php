<?php
require_once("bd.php");

class Pagos {
    private $conn;

    public function __construct() {
        $bd = new db();
        $this->conn = $bd->getConn();
        
        // Verificar y crear la tabla al instanciar el objeto
        $this->crearTablaSiNoExiste();
    }

    /**
     * Registra un nuevo pago en la base de datos
     * @param array $datos Datos del pago a registrar
     * @return array Resultado de la operación
     */
    public function registrarPago($datos) {
        try {
            // Verificar si existe una tabla de pagos, y si no, crearla
            // Esto debe ejecutarse en el constructor para asegurar que la tabla exista para todas las operaciones
            $this->crearTablaSiNoExiste();
            
            // Log para depuración
            error_log("Registrando pago con datos: " . print_r($datos, true));
            
            // Insertar nuevo registro en la tabla pagos
            $sentencia = "INSERT INTO pagos (id_usuario, id_curso, fecha_pago, monto, metodo_pago, estado, referencia) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)";
            $consulta = $this->conn->prepare($sentencia);
            
            if ($consulta === false) {
                return ["success" => false, "message" => "Error al preparar la consulta: " . $this->conn->error];
            }
            
            // Primero verificamos que todos los datos necesarios estén presentes
            // y los convertimos a los tipos adecuados para la base de datos
            $id_usuario = intval($datos["id_usuario"]);
            $id_curso = intval($datos["id_curso"]);
            $fecha_pago = $datos["fecha_pago"];
            $monto = floatval($datos["monto"]);
            $metodo_pago = $datos["metodo_pago"];
            $estado = $datos["estado"];
            $referencia = $datos["referencia"];
            
            // Log de depuración para los valores procesados
            error_log("Valores para insertar: usuario={$id_usuario}, curso={$id_curso}, monto={$monto}");
            
            // IMPORTANTE: Contemos los parámetros y asegurar que coinciden
            // Tenemos 7 parámetros: id_usuario, id_curso, fecha_pago, monto, metodo_pago, estado, referencia
            // Por lo tanto, necesitamos 7 tipos: i=integer, d=float, s=string
            error_log("Parámetros para bind_param: " . json_encode([
                'id_usuario' => $id_usuario, 
                'id_curso' => $id_curso, 
                'fecha_pago' => $fecha_pago,
                'monto' => $monto,
                'metodo_pago' => $metodo_pago,
                'estado' => $estado,
                'referencia' => $referencia
            ]));
            
            // Evitar problemas con bind_param usando una consulta directa
            // IMPORTANTE: Esta técnica debe usarse con precaución y solo con datos validados
            // para evitar inyección SQL
            
            // Escapar los valores de cadena para evitar inyección SQL
            $metodo_pago_esc = $this->conn->real_escape_string($metodo_pago);
            $estado_esc = $this->conn->real_escape_string($estado);
            $referencia_esc = $this->conn->real_escape_string($referencia);
            $fecha_pago_esc = $this->conn->real_escape_string($fecha_pago);
            
            // Construir la consulta directa
            $sql = "INSERT INTO pagos (id_usuario, id_curso, fecha_pago, monto, metodo_pago, estado, referencia) 
                   VALUES ({$id_usuario}, {$id_curso}, '{$fecha_pago_esc}', {$monto}, '{$metodo_pago_esc}', '{$estado_esc}', '{$referencia_esc}')";               
            
            error_log("Ejecutando consulta SQL directa: {$sql}");  
            
            // Ejecutar la consulta directamente
            $resultado = $this->conn->query($sql);
            
            if ($resultado) {
                $id_pago = $this->conn->insert_id;
                
                // Ya tenemos todos los datos del pago, los devolvemos directamente
                // en lugar de hacer otra consulta a la base de datos
                $pago = [
                    "id_pago" => $id_pago,
                    "id_usuario" => $id_usuario,
                    "id_curso" => $id_curso,
                    "fecha_pago" => $fecha_pago,
                    "monto" => $monto,
                    "metodo_pago" => $metodo_pago,
                    "estado" => $estado,
                    "referencia" => $referencia
                ];
                
                // Agregamos log para verificar que el pago se ha registrado correctamente
                error_log("Pago registrado exitosamente con ID: {$id_pago}");
                
                return [
                    "success" => true, 
                    "message" => "Pago registrado con éxito", 
                    "id_pago" => $id_pago,
                    "pago" => $pago
                ];
            } else {
                $error = $this->conn->error;
                error_log("Error al ejecutar la consulta de inserción: {$error}");
                return ["success" => false, "message" => "Error al registrar el pago: {$error}"];
            }
        } catch (Exception $e) {
            return ["success" => false, "message" => "Error al registrar el pago: " . $e->getMessage()];
        }
    }
    
    /**
     * Obtiene un pago específico por su ID
     * @param int $id_pago ID del pago a obtener
     * @return array|null Datos del pago o null si no existe
     */
    public function obtenerPagoPorId($id_pago) {
        $sentencia = "SELECT p.*, c.titulo as curso_titulo, u.nombre as usuario_nombre 
                     FROM pagos p 
                     LEFT JOIN cursos c ON p.id_curso = c.id_curso 
                     LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario 
                     WHERE p.id_pago = ?";
        $consulta = $this->conn->prepare($sentencia);
        
        if ($consulta === false) {
            return null;
        }
        
        $consulta->bind_param("i", $id_pago);
        $consulta->execute();
        $resultado = $consulta->get_result();
        
        if ($fila = $resultado->fetch_assoc()) {
            $consulta->close();
            return $fila;
        }
        
        $consulta->close();
        return null;
    }
    
    /**
     * Obtiene el historial de pagos de un usuario
     * @param int $id_usuario ID del usuario
     * @return array Lista de pagos del usuario
     */
    public function obtenerHistorialPagos($id_usuario) {
        // Primero verificamos si la tabla existe
        $tablaExiste = $this->verificarTabla();
        if (!$tablaExiste) {
            return ["error" => "La tabla de pagos aún no existe. No hay historial disponible."];
        }
        
        // Verificamos si la tabla tiene las columnas necesarias
        $tieneIdCurso = $this->verificarColumna('id_curso');
        
        if (!$tieneIdCurso) {
            // Si no tiene id_curso, usamos una consulta más simple
            $sentencia = "SELECT p.* FROM pagos p WHERE p.id_usuario = ? ORDER BY p.fecha_pago DESC";
        } else {
            $sentencia = "SELECT p.*, c.titulo as curso_titulo 
                         FROM pagos p 
                         LEFT JOIN cursos c ON p.id_curso = c.id_curso 
                         WHERE p.id_usuario = ? 
                         ORDER BY p.fecha_pago DESC";
        }
        
        $consulta = $this->conn->prepare($sentencia);
        
        if ($consulta === false) {
            return ["error" => "Error en la consulta: " . $this->conn->error];
        }
        
        $consulta->bind_param("i", $id_usuario);
        $consulta->execute();
        $resultado = $consulta->get_result();
        
        $pagos = array();
        while($fila = $resultado->fetch_assoc()) {
            $pagos[] = $fila;
        }
        
        $consulta->close();
        return $pagos;
    }
    
    /**
     * Obtiene todos los pagos para el administrador
     * @return array Lista de todos los pagos
     */
    public function obtenerTodosPagos() {
        // Primero verificamos si la tabla existe
        $tablaExiste = $this->verificarTabla();
        if (!$tablaExiste) {
            return ["error" => "La tabla de pagos aún no existe. No hay historial disponible."];
        }
        
        // Verificamos si la tabla tiene las columnas necesarias
        $tieneIdCurso = $this->verificarColumna('id_curso');
        $tieneIdUsuario = $this->verificarColumna('id_usuario');
        
        if (!$tieneIdCurso || !$tieneIdUsuario) {
            // Si faltan columnas esenciales, usamos una consulta simple
            $sentencia = "SELECT p.* FROM pagos p ORDER BY p.fecha_pago DESC";
        } else {
            $sentencia = "SELECT p.*, c.titulo as curso_titulo, u.nombre as usuario_nombre 
                         FROM pagos p 
                         LEFT JOIN cursos c ON p.id_curso = c.id_curso 
                         LEFT JOIN usuarios u ON p.id_usuario = u.id_usuario 
                         ORDER BY p.fecha_pago DESC";
        }
        
        $consulta = $this->conn->prepare($sentencia);
        
        if ($consulta === false) {
            return ["error" => "Error en la consulta: " . $this->conn->error];
        }
        
        $consulta->execute();
        $resultado = $consulta->get_result();
        
        $pagos = array();
        while($fila = $resultado->fetch_assoc()) {
            $pagos[] = $fila;
        }
        
        $consulta->close();
        return $pagos;
    }
    
    /**
     * Verifica si la tabla de pagos existe y la crea si no
     * Este método es especialmente útil para la primera instalación
     */
    /**
     * Verifica si la tabla pagos existe en la base de datos
     * @return bool True si la tabla existe, False si no
     */
    private function verificarTabla() {
        $sentencia = "SHOW TABLES LIKE 'pagos'";
        $resultado = $this->conn->query($sentencia);
        return $resultado->num_rows > 0;
    }
    
    /**
     * Verifica si una columna específica existe en la tabla pagos
     * @param string $nombreColumna Nombre de la columna a verificar
     * @return bool True si la columna existe, False si no
     */
    private function verificarColumna($nombreColumna) {
        if (!$this->verificarTabla()) {
            return false;
        }
        
        $sentencia = "DESCRIBE pagos";
        $resultado = $this->conn->query($sentencia);
        $columnas = [];
        while ($fila = $resultado->fetch_assoc()) {
            $columnas[] = $fila['Field'];
        }
        
        return in_array($nombreColumna, $columnas);
    }
    
    private function crearTablaSiNoExiste() {
        // Verificar si la tabla ya existe
        $sentencia = "SHOW TABLES LIKE 'pagos'";
        $resultado = $this->conn->query($sentencia);
        
        if ($resultado->num_rows == 0) {
            // La tabla no existe, crearla
            $sql = "CREATE TABLE pagos (
                id_pago INT(11) AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT(11) NOT NULL,
                id_curso INT(11) NOT NULL,
                fecha_pago DATETIME NOT NULL,
                monto DECIMAL(10,2) NOT NULL,
                metodo_pago VARCHAR(50) NOT NULL,
                estado VARCHAR(50) NOT NULL,
                referencia VARCHAR(50) NOT NULL,
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
            
            if ($this->conn->query($sql) === FALSE) {
                error_log("Error al crear la tabla pagos: " . $this->conn->error);
                // Intentar crear una versión simplificada de la tabla si falla con las claves foráneas
                $sql_simple = "CREATE TABLE pagos (
                    id_pago INT(11) AUTO_INCREMENT PRIMARY KEY,
                    id_usuario INT(11) NOT NULL,
                    id_curso INT(11) NOT NULL,
                    fecha_pago DATETIME NOT NULL,
                    monto DECIMAL(10,2) NOT NULL,
                    metodo_pago VARCHAR(50) NOT NULL,
                    estado VARCHAR(50) NOT NULL,
                    referencia VARCHAR(50) NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
                
                if ($this->conn->query($sql_simple) === FALSE) {
                    error_log("Error al crear la tabla simplificada de pagos: " . $this->conn->error);
                } else {
                    error_log("Tabla pagos creada con éxito (versión simplificada sin claves foráneas)");
                }
            } else {
                error_log("Tabla pagos creada con éxito");
            }
        } else {
            // Verificar que la tabla tiene la estructura correcta
            $sentencia = "DESCRIBE pagos";
            $resultado = $this->conn->query($sentencia);
            $columnas = [];
            while ($fila = $resultado->fetch_assoc()) {
                $columnas[] = $fila['Field'];
            }
            
            // Verificar si existen todas las columnas necesarias
            $columnasNecesarias = [
                'id_curso' => ["INT(11) NOT NULL", "AFTER id_usuario"],
                'fecha_pago' => ["DATETIME NOT NULL", "AFTER id_curso"],
                'monto' => ["DECIMAL(10,2) NOT NULL", "AFTER fecha_pago"],
                'metodo_pago' => ["VARCHAR(50) NOT NULL", "AFTER monto"],
                'estado' => ["VARCHAR(50) NOT NULL", "AFTER metodo_pago"],
                'referencia' => ["VARCHAR(50) NOT NULL", "AFTER estado"]
            ];
            
            foreach ($columnasNecesarias as $columna => $detalles) {
                if (!in_array($columna, $columnas)) {
                    error_log("La tabla pagos existe pero le falta la columna {$columna}. Intentando añadirla.");
                    $sql = "ALTER TABLE pagos ADD COLUMN {$columna} {$detalles[0]} {$detalles[1]}";
                    if ($this->conn->query($sql) === FALSE) {
                        error_log("Error al añadir columna {$columna}: " . $this->conn->error);
                    } else {
                        error_log("Columna {$columna} añadida con éxito");
                    }
                }
            }
        }
    }
}
?>
