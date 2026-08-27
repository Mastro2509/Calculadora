<?php
// backend/consultar.php
header('Content-Type: application/json');
require 'conexion.php';

try {
    // Consulta para traer todos los registros
    $sql = "SELECT * FROM estudiante";
    $stmt = $pdo->query($sql);
    
    // Extraer los datos en un arreglo asociativo
    $estudiantes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Devolver el arreglo en formato JSON
    echo json_encode(["status" => "success", "data" => $estudiantes]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "mensaje" => "Error al consultar: " . $e->getMessage()]);
}
?>