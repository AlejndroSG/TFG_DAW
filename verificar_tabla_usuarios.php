<?php
// Script para verificar la estructura de la tabla usuarios y añadir la columna email si no existe

require_once("backend/modelo/bd.php");

$db = new db();
$conn = $db->getConn();

// Verificar si la columna email existe en la tabla usuarios
$result = $conn->query("SHOW COLUMNS FROM usuarios LIKE 'email'");
$emailExists = $result->num_rows > 0;

echo "<h2>Verificación de la tabla usuarios</h2>";
echo "<p>Estructura actual de la tabla:</p>";

// Mostrar la estructura actual de la tabla
$result = $conn->query("DESCRIBE usuarios");
echo "<pre>";
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
echo "</pre>";

// Si no existe la columna email, añadirla
if (!$emailExists) {
    echo "<p>La columna 'email' no existe. Intentando añadirla...</p>";
    
    $alterTableQuery = "ALTER TABLE usuarios ADD COLUMN email VARCHAR(255) AFTER nombre";
    
    if ($conn->query($alterTableQuery)) {
        echo "<p style='color: green;'>Columna 'email' añadida correctamente.</p>";
    } else {
        echo "<p style='color: red;'>Error al añadir la columna 'email': " . $conn->error . "</p>";
    }
    
    // Mostrar la estructura actualizada
    echo "<p>Estructura actualizada de la tabla:</p>";
    $result = $conn->query("DESCRIBE usuarios");
    echo "<pre>";
    while ($row = $result->fetch_assoc()) {
        print_r($row);
    }
    echo "</pre>";
} else {
    echo "<p style='color: green;'>La columna 'email' ya existe en la tabla.</p>";
}

// Cerrar la conexión
$conn->close();
?>
