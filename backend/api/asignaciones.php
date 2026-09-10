<?php


require __DIR__ . '/_bootstrap.php';

function sqlAsignacionEnriquecida(): string
{
    return "SELECT aa.idAsignacion, aa.idDocente, aa.idCurso, aa.idAsignatura,
                   CONCAT(d.nombres, ' ', d.apellidos) AS docente, d.documento,
                   c.grado, c.curso, c.jornada,
                   a.nombre_asignatura AS asignatura, a.intensidad_horaria,
                   (SELECT COUNT(*) FROM horario h WHERE h.idAsignacion = aa.idAsignacion) AS total_horarios
            FROM asignacion_academica aa
            JOIN docente     d ON d.idDocente     = aa.idDocente
            JOIN curso       c ON c.idCurso       = aa.idCurso
            JOIN asignatura  a ON a.idAsignatura  = aa.idAsignatura";
}

ejecutar(function () use ($pdo) {

    $id = idRecurso();

    switch (metodo()) {

        case 'GET':
            if ($id !== null) {
                $st = $pdo->prepare(sqlAsignacionEnriquecida() . ' WHERE aa.idAsignacion = ?');
                $st->execute([$id]);
                $row = $st->fetch();
                $row ? ok($row) : error('Asignación no encontrada.', 404);
            }

            $where  = [];
            $params = [];
            foreach (['idDocente' => 'aa.idDocente', 'idCurso' => 'aa.idCurso', 'idAsignatura' => 'aa.idAsignatura'] as $q => $col) {
                $v = queryInt($q);
                if ($v !== null) {
                    $where[]  = "$col = ?";
                    $params[] = $v;
                }
            }
            if (($texto = queryTexto('q')) !== null) {
                $where[] = "(CONCAT(d.nombres, ' ', d.apellidos) LIKE ? OR c.curso LIKE ?
                             OR c.grado LIKE ? OR a.nombre_asignatura LIKE ?)";
                $like    = comoLike($texto);
                $params  = array_merge($params, [$like, $like, $like, $like]);
            }
            $sql = sqlAsignacionEnriquecida();
            if ($where) {
                $sql .= ' WHERE ' . implode(' AND ', $where);
            }
            $sql .= ' ORDER BY docente, c.curso, asignatura';
            $st = $pdo->prepare($sql);
            $st->execute($params);
            ok($st->fetchAll());
            break;

        case 'POST':
            $d = cuerpo();
            exigir($d, ['idDocente', 'idCurso', 'idAsignatura']);
            $idDocente    = (int) $d['idDocente'];
            $idCurso      = (int) $d['idCurso'];
            $idAsignatura = (int) $d['idAsignatura'];

            if (asignacionParaTerna($pdo, $idDocente, $idCurso, $idAsignatura, false) !== null) {
                error('Esa combinación de docente, curso y asignatura ya está asignada.', 409);
            }
            
            $nuevoId = asignacionParaTerna($pdo, $idDocente, $idCurso, $idAsignatura, true);

            $st = $pdo->prepare(sqlAsignacionEnriquecida() . ' WHERE aa.idAsignacion = ?');
            $st->execute([$nuevoId]);
            ok($st->fetch(), 201);
            break;

        case 'DELETE':
            if ($id === null) {
                error('Falta el id de la asignación (?id=N).', 400);
            }
            $st = $pdo->prepare('DELETE FROM asignacion_academica WHERE idAsignacion = ?');
            $st->execute([$id]);
            $st->rowCount()
                ? ok(['idAsignacion' => $id, 'mensaje' => 'Asignación eliminada (y sus horarios).'])
                : error('Asignación no encontrada.', 404);
            break;

        default:
            metodoNoPermitido(['GET', 'POST', 'DELETE']);
    }
});
