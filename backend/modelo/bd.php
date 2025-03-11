<?php
    require_once("../../../cred.php");

    class db{
        private $conn;
        public function __construct(){
            $this->conn = new mysqli("localhost", "root", "", "learnia");
            $this->conn->set_charset("utf8");
        }

        public function getConn() {
            return $this->conn;
        }
        
        // Comprobamos si las credenciales son correctas
        public function compCredenciales(String $nom, String $psw){
            $sentencia = "SELECT nombre, tipo_usuario FROM usuarios WHERE nombre = ? AND contraseña = ?"; 
            $consulta = $this->conn->prepare($sentencia);
            $consulta->bind_param("ss", $nom, $psw);
            $consulta->bind_result($nombre, $tipo_usuario);
            $consulta->execute();
            $consulta->fetch();
            $comprobar = array("nombre" => $nombre, "tipo_usuario" => $tipo_usuario);
            $consulta->close();
            return $comprobar;
        }
    }
?>