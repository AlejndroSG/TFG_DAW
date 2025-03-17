<?php
require_once("bd.php");

class Cursos {
    private $conn;

    public function __construct() {
        $bd = new db();
        $this->conn = $bd->getConn();
    }

    public function obtenerCursos() {
        $sentencia = "SELECT cursos.id_curso, cursos.titulo, cursos.descripcion, cursos.precio, cursos.duracion, cursos.tipo_Curso, usuarios.nombre FROM cursos, usuarios WHERE cursos.id_profesor = usuarios.id_usuario";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_result($id, $titulo, $descripcion, $precio, $duracion, $tipo_curso, $profesor);
        $consulta->execute();
        $cursos = array();
        while($consulta->fetch()){
            $cursos[] = array("id" => $id, "titulo" => $titulo, "descripcion" => $descripcion, "precio" => $precio, "duracion" => $duracion, "tipo_curso" => $tipo_curso, "profesor" => $profesor);
        }
        $consulta->close();
        return $cursos;
    }

    public function obtenerCurso($id) {
        $sentencia = "SELECT cursos.id_curso, cursos.titulo, cursos.descripcion, cursos.precio, cursos.duracion, cursos.tipo_Curso, usuarios.nombre FROM cursos, usuarios WHERE cursos.id_profesor = usuarios.id_usuario AND cursos.id_curso = ?";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("i", $id);
        $consulta->bind_result($id, $titulo, $descripcion, $precio, $duracion, $tipo_curso, $profesor);
        $consulta->execute();
        $curso = array();
        while($consulta->fetch()){
            $curso[] = array("id" => $id, "titulo" => $titulo, "descripcion" => $descripcion, "precio" => $precio, "duracion" => $duracion, "tipo_curso" => $tipo_curso, "profesor" => $profesor);
        }
        $consulta->close();
        return $curso;
    }

    public function obtenerMisCursos($id) {
        // var_dump($id);
        $sentencia = "SELECT cursos.id_curso, cursos.titulo, cursos.descripcion, cursos.precio, cursos.duracion, cursos.tipo_Curso, usuarios.nombre FROM cursos, usuarios WHERE cursos.id_profesor = usuarios.id_usuario AND cursos.id_curso in (select id_curso from inscripciones where id_usuario = ?)";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("i", $id);
        $consulta->bind_result($id, $titulo, $descripcion, $precio, $duracion, $tipo_curso, $profesor);
        $consulta->execute();
        $cursos = array();
        while($consulta->fetch()){
            $cursos[] = array("id" => $id, "titulo" => $titulo, "descripcion" => $descripcion, "precio" => $precio, "duracion" => $duracion, "tipo_curso" => $tipo_curso, "profesor" => $profesor);
        }
        $consulta->close();
        return $cursos;
    }
}
?>