<?php
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

    function iniciarSesion(){
        if(session_status() == PHP_SESSION_NONE){
            session_start();
        }
        require_once("../modelo/bd.php");
        $modelo = new db();
        $msg = "<p style='color:red'>Credenciales incorrectas</p>";
        $comprobar = array();
        $comprobar = $modelo->compCredenciales($_POST["username"], $_POST["password"]);
        if(count($comprobar) == 0){
            echo json_encode($msg);
        }else{
            $_SESSION["username"] = $comprobar["nombre"];
            $_SESSION["tipo_usuario"] = $comprobar["tipo_usuario"];
            echo json_encode($comprobar);
        }
    }

    function obtenerCursos(){
        require_once("../modelo/cursos.php");
        $modelo = new Cursos();
        $cursos = array();
        $cursos = $modelo->obtenerCursos();
        echo json_encode($cursos);
    }
    
    
    
    // Si no ha sido iniciado el action
    if(isset($_REQUEST["action"])){
        $action = $_REQUEST["action"];
        $action(); //La cabra del sistema, lo acciona absolutamente todo
    }
?>