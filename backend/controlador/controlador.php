<?php
    // Si no ha sido iniciado el action
    if(!isset($_REQUEST["action"])){
        require_once("../header&footer/head.html");
        require_once("../vistas/login.php");
        require_once("../header&footer/footer.html");
    }else{
        $action = $_REQUEST["action"];
        $action(); //La cabra del sistema, lo acciona absolutamente todo
    }
?>