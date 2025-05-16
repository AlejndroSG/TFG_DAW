<?php
    // Configurar cookies antes de cualquier salida
    ini_set('session.cookie_lifetime', '86400');    // 24 horas
    ini_set('session.gc_maxlifetime', '86400');     // 24 horas
    ini_set('session.use_strict_mode', '1');        // Modo estricto para seguridad
    ini_set('session.cookie_httponly', '1');        // Prevenir acceso JS a la cookie
    ini_set('session.use_only_cookies', '1');       // Solo usar cookies para sesiones
    ini_set('session.cookie_samesite', 'Lax');      // Configuración más compatible
    
    session_start();
    
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Accept");
    header("Content-Type: application/json; charset=UTF-8");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit(0);
    }

    function comprobarSesion(){
        $response = array(
            'id' => isset($_SESSION['id']) ? $_SESSION['id'] : null,
            'username' => isset($_SESSION['username']) ? $_SESSION['username'] : null,
            'tipo_usuario' => isset($_SESSION['tipo_usuario']) ? $_SESSION['tipo_usuario'] : null,
            'sessionId' => session_id()
        );
        
        echo json_encode($response);
    }
    
    function iniciarSesion(){
        if (!isset($_POST["username"]) || !isset($_POST["password"])) {
            echo json_encode(["error" => "Datos de login incompletos"]);
            return;
        }
        
        require_once("../modelo/bd.php");
        $modelo = new db();
        $comprobar = $modelo->compCredenciales($_POST["username"], $_POST["password"]);
        
        if(empty($comprobar)) {
            echo json_encode(["error" => "Credenciales incorrectas"]);
            return;
        }
        
        session_regenerate_id(true);
        
        $_SESSION['id'] = $comprobar['id'];
        $_SESSION['username'] = $comprobar['nombre'];
        $_SESSION['tipo_usuario'] = $comprobar['tipo_usuario'];
        
        $response = array(
            'id' => $_SESSION['id'],
            'username' => $_SESSION['username'],
            'tipo_usuario' => $_SESSION['tipo_usuario'],
            'sessionId' => session_id()
        );
        
        echo json_encode($response);
    }

    function obtenerCursos(){
        require_once("../modelo/cursos.php");
        $modelo = new Cursos();
        $cursos = array();
        $cursos = $modelo->obtenerCursos();
        
        echo json_encode($cursos);
    }

    function obtenerPerfil(){
        if (!isset($_SESSION['id'])) {
            echo json_encode(["error" => "Usuario no autenticado"]);
            return;
        }

        require_once("../modelo/perfil.php");
        $perfil = new Perfil();
        $datos = $perfil->obtenerPerfil($_SESSION['id']);
        
        // Eliminar la contraseña de los datos
        if (isset($datos['contraseña'])) {
            unset($datos['contraseña']);
        }
        
        echo json_encode($datos);
    }

    function obtenerPassword(){
        if (!isset($_SESSION['id'])) {
            echo json_encode(["error" => "Usuario no autenticado"]);
            return;
        }

        require_once("../modelo/perfil.php");
        $perfil = new Perfil();
        $datos = $perfil->obtenerPassword($_SESSION['id']);
        echo json_encode($datos);
    }

    function actualizarPerfil(){
        if (!isset($_SESSION['id'])) {
            echo json_encode(["error" => "Usuario no autenticado"]);
            return;
        }

        if (!isset($_POST["nombre"]) || !isset($_POST["email"])) {
            echo json_encode(["error" => "Datos incompletos"]);
            return;
        }

        require_once("../modelo/perfil.php");
        $perfil = new Perfil();
        $datos = array(
            "nombre" => $_POST["nombre"],
            "email" => $_POST["email"]
        );
        $resultado = $perfil->actualizarPerfil($datos);
        echo json_encode($resultado);
    }

    function cambiarPassword(){
        if (!isset($_SESSION['id'])) {
            echo json_encode(["error" => "Usuario no autenticado"]);
            return;
        }

        if (!isset($_POST["password_actual"]) || !isset($_POST["password_nuevo"])) {
            echo json_encode(["error" => "Datos incompletos"]);
            return;
        }

        require_once("../modelo/perfil.php");
        $perfil = new Perfil();
        $datos = array(
            "password_actual" => $_POST["password_actual"],
            "password_nuevo" => $_POST["password_nuevo"]
        );
        $resultado = $perfil->cambiarPassword($datos);
        echo json_encode($resultado);
    }

    function obtenerMisCursos(){
        if (!isset($_SESSION['id'])) {
            echo json_encode(["error" => "Usuario no autenticado"]);
            return;
        }

        require_once("../modelo/cursos.php");
        $cursos = new Cursos();
        $misCursos = array();
        $misCursos = $cursos->obtenerMisCursos($_SESSION['id']);
        echo json_encode($misCursos);
    }

    function obtenerCurso(){
        if (!isset($_POST["id"])) {
            echo json_encode(["error" => "Datos de curso incompletos"]);
            return;
        }
        
        require_once("../modelo/cursos.php");
        $cursos = new Cursos();
        $curso = array();
        $curso = $cursos->obtenerCurso($_POST["id"]);
        error_log('Datos del curso: ' . print_r($curso, true));
        echo json_encode($curso);
    }

    function desconectar(){
        $_SESSION = array();
        
        if (isset($_COOKIE[session_name()])) {
            setcookie(session_name(), '', time() - 3600, '/');
        }
        
        session_destroy();
        
        echo json_encode(['success' => true]);
    }
    
    function inscribirCurso(){
        if (!isset($_SESSION['id'])) {
            echo json_encode(["success" => false, "message" => "Usuario no autenticado"]);
            return;
        }

        if (!isset($_POST["id_curso"])) {
            echo json_encode(["success" => false, "message" => "ID de curso no proporcionado"]);
            return;
        }
        
        require_once("../modelo/inscripciones.php");
        $inscripciones = new Inscripciones();
        $datos = array(
            "id_usuario" => $_SESSION['id'],
            "id_curso" => $_POST["id_curso"],
            "fecha_inscripcion" => date("Y-m-d H:i:s")
        );
        
        $resultado = $inscripciones->inscribirCurso($datos);
        echo json_encode($resultado);
    }

    // Si no ha sido iniciado el action
    if(isset($_REQUEST["action"])){
        $action = $_REQUEST["action"];
        
        // Obtener la función correspondiente
        $function = $action;
        
        // Verificar si la función existe
        if (function_exists($function)) {
            $function();
            exit();
        }
    }

    // Si llegamos aquí, es que la acción no existe
    header("HTTP/1.1 404 Not Found");
    echo json_encode(["error" => "Acción no válida: " . htmlspecialchars($_REQUEST["action"] ?? '')]);
    exit();
?>