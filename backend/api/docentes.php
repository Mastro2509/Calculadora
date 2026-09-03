<?php
/* ==========================================================================
   Recurso: docentes
   --------------------------------------------------------------------------
   GET    /docentes.php        -> lista
   GET    /docentes.php?id=N   -> un docente
   POST   /docentes.php        -> crea
   PUT    /docentes.php?id=N   -> actualiza
   DELETE /docentes.php?id=N   -> elimina (cascada sobre asignaciones/horarios)

   Campos:
     documento      (texto, único)
     nombres        (texto)
     apellidos      (texto)
     tipo_contrato  (Tiempo Completo | Medio Tiempo)
     jornada        (Mañana | Tarde | Mixta)
     dias_trabajo   (arreglo, p. ej. ["Lunes","Martes","Miercoles"])

   En las respuestas, `dias_trabajo` se devuelve siempre como arreglo.
   ========================================================================== */

require __DIR__ . '/_bootstrap.php';

/** Convierte la fila de BD a la forma expuesta por la API (dias_trabajo como arreglo). */
function formatearDocente(array $row): array
{
    $row['dias_trabajo'] = ($row['dias_trabajo'] ?? '') === ''
        ? []
        : explode(',', $row['dias_trabajo']);
    return $row;
}

ejecutar(function () use ($pdo) {

    $id = idRecurso();

    switch (metodo()) {

        case 'GET':
            if ($id !== null) {
                $st = $pdo->prepare('SELECT * FROM docente WHERE idDocente = ?');
                $st->execute([$id]);
                $row = $st->fetch();
                $row ? ok(formatearDocente($row)) : error('Docente no encontrado.', 404);
            }
            $st = $pdo->query('SELECT * FROM docente ORDER BY apellidos, nombres');
            ok(array_map('formatearDocente', $st->fetchAll()));
            break;

        case 'POST':
            $d = cuerpo();
            exigir($d, ['documento', 'nombres', 'apellidos', 'tipo_contrato', 'jornada', 'dias_trabajo']);
            exigirEnum($d['tipo_contrato'], TIPOS_CONTRATO, 'tipo_contrato');
            exigirEnum($d['jornada'], JORNADAS_VALIDAS, 'jornada');
            $dias = normalizarDiasTrabajo($d['dias_trabajo']);

            $documento = trim($d['documento']);
            $st = $pdo->prepare('SELECT 1 FROM docente WHERE documento = ?');
            $st->execute([$documento]);
            if ($st->fetchColumn()) {
                error("Ya existe un docente con el documento $documento.", 409);
            }

            $st = $pdo->prepare(
                'INSERT INTO docente (documento, nombres, apellidos, tipo_contrato, jornada, dias_trabajo)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            $st->execute([
                $documento,
                trim($d['nombres']),
                trim($d['apellidos']),
                $d['tipo_contrato'],
                $d['jornada'],
                $dias,
            ]);

            $st = $pdo->prepare('SELECT * FROM docente WHERE idDocente = ?');
            $st->execute([(int) $pdo->lastInsertId()]);
            ok(formatearDocente($st->fetch()), 201);
            break;

        case 'PUT':
        case 'PATCH':
            if ($id === null) {
                error('Falta el id del docente (?id=N).', 400);
            }
            $st = $pdo->prepare('SELECT * FROM docente WHERE idDocente = ?');
            $st->execute([$id]);
            $actual = $st->fetch();
            if (!$actual) {
                error('Docente no encontrado.', 404);
            }

            $d             = cuerpo();
            $documento     = trim($d['documento']     ?? $actual['documento']);
            $nombres       = trim($d['nombres']       ?? $actual['nombres']);
            $apellidos     = trim($d['apellidos']     ?? $actual['apellidos']);
            $tipoContrato  = $d['tipo_contrato']      ?? $actual['tipo_contrato'];
            $jornada       = $d['jornada']            ?? $actual['jornada'];
            $dias          = array_key_exists('dias_trabajo', $d)
                ? normalizarDiasTrabajo($d['dias_trabajo'])
                : $actual['dias_trabajo'];

            exigirEnum($tipoContrato, TIPOS_CONTRATO, 'tipo_contrato');
            exigirEnum($jornada, JORNADAS_VALIDAS, 'jornada');

            $st = $pdo->prepare('SELECT 1 FROM docente WHERE documento = ? AND idDocente <> ?');
            $st->execute([$documento, $id]);
            if ($st->fetchColumn()) {
                error("Ya existe otro docente con el documento $documento.", 409);
            }

            $st = $pdo->prepare(
                'UPDATE docente SET documento = ?, nombres = ?, apellidos = ?,
                        tipo_contrato = ?, jornada = ?, dias_trabajo = ?
                 WHERE idDocente = ?'
            );
            $st->execute([$documento, $nombres, $apellidos, $tipoContrato, $jornada, $dias, $id]);

            $st = $pdo->prepare('SELECT * FROM docente WHERE idDocente = ?');
            $st->execute([$id]);
            ok(formatearDocente($st->fetch()));
            break;

        case 'DELETE':
            if ($id === null) {
                error('Falta el id del docente (?id=N).', 400);
            }
            $st = $pdo->prepare('DELETE FROM docente WHERE idDocente = ?');
            $st->execute([$id]);
            $st->rowCount()
                ? ok(['idDocente' => $id, 'mensaje' => 'Docente eliminado.'])
                : error('Docente no encontrado.', 404);
            break;

        default:
            metodoNoPermitido(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    }
});
