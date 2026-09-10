<?php

require __DIR__ . '/_bootstrap.php';

if (metodo() !== 'GET') {
    metodoNoPermitido(['GET']);
}

ejecutar(function () use ($pdo) {

    $totales = [
        'cursos'                => (int) $pdo->query('SELECT COUNT(*) FROM curso')->fetchColumn(),
        'docentes'              => (int) $pdo->query('SELECT COUNT(*) FROM docente')->fetchColumn(),
        'asignaturas'           => (int) $pdo->query('SELECT COUNT(*) FROM asignatura')->fetchColumn(),
        'asignaciones'          => (int) $pdo->query('SELECT COUNT(*) FROM asignacion_academica')->fetchColumn(),
        'horarios'              => (int) $pdo->query('SELECT COUNT(*) FROM horario')->fetchColumn(),
        'estudiantes_en_cursos' => (int) $pdo->query('SELECT COALESCE(SUM(numero_estudiantes),0) FROM curso')->fetchColumn(),
        'estudiantes_registrados' => (int) $pdo->query('SELECT COUNT(*) FROM estudiante')->fetchColumn(),
    ];

    $porJornada = [];
    foreach (JORNADAS_VALIDAS as $j) {
        $c = $pdo->prepare('SELECT COUNT(*), COALESCE(SUM(numero_estudiantes),0) FROM curso WHERE jornada = ?');
        $c->execute([$j]);
        [$nCursos, $nEst] = $c->fetch(PDO::FETCH_NUM);

        $h = $pdo->prepare(
            'SELECT COUNT(*)
             FROM horario h
             JOIN asignacion_academica aa ON aa.idAsignacion = h.idAsignacion
             JOIN curso c ON c.idCurso = aa.idCurso
             WHERE c.jornada = ?'
        );
        $h->execute([$j]);

        $porJornada[] = [
            'jornada'     => $j,
            'cursos'      => (int) $nCursos,
            'estudiantes' => (int) $nEst,
            'clases'      => (int) $h->fetchColumn(),
        ];
    }

    $horarios = $pdo->query(sqlHorarioEnriquecido() . ' ORDER BY h.dia_semana, h.hora_inicio')->fetchAll();
    $conflictos = [];
    $n = count($horarios);
    for ($i = 0; $i < $n; $i++) {
        for ($j = $i + 1; $j < $n; $j++) {
            $a = $horarios[$i];
            $b = $horarios[$j];
            if ($a['dia_semana'] !== $b['dia_semana']) {
                continue;
            }
            $solapan = $a['hora_inicio'] < $b['hora_fin'] && $b['hora_inicio'] < $a['hora_fin'];
            if (!$solapan) {
                continue;
            }
            $mismoDocente = $a['idDocente'] === $b['idDocente'];
            $mismoCurso   = $a['idCurso'] === $b['idCurso'];
            if (!$mismoDocente && !$mismoCurso) {
                continue;
            }
            $conflictos[] = [
                'dia_semana' => $a['dia_semana'],
                'motivo'     => $mismoDocente ? 'Docente' : 'Curso',
                'a'          => $a,
                'b'          => $b,
            ];
        }
    }

    ok([
        'totales'     => $totales,
        'por_jornada' => $porJornada,
        'conflictos'  => $conflictos,
    ]);
});
