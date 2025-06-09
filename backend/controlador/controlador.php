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
        
        error_log("Obteniendo cursos inscritos para usuario ID: {$_SESSION['id']}");

        require_once("../modelo/inscripciones.php");
        $inscripcionesModel = new Inscripciones();
        
        try {
            $misCursos = $inscripcionesModel->obtenerCursosUsuario($_SESSION['id']);
            
            // Verificar si hay un error en la respuesta
            if (isset($misCursos['error'])) {
                error_log("Error al obtener cursos inscritos: {$misCursos['error']}");
                echo json_encode(["error" => $misCursos['error']]);
                return;
            }
            
            error_log("Se encontraron " . count($misCursos) . " cursos inscritos para el usuario ID: {$_SESSION['id']}");
            echo json_encode($misCursos);
        } catch (Exception $e) {
            error_log("Excepción al obtener cursos inscritos: " . $e->getMessage());
            echo json_encode(["error" => "Error al procesar la solicitud: " . $e->getMessage()]);
        }
    }

    function obtenerCurso(){
        // Comprobar si se recibe id_curso (nuevo formato) o id (formato antiguo)
        if (isset($_POST["id_curso"])) {
            $id_curso = $_POST["id_curso"];
            error_log("obtenerCurso: Recibido id_curso=$id_curso");
        } else if (isset($_POST["id"])) {
            $id_curso = $_POST["id"];
            error_log("obtenerCurso: Recibido id=$id_curso (formato antiguo)");
        } else {
            echo json_encode(["error" => "Datos de curso incompletos"]);
            return;
        }
        
        require_once("../modelo/cursos.php");
        $cursos = new Cursos();
        $curso = array();
        $curso = $cursos->obtenerCurso($id_curso);
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
        
        // Añadir logs para depuración
        error_log("Resultado de inscripción: " . json_encode($resultado));
        error_log("POST registrar_pago: " . (isset($_POST["registrar_pago"]) ? $_POST["registrar_pago"] : 'no definido') . " - Tipo: " . gettype(isset($_POST["registrar_pago"]) ? $_POST["registrar_pago"] : 'no definido'));
        
        // Si la inscripción fue exitosa y se solicita registrar un pago
        // Nota: FormData en JavaScript puede enviar 'true' como string, por lo que comprobamos ambos casos
        if ($resultado["success"] && isset($_POST["registrar_pago"]) && 
           ($_POST["registrar_pago"] == true || $_POST["registrar_pago"] === "true" || $_POST["registrar_pago"] == 1)) {
            
            error_log("Condición para registrar pago cumplida");
            require_once("../modelo/pagos.php");
            $pagos = new Pagos();
            
            // Asegurar que tenemos un valor numérico para el monto
            $monto = 0;
            if (isset($_POST["precio"]) && !empty($_POST["precio"])) {
                $monto = is_numeric($_POST["precio"]) ? floatval($_POST["precio"]) : 0;
                error_log("Monto del pago: {$monto}");
            } else {
                error_log("ADVERTENCIA: No se proporcionó un precio válido para el pago");
            }
            
            // Generar una referencia única para el pago
            $referencia = 'INV-' . date('Y') . '-' . sprintf("%04d", rand(1, 9999));
            
            $datoPago = array(
                "id_usuario" => intval($_SESSION['id']),
                "id_curso" => intval($_POST["id_curso"]),
                "fecha_pago" => date("Y-m-d H:i:s"),
                "monto" => $monto,
                "metodo_pago" => isset($_POST["metodo_pago"]) ? $_POST["metodo_pago"] : 'tarjeta',
                "estado" => 'completado',
                "referencia" => $referencia
            );
            
            // Validación de integridad de datos antes de registrar el pago
            error_log("Validando datos del pago antes de registrar: " . json_encode($datoPago));
            
            error_log("Intentando registrar pago con datos: " . json_encode($datoPago));
            
            $resultadoPago = $pagos->registrarPago($datoPago);
            error_log("Resultado del registro de pago: " . json_encode($resultadoPago));
            
            // Añadimos información del pago al resultado
            if (isset($resultadoPago["success"]) && $resultadoPago["success"]) {
                $resultado["pago"] = $resultadoPago["pago"];
                $resultado["mensaje_pago"] = "Pago registrado correctamente";
            } else {
                // Si hay un error en el pago, lo registramos pero no afecta a la inscripción
                $resultado["error_pago"] = isset($resultadoPago["message"]) ? $resultadoPago["message"] : "Error desconocido al registrar el pago";
            }
        } else {
            error_log("No se cumplen las condiciones para registrar el pago");
            $resultado["info_pago"] = "No se intentó registrar ningún pago";
        }
        
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
        
        // Obtener ID del curso (ya sea por GET o POST)
        $id_curso = null;
        
        // Verificar si viene por GET
        if (isset($_GET['id_curso']) && !empty($_GET['id_curso'])) {
            $id_curso = $_GET['id_curso'];
        } else {
            // Verificar si viene en el cuerpo JSON (POST)
            $datos = json_decode(file_get_contents('php://input'), true);
            if (isset($datos['id_curso']) && !empty($datos['id_curso'])) {
                $id_curso = $datos['id_curso'];
            }
        }
        
        // Comprobar que tenemos un ID de curso
        if ($id_curso === null) {
            echo json_encode([
                'error' => 'ID de curso no proporcionado'
            ]);
            exit;
        }
        
        require_once("../modelo/inscripciones.php");
        $inscripciones = new Inscripciones();
        $usuarios = $inscripciones->obtenerUsuariosPorCurso($id_curso);
        
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
        
        // Obtener ID de usuario y curso (ya sea por GET o POST)
        $id_usuario = null;
        $id_curso = null;
        
        // Verificar si vienen por GET
        if (isset($_GET['id_usuario']) && !empty($_GET['id_usuario']) && 
            isset($_GET['id_curso']) && !empty($_GET['id_curso'])) {
            $id_usuario = $_GET['id_usuario'];
            $id_curso = $_GET['id_curso'];
        } else {
            // Verificar si vienen en el cuerpo JSON (POST)
            $datos = json_decode(file_get_contents('php://input'), true);
            if (isset($datos['id_usuario']) && !empty($datos['id_usuario']) && 
                isset($datos['id_curso']) && !empty($datos['id_curso'])) {
                $id_usuario = $datos['id_usuario'];
                $id_curso = $datos['id_curso'];
            }
        }
        
        // Comprobar que tenemos ambos IDs
        if ($id_usuario === null || $id_curso === null) {
            echo json_encode([
                'error' => 'Datos incompletos para eliminar inscripción'
            ]);
            exit;
        }
        
        require_once("../modelo/inscripciones.php");
        $inscripciones = new Inscripciones();
        $resultado = $inscripciones->eliminarInscripcion($id_usuario, $id_curso);
        
        echo json_encode($resultado);
    }

    // Función para guardar usuario (crear o actualizar)
    function guardarUsuario() {
        // Verificar si el usuario tiene permisos de administrador
        if (!isset($_SESSION['tipo_usuario']) || (strtolower($_SESSION['tipo_usuario']) !== 'administrador' && strtolower($_SESSION['tipo_usuario']) !== 'admin')) {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            return;
        }
        
        // Obtener datos del formulario
        $datos = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($datos['nombre']) || !isset($datos['email']) || !isset($datos['tipo_usuario'])) {
            echo json_encode(['error' => 'Datos incompletos']);
            return;
        }
        
        require_once('../modelo/bd.php');
        $modelo = new db();
        
        // Si tiene ID, es una actualización
        if (isset($datos['id']) && !empty($datos['id'])) {
            $resultado = $modelo->actualizarUsuario($datos);
        } else {
            // Si no tiene ID, es un nuevo usuario
            // Para nuevos usuarios necesitamos una contraseña
            if (!isset($datos['password']) || empty($datos['password'])) {
                echo json_encode(['error' => 'Se requiere contraseña para crear un usuario nuevo']);
                return;
            }
            $resultado = $modelo->crearUsuario($datos);
        }
        
        echo json_encode($resultado);
    }

    function obtenerHistorialPagos(){
        if (!isset($_SESSION['id'])) {
            echo json_encode(["error" => "Usuario no autenticado"]);
            return;
        }

        require_once("../modelo/pagos.php");
        $pagos = new Pagos();
        $historialPagos = $pagos->obtenerHistorialPagos($_SESSION['id']);
        echo json_encode($historialPagos);
    }

    function obtenerTodosPagos(){
        if (!isset($_SESSION['id']) || $_SESSION['tipo_usuario'] != 'admin') {
            echo json_encode(["error" => "Acceso denegado"]);
            return;
        }

        require_once("../modelo/pagos.php");
        $pagos = new Pagos();
        $todosPagos = $pagos->obtenerTodosPagos();
        echo json_encode($todosPagos);
    }
    
    // Función para verificar inscripción directamente
    function verificarInscripcionDirecta() {
        // Verificar si el usuario tiene permisos de administrador
        if (!isset($_SESSION['tipo_usuario']) || (strtolower($_SESSION['tipo_usuario']) !== 'administrador' && strtolower($_SESSION['tipo_usuario']) !== 'admin')) {
            echo json_encode([
                'error' => 'No tienes permiso para realizar esta acción'
            ]);
            return;
        }
        
        // Obtener datos del formulario
        $datos = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($datos['id_usuario']) || !isset($datos['id_curso'])) {
            echo json_encode(['error' => 'Datos incompletos']);
            return;
        }
        
        require_once("../modelo/inscripciones.php");
        $inscripciones = new Inscripciones();
        $resultado = $inscripciones->verificarInscripcionDirecta($datos['id_usuario'], $datos['id_curso']);
        
        echo json_encode($resultado);
    }

    function verificarInscripcion() {
        // Verificar que el usuario esté autenticado
        if (!isset($_SESSION['id'])) {
            error_log("verificarInscripcion: Usuario no autenticado");
            echo json_encode(["error" => "Usuario no autenticado"]);
            return;
        }
        
        // Obtener id_curso
        if (!isset($_POST['id_curso'])) {
            error_log("verificarInscripcion: id_curso no proporcionado");
            echo json_encode(["error" => "ID de curso no proporcionado"]);
            return;
        }
        
        $id_curso = $_POST['id_curso'];
        $id_usuario = $_SESSION['id'];
        
        error_log("verificarInscripcion: Comprobando inscripción para usuario=$id_usuario, curso=$id_curso");
        
        require_once("../modelo/inscripciones.php");
        $inscripcionesModel = new Inscripciones();
        
        // Verificar inscripción directamente
        $resultado = $inscripcionesModel->verificarInscripcion($id_usuario, $id_curso);
        
        error_log("verificarInscripcion: Resultado = ". json_encode($resultado));
        echo json_encode($resultado);
    }
    
    // Función para eliminar un usuario
    function eliminarUsuario() {
        // Logs extensivos para diagnóstico
        error_log("==== INICIO ELIMINAR USUARIO ====");
        error_log("SESSION en eliminarUsuario: " . print_r($_SESSION, true));
        error_log("REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD']);
        error_log("Content-Type: " . (isset($_SERVER['CONTENT_TYPE']) ? $_SERVER['CONTENT_TYPE'] : 'no definido'));
        
        // Obtener datos JSON del cuerpo de la solicitud
        $jsonData = file_get_contents('php://input');
        error_log("Datos recibidos: " . $jsonData);
        
        $data = json_decode($jsonData, true);
        error_log("Datos decodificados: " . print_r($data, true));
        
        if (!isset($data['id'])) {
            error_log("Error: ID de usuario no proporcionado");
            echo json_encode(["error" => "ID de usuario no proporcionado"]);
            return;
        }
        
        $id_usuario = $data['id'];
        error_log("ID de usuario a eliminar: " . $id_usuario);
        
        // Ya no verificamos si es el mismo usuario para permitir todas las eliminaciones
        
        require_once("../modelo/bd.php");
        $modelo = new db();
        $resultado = $modelo->eliminarUsuario($id_usuario);
        
        error_log("eliminarUsuario: Resultado = ". json_encode($resultado));
        error_log("==== FIN ELIMINAR USUARIO ====");
        echo json_encode($resultado);
    }
    
    // Función para obtener estadísticas de ventas con filtro de usuario opcional
    function obtenerEstadisticasVentas() {
        // Verificar autenticación del usuario
        if (!isset($_SESSION['id'])) {
            echo json_encode(["error" => "No has iniciado sesión"]);
            return;
        }
        
        // Obtener parámetros de la solicitud
        $fecha_inicio = isset($_GET['fecha_inicio']) ? $_GET['fecha_inicio'] : null;
        $fecha_fin = isset($_GET['fecha_fin']) ? $_GET['fecha_fin'] : null;
        $id_usuario = isset($_GET['id_usuario']) ? intval($_GET['id_usuario']) : null;
        
        error_log("obtenerEstadisticasVentas: fecha_inicio=$fecha_inicio, fecha_fin=$fecha_fin, id_usuario=$id_usuario");
        
        // Cargar el modelo de estadísticas
        require_once("../modelo/estadisticas.php");
        $estadisticas = new Estadisticas();
        
        // Obtener estadísticas de ventas
        $datos = $estadisticas->obtenerEstadisticasVentas($fecha_inicio, $fecha_fin, $id_usuario);
        
        // Devolver resultados
        echo json_encode($datos);
    }
    
    // Función para verificar si el usuario ha aceptado las cookies
    function checkCookieConsent() {
        require_once("../modelo/cookies.php");
        $cookiesManager = new CookiesManager();
        
        $hasConsent = $cookiesManager->verificarConsentimiento();
        
        echo json_encode(["hasConsent" => $hasConsent]);
    }
    
    // Función para establecer el consentimiento de cookies
    function setCookieConsent() {
        // Obtener datos del POST en formato JSON
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);
        
        if (!isset($input['consent'])) {
            echo json_encode(["error" => "Falta el parámetro de consentimiento"]);
            return;
        }
        
        require_once("../modelo/cookies.php");
        $cookiesManager = new CookiesManager();
        
        $result = $cookiesManager->establecerConsentimiento($input['consent']);
        
        echo json_encode(["success" => $result]);
    }

    // Función para obtener lista de usuarios para filtro en panel de estadísticas
    function obtenerUsuariosFiltro() {
        // Verificar autenticación del usuario
        if (!isset($_SESSION['id'])) {
            echo json_encode(["error" => "No has iniciado sesión"]);
            return;
        }
        
        // Verificar si es administrador
        require_once("../modelo/bd.php");
        $bd = new BaseDatos();
        $usuario = $bd->obtenerUsuarioPorId($_SESSION['id']);
        
        if (!$usuario || ($usuario['tipo_usuario'] !== 'administrador' && $usuario['tipo_usuario'] !== 'admin')) {
            echo json_encode(["error" => "No tienes permisos para realizar esta acción"]);
            return;
        }
        
        // Cargar el modelo de estadísticas
        require_once("../modelo/estadisticas.php");
        $estadisticas = new Estadisticas();
        
        // Obtener lista de usuarios
        $usuarios = $estadisticas->obtenerUsuariosFiltro();
        
        // Devolver resultados
        echo json_encode($usuarios);
    }

    // Función para encriptar todas las contraseñas de la base de datos
    function encriptarTodasContrasenas() {
        // Verificar si el usuario tiene permisos de administrador
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
        
        require_once("../modelo/bd.php");
        $modelo = new db();
        $resultado = $modelo->encriptarContrasenasBD();
        
        echo json_encode($resultado);
    }

    // Si no ha sido iniciado el action
    if(isset($_REQUEST["action"])){
        $action = $_GET["action"];
        
        // Mensajes de depuración
        error_log("CONTROLADOR: Action: " . $action);
        error_log("CONTROLADOR: POST data: " . json_encode($_POST));
        
        if (isset($_SESSION['id'])) {
            error_log("CONTROLADOR: Usuario en sesión ID: " . $_SESSION['id']);
        }

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