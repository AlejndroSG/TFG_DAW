<?php
// Script para añadir la columna cookie_consent a la tabla usuarios

// Incluir el archivo de conexión a la base de datos
require_once("backend/modelo/bd.php");

// Crear una instancia de la clase de base de datos
$db = new db();
$conn = $db->getConnection();

// Verificar si la columna ya existe
$checkColumn = "SHOW COLUMNS FROM `usuarios` LIKE 'cookie_consent'";
$result = $conn->query($checkColumn);

if ($result->num_rows == 0) {
    // La columna no existe, añadirla
    $alterTable = "ALTER TABLE `usuarios` ADD COLUMN `cookie_consent` TINYINT(1) DEFAULT 0";
    
    if ($conn->query($alterTable) === TRUE) {
        echo "Columna cookie_consent añadida correctamente a la tabla usuarios";
    } else {
        echo "Error al añadir la columna: " . $conn->error;
    }
} else {
    echo "La columna cookie_consent ya existe en la tabla usuarios";
}

$conn->close();
?>
