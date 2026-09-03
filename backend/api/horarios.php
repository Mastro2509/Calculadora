<?php
/* ==========================================================================
   Recurso: horarios
   --------------------------------------------------------------------------
   Cada horario es una clase recurrente (día de la semana + franja horaria)
   ligada a una asignación (docente + curso + asignatura).

   GET    /horarios.php                    -> lista enriquecida (con nombres)
   GET    /horarios.php?id=N               -> un horario
   GET    /horarios.php?idCurso=N          -> filtra por curso
   GET    /horarios.php?idDocente=N        -> filtra por docente
   GET    /horarios.php?idAsignatura=N     -> filtra por asignatura
   GET    /horarios.php?dia=Lunes          -> filtra por día
   GET    /horarios.php?jornada=Mañana     -> filtra por jornada del curso
   GET    /horarios.php?q=texto            -> busca por docente, curso o asignatura
   POST   /horarios.php                    -> programa una clase
   PUT    /horarios.php?id=N               -> reprograma una clase
   DELETE /horarios.php?id=N               -> elimina una clase

   Cuerpo de POST/PUT (dos formas admitidas):
     A) { "idAsignacion": N, "dia_semana": "...", "hora_inicio": "HH:MM", "hora_fin": "HH:MM" }
     B) { "idCurso": N, "idDocente": N, "idAsignatura": N, "dia_semana": "...",
          "hora_inicio": "HH:MM", "hora_fin": "HH:MM" }
        -> la asignación (terna) se busca o se crea automáticamente.

   Detección de conflictos:
     Antes de guardar se comprueba si el mismo docente o el mismo curso ya
     tienen otra clase que se solape ese día. Si la hay, se responde 409 con
     la lista de choques. Para forzar el guardado: añadir ?force=1.
   ========================================================================== */

require __DIR__ . '/_bootstrap.php';

const ORDEN_DIAS_SQL = "FIELD(h.dia_semana,'Lunes','Martes','Miercoles','Jueves','Viernes','Sabado')";

/**
 * Devuelve los horarios que chocan con la franja indicada.
 * Solapan dos rangos [i1,f1) y [i2,f2) si  i1 < f2  y  i2 < f1.
 */
function conflictosDe(PDO $pdo, string $dia, string $ini, string $fin, int $idDocente, int $idCurso, int $ignorarId = 0): array
{
    $sql = sqlHorarioEnriquecido() . "
            WHERE h.dia_semana = :dia
              AND h.idHorario <> :ignorar
              AND (aa.idDocente = :doc OR aa.idCurso = :curso)
              AND h.hora_inicio < :fin
              AND :ini < h.hora_fin
            ORDER BY h.hora_inicio";
    $st = $pdo->prepare($sql);
    $st->execute([
        ':dia' => $dia, ':ignorar' => $ignorarId,
        ':doc' => $idDocente, ':curso' => $idCurso,
        ':ini' => $ini, ':fin' => $fin,
    ]);

    $filas = [];
    foreach ($st->fetchAll() as $r) {
        $r['motivo'] = ((int) $r['idDocente'] === $idDocente) ? 'Docente' : 'Curso';
        $filas[] = $r;
    }
    return $filas;
}

/**
 * Resuelve la asignación a partir del cuerpo: usa idAsignacion si viene,
 * o busca/crea la terna idCurso + idDocente + idAsignatura.
 * Devuelve [idAsignacion, idDocente, idCurso].
 */
function resolverAsignacion(PDO $pdo, array $d, ?array $actual = null): array
{
    if (array_key_exists('idAsignacion', $d) && $d['idAsignacion'] !== null && $d['idAsignacion'] !== '') {
        $idAsignacion = (int) $d['idAsignacion'];
        $st = $pdo->prepare('SELECT idAsignacion, idDocente, idCurso FROM asignacion_academica WHERE idAsignacion = ?');
        $st->execute([$idAsignacion]);
        $row = $st->fetch();
        if (!$row) {
            error("No existe la asignación con id $idAsignacion.", 422);
        }
        return [(int) $row['idAsignacion'], (int) $row['idDocente'], (int) $row['idCurso']];
    }

    $tieneTerna = isset($d['idCurso'], $d['idDocente'], $d['idAsignatura']);
    if (!$tieneTerna && $actual !== null) {
        // En un PUT sin datos de asignación, se conserva la actual.
        return [(int) $actual['idAsignacion'], (int) $actual['idDocente'], (int) $actual['idCurso']];
    }
    if (!$tieneTerna) {
        error('Indique "idAsignacion" o la terna "idCurso" + "idDocente" + "idAsignatura".', 422);
    }

    $idCurso      = (int) $d['idCurso'];
    $idDocente    = (int) $d['idDocente'];
    $idAsignatura = (int) $d['idAsignatura'];
    $idAsignacion = asignacionParaTerna($pdo, $idDocente, $idCurso, $idAsignatura, true);
    return [$idAsignacion, $idDocente, $idCurso];
}

ejecutar(function () use ($pdo) {

    $id = idRecurso();

    switch (metodo()) {

        /* ---------------------------------------------------------- GET */
        case 'GET':
            if ($id !== null) {
                $st = $pdo->prepare(sqlHorarioEnriquecido() . ' WHERE h.idHorario = ?');
                $st->execute([$id]);
                $row = $st->fetch();
                $row ? ok($row) : error('Horario no encontrado.', 404);
            }

            $where  = [];
            $params = [];
            foreach (['idCurso' => 'aa.idCurso', 'idDocente' => 'aa.idDocente', 'idAsignatura' => 'aa.idAsignatura'] as $q => $col) {
                $v = queryInt($q);
                if ($v !== null) {
                    $where[]  = "$col = ?";
                    $params[] = $v;
                }
            }
            if (isset($_GET['dia']) && $_GET['dia'] !== '') {
                $where[]  = 'h.dia_semana = ?';
                $params[] = normalizarDia($_GET['dia']);
            }
            if (isset($_GET['jornada']) && $_GET['jornada'] !== '') {
                $where[]  = 'c.jornada = ?';
                $params[] = $_GET['jornada'];
            }
            if (($texto = queryTexto('q')) !== null) {
                $where[] = "(CONCAT(d.nombres, ' ', d.apellidos) LIKE ? OR c.curso LIKE ?
                             OR c.grado LIKE ? OR a.nombre_asignatura LIKE ?)";
                $like    = comoLike($texto);
                $params  = array_merge($params, [$like, $like, $like, $like]);
            }

            $sql = sqlHorarioEnriquecido();
            if ($where) {
                $sql .= ' WHERE ' . implode(' AND ', $where);
            }
            $sql .= ' ORDER BY ' . ORDEN_DIAS_SQL . ', h.hora_inicio';
            $st = $pdo->prepare($sql);
            $st->execute($params);
            ok($st->fetchAll());
            break;

        /* --------------------------------------------------- POST / PUT */
        case 'POST':
        case 'PUT':
        case 'PATCH':
            $esCreacion = (metodo() === 'POST');
            $actual = null;

            if (!$esCreacion) {
                if ($id === null) {
                    error('Falta el id del horario (?id=N).', 400);
                }
                $st = $pdo->prepare(sqlHorarioEnriquecido() . ' WHERE h.idHorario = ?');
                $st->execute([$id]);
                $actual = $st->fetch();
                if (!$actual) {
                    error('Horario no encontrado.', 404);
                }
            }

            $d = cuerpo();
            if ($esCreacion) {
                exigir($d, ['dia_semana', 'hora_inicio', 'hora_fin']);
            }

            [$idAsignacion, $idDocente, $idCurso] = resolverAsignacion($pdo, $d, $actual);

            $dia = array_key_exists('dia_semana', $d)
                ? normalizarDia($d['dia_semana'])
                : $actual['dia_semana'];
            exigirEnum($dia, DIAS_SEMANA, 'dia_semana');

            $ini = array_key_exists('hora_inicio', $d)
                ? normalizarHora($d['hora_inicio'])
                : normalizarHora($actual['hora_inicio']);
            $fin = array_key_exists('hora_fin', $d)
                ? normalizarHora($d['hora_fin'])
                : normalizarHora($actual['hora_fin']);

            if ($ini >= $fin) {
                error('La hora de inicio debe ser anterior a la hora de fin.', 422);
            }

            $choques = conflictosDe($pdo, $dia, $ini, $fin, $idDocente, $idCurso, $esCreacion ? 0 : $id);
            $forzar  = isset($_GET['force']) && ($_GET['force'] === '1' || $_GET['force'] === 'true');
            if ($choques && !$forzar) {
                error('Conflicto de horario detectado. Use ?force=1 para programar de todos modos.', 409, [
                    'conflictos' => $choques,
                ]);
            }

            if ($esCreacion) {
                $st = $pdo->prepare(
                    'INSERT INTO horario (idAsignacion, dia_semana, hora_inicio, hora_fin)
                     VALUES (?, ?, ?, ?)'
                );
                $st->execute([$idAsignacion, $dia, $ini, $fin]);
                $nuevoId = (int) $pdo->lastInsertId();
                $codigo  = 201;
            } else {
                $st = $pdo->prepare(
                    'UPDATE horario SET idAsignacion = ?, dia_semana = ?, hora_inicio = ?, hora_fin = ?
                     WHERE idHorario = ?'
                );
                $st->execute([$idAsignacion, $dia, $ini, $fin, $id]);
                $nuevoId = $id;
                $codigo  = 200;
            }

            $st = $pdo->prepare(sqlHorarioEnriquecido() . ' WHERE h.idHorario = ?');
            $st->execute([$nuevoId]);
            $resultado = $st->fetch();
            if ($choques) {
                $resultado['advertencia'] = 'Guardado con conflictos de horario.';
                $resultado['conflictos']  = $choques;
            }
            ok($resultado, $codigo);
            break;

        /* ------------------------------------------------------- DELETE */
        case 'DELETE':
            if ($id === null) {
                error('Falta el id del horario (?id=N).', 400);
            }
            $st = $pdo->prepare('DELETE FROM horario WHERE idHorario = ?');
            $st->execute([$id]);
            $st->rowCount()
                ? ok(['idHorario' => $id, 'mensaje' => 'Horario eliminado.'])
                : error('Horario no encontrado.', 404);
            break;

        default:
            metodoNoPermitido(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    }
});
