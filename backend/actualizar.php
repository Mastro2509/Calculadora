<?php
// backend/actualizar.php
header('Content-Type: application/json');
require 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);

// Verificamos que lleguen los datos y que el ID exista
if ($datos && isset($datos['id'])) {
    try {
        // La consulta con sus 8 parámetros exactos (incluyendo idEstudiante)
        $sql = "UPDATE estudiante SET 
                nombre_Estudiante = :nombre, 
                nota_Uno = :nota1, 
                nota_Dos = :nota2, 
                nota_Tres = :nota3, 
                nota_Cuatro = :nota4, 
                promedio = :promedio, 
                resultado_Cualitativo = :resultado
                WHERE idEstudiante = :id";
        
        $stmt = $pdo->prepare($sql);
        
        // Los 8 bindParam vinculados EXACTAMENTE a los nombres de arriba
        $stmt->bindParam(':nombre', $datos['nombre']);
        $stmt->bindParam(':nota1', $datos['nota1']);
        $stmt->bindParam(':nota2', $datos['nota2']);
        $stmt->bindParam(':nota3', $datos['nota3']);
        $stmt->bindParam(':nota4', $datos['nota4']);
        $stmt->bindParam(':promedio', $datos['promedio']);
        $stmt->bindParam(':resultado', $datos['resultadoCualitativo']);
        $stmt->bindParam(':id', $datos['id']);
        
        $stmt->execute();
        
        echo json_encode(["status" => "success", "mensaje" => "Registro actualizado correctamente"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "mensaje" => "Error al actualizar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "Datos incompletos o falta el ID"]);
}
?>