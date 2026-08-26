<?php
// backend/conexion.php

$host = 'localhost';
$dbname = 'gestion_notas'; // Cambia esto por el nombre exacto de tu base de datos
$username = 'root';        // Tu usuario de MySQL
$password = '123456';            // Tu contraseña de MySQL

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    // Configurar PDO para que lance excepciones en caso de error
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "Error de conexión: " . $e->getMessage()]));
}
?>