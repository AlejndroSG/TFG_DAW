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
        // Log para depurar la sesiu00f3n actual
        error_log('SESSION en comprobarSesion: ' . print_r($_SESSION, true));
        error_log('SESSION ID: ' . session_id());
        
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

    function registrarUsuario(){
        if (!isset($_POST["username"]) || !isset($_POST["email"]) || !isset($_POST["password"])) {
            echo json_encode(["error" => "Datos de registro incompletos"]);
            return;
        }
        
        $username = trim($_POST["username"]);
        $email = trim($_POST["email"]);
        $password = trim($_POST["password"]);
        
        // Validaciones básicas
        if (strlen($username) < 3) {
            echo json_encode(["error" => "El nombre de usuario debe tener al menos 3 caracteres"]);
            return;
        }
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode(["error" => "El email no es válido"]);
            return;
        }
        
        if (strlen($password) < 6) {
            echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres"]);
            return;
        }
        
        require_once("../modelo/bd.php");
        $modelo = new db();
        $resultado = $modelo->registrarUsuario($username, $email, $password);
        
        if (isset($resultado["success"]) && $resultado["success"]) {
            // Iniciar sesión automáticamente tras el registro
            session_regenerate_id(true);
            
            $_SESSION['id'] = $resultado['id'];
            $_SESSION['username'] = $resultado['nombre'];
            $_SESSION['tipo_usuario'] = $resultado['tipo_usuario'];
            
            echo json_encode([
                "success" => true,
                "mensaje" => "Usuario registrado correctamente",
                "id" => $resultado['id'],
                "nombre" => $resultado['nombre'],
                "tipo_usuario" => $resultado['tipo_usuario']
            ]);
        } else {
            echo json_encode($resultado); // Devolver el error del modelo
        }
    }

    function obtenerUsuarios() {
        // Log para depurar
        error_log('SESSION en obtenerUsuarios: ' . print_r($_SESSION, true));
        error_log('tipo_usuario: ' . (isset($_SESSION['tipo_usuario']) ? $_SESSION['tipo_usuario'] : 'no definido'));
        
        // Verificar si el usuario tiene permisos de administrador
        if (!isset($_SESSION['tipo_usuario'])) {
            echo json_encode([
                'error' => 'No hay sesiu00f3n activa'
            ]);
            exit;
        }
        
        // Convertir a minu00fasculas y comparar
        $tipo = strtolower($_SESSION['tipo_usuario']);
        if ($tipo !== 'administrador' && $tipo !== 'admin') {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            exit;
        }
        
        require_once("../modelo/bd.php");
        $modelo = new db();
        $usuarios = $modelo->obtenerTodosUsuarios();
        
        echo json_encode($usuarios);
    }

    function obtenerTodosCursos() {
        // Log para depurar
        error_log('SESSION en obtenerTodosCursos: ' . print_r($_SESSION, true));
        error_log('tipo_usuario: ' . (isset($_SESSION['tipo_usuario']) ? $_SESSION['tipo_usuario'] : 'no definido'));
        
        // Verificar si el usuario tiene permisos de administrador
        if (!isset($_SESSION['tipo_usuario'])) {
            echo json_encode([
                'error' => 'No hay sesiu00f3n activa'
            ]);
            exit;
        }
        
        // Convertir a minu00fasculas y comparar
        $tipo = strtolower($_SESSION['tipo_usuario']);
        if ($tipo !== 'administrador' && $tipo !== 'admin') {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            exit;
        }
        
        require_once("../modelo/cursos.php");
        $modeloCursos = new Cursos();
        $cursos = $modeloCursos->obtenerTodosCursos();
        
        echo json_encode($cursos);
    }

    // Función para subir imágenes de cursos
    function subirImagenCurso() {
        // Verificar permisos de administrador
        if (!isset($_SESSION['tipo_usuario'])) {
            echo json_encode([
                'error' => 'No hay sesión activa'
            ]);
            exit;
        }
        
        $tipo = strtolower($_SESSION['tipo_usuario']);
        if ($tipo !== 'administrador' && $tipo !== 'admin') {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            exit;
        }
        
        if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
            echo json_encode([
                'error' => 'Error al subir la imagen'
            ]);
            exit;
        }
        
        $file = $_FILES['imagen'];
        $filename = $file['name'];
        $tmp_name = $file['tmp_name'];
        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        
        // Validar extensión
        $valid_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($ext, $valid_extensions)) {
            echo json_encode([
                'error' => 'Formato de imagen no válido. Se permiten: ' . implode(', ', $valid_extensions)
            ]);
            exit;
        }
        
        // Generar nombre único
        $new_filename = uniqid('curso_') . '.' . $ext;
        $upload_path = '../../frontend/src/img/imgCursos/' . $new_filename;
        
        if (move_uploaded_file($tmp_name, $upload_path)) {
            echo json_encode([
                'success' => true,
                'ruta' => '/src/img/imgCursos/' . $new_filename,
                'mensaje' => 'Imagen subida correctamente'
            ]);
        } else {
            echo json_encode([
                'error' => 'Error al guardar la imagen'
            ]);
        }
    }
    
    // Función para crear o actualizar un curso
    function guardarCurso() {
        // Verificar permisos de administrador
        if (!isset($_SESSION['tipo_usuario'])) {
            echo json_encode([
                'error' => 'No hay sesión activa'
            ]);
            exit;
        }
        
        $tipo = strtolower($_SESSION['tipo_usuario']);
        if ($tipo !== 'administrador' && $tipo !== 'admin') {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            exit;
        }
        
        // Obtener datos del cuerpo de la petición
        $datos = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($datos['titulo']) || empty($datos['titulo'])) {
            echo json_encode([
                'error' => 'El título del curso es obligatorio'
            ]);
            exit;
        }
        
        require_once("../modelo/cursos.php");
        $modeloCursos = new Cursos();
        
        // Si tiene ID, es una actualización
        if (isset($datos['id']) && !empty($datos['id'])) {
            $resultado = $modeloCursos->actualizarCurso($datos);
        } else {
            // Es un nuevo curso
            $resultado = $modeloCursos->crearCurso($datos);
        }
        
        echo json_encode($resultado);
    }
    
    // Función para cambiar estado de publicación de un curso
    function cambiarEstadoCurso() {
        // Verificar permisos de administrador
        if (!isset($_SESSION['tipo_usuario'])) {
            echo json_encode([
                'error' => 'No hay sesión activa'
            ]);
            exit;
        }
        
        $tipo = strtolower($_SESSION['tipo_usuario']);
        if ($tipo !== 'administrador' && $tipo !== 'admin') {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            exit;
        }
        
        // Obtener datos del cuerpo de la petición
        $datos = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($datos['id']) || empty($datos['id'])) {
            echo json_encode([
                'error' => 'ID de curso no proporcionado'
            ]);
            exit;
        }
        
        if (!isset($datos['campo']) || !in_array($datos['campo'], ['publicado', 'destacado'])) {
            echo json_encode([
                'error' => 'Campo de actualización no válido'
            ]);
            exit;
        }
        
        require_once("../modelo/cursos.php");
        $modeloCursos = new Cursos();
        $resultado = $modeloCursos->cambiarEstadoCurso($datos['id'], $datos['campo'], $datos['valor']);
        
        echo json_encode($resultado);
    }
    
    // Función para eliminar un curso
    function eliminarCurso() {
        // Verificar permisos de administrador
        if (!isset($_SESSION['tipo_usuario'])) {
            echo json_encode([
                'error' => 'No hay sesión activa'
            ]);
            exit;
        }
        
        $tipo = strtolower($_SESSION['tipo_usuario']);
        if ($tipo !== 'administrador' && $tipo !== 'admin') {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            exit;
        }
        
        // Obtener datos del cuerpo de la petición
        $datos = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($datos['id']) || empty($datos['id'])) {
            echo json_encode([
                'error' => 'ID de curso no proporcionado'
            ]);
            exit;
        }
        
        require_once("../modelo/cursos.php");
        $modeloCursos = new Cursos();
        $resultado = $modeloCursos->eliminarCurso($datos['id']);
        
        echo json_encode($resultado);
    }
    
    // Función para obtener los usuarios inscritos en un curso específico
    function obtenerUsuariosPorCurso() {
        // Verificar permisos de administrador
        if (!isset($_SESSION['tipo_usuario'])) {
            echo json_encode([
                'error' => 'No hay sesión activa'
            ]);
            exit;
        }
        
        $tipo = strtolower($_SESSION['tipo_usuario']);
        if ($tipo !== 'administrador' && $tipo !== 'admin') {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            exit;
        }
        
        // Obtener datos del cuerpo de la petición
        $datos = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($datos['id_curso']) || empty($datos['id_curso'])) {
            echo json_encode([
                'error' => 'ID de curso no proporcionado'
            ]);
            exit;
        }
        
        require_once("../modelo/inscripciones.php");
        $inscripciones = new Inscripciones();
        $usuarios = $inscripciones->obtenerUsuariosPorCurso($datos['id_curso']);
        
        echo json_encode($usuarios);
    }
    
    // Función para eliminar la inscripción de un usuario a un curso
    function eliminarInscripcion() {
        // Verificar permisos de administrador
        if (!isset($_SESSION['tipo_usuario'])) {
            echo json_encode([
                'error' => 'No hay sesión activa'
            ]);
            exit;
        }
        
        $tipo = strtolower($_SESSION['tipo_usuario']);
        if ($tipo !== 'administrador' && $tipo !== 'admin') {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            exit;
        }
        
        // Obtener datos del cuerpo de la petición
        $datos = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($datos['id_usuario']) || empty($datos['id_usuario']) || 
            !isset($datos['id_curso']) || empty($datos['id_curso'])) {
            echo json_encode([
                'error' => 'Datos incompletos para eliminar inscripción'
            ]);
            exit;
        }
        
        require_once("../modelo/inscripciones.php");
        $inscripciones = new Inscripciones();
        $resultado = $inscripciones->eliminarInscripcion($datos['id_usuario'], $datos['id_curso']);
        
        echo json_encode($resultado);
    }

    // Si no ha sido iniciado el action
    if(isset($_REQUEST["action"])){
        $action = $_REQUEST["action"];
        
        // Ejecutar función según la acción
        if(function_exists($action)){
            // No es necesario iniciar sesión aquí, ya se inicia al principio del archivo
            $action();
        } else {
            // Si la acción no existe, devolver error 404
            header("HTTP/1.1 404 Not Found");
            echo json_encode(["error" => "Acción no válida: " . htmlspecialchars($action)]);
        }
    } else {
        // Si no se especificó ninguna acción
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["error" => "No se especificó ninguna acción"]);
    }
?>