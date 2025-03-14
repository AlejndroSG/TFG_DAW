<?php
require_once("bd.php");

class Cursos {
    private $conn;

    public function __construct() {
        $bd = new db();
        $this->conn = $bd->getConn();
    }

    public function obtenerCursos() {
        $sentencia = "SELECT * ,usuarios.nombre FROM cursos";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->execute();
        $cursos = array();
        while($consulta->fetch()){
            $cursos[] = array(
                "id" => $this->conn->insert_id,
                "nombre" => $this->conn->insert_id,
                "descripcion" => $this->conn->insert_id,
                "precio" => $this->conn->insert_id
            );
        }
        $consulta->close();
        return $cursos;
    }
}
?>