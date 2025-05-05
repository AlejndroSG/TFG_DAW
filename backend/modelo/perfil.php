<?php
require_once("bd.php");

class Perfil {
    private $conn;

    public function __construct() {
        $bd = new db();
        $this->conn = $bd->getConn();
    }

    public function obtenerPerfil($id) {
        $sentencia = "SELECT nombre, email, tipo_usuario FROM usuarios WHERE id_usuario = ?";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("i", $id);
        $consulta->bind_result($nombre, $email, $tipo_usuario);
        $consulta->execute();
        
        if ($consulta->fetch()) {
            $perfil = array(
                "id" => $id,
                "nombre" => $nombre,
                "email" => $email,
                "tipo_usuario" => $tipo_usuario
            );
        } else {
            $perfil = array(
                "error" => "Usuario no encontrado"
            );
        }
        
        $consulta->close();
        return $perfil;
    }

    public function actualizarPerfil($datos) {
        if (!isset($_SESSION['id'])) {
            return array("error" => "Usuario no autenticado");
        }

        $sentencia = "UPDATE usuarios SET nombre = ?, email = ? WHERE id_usuario = ?";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("ssi", $datos['nombre'], $datos['email'], $_SESSION['id']);
        
        if ($consulta->execute()) {
            return array("success" => true);
        } else {
            return array("error" => "Error al actualizar el perfil");
        }
    }

    public function obtenerPassword($id_usuario) {
        $sentencia = "SELECT contraseña FROM usuarios WHERE id_usuario = ?";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("i", $id_usuario);
        $consulta->bind_result($contraseña);
        $consulta->execute();
        
        if ($consulta->fetch()) {
            $resultado = array(
                "contraseña" => $contraseña
            );
        } else {
            $resultado = array(
                "error" => "Usuario no encontrado"
            );
        }
        
        $consulta->close();
        return $resultado;
    }

    public function cambiarPassword($datos) {
        if (!isset($_SESSION['id'])) {
            return array("error" => "Usuario no autenticado");
        }

        if (!isset($datos['password_actual']) || !isset($datos['password_nuevo'])) {
            return array("error" => "Datos incompletos");
        }

        // Verificar la contraseña actual
        $sentencia = "SELECT contraseña FROM usuarios WHERE id_usuario = ?";
        $consulta = $this->conn->prepare($sentencia);
        $consulta->bind_param("i", $_SESSION['id']);
        $consulta->bind_result($password_actual);
        $consulta->execute();
        $consulta->fetch();
        $consulta->close();

        // Comparar directamente las contraseñas (sin hash)
        if ($datos['password_actual'] !== $password_actual) {
            return array("error" => "Contraseña actual incorrecta");
        }

        // Actualizar la contraseña
        $sentencia = "UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?";
        $consulta = $this->conn->prepare($sentencia);
        // No usamos hash ya que las contraseñas se almacenan en texto plano
        $consulta->bind_param("si", $datos['password_nuevo'], $_SESSION['id']);
        
        if ($consulta->execute()) {
            return array("success" => true);
        } else {
            return array("error" => "Error al cambiar la contraseña");
        }
    }
}