<?php
    // Clase para manejar las estadísticas e informes del sistema
    class Estadisticas {
        private $conn;
        
        public function __construct() {
            // Conectar a la base de datos
            $this->conn = new mysqli("localhost", "root", "", "TFG_DAW");
            if ($this->conn->connect_error) {
                error_log("Error de conexión a la base de datos: " . $this->conn->connect_error);
            }
            $this->conn->set_charset("utf8");
        }
        
        // Obtener estadísticas de ventas/inscripciones con filtro de usuario opcional
        public function obtenerEstadisticasVentas($fecha_inicio = null, $fecha_fin = null, $id_usuario = null) {
            // Si no se proporcionan fechas, usar el último mes
            if (!$fecha_inicio) {
                $fecha_inicio = date("Y-m-d", strtotime("-30 days"));
            }
            
            if (!$fecha_fin) {
                $fecha_fin = date("Y-m-d");
            }
            
            error_log("Generando estadísticas de ventas desde $fecha_inicio hasta $fecha_fin" . ($id_usuario ? " para usuario ID: $id_usuario" : ""));
            
            // Usaremos consultas simples para mayor compatibilidad
            $total_ingresos = 0;
            $datos = [];
            
            // Primero comprobamos si podemos acceder a las inscripciones
            $sql = "SELECT COUNT(*) as total FROM inscripciones";
            $result = $this->conn->query($sql);
            
            if (!$result) {
                error_log("Error al verificar tabla inscripciones: " . $this->conn->error);
                return [
                    "titulo" => "Ventas e Ingresos",
                    "periodo" => "Del $fecha_inicio al $fecha_fin",
                    "totales" => ["ingresos" => 0, "transacciones" => 0],
                    "datos" => []
                ];
            }
            
            // Preparamos la consulta base
            $sql = "SELECT i.* FROM inscripciones i WHERE fecha_inscripcion BETWEEN '$fecha_inicio' AND '$fecha_fin'";
            
            // Añadir filtro de usuario si se proporciona
            if ($id_usuario) {
                $sql .= " AND i.id_usuario = $id_usuario";
            }
            
            $sql .= " ORDER BY fecha_inscripcion DESC";
            error_log("Ejecutando consulta: $sql");
            
            $resultado = $this->conn->query($sql);
            
            if (!$resultado) {
                error_log("Error en la consulta de inscripciones: " . $this->conn->error);
                return [
                    "titulo" => "Ventas e Ingresos",
                    "periodo" => "Del $fecha_inicio al $fecha_fin",
                    "totales" => ["ingresos" => 0, "transacciones" => 0],
                    "datos" => []
                ];
            }
            
            // Procesar cada inscripción
            while ($inscripcion = $resultado->fetch_assoc()) {
                $id_curso = $inscripcion['id_curso'] ?? 0;
                $id_usuario = $inscripcion['id_usuario'] ?? 0;
                
                // Obtener datos del curso
                $infoCurso = $this->conn->query("SELECT titulo, precio FROM cursos WHERE id_curso = $id_curso");
                $curso = $infoCurso && $infoCurso->num_rows > 0 ? $infoCurso->fetch_assoc() : null;
                
                // Obtener datos del usuario
                $infoUsuario = $this->conn->query("SELECT username as nombre_usuario FROM usuarios WHERE id = $id_usuario");
                $usuario = $infoUsuario && $infoUsuario->num_rows > 0 ? $infoUsuario->fetch_assoc() : null;
                
                $titulo_curso = $curso ? $curso['titulo'] : "Curso #$id_curso";
                $precio = $curso ? floatval($curso['precio']) : 0;
                $nombre_usuario = $usuario ? $usuario['nombre_usuario'] : "Usuario #$id_usuario";
                
                $datos[] = [
                    "id" => $inscripcion["id_inscripcion"],
                    "fecha" => $inscripcion["fecha_inscripcion"],
                    "curso" => $titulo_curso,
                    "valor" => $precio,
                    "usuario" => $nombre_usuario,
                    "id_usuario" => $id_usuario
                ];
                
                $total_ingresos += $precio;
            }
            
            return [
                "titulo" => "Ventas e Ingresos",
                "periodo" => "Del $fecha_inicio al $fecha_fin",
                "totales" => [
                    "ingresos" => $total_ingresos,
                    "transacciones" => count($datos)
                ],
                "datos" => $datos
            ];
        }
        
        // Obtener lista de usuarios para filtro
        public function obtenerUsuariosFiltro() {
            $datos = [];
            
            // Verificar que la tabla usuarios existe
            $sql = "SHOW TABLES LIKE 'usuarios'";
            $result = $this->conn->query($sql);
            
            if (!$result || $result->num_rows == 0) {
                error_log("La tabla usuarios no existe");
                return [];
            }
            
            // Consulta para obtener usuarios
            $sql = "SELECT id, username, email FROM usuarios ORDER BY username ASC";
            $resultado = $this->conn->query($sql);
            
            if (!$resultado) {
                error_log("Error al obtener usuarios: " . $this->conn->error);
                return [];
            }
            
            // Procesar resultados
            while ($usuario = $resultado->fetch_assoc()) {
                $datos[] = [
                    "id" => $usuario["id"],
                    "nombre" => $usuario["username"],
                    "email" => $usuario["email"]
                ];
            }
            
            return $datos;
        }
    }
?>