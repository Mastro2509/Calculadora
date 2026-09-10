<?php

require __DIR__ . '/_bootstrap.php';

ejecutar(function () use ($pdo) {

    $id = idRecurso();

    switch (metodo()) {

        case 'GET':
            if ($id !== null) {
                $st = $pdo->prepare('SELECT * FROM asignatura WHERE idAsignatura = ?');
                $st->execute([$id]);
                $row = $st->fetch();
                $row ? ok($row) : error('Asignatura no encontrada.', 404);
            }
            $sql    = 'SELECT * FROM asignatura';
            $params = [];
            if (($q = queryTexto('q')) !== null) {
                $sql     .= ' WHERE nombre_asignatura LIKE ?';
                $params[] = comoLike($q);
            }
            $sql .= ' ORDER BY nombre_asignatura';
            $st = $pdo->prepare($sql);
            $st->execute($params);
            ok($st->fetchAll());
            break;

        case 'POST':
            $d = cuerpo();
            exigir($d, ['nombre_asignatura', 'intensidad_horaria']);
            $intensidad = (int) $d['intensidad_horaria'];
            if ($intensidad <= 0) {
                error("'intensidad_horaria' debe ser un entero mayor que 0.", 422);
            }

            $st = $pdo->prepare(
                'INSERT INTO asignatura (nombre_asignatura, intensidad_horaria) VALUES (?, ?)'
            );
            $st->execute([trim($d['nombre_asignatura']), $intensidad]);

            $st = $pdo->prepare('SELECT * FROM asignatura WHERE idAsignatura = ?');
            $st->execute([(int) $pdo->lastInsertId()]);
            ok($st->fetch(), 201);
            break;

        case 'PUT':
        case 'PATCH':
            if ($id === null) {
                error('Falta el id de la asignatura (?id=N).', 400);
            }
            $st = $pdo->prepare('SELECT * FROM asignatura WHERE idAsignatura = ?');
            $st->execute([$id]);
            $actual = $st->fetch();
            if (!$actual) {
                error('Asignatura no encontrada.', 404);
            }

            $d          = cuerpo();
            $nombre     = trim($d['nombre_asignatura'] ?? $actual['nombre_asignatura']);
            $intensidad = array_key_exists('intensidad_horaria', $d)
                ? (int) $d['intensidad_horaria']
                : (int) $actual['intensidad_horaria'];
            if ($intensidad <= 0) {
                error("'intensidad_horaria' debe ser un entero mayor que 0.", 422);
            }

            $st = $pdo->prepare(
                'UPDATE asignatura SET nombre_asignatura = ?, intensidad_horaria = ?
                 WHERE idAsignatura = ?'
            );
            $st->execute([$nombre, $intensidad, $id]);

            $st = $pdo->prepare('SELECT * FROM asignatura WHERE idAsignatura = ?');
            $st->execute([$id]);
            ok($st->fetch());
            break;

        case 'DELETE':
            if ($id === null) {
                error('Falta el id de la asignatura (?id=N).', 400);
            }
            $st = $pdo->prepare('DELETE FROM asignatura WHERE idAsignatura = ?');
            $st->execute([$id]);
            $st->rowCount()
                ? ok(['idAsignatura' => $id, 'mensaje' => 'Asignatura eliminada.'])
                : error('Asignatura no encontrada.', 404);
            break;

        default:
            metodoNoPermitido(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    }
});
