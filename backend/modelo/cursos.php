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
    
    // Crear un nuevo curso
    public function crearCurso($datos) {
        // Validar campos requeridos
        if (!isset($datos['titulo']) || empty($datos['titulo'])) {
            return ['error' => 'El título es obligatorio'];
        }
        
        if (!isset($datos['id_profesor']) || empty($datos['id_profesor'])) {
            // Si no se especifica, usamos el ID del profesor administrador por defecto (ID 3 en la base de datos)
            $datos['id_profesor'] = 3;
        }
        
        // Valores predeterminados
        $descripcion = isset($datos['descripcion']) ? $datos['descripcion'] : '';
        $precio = isset($datos['precio']) ? $datos['precio'] : 0;
        $duracion = isset($datos['duracion']) ? $datos['duracion'] : 0;
        $tipo_curso = isset($datos['tipo_curso']) ? $datos['tipo_curso'] : 'Básico';
        $imgCurso = isset($datos['imgCurso']) ? $datos['imgCurso'] : './src/img/imgCursos/default.jpg';
        
        // Insertar el nuevo curso
        $sentencia = "INSERT INTO cursos (titulo, descripcion, precio, duracion, id_profesor, tipo_Curso, imgCurso) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sentencia);
        $stmt->bind_param("ssdiiss", 
            $datos['titulo'], 
            $descripcion, 
            $precio, 
            $duracion, 
            $datos['id_profesor'], 
            $tipo_curso, 
            $imgCurso
        );
        
        if ($stmt->execute()) {
            $id_curso = $this->conn->insert_id;
            $stmt->close();
            
            return [
                'success' => true,
                'mensaje' => 'Curso creado correctamente',
                'id' => $id_curso,
                'curso' => $this->obtenerCursoDetalle($id_curso)
            ];
        } else {
            $stmt->close();
            return ['error' => 'Error al crear el curso: ' . $this->conn->error];
        }
    }
    
    // Actualizar un curso existente
    public function actualizarCurso($datos) {
        // Validar ID del curso
        if (!isset($datos['id']) || empty($datos['id'])) {
            return ['error' => 'ID de curso no proporcionado'];
        }
        
        // Verificar que el curso existe
        $curso = $this->obtenerCursoDetalle($datos['id']);
        if (!$curso) {
            return ['error' => 'El curso no existe'];
        }
        
        // Preparar campos a actualizar
        $campos_actualizables = [];
        $valores = [];
        $tipos = '';
        
        // Construir la consulta dinámicamente según los campos proporcionados
        if (isset($datos['titulo']) && !empty($datos['titulo'])) {
            $campos_actualizables[] = "titulo = ?";
            $valores[] = $datos['titulo'];
            $tipos .= 's';
        }
        
        if (isset($datos['descripcion'])) {
            $campos_actualizables[] = "descripcion = ?";
            $valores[] = $datos['descripcion'];
            $tipos .= 's';
        }
        
        if (isset($datos['precio'])) {
            $campos_actualizables[] = "precio = ?";
            $valores[] = $datos['precio'];
            $tipos .= 'd';
        }
        
        if (isset($datos['duracion'])) {
            $campos_actualizables[] = "duracion = ?";
            $valores[] = $datos['duracion'];
            $tipos .= 'i';
        }
        
        if (isset($datos['tipo_curso'])) {
            $campos_actualizables[] = "tipo_Curso = ?";
            $valores[] = $datos['tipo_curso'];
            $tipos .= 's';
        }
        
        if (isset($datos['imgCurso']) && !empty($datos['imgCurso'])) {
            $campos_actualizables[] = "imgCurso = ?";
            $valores[] = $datos['imgCurso'];
            $tipos .= 's';
        }
        
        // Si no hay campos para actualizar
        if (empty($campos_actualizables)) {
            return [
                'success' => true,
                'mensaje' => 'No hay cambios para aplicar',
                'curso' => $curso
            ];
        }
        
        // Construir la consulta SQL
        $sentencia = "UPDATE cursos SET " . implode(", ", $campos_actualizables) . " WHERE id_curso = ?";
        
        // Añadir el ID al final de los valores y tipos
        $valores[] = $datos['id'];
        $tipos .= 'i';
        
        $stmt = $this->conn->prepare($sentencia);
        
        // Enlazar parámetros dinámicamente
        $stmt->bind_param($tipos, ...$valores);
        
        if ($stmt->execute()) {
            $stmt->close();
            $curso_actualizado = $this->obtenerCursoDetalle($datos['id']);
            
            return [
                'success' => true,
                'mensaje' => 'Curso actualizado correctamente',
                'curso' => $curso_actualizado
            ];
        } else {
            $stmt->close();
            return ['error' => 'Error al actualizar el curso: ' . $this->conn->error];
        }
    }
    
    // Cambiar el estado de publicación o destacado de un curso
    public function cambiarEstadoCurso($id, $campo, $valor) {
        // Validar el campo (solo permitimos publicado o destacado)
        if ($campo != 'publicado' && $campo != 'destacado') {
            return ['error' => 'Campo no válido para actualizar'];
        }
        
        // Verificar si existe la columna en la tabla
        try {
            // Si la columna no existe, la agregamos
            $verificar = "SHOW COLUMNS FROM cursos LIKE '$campo'";
            $resultado = $this->conn->query($verificar);
            
            if ($resultado->num_rows == 0) {
                $alter = "ALTER TABLE cursos ADD COLUMN $campo TINYINT(1) NOT NULL DEFAULT 0";
                $this->conn->query($alter);
            }
            
            // Actualizar el estado
            $valor_bool = $valor ? 1 : 0;
            $sentencia = "UPDATE cursos SET $campo = ? WHERE id_curso = ?";
            $stmt = $this->conn->prepare($sentencia);
            $stmt->bind_param("ii", $valor_bool, $id);
            
            if ($stmt->execute()) {
                $stmt->close();
                return [
                    'success' => true,
                    'mensaje' => 'Estado actualizado correctamente',
                    'id' => $id,
                    'campo' => $campo,
                    'valor' => $valor
                ];
            } else {
                $stmt->close();
                return ['error' => 'Error al actualizar el estado: ' . $this->conn->error];
            }
        } catch (Exception $e) {
            return ['error' => 'Error al actualizar el estado: ' . $e->getMessage()];
        }
    }
    
    // Eliminar un curso
    public function eliminarCurso($id) {
        // Primero eliminar las inscripciones asociadas
        $sentencia = "DELETE FROM inscripciones WHERE id_curso = ?";
        $stmt = $this->conn->prepare($sentencia);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $stmt->close();
        
        // Luego eliminar el curso
        $sentencia = "DELETE FROM cursos WHERE id_curso = ?";
        $stmt = $this->conn->prepare($sentencia);
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            $filas_afectadas = $stmt->affected_rows;
            $stmt->close();
            
            if ($filas_afectadas > 0) {
                return [
                    'success' => true,
                    'mensaje' => 'Curso eliminado correctamente',
                    'id' => $id
                ];
            } else {
                return ['error' => 'No se encontró el curso especificado'];
            }
        } else {
            $stmt->close();
            return ['error' => 'Error al eliminar el curso: ' . $this->conn->error];
        }
    }
    
    // Obtener un curso específico por ID con detalles adicionales
    public function obtenerCursoDetalle($id) {
        $sentencia = "
            SELECT c.id_curso, c.titulo, c.descripcion, c.precio, c.duracion, c.tipo_Curso, 
                   u.nombre as profesor, c.imgCurso, c.id_profesor
            FROM cursos c
            JOIN usuarios u ON c.id_profesor = u.id_usuario
            WHERE c.id_curso = ?
        ";
        
        $stmt = $this->conn->prepare($sentencia);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $resultado = $stmt->get_result();
        
        if ($resultado && $resultado->num_rows > 0) {
            $fila = $resultado->fetch_assoc();
            $stmt->close();
            
            // Contar número de estudiantes inscritos
            $sentenciaEstudiantes = "SELECT COUNT(*) as total FROM inscripciones WHERE id_curso = ?";
            $stmtEst = $this->conn->prepare($sentenciaEstudiantes);
            $stmtEst->bind_param("i", $id);
            $stmtEst->execute();
            $resultadoEst = $stmtEst->get_result();
            $estudiantes = 0;
            
            if ($resultadoEst && $resultadoEst->num_rows > 0) {
                $filaEst = $resultadoEst->fetch_assoc();
                $estudiantes = $filaEst['total'];
            }
            $stmtEst->close();
            
            // Valores predeterminados para campos que no existen en la BD actual
            $valoracion = 0;
            $modulos = 0;
            $publicado = true;
            $destacado = false;
            
            // Verificar si existen las columnas publicado y destacado
            try {
                $verificarPublicado = "SHOW COLUMNS FROM cursos LIKE 'publicado'";
                $resultPublicado = $this->conn->query($verificarPublicado);
                if ($resultPublicado && $resultPublicado->num_rows > 0) {
                    $sentenciaPublicado = "SELECT publicado FROM cursos WHERE id_curso = ?";
                    $stmtPub = $this->conn->prepare($sentenciaPublicado);
                    $stmtPub->bind_param("i", $id);
                    $stmtPub->execute();
                    $resultPub = $stmtPub->get_result();
                    if ($resultPub && $resultPub->num_rows > 0) {
                        $filaPub = $resultPub->fetch_assoc();
                        $publicado = (bool)$filaPub['publicado'];
                    }
                    $stmtPub->close();
                }
                
                $verificarDestacado = "SHOW COLUMNS FROM cursos LIKE 'destacado'";
                $resultDestacado = $this->conn->query($verificarDestacado);
                if ($resultDestacado && $resultDestacado->num_rows > 0) {
                    $sentenciaDestacado = "SELECT destacado FROM cursos WHERE id_curso = ?";
                    $stmtDest = $this->conn->prepare($sentenciaDestacado);
                    $stmtDest->bind_param("i", $id);
                    $stmtDest->execute();
                    $resultDest = $stmtDest->get_result();
                    if ($resultDest && $resultDest->num_rows > 0) {
                        $filaDest = $resultDest->fetch_assoc();
                        $destacado = (bool)$filaDest['destacado'];
                    }
                    $stmtDest->close();
                }
            } catch (Exception $e) {
                // Si hay algún error, mantenemos los valores predeterminados
            }
            
            // Intentar obtener valoración si existe la tabla
            try {
                $sentenciaValoracion = "SELECT AVG(valoracion) as promedio FROM valoraciones WHERE id_curso = ?";
                $stmtVal = $this->conn->prepare($sentenciaValoracion);
                if ($stmtVal) {
                    $stmtVal->bind_param("i", $id);
                    $stmtVal->execute();
                    $resultadoVal = $stmtVal->get_result();
                
                    if ($resultadoVal && $resultadoVal->num_rows > 0) {
                        $filaVal = $resultadoVal->fetch_assoc();
                        $valoracion = $filaVal['promedio'] ? round($filaVal['promedio'], 1) : 0;
                    }
                    $stmtVal->close();
                }
            } catch (Exception $e) {
                // La tabla valoraciones no existe, se mantiene el valor predeterminado
            }
            
            // Intentar contar módulos si existe la tabla
            try {
                $sentenciaModulos = "SELECT COUNT(*) as total FROM modulos WHERE id_curso = ?";
                $stmtMod = $this->conn->prepare($sentenciaModulos);
                if ($stmtMod) {
                    $stmtMod->bind_param("i", $id);
                    $stmtMod->execute();
                    $resultadoMod = $stmtMod->get_result();
                    
                    if ($resultadoMod && $resultadoMod->num_rows > 0) {
                        $filaMod = $resultadoMod->fetch_assoc();
                        $modulos = $filaMod['total'];
                    }
                    $stmtMod->close();
                }
            } catch (Exception $e) {
                // La tabla modulos no existe, se mantiene el valor predeterminado
            }
            
            // Construir y devolver el objeto curso
            return [
                'id' => $fila['id_curso'],
                'titulo' => $fila['titulo'],
                'descripcion' => $fila['descripcion'],
                'imgCurso' => $fila['imgCurso'],
                'precio' => (float)$fila['precio'],
                'profesor' => $fila['profesor'],
                'id_profesor' => $fila['id_profesor'],
                'duracion' => (int)$fila['duracion'],
                'estudiantes' => $estudiantes,
                'valoracion' => $valoracion,
                'publicado' => $publicado,
                'destacado' => $destacado,
                'tipo_curso' => $fila['tipo_Curso'],
                'fecha_creacion' => date('Y-m-d'), // Fecha actual como predeterminada
                'modulos' => $modulos
            ];
        } else {
            $stmt->close();
            return null;
        }
    }
}
?>