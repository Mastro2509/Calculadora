<?php
// backend/eliminar.php
header('Content-Type: application/json');
require 'conexion.php';

$datos = json_decode(file_get_contents("php://input"), true);

if (isset($datos['id'])) {
    try {
        // Aquí está el cambio: de "WHERE id" a "WHERE idEstudiante"
        $sql = "DELETE FROM estudiante WHERE idEstudiante = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $datos['id']);
        $stmt->execute();
        
        echo json_encode(["status" => "success", "mensaje" => "Registro eliminado correctamente"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "mensaje" => "Error al eliminar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "No se proporcionó un ID"]);
}
?>