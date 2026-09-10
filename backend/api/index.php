<?php

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
        'consultas'    => "$base/consultas.php",
        'carga_docentes' => "$base/carga_docentes.php",
        'resumen'      => "$base/resumen.php",
        'estudiantes'  => "$base/estudiantes.php",
    ],
    'convenciones' => [
        'id'        => 'Usar ?id=N o ruta/N (PATH_INFO) para operar sobre un registro.',
        'busqueda'  => 'En los listados GET, ?q=texto hace búsqueda parcial; se combina con los demás filtros.',
        'metodos'   => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        'respuesta' => ['exito' => '{ status: "success", data: ... }', 'error' => '{ status: "error", mensaje: "..." }'],
        'force'     => 'En horarios, ?force=1 guarda aunque exista conflicto o se supere el tope de horas del docente.',
        'carga'     => 'Tope semanal por contrato: Tiempo Completo 40 h, Medio Tiempo 20 h (tabla carga_docente).',
    ],
]);
