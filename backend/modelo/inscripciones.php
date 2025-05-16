<?php
require_once("bd.php");

class Inscripciones {
    private $conn;

    public function __construct() {
        $bd = new db();
        $this->conn = $bd->getConn();
    }

    public function inscribirCurso($datos) {
        try {
            // Comprobar si el usuario ya está inscrito en el curso
            $sentenciaVerificar = "SELECT id_inscripcion FROM inscripciones WHERE id_usuario = ? AND id_curso = ?";
            $consultaVerificar = $this->conn->prepare($sentenciaVerificar);
            $consultaVerificar->bind_param("ii", $datos["id_usuario"], $datos["id_curso"]);
            $consultaVerificar->execute();
            $consultaVerificar->store_result();
            
            // Si ya existe la inscripción, devolver un mensaje
            if ($consultaVerificar->num_rows > 0) {
                $consultaVerificar->close();
                return ["success" => false, "message" => "Ya estás inscrito en este curso"];
            }
            $consultaVerificar->close();
            
            // Insertar nuevo registro en la tabla inscripciones
            $sentencia = "INSERT INTO inscripciones (id_usuario, id_curso, fecha_inscripcion) VALUES (?, ?, ?)";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("iis", 
                $datos["id_usuario"], 
                $datos["id_curso"], 
                $datos["fecha_inscripcion"]
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
}
?>
