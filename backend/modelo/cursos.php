<?php
require_once("bd.php");

class Cursos {
    private $conn;

    public function __construct() {
        $bd = new db();
        $this->conn = $bd->getConn();
    }

    public function obtenerCursos() {
        $sentencia = "SELECT cursos.id_curso, cursos.titulo, cursos.descripcion, cursos.precio, cursos.duracion, cursos.tipo_Curso, usuarios.nombre, cursos.imgCurso FROM cursos, usuarios WHERE cursos.id_profesor = usuarios.id_usuario";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_result($id, $titulo, $descripcion, $precio, $duracion, $tipo_curso, $profesor, $imgCurso);
        $consulta->execute();
        $cursos = array();
        while($consulta->fetch()){
            $cursos[] = array("id" => $id, "titulo" => $titulo, "descripcion" => $descripcion, "precio" => $precio, "duracion" => $duracion, "tipo_curso" => $tipo_curso, "profesor" => $profesor , "imgCurso" => $imgCurso);
        }
        $consulta->close();
        return $cursos;
    }

    public function obtenerCurso($id) {
        $sentencia = "SELECT cursos.id_curso, cursos.titulo, cursos.descripcion, cursos.precio, cursos.duracion, cursos.tipo_Curso, usuarios.nombre, cursos.imgCurso FROM cursos, usuarios WHERE cursos.id_profesor = usuarios.id_usuario AND cursos.id_curso = ?";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("i", $id);
        $consulta->bind_result($id, $titulo, $descripcion, $precio, $duracion, $tipo_curso, $profesor, $imgCurso);
        $consulta->execute();
        
        if ($consulta->fetch()) {
            $curso = array(
                "id" => $id,
                "titulo" => $titulo,
                "descripcion" => $descripcion,
                "precio" => $precio,
                "duracion" => $duracion,
                "tipo_curso" => $tipo_curso,
                "profesor" => $profesor,
                "imgCurso" => $imgCurso
            );
        } else {
            $curso = null;
        }
        
        $consulta->close();
        return $curso;
    }

    public function obtenerMisCursos($id) {
        $sentencia = "SELECT cursos.id_curso, cursos.titulo, cursos.descripcion, cursos.precio, cursos.duracion, cursos.tipo_Curso, usuarios.nombre, cursos.imgCurso FROM cursos, usuarios, inscripciones WHERE inscripciones.id_usuario = ? AND inscripciones.id_curso = cursos.id_curso AND cursos.id_profesor = usuarios.id_usuario";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("i", $id);
        $consulta->bind_result($id, $titulo, $descripcion, $precio, $duracion, $tipo_curso, $profesor, $imgCurso);
        $consulta->execute();
        $cursos = array();
        while($consulta->fetch()){
            $cursos[] = array("id" => $id, "titulo" => $titulo, "descripcion" => $descripcion, "precio" => $precio, "duracion" => $duracion, "tipo_curso" => $tipo_curso, "profesor" => $profesor, "imgCurso" => $imgCurso);
        }
        $consulta->close();
        return $cursos;
    }
    
    public function obtenerTodosCursos() {
        $cursos = array();
        
        // Consulta principal para obtener datos bu00e1sicos de los cursos, adaptada a la estructura actual
        $sentencia = "
            SELECT c.id_curso, c.titulo, c.descripcion, c.precio, c.duracion, c.tipo_Curso, 
                   u.nombre as profesor, c.imgCurso
            FROM cursos c
            JOIN usuarios u ON c.id_profesor = u.id_usuario
        ";
        
        $resultado = $this->conn->query($sentencia);
        
        if ($resultado && $resultado->num_rows > 0) {
            while ($fila = $resultado->fetch_assoc()) {
                $id_curso = $fila['id_curso'];
                
                // Contar nu00famero de estudiantes inscritos
                $sentenciaEstudiantes = "SELECT COUNT(*) as total FROM inscripciones WHERE id_curso = $id_curso";
                $resultadoEstudiantes = $this->conn->query($sentenciaEstudiantes);
                $estudiantes = 0;
                
                if ($resultadoEstudiantes && $resultadoEstudiantes->num_rows > 0) {
                    $filaEstudiantes = $resultadoEstudiantes->fetch_assoc();
                    $estudiantes = $filaEstudiantes['total'];
                }
                
                // Valores predeterminados para campos que no existen en la BD actual
                $valoracion = 0;
                $modulos = 0;
                
                // Intentar obtener valoraciu00f3n si existe la tabla
                try {
                    $sentenciaValoracion = "SELECT AVG(valoracion) as promedio FROM valoraciones WHERE id_curso = $id_curso";
                    $resultadoValoracion = $this->conn->query($sentenciaValoracion);
                    
                    if ($resultadoValoracion && $resultadoValoracion->num_rows > 0) {
                        $filaValoracion = $resultadoValoracion->fetch_assoc();
                        $valoracion = $filaValoracion['promedio'] ? round($filaValoracion['promedio'], 1) : 0;
                    }
                } catch (Exception $e) {
                    // La tabla valoraciones no existe, se mantiene el valor predeterminado
                }
                
                // Intentar contar mu00f3dulos si existe la tabla
                try {
                    $sentenciaModulos = "SELECT COUNT(*) as total FROM modulos WHERE id_curso = $id_curso";
                    $resultadoModulos = $this->conn->query($sentenciaModulos);
                    
                    if ($resultadoModulos && $resultadoModulos->num_rows > 0) {
                        $filaModulos = $resultadoModulos->fetch_assoc();
                        $modulos = $filaModulos['total'];
                    }
                } catch (Exception $e) {
                    // La tabla modulos no existe, se mantiene el valor predeterminado
                }
                
                // Agregar toda la informaciu00f3n al array de cursos con valores predeterminados para campos faltantes
                $cursos[] = array(
                    'id' => $id_curso,
                    'titulo' => $fila['titulo'],
                    'descripcion' => $fila['descripcion'],
                    'imgCurso' => $fila['imgCurso'],
                    'precio' => (float)$fila['precio'],
                    'profesor' => $fila['profesor'],
                    'duracion' => (int)$fila['duracion'],
                    'estudiantes' => $estudiantes,
                    'valoracion' => $valoracion,
                    'publicado' => true, // Valor predeterminado
                    'destacado' => false, // Valor predeterminado
                    'tipo_curso' => $fila['tipo_Curso'],
                    'fecha_creacion' => date('Y-m-d'), // Fecha actual como predeterminada
                    'modulos' => $modulos
                );
            }
        }
        
        return $cursos;
    }
}
?>