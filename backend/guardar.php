<?php

header('Content-Type: application/json');
require 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);

if ($datos) {
    try {
        $sql = "INSERT INTO estudiante (nombre_Estudiante, nota_Uno, nota_Dos, nota_Tres, nota_Cuatro, promedio, resultado_Cualitativo) 
                VALUES (:nombre_Estudiante, :nota_Uno, :nota_Dos, :nota_Tres, :nota_Cuatro, :promedio, :resultado_Cualitativo)";
        
        $stmt = $pdo->prepare($sql);
        
        $stmt->bindParam(':nombre_Estudiante', $datos['nombre']);
        $stmt->bindParam(':nota_Uno', $datos['nota1']);
        $stmt->bindParam(':nota_Dos', $datos['nota2']);
        $stmt->bindParam(':nota_Tres', $datos['nota3']);
        $stmt->bindParam(':nota_Cuatro', $datos['nota4']);
        $stmt->bindParam(':promedio', $datos['promedio']);
        $stmt->bindParam(':resultado_Cualitativo', $datos['resultadoCualitativo']);
        
        $stmt->execute();
        
        echo json_encode(["status" => "success", "mensaje" => "Registro guardado correctamente"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "mensaje" => "Error al guardar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "No se recibieron datos válidos"]);
}
?>