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
    }
?>