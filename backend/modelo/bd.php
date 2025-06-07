<?php
    require_once("../../../cred.php");

    class db{
        private $conn;
        public function __construct(){
            $this->conn = new mysqli("localhost", "root", "", "TFG_DAW");
            $this->conn->set_charset("utf8");
        }

        public function getConn() {
            return $this->conn;
        }
        
        // Obtener todos los usuarios para el panel de administraciu00f3n
        public function obtenerTodosUsuarios() {
            $usuarios = array();
            // Adaptamos la consulta a las columnas existentes en la BD
            $sentencia = "SELECT id_usuario, nombre, email, tipo_usuario, id_plan FROM usuarios ORDER BY id_usuario DESC";
            $resultado = $this->conn->query($sentencia);
            
            if ($resultado && $resultado->num_rows > 0) {
                while ($fila = $resultado->fetch_assoc()) {
                    // Obtener el nu00famero de cursos en los que estu00e1 inscrito cada usuario
                    $id_usuario = $fila['id_usuario'];
                    $sentenciaCursos = "SELECT COUNT(*) as total FROM inscripciones WHERE id_usuario = $id_usuario";
                    $resultadoCursos = $this->conn->query($sentenciaCursos);
                    $cursos_inscritos = 0;
                    
                    if ($resultadoCursos && $resultadoCursos->num_rows > 0) {
                        $filaCursos = $resultadoCursos->fetch_assoc();
                        $cursos_inscritos = $filaCursos['total'];
                    }
                    
                    // Agregar toda la informaciu00f3n al array de usuarios con valores predeterminados para campos faltantes
                    $usuarios[] = array(
                        'id' => $fila['id_usuario'],
                        'nombre' => $fila['nombre'],
                        'email' => $fila['email'],
                        'tipo_usuario' => $fila['tipo_usuario'],
                        'fecha_registro' => date('Y-m-d'), // Valor predeterminado ya que no existe en la BD
                        'activo' => true, // Valor predeterminado ya que no existe en la BD
                        'cursos_inscritos' => $cursos_inscritos,
                        'plan' => $fila['id_plan'] ? $fila['id_plan'] : 'Ninguno'
                    );
                }
            }
            
            return $usuarios;
        }
        
        // Comprobamos si las credenciales son correctas
        public function compCredenciales(String $nom, String $psw){
            $sentencia = "SELECT id_usuario, nombre, tipo_usuario FROM usuarios WHERE nombre = ? AND contraseña = ?"; 
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("ss", $nom, $psw);
            $consulta->bind_result($id, $nombre, $tipo_usuario);
            $consulta->execute();
            $consulta->fetch();
            $comprobar = array("id" => $id, "nombre" => $nombre, "tipo_usuario" => $tipo_usuario);
            $consulta->close();
            return $comprobar;
        }
        
        // Registrar un nuevo usuario
        public function registrarUsuario(String $nombre, String $email, String $password) {
            // Primero verificamos si el usuario ya existe
            $sentencia = "SELECT COUNT(*) FROM usuarios WHERE nombre = ? OR email = ?";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("ss", $nombre, $email);
            $consulta->bind_result($count);
            $consulta->execute();
            $consulta->fetch();
            $consulta->close();
            
            if ($count > 0) {
                return ["error" => "El nombre de usuario o email ya está en uso"];
            }
            
            // Si no existe, procedemos a registrar el usuario
            $tipo_usuario = "usuario"; // Por defecto, todos los nuevos registros son de tipo 'usuario'
            $sentencia = "INSERT INTO usuarios (nombre, email, contraseña, tipo_usuario) VALUES (?, ?, ?, ?)";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("ssss", $nombre, $email, $password, $tipo_usuario);
            
            if ($consulta->execute()) {
                $id = $this->conn->insert_id;
                $consulta->close();
                return [
                    "success" => true,
                    "mensaje" => "Usuario registrado correctamente",
                    "id" => $id,
                    "nombre" => $nombre,
                    "tipo_usuario" => $tipo_usuario
                ];
            } else {
                $consulta->close();
                return ["error" => "Error al registrar el usuario: " . $this->conn->error];
            }
        }
        
        // Función para actualizar un usuario existente
        public function actualizarUsuario($datos) {
            // Verificar si existe un usuario con el mismo email (excepto el usuario actual)
            $sentencia = "SELECT COUNT(*) FROM usuarios WHERE email = ? AND id_usuario != ?";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("si", $datos['email'], $datos['id']);
            $consulta->bind_result($count);
            $consulta->execute();
            $consulta->fetch();
            $consulta->close();
            
            if ($count > 0) {
                return ["error" => "El email ya está en uso por otro usuario"];
            }
            
            // Actualizar el usuario
            $activo = isset($datos['activo']) && $datos['activo'] ? 1 : 0;
            $sentencia = "UPDATE usuarios SET nombre = ?, email = ?, tipo_usuario = ? WHERE id_usuario = ?";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("sssi", $datos['nombre'], $datos['email'], $datos['tipo_usuario'], $datos['id']);
            
            if ($consulta->execute()) {
                $consulta->close();
                return [
                    "success" => true,
                    "mensaje" => "Usuario actualizado correctamente",
                    "id" => $datos['id'],
                    "nombre" => $datos['nombre'],
                    "email" => $datos['email'],
                    "tipo_usuario" => $datos['tipo_usuario'],
                    "activo" => (bool)$activo
                ];
            } else {
                $consulta->close();
                return ["error" => "Error al actualizar el usuario: " . $this->conn->error];
            }
        }
        
        // Función para crear un nuevo usuario
        public function crearUsuario($datos) {
            // Verificar si ya existe un usuario con el mismo nombre o email
            $sentencia = "SELECT COUNT(*) FROM usuarios WHERE nombre = ? OR email = ?";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("ss", $datos['nombre'], $datos['email']);
            $consulta->bind_result($count);
            $consulta->execute();
            $consulta->fetch();
            $consulta->close();
            
            if ($count > 0) {
                return ["error" => "El nombre de usuario o email ya está en uso"];
            }
            
            // Crear el usuario
            $sentencia = "INSERT INTO usuarios (nombre, email, contraseña, tipo_usuario) VALUES (?, ?, ?, ?)";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("ssss", $datos['nombre'], $datos['email'], $datos['password'], $datos['tipo_usuario']);
            
            if ($consulta->execute()) {
                $id = $this->conn->insert_id;
                $consulta->close();
                return [
                    "success" => true,
                    "mensaje" => "Usuario creado correctamente",
                    "id" => $id,
                    "nombre" => $datos['nombre'],
                    "email" => $datos['email'],
                    "tipo_usuario" => $datos['tipo_usuario'],
                    "activo" => true
                ];
            } else {
                $consulta->close();
                return ["error" => "Error al crear el usuario: " . $this->conn->error];
            }
        }
        
        // Función para eliminar un usuario
        public function eliminarUsuario($id_usuario) {
            // Log para diagnóstico
            error_log("Modelo - eliminarUsuario: ID recibido = $id_usuario, tipo: " . gettype($id_usuario));
            
            // Convertir a entero para asegurar compatibilidad
            $id_usuario = intval($id_usuario);
            error_log("Modelo - eliminarUsuario: ID convertido = $id_usuario");
            
            // Verificar si el usuario existe con el ID proporcionado
            $sentencia = "SELECT id_usuario FROM usuarios WHERE id_usuario = ?";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("i", $id_usuario);
            $consulta->execute();
            $consulta->store_result(); // Almacenar los resultados para verificar num_rows
            
            if ($consulta->num_rows == 0) {
                error_log("Modelo - eliminarUsuario: El usuario con ID $id_usuario no existe");
                $consulta->close();
                return ["error" => "El usuario con ID $id_usuario no existe"];
            }
            
            $consulta->close();
            
            // Eliminar inscripciones del usuario (para evitar errores de integridad referencial)
            $sentencia = "DELETE FROM inscripciones WHERE id_usuario = ?";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("i", $id_usuario);
            $result_inscripciones = $consulta->execute();
            $affected_inscripciones = $consulta->affected_rows;
            $consulta->close();
            
            error_log("Modelo - eliminarUsuario: Eliminación de inscripciones exitosa = " . ($result_inscripciones ? 'true' : 'false') . 
                     ", filas afectadas: $affected_inscripciones");
            
            // Eliminar el usuario
            $sentencia = "DELETE FROM usuarios WHERE id_usuario = ?";
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("i", $id_usuario);
            $result_usuario = $consulta->execute();
            $affected_usuarios = $consulta->affected_rows;
            $consulta->close();
            
            error_log("Modelo - eliminarUsuario: Eliminación de usuario exitosa = " . ($result_usuario ? 'true' : 'false') . 
                     ", filas afectadas: $affected_usuarios");
            
            if ($result_usuario) {
                return [
                    "success" => true,
                    "mensaje" => "Usuario eliminado correctamente",
                    "id" => $id_usuario
                ];
            } else {
                return [
                    "error" => "Error al eliminar el usuario: " . $this->conn->error,
                    "id" => $id_usuario
                ];
            }
        }
    }
?>