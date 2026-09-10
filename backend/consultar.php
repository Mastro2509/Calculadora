<?php

header('Content-Type: application/json');
require 'conexion.php';

try {

    $sql = "SELECT * FROM estudiante";
    $stmt = $pdo->query($sql);
    
    $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["status" => "success", "data" => $estudiantes]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al consultar: " . $e->getMessage()]);
}
?>