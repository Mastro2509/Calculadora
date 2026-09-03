<?php
/* ==========================================================================
   API REST - Punto de entrada informativo
   --------------------------------------------------------------------------
   No es un enrutador: cada recurso vive en su propio archivo. Este index
   solo devuelve el catálogo de endpoints disponibles.
   ========================================================================== */

require __DIR__ . '/_bootstrap.php';

if (metodo() !== 'GET') {
    metodoNoPermitido(['GET']);
}

$base = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? '/backend/api/index.php'), '/');

ok([
    'nombre'  => 'API REST - Gestión Académica',
    'version' => '1.0.0',
    'base'    => $base,
    'recursos' => [
        'cursos'       => "$base/cursos.php",
        'asignaturas'  => "$base/asignaturas.php",
        'docentes'     => "$base/docentes.php",
        'asignaciones' => "$base/asignaciones.php",
        'horarios'     => "$base/horarios.php",
        'resumen'      => "$base/resumen.php",
        'estudiantes'  => "$base/estudiantes.php",
    ],
    'convenciones' => [
        'id'        => 'Usar ?id=N o ruta/N (PATH_INFO) para operar sobre un registro.',
        'metodos'   => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        'respuesta' => ['exito' => '{ status: "success", data: ... }', 'error' => '{ status: "error", mensaje: "..." }'],
        'force'     => 'En horarios, ?force=1 guarda aunque exista conflicto.',
    ],
]);
