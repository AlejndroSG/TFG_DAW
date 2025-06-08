<?php
class CookiesManager {
    private $conn;
    
    public function __construct() {
        require_once("bd.php");
        $db = new db();
        $this->conn = $db->getConnection();
    }
    
    /**
     * Verifica si un usuario ya ha dado consentimiento de cookies
     * Si el usuario está autenticado, verifica en la base de datos
     * Si es un visitante anónimo, verifica la cookie de sesión
     */
    public function verificarConsentimiento() {
        if (isset($_SESSION['id']) && !empty($_SESSION['id'])) {
            // Para usuarios autenticados, verificar en la base de datos
            $id_usuario = $_SESSION['id'];
            $sql = "SELECT cookie_consent FROM usuarios WHERE id_usuario = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("i", $id_usuario);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($row = $result->fetch_assoc()) {
                return $row['cookie_consent'] == 1;
            }
            return false;
        } else {
            // Para usuarios anónimos, verificar si existe la cookie
            return isset($_COOKIE['cookie_consent']) && $_COOKIE['cookie_consent'] == 'accepted';
        }
    }
    
    /**
     * Establece el consentimiento de cookies para un usuario
     * @param bool $consent True si el usuario acepta, false si rechaza
     */
    public function establecerConsentimiento($consent) {
        $consent_value = $consent ? 1 : 0;
        
        // Si hay un usuario autenticado, guardar en la base de datos
        if (isset($_SESSION['id']) && !empty($_SESSION['id'])) {
            $id_usuario = $_SESSION['id'];
            $sql = "UPDATE usuarios SET cookie_consent = ? WHERE id_usuario = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ii", $consent_value, $id_usuario);
            $result = $stmt->execute();
        }
        
        // Independientemente de si hay usuario o no, establecer una cookie
        $cookie_value = $consent ? 'accepted' : 'declined';
        $expiry = time() + (86400 * 365); // 1 año
        setcookie('cookie_consent', $cookie_value, $expiry, '/', '', false, true);
        
        return true;
    }
}
?>
