<?php
// backend/guardar.php
header('Content-Type: application/json');
require 'conexion.php';

// Leer los datos JSON que envía app.js
$datos = json_decode(file_get_contents("php://input"), true);

if ($datos) {
    try {
        $sql = "INSERT INTO estudiantes (nombre_Estudiante, nota_Uno, nota_Dos, nota_Tres, nota_Cuatro, promedio, resultado_Cualitativo) 
                VALUES (:nombre_Estudiante, :nota_Uno, :nota_Dos, :nota_Tres, :nota_Cuatro, :promedio, :resultado_Cualitativo)";
        
        $stmt = $pdo->prepare($sql);
        
        // Vincular los parámetros
        $stmt->bindParam(':nombre_Estudiante', $datos['nombre_Estudiante']);
        $stmt->bindParam(':nota_Uno', $datos['nota_Uno']);
        $stmt->bindParam(':nota_Dos', $datos['nota_Dos']);
        $stmt->bindParam(':nota_Tres', $datos['nota_Tres']);
        $stmt->bindParam(':nota_Cuatro', $datos['nota_Cuatro']);
        $stmt->bindParam(':promedio', $datos['promedio']);
        $stmt->bindParam(':resultado_Cualitativo', $datos['resultado_Cualitativo']);
        
        $stmt->execute();
        
        echo json_encode(["status" => "success", "mensaje" => "Registro guardado correctamente"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "mensaje" => "Error al guardar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "No se recibieron datos válidos"]);
}
?>