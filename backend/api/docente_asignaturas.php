<?php

require __DIR__ . '/_bootstrap.php';

ejecutar(function () use ($pdo) {

    switch (metodo()) {

        case 'GET':
            $idDocente = queryInt('idDocente');
            if ($idDocente !== null) {
                $st = $pdo->prepare(
                    'SELECT da.idDocente, da.idAsignatura, a.nombre_asignatura AS asignatura
                     FROM docente_asignatura da
                     JOIN asignatura a ON a.idAsignatura = da.idAsignatura
                     WHERE da.idDocente = ?
                     ORDER BY a.nombre_asignatura'
                );
                $st->execute([$idDocente]);
            } else {
                $st = $pdo->query(
                    'SELECT da.idDocente, da.idAsignatura, a.nombre_asignatura AS asignatura
                     FROM docente_asignatura da
                     JOIN asignatura a ON a.idAsignatura = da.idAsignatura
                     ORDER BY da.idDocente, a.nombre_asignatura'
                );
            }
            ok($st->fetchAll());
            break;

        case 'PUT':
            $idDocente = queryInt('idDocente');
            if ($idDocente === null) {
                error('Falta el id del docente (?idDocente=N).', 400);
            }
            exigirExiste($pdo, 'docente', 'idDocente', $idDocente);

            $d = cuerpo();
            $ids = $d['idAsignaturas'] ?? [];
            if (!is_array($ids)) {
                error("'idAsignaturas' debe ser un arreglo.", 422);
            }
            
            $limpios = [];
            foreach ($ids as $x) {
                $n = (int) $x;
                exigirExiste($pdo, 'asignatura', 'idAsignatura', $n);
                $limpios[$n] = true;
            }

            $pdo->beginTransaction();
            try {
                $pdo->prepare('DELETE FROM docente_asignatura WHERE idDocente = ?')
                    ->execute([$idDocente]);
                if ($limpios) {
                    $ins = $pdo->prepare(
                        'INSERT INTO docente_asignatura (idDocente, idAsignatura) VALUES (?, ?)'
                    );
                    foreach (array_keys($limpios) as $idAsig) {
                        $ins->execute([$idDocente, $idAsig]);
                    }
                }
                $pdo->commit();
            } catch (Throwable $e) {
                $pdo->rollBack();
                throw $e;
            }

            $st = $pdo->prepare(
                'SELECT da.idDocente, da.idAsignatura, a.nombre_asignatura AS asignatura
                 FROM docente_asignatura da
                 JOIN asignatura a ON a.idAsignatura = da.idAsignatura
                 WHERE da.idDocente = ?
                 ORDER BY a.nombre_asignatura'
            );
            $st->execute([$idDocente]);
            ok($st->fetchAll());
            break;

        default:
            metodoNoPermitido(['GET', 'PUT']);
    }
});
