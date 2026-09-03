<?php
/* ==========================================================================
   Recurso: cursos
   --------------------------------------------------------------------------
   GET    /cursos.php            -> lista de cursos
   GET    /cursos.php?id=N       -> un curso
   POST   /cursos.php            -> crea un curso
   PUT    /cursos.php?id=N       -> reemplaza / actualiza un curso
   DELETE /cursos.php?id=N       -> elimina un curso (borra en cascada sus
                                    asignaciones y horarios asociados)
   Campos: grado, curso, jornada (Mañana|Tarde|Mixta), numero_estudiantes
   ========================================================================== */

require __DIR__ . '/_bootstrap.php';

ejecutar(function () use ($pdo) {

    $id = idRecurso();

    switch (metodo()) {

        case 'GET':
            if ($id !== null) {
                $st = $pdo->prepare('SELECT * FROM curso WHERE idCurso = ?');
                $st->execute([$id]);
                $curso = $st->fetch();
                $curso ? ok($curso) : error('Curso no encontrado.', 404);
            }
            $st = $pdo->query('SELECT * FROM curso ORDER BY grado, curso');
            ok($st->fetchAll());
            break;

        case 'POST':
            $d = cuerpo();
            exigir($d, ['grado', 'curso', 'jornada', 'numero_estudiantes']);
            exigirEnum($d['jornada'], JORNADAS_VALIDAS, 'jornada');

            $st = $pdo->prepare(
                'INSERT INTO curso (grado, curso, jornada, numero_estudiantes)
                 VALUES (?, ?, ?, ?)'
            );
            $st->execute([
                trim($d['grado']),
                trim($d['curso']),
                $d['jornada'],
                (int) $d['numero_estudiantes'],
            ]);

            $st = $pdo->prepare('SELECT * FROM curso WHERE idCurso = ?');
            $st->execute([(int) $pdo->lastInsertId()]);
            ok($st->fetch(), 201);
            break;

        case 'PUT':
        case 'PATCH':
            if ($id === null) {
                error('Falta el id del curso (?id=N).', 400);
            }
            $st = $pdo->prepare('SELECT * FROM curso WHERE idCurso = ?');
            $st->execute([$id]);
            $actual = $st->fetch();
            if (!$actual) {
                error('Curso no encontrado.', 404);
            }

            $d       = cuerpo();
            $grado   = trim($d['grado'] ?? $actual['grado']);
            $curso   = trim($d['curso'] ?? $actual['curso']);
            $jornada = $d['jornada'] ?? $actual['jornada'];
            $numEst  = array_key_exists('numero_estudiantes', $d)
                ? (int) $d['numero_estudiantes']
                : (int) $actual['numero_estudiantes'];

            exigirEnum($jornada, JORNADAS_VALIDAS, 'jornada');

            $st = $pdo->prepare(
                'UPDATE curso SET grado = ?, curso = ?, jornada = ?, numero_estudiantes = ?
                 WHERE idCurso = ?'
            );
            $st->execute([$grado, $curso, $jornada, $numEst, $id]);

            $st = $pdo->prepare('SELECT * FROM curso WHERE idCurso = ?');
            $st->execute([$id]);
            ok($st->fetch());
            break;

        case 'DELETE':
            if ($id === null) {
                error('Falta el id del curso (?id=N).', 400);
            }
            $st = $pdo->prepare('DELETE FROM curso WHERE idCurso = ?');
            $st->execute([$id]);
            $st->rowCount()
                ? ok(['idCurso' => $id, 'mensaje' => 'Curso eliminado.'])
                : error('Curso no encontrado.', 404);
            break;

        default:
            metodoNoPermitido(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    }
});
