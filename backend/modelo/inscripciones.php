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
            
            $fecha = $datos["fecha_inscripcion"];
            error_log("Binding parameters: usuario={$id_usuario}, curso={$id_curso}, fecha={$fecha}");
            
            $consulta->bind_param("iis", 
                $id_usuario, 
                $id_curso, 
                $fecha
            );
            $resultado = $consulta->execute();
            
            if ($resultado) {
                $id_inscripcion = $this->conn->insert_id;
                $consulta->close();
                return [
                    "success" => true, 
                    "message" => "Inscripción completada con éxito", 
                    "id_inscripcion" => $id_inscripcion
                ];
            } else {
                $consulta->close();
                return ["success" => false, "message" => "Error al procesar la inscripción: " . $this->conn->error];
            }
        } catch (Exception $e) {
            error_log("Excepción en inscribirCurso: " . $e->getMessage());
            return ["success" => false, "message" => "Error al procesar la inscripción: " . $e->getMessage()];
        }
    }
    
    public function obtenerInscripciones($id_usuario) {
        $sentencia = "SELECT i.id_inscripcion, i.id_curso, i.fecha_inscripcion, i.estado, c.titulo 
                     FROM inscripciones i 
                     JOIN cursos c ON i.id_curso = c.id_curso 
                     WHERE i.id_usuario = ?";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("i", $id_usuario);
        $consulta->bind_result($id_inscripcion, $id_curso, $fecha_inscripcion, $estado, $titulo);
        $consulta->execute();
        
        $inscripciones = array();
        while($consulta->fetch()){
            $inscripciones[] = array(
                "id_inscripcion" => $id_inscripcion, 
                "id_curso" => $id_curso,
                "fecha_inscripcion" => $fecha_inscripcion,
                "estado" => $estado,
                "titulo_curso" => $titulo
            );
        }
        $consulta->close();
        return $inscripciones;
    }
    
    // Obtener todos los usuarios inscritos en un curso específico
    public function obtenerUsuariosPorCurso($id_curso) {
        try {
            // Verificamos primero que el curso exista
            $sentenciaVerificar = "SELECT id_curso FROM cursos WHERE id_curso = ?";
            $consultaVerificar = $this->conn->prepare($sentenciaVerificar);
            
            if ($consultaVerificar === false) {
                return ["error" => "Error en la consulta de verificación: " . $this->conn->error];
            }
            
            $consultaVerificar->bind_param("i", $id_curso);
            $consultaVerificar->execute();
            $consultaVerificar->store_result();
            
            if ($consultaVerificar->num_rows === 0) {
                $consultaVerificar->close();
                return ["error" => "El curso especificado no existe"];
            }
            $consultaVerificar->close();
            
            // Ahora obtenemos los usuarios inscritos
            $sentencia = "SELECT u.id_usuario, u.nombre, u.nombre AS username, u.email, i.id_inscripcion, i.fecha_inscripcion 
                        FROM inscripciones i 
                        JOIN usuarios u ON i.id_usuario = u.id_usuario 
                        WHERE i.id_curso = ? 
                        ORDER BY i.fecha_inscripcion DESC";
            
            $consulta = $this->conn->prepare($sentencia);
            
            if ($consulta === false) {
                return ["error" => "Error en la consulta: " . $this->conn->error];
            }
            
            $consulta->bind_param("i", $id_curso);
            $consulta->execute();
            
            $resultado = $consulta->get_result();
            $usuarios = array();
            
            while($fila = $resultado->fetch_assoc()) {
                $usuarios[] = array(
                    "id_usuario" => $fila["id_usuario"],
                    "nombre" => $fila["nombre"],
                    "username" => $fila["username"],
                    "email" => $fila["email"],
                    "id_inscripcion" => $fila["id_inscripcion"],
                    "fecha_inscripcion" => $fila["fecha_inscripcion"]
                );
            }
            
            $consulta->close();
            return $usuarios;
            
        } catch (Exception $e) {
            return ["error" => "Error al obtener usuarios inscritos: " . $e->getMessage()];
        }
    }
    
    // Eliminar la inscripción de un usuario a un curso
    public function eliminarInscripcion($id_usuario, $id_curso) {
        try {
            // Verificar que la inscripción existe
            $sentenciaVerificar = "SELECT id_inscripcion FROM inscripciones WHERE id_usuario = ? AND id_curso = ?";
            $consultaVerificar = $this->conn->prepare($sentenciaVerificar);
            
            if ($consultaVerificar === false) {
                return ["success" => false, "error" => "Error en la consulta de verificación: " . $this->conn->error];
            }
            
            $consultaVerificar->bind_param("ii", $id_usuario, $id_curso);
            $consultaVerificar->execute();
            $consultaVerificar->store_result();
            
            if ($consultaVerificar->num_rows === 0) {
                $consultaVerificar->close();
                return ["success" => false, "error" => "No se encontró la inscripción"];
            }
            $consultaVerificar->close();
            
            // Eliminar la inscripción
            $sentencia = "DELETE FROM inscripciones WHERE id_usuario = ? AND id_curso = ?";
            $consulta = $this->conn->prepare($sentencia);
            
            if ($consulta === false) {
                return ["success" => false, "error" => "Error en la consulta de eliminación: " . $this->conn->error];
            }
            
            $consulta->bind_param("ii", $id_usuario, $id_curso);
            $resultado = $consulta->execute();
            
            if ($resultado) {
                $filas_afectadas = $consulta->affected_rows;
                $consulta->close();
                
                if ($filas_afectadas > 0) {
                    return ["success" => true, "message" => "Inscripción eliminada correctamente"];
                } else {
                    return ["success" => false, "error" => "No se pudo eliminar la inscripción"];
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
     * Verifica si la tabla inscripciones existe y la crea si no
     * Este método es especialmente útil para la primera instalación
     */
    private function crearTablaSiNoExiste() {
        // Verificar si la tabla ya existe
        $sentencia = "SHOW TABLES LIKE 'inscripciones'";
        $resultado = $this->conn->query($sentencia);
        
        if ($resultado->num_rows == 0) {
            // La tabla no existe, crearla
            error_log("Creando tabla inscripciones...");
            $sql = "CREATE TABLE inscripciones (
                id_inscripcion INT(11) AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT(11) NOT NULL,
                id_curso INT(11) NOT NULL,
                fecha_inscripcion DATETIME NOT NULL,
                FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
                FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
            
            if ($this->conn->query($sql) === FALSE) {
                error_log("Error al crear la tabla inscripciones: " . $this->conn->error);
                // Intentar crear una versión simplificada sin claves foráneas
                $sql_simple = "CREATE TABLE inscripciones (
                    id_inscripcion INT(11) AUTO_INCREMENT PRIMARY KEY,
                    id_usuario INT(11) NOT NULL,
                    id_curso INT(11) NOT NULL,
                    fecha_inscripcion DATETIME NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
                
                if ($this->conn->query($sql_simple) === FALSE) {
                    error_log("Error al crear la tabla simplificada de inscripciones: " . $this->conn->error);
                } else {
                    error_log("Tabla inscripciones creada con éxito (versión sin claves foráneas)");
                }
            } else {
                error_log("Tabla inscripciones creada con éxito");
            }
        }
    }
}
?>
