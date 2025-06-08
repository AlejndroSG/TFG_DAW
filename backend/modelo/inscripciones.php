<?php
require_once("bd.php");

class Inscripciones {
    private $conn;

    public function __construct() {
        $bd = new db();
        $this->conn = $bd->getConn();
        
        // Verificar y crear la tabla al instanciar el objeto
        $this->crearTablaSiNoExiste();
    }

    /**
     * Inscribe a un usuario en un curso
     * @param array $datos Datos de inscripción (id_usuario, id_curso)
     * @return array Resultado de la operación
     */
    public function inscribirCurso($datos) {
        try {
            // Registrar detalles para depuración
            error_log("Intentando inscribir usuario en curso con datos: " . json_encode($datos));
            
            // Verificar que la tabla inscripciones existe
            $this->crearTablaSiNoExiste();
            
            // Comprobar si el usuario ya está inscrito en el curso
            $sentenciaVerificar = "SELECT id_inscripcion FROM inscripciones WHERE id_usuario = ? AND id_curso = ?";
            $consultaVerificar = $this->conn->prepare($sentenciaVerificar);
            
            if ($consultaVerificar === false) {
                error_log("Error al preparar consulta de verificación: " . $this->conn->error);
                return ["success" => false, "message" => "Error al verificar inscripción existente"];
            }
            
            // Convertir valores a enteros para asegurar tipo correcto
            $id_usuario = intval($datos["id_usuario"]);
            $id_curso = intval($datos["id_curso"]);
            
            $consultaVerificar->bind_param("ii", $id_usuario, $id_curso);
            $consultaVerificar->execute();
            $consultaVerificar->store_result();
            
            // Si ya existe la inscripción, devolver un mensaje
            if ($consultaVerificar->num_rows > 0) {
                error_log("Usuario ya inscrito en este curso");
                $consultaVerificar->close();
                return ["success" => false, "message" => "Ya estás inscrito en este curso"];
            }
            $consultaVerificar->close();
            
            // Insertar nuevo registro en la tabla inscripciones
            $sentencia = "INSERT INTO inscripciones (id_usuario, id_curso, fecha_inscripcion) VALUES (?, ?, ?)";
            $consulta = $this->conn->prepare($sentencia);
            
            if ($consulta === false) {
                error_log("Error al preparar consulta de inserción: " . $this->conn->error);
                return ["success" => false, "message" => "Error al preparar la inscripción"];
            }
            
            $fecha_actual = date('Y-m-d H:i:s');
            $consulta->bind_param("iis", $id_usuario, $id_curso, $fecha_actual);
            
            if ($consulta->execute()) {
                $id_inscripcion = $this->conn->insert_id;
                $consulta->close();
                error_log("Inscripción completada con éxito. ID: {$id_inscripcion}");
                
                return [
                    "success" => true, 
                    "message" => "Te has inscrito correctamente al curso", 
                    "id_inscripcion" => $id_inscripcion
                ];
            } else {
                error_log("Error al ejecutar consulta de inserción: " . $this->conn->error);
                $consulta->close();
                return ["success" => false, "message" => "Error al procesar la inscripción"];
            }
            
        } catch (Exception $e) {
            error_log("Excepción al inscribir curso: " . $e->getMessage());
            return ["success" => false, "message" => "Error al procesar la inscripción: " . $e->getMessage()];
        }
    }
    
    /**
     * Elimina la inscripción de un usuario a un curso
     * @param int $id_usuario ID del usuario
     * @param int $id_curso ID del curso
     * @return array Resultado de la operación
     */
    public function eliminarInscripcion($id_usuario, $id_curso) {
        try {
            // Verificar que la tabla inscripciones existe
            $this->crearTablaSiNoExiste();
            
            // Preparar consulta de eliminación
            $sentencia = "DELETE FROM inscripciones WHERE id_usuario = ? AND id_curso = ?";
            $consulta = $this->conn->prepare($sentencia);
            
            if ($consulta === false) {
                return ["success" => false, "error" => "Error al preparar la consulta: " . $this->conn->error];
            }
            
            // Convertir valores a enteros
            $id_usuario = intval($id_usuario);
            $id_curso = intval($id_curso);
            
            $consulta->bind_param("ii", $id_usuario, $id_curso);
            
            if ($consulta->execute()) {
                $consulta->close();
                if ($this->conn->affected_rows > 0) {
                    return ["success" => true, "message" => "Inscripción eliminada correctamente"];
                } else {
                    return ["success" => false, "error" => "No se encontró la inscripción para eliminar"];
                }
            } else {
                $consulta->close();
                return ["success" => false, "error" => "Error al eliminar la inscripción: " . $this->conn->error];
            }
        } catch (Exception $e) {
            return ["success" => false, "error" => "Error al eliminar la inscripción: " . $e->getMessage()];
        }
    }
    
    /**
     * Obtiene los usuarios inscritos en un curso específico
     * @param int $id_curso ID del curso
     * @return array Lista de usuarios inscritos
     */
    public function obtenerUsuariosPorCurso($id_curso) {
        try {
            // Verificar que la tabla existe
            $this->crearTablaSiNoExiste();
            
            // Convertir a entero
            $id_curso = intval($id_curso);
            
            $sentencia = "SELECT u.*, i.fecha_inscripcion, i.progreso, i.completado 
                        FROM inscripciones i
                        JOIN usuarios u ON i.id_usuario = u.id_usuario
                        WHERE i.id_curso = ?
                        ORDER BY i.fecha_inscripcion DESC";
            
            $consulta = $this->conn->prepare($sentencia);
            
            if ($consulta === false) {
                error_log("Error al preparar consulta: " . $this->conn->error);
                return ["error" => "Error al preparar la consulta"];
            }
            
            $consulta->bind_param("i", $id_curso);
            $consulta->execute();
            $resultado = $consulta->get_result();
            
            $usuarios = [];
            while ($usuario = $resultado->fetch_assoc()) {
                // Eliminamos datos sensibles
                unset($usuario['password']);
                $usuarios[] = $usuario;
            }
            
            $consulta->close();
            return $usuarios;
        } catch (Exception $e) {
            error_log("Error al obtener usuarios por curso: " . $e->getMessage());
            return ["error" => "Error al obtener usuarios: " . $e->getMessage()];
        }
    }
    
    /**
     * Verifica directamente si un usuario está inscrito en un curso específico
     * @param int $id_usuario ID del usuario
     * @param int $id_curso ID del curso
     * @return array Resultado con estado de inscripción
     */
    public function verificarInscripcion($id_usuario, $id_curso) {
        try {
            // Asegurar que los IDs son números enteros
            $id_usuario = intval($id_usuario);
            $id_curso = intval($id_curso);
            
            error_log("MODELO: Verificando inscripción para usuario=$id_usuario, curso=$id_curso");
            
            // Consulta directa para verificar inscripción
            $sentencia = "SELECT * FROM inscripciones WHERE id_usuario = ? AND id_curso = ? AND estado = 'activo' LIMIT 1";
            $consulta = $this->conn->prepare($sentencia);
            
            if ($consulta === false) {
                $error = "Error al preparar consulta: " . $this->conn->error;
                error_log("MODELO ERROR: " . $error);
                return ["inscrito" => false, "error" => $error];
            }
            
            $consulta->bind_param("ii", $id_usuario, $id_curso);
            
            if (!$consulta->execute()) {
                $error = "Error al ejecutar consulta: " . $consulta->error;
                error_log("MODELO ERROR: " . $error);
                $consulta->close();
                return ["inscrito" => false, "error" => $error];
            }
            
            $resultado = $consulta->get_result();
            
            // Verificar si hay resultados
            $inscrito = $resultado->num_rows > 0;
            
            if ($inscrito) {
                $datos = $resultado->fetch_assoc();
                error_log("MODELO: Usuario $id_usuario ESTÁ inscrito en curso $id_curso. Datos: " . json_encode($datos));
                $consulta->close();
                return [
                    "inscrito" => true,
                    "fecha_inscripcion" => $datos['fecha_inscripcion'],
                    "progreso" => $datos['progreso'],
                    "completado" => $datos['completado'] == 1
                ];
            } else {
                error_log("MODELO: Usuario $id_usuario NO está inscrito en curso $id_curso");
                $consulta->close();
                return ["inscrito" => false];
            }
            
        } catch (Exception $e) {
            $error = "Excepción al verificar inscripción: " . $e->getMessage();
            error_log("MODELO EXCEPCIÓN: " . $error);
            return ["inscrito" => false, "error" => $error];
        }
    }
    
    /**
     * Verifica si existe la tabla inscripciones y la crea si no existe
     */
    public function crearTablaSiNoExiste() {
        // Comprobar si la tabla existe
        $consultaTabla = "SHOW TABLES LIKE 'inscripciones'";
        $resultado = $this->conn->query($consultaTabla);
        
        // Si la tabla no existe, crearla
        if ($resultado->num_rows == 0) {
            error_log("La tabla inscripciones no existe. Creando tabla...");
            
            $sentenciaCrear = "CREATE TABLE inscripciones (
                id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT NOT NULL,
                id_curso INT NOT NULL,
                fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
                estado VARCHAR(50) DEFAULT 'activo',
                progreso INT DEFAULT 0,
                completado TINYINT(1) DEFAULT 0,
                UNIQUE KEY unique_inscripcion (id_usuario, id_curso),
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
            )";
            
            if ($this->conn->query($sentenciaCrear) === TRUE) {
                error_log("Tabla inscripciones creada exitosamente");
            } else {
                error_log("Error al crear tabla inscripciones: " . $this->conn->error);
                
                // Si falla por las claves foráneas, intentar una versión simplificada
                $sentenciaSimple = "CREATE TABLE inscripciones (
                    id_inscripcion INT AUTO_INCREMENT PRIMARY KEY,
                    id_usuario INT NOT NULL,
                    id_curso INT NOT NULL,
                    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
                    estado VARCHAR(50) DEFAULT 'activo',
                    progreso INT DEFAULT 0,
                    completado TINYINT(1) DEFAULT 0,
                    UNIQUE KEY unique_inscripcion (id_usuario, id_curso)
                )";
                
                if ($this->conn->query($sentenciaSimple) === TRUE) {
                    error_log("Tabla inscripciones creada con versión simplificada");
                } else {
                    error_log("Error al crear tabla simplificada: " . $this->conn->error);
                }
            }
        } else {
            // Verificar y añadir columnas si faltan
            $columnas = [
                "estado" => "ALTER TABLE inscripciones ADD COLUMN estado VARCHAR(50) DEFAULT 'activo' AFTER fecha_inscripcion",
                "progreso" => "ALTER TABLE inscripciones ADD COLUMN progreso INT DEFAULT 0 AFTER estado",
                "completado" => "ALTER TABLE inscripciones ADD COLUMN completado TINYINT(1) DEFAULT 0 AFTER progreso"
            ];
            
            foreach ($columnas as $columna => $sql) {
                $verificarColumna = "SHOW COLUMNS FROM inscripciones LIKE '{$columna}'";
                $existe = $this->conn->query($verificarColumna);
                
                if ($existe->num_rows == 0) {
                    $this->conn->query($sql);
                    error_log("Añadida columna {$columna} a la tabla inscripciones");
                }
            }
        }
    }
    
    /**
     * Obtiene todos los cursos en los que está inscrito un usuario
     * @param int $id_usuario ID del usuario
     * @return array Lista de cursos con detalles o mensaje de error
     */
    public function obtenerCursosUsuario($id_usuario) {
        try {
            // Asegurar que la tabla existe
            $this->crearTablaSiNoExiste();
            
            // Convertir el id a entero para asegurar el tipo correcto
            $id_usuario = intval($id_usuario);
            error_log("Obteniendo cursos para el usuario ID: {$id_usuario}");
            
            // Verificar primero que el usuario existe
            $verificarUsuario = "SELECT id_usuario FROM usuarios WHERE id_usuario = ?";
            $consultaUsuario = $this->conn->prepare($verificarUsuario);
            
            if ($consultaUsuario === false) {
                $error = "Error al preparar consulta de verificación de usuario: " . $this->conn->error;
                error_log($error);
                return ["error" => $error];
            }
            
            $consultaUsuario->bind_param("i", $id_usuario);
            $consultaUsuario->execute();
            $consultaUsuario->store_result();
            
            if ($consultaUsuario->num_rows == 0) {
                $error = "No se encontró el usuario con ID: {$id_usuario}";
                error_log($error);
                $consultaUsuario->close();
                return ["error" => $error];
            }
            $consultaUsuario->close();
            
            // Ahora verificamos primero si existen inscripciones para este usuario
            $verificarInscripciones = "SELECT COUNT(*) as total FROM inscripciones WHERE id_usuario = ?";
            $consultaVerificar = $this->conn->prepare($verificarInscripciones);
            
            if ($consultaVerificar === false) {
                $error = "Error al preparar consulta de verificación de inscripciones: " . $this->conn->error;
                error_log($error);
                return ["error" => $error];
            }
            
            $consultaVerificar->bind_param("i", $id_usuario);
            $consultaVerificar->execute();
            $resultadoVerificar = $consultaVerificar->get_result();
            $fila = $resultadoVerificar->fetch_assoc();
            $totalInscripciones = $fila['total']; 
            $consultaVerificar->close();
            
            error_log("Total de inscripciones encontradas para usuario {$id_usuario}: {$totalInscripciones}");
            
            if ($totalInscripciones == 0) {
                // No hay inscripciones, pero esto no es un error, simplemente devolvemos un array vacío
                return [];
            }
            
            // Consulta para obtener los cursos con detalles (join con la tabla cursos)
            $sentencia = "SELECT c.*, i.fecha_inscripcion, i.progreso, i.completado 
                       FROM inscripciones i 
                       JOIN cursos c ON i.id_curso = c.id_curso 
                       WHERE i.id_usuario = ? AND i.estado = 'activo' 
                       ORDER BY i.fecha_inscripcion DESC";
            
            error_log("Consulta SQL a ejecutar: {$sentencia}");
            $consulta = $this->conn->prepare($sentencia);
            
            if ($consulta === false) {
                $error = "Error al preparar consulta de cursos: " . $this->conn->error;
                error_log($error);
                return ["error" => $error];
            }
            
            $consulta->bind_param("i", $id_usuario);
            
            if (!$consulta->execute()) {
                $error = "Error al ejecutar consulta: " . $consulta->error;
                error_log($error);
                $consulta->close();
                return ["error" => $error];
            }
            
            $resultado = $consulta->get_result();
            
            if ($resultado === false) {
                $error = "Error al obtener resultados: " . $consulta->error;
                error_log($error);
                $consulta->close();
                return ["error" => $error];
            }
            
            $cursos = [];
            while ($curso = $resultado->fetch_assoc()) {
                // Agregar un campo para indicar si el curso está completado (para facilitar el uso en frontend)
                $curso['progreso_completado'] = $curso['completado'] == 1;
                $cursos[] = $curso;
            }
            
            $consulta->close();
            
            error_log("Se encontraron " . count($cursos) . " cursos para el usuario ID: {$id_usuario}");
            return $cursos;
            
        } catch (Exception $e) {
            $error = "Excepción al obtener cursos del usuario: " . $e->getMessage() . " en la línea " . $e->getLine() . " del archivo " . $e->getFile();
            error_log($error);
            return ["error" => $error];
        }
    }
}
?>
