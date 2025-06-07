<?php
// Script para verificar la estructura y datos de la tabla usuarios
$conn = new mysqli("localhost", "root", "", "TFG_DAW");

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

echo "<h2>Estructura de la tabla usuarios</h2>";
$estructura = $conn->query("DESCRIBE usuarios");
if ($estructura) {
    echo "<table border='1'>";
    echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Llave</th><th>Default</th><th>Extra</th></tr>";
    while ($campo = $estructura->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $campo['Field'] . "</td>";
        echo "<td>" . $campo['Type'] . "</td>";
        echo "<td>" . $campo['Null'] . "</td>";
        echo "<td>" . $campo['Key'] . "</td>";
        echo "<td>" . $campo['Default'] . "</td>";
        echo "<td>" . $campo['Extra'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "Error al obtener estructura: " . $conn->error;
}

echo "<h2>Datos de la tabla usuarios</h2>";
$datos = $conn->query("SELECT * FROM usuarios");
if ($datos) {
    if ($datos->num_rows > 0) {
        echo "<table border='1'>";
        echo "<tr>";
        $firstRow = $datos->fetch_assoc();
        $datos->data_seek(0);
        foreach (array_keys($firstRow) as $columna) {
            echo "<th>" . $columna . "</th>";
        }
        echo "</tr>";
        
        while ($usuario = $datos->fetch_assoc()) {
            echo "<tr>";
            foreach ($usuario as $valor) {
                echo "<td>" . ($valor ?? 'NULL') . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "La tabla usuarios está vacía.";
    }
} else {
    echo "Error al obtener datos: " . $conn->error;
}

// También verificamos la tabla inscripciones para entender la relación
echo "<h2>Muestra de datos de inscripciones</h2>";
$inscripciones = $conn->query("SELECT * FROM inscripciones LIMIT 10");
if ($inscripciones) {
    if ($inscripciones->num_rows > 0) {
        echo "<table border='1'>";
        echo "<tr>";
        $firstRow = $inscripciones->fetch_assoc();
        $inscripciones->data_seek(0);
        foreach (array_keys($firstRow) as $columna) {
            echo "<th>" . $columna . "</th>";
        }
        echo "</tr>";
        
        while ($inscripcion = $inscripciones->fetch_assoc()) {
            echo "<tr>";
            foreach ($inscripcion as $valor) {
                echo "<td>" . ($valor ?? 'NULL') . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "La tabla inscripciones está vacía.";
    }
} else {
    echo "Error al obtener datos de inscripciones: " . $conn->error;
}
?>
