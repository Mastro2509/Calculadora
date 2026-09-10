<?php

require __DIR__ . '/_bootstrap.php';

if (metodo() !== 'GET') {
    metodoNoPermitido(['GET']);
}

ejecutar(function () use ($pdo) {

    $idDocente = queryInt('idDocente');

    $sql = "SELECT d.idDocente, d.documento, d.tipo_contrato, d.jornada, d.dias_trabajo,
                   CONCAT(d.nombres, ' ', d.apellidos) AS docente,
                   COALESCE(cd.minutos_programados, 0) AS minutos,
                   COALESCE(cd.clases_programadas, 0)  AS clases,
                   COALESCE(cd.tope_horas,
                            CASE d.tipo_contrato WHEN 'Medio Tiempo' THEN 20 ELSE 40 END) AS tope_horas,
                   cd.actualizado
            FROM docente d
            LEFT JOIN carga_docente cd ON cd.idDocente = d.idDocente";
    $par = [];
    if ($idDocente !== null) {
        $sql .= ' WHERE d.idDocente = ?';
        $par[] = $idDocente;
    }
    $sql .= ' ORDER BY d.apellidos, d.nombres';

    $st = $pdo->prepare($sql);
    $st->execute($par);
    $filas = $st->fetchAll();

    if ($idDocente !== null && !$filas) {
        error('Docente no encontrado.', 404);
    }

    $porDia = [];
    if ($idDocente !== null) {
        $st = $pdo->prepare(
            'SELECT h.dia_semana, SUM(TIMESTAMPDIFF(MINUTE, h.hora_inicio, h.hora_fin)) AS minutos
             FROM horario h
             JOIN asignacion_academica aa ON aa.idAsignacion = h.idAsignacion
             WHERE aa.idDocente = ?
             GROUP BY h.dia_semana'
        );
        $st->execute([$idDocente]);
        foreach ($st->fetchAll() as $r) {
            $porDia[$r['dia_semana']] = (int) $r['minutos'];
        }
    }

    $carga = array_map(fn ($f) => formatearCarga($f, $porDia), $filas);

    if ($idDocente !== null) {
        $st = $pdo->prepare(
            sqlHorarioEnriquecido() . ' WHERE aa.idDocente = ?' .
            " ORDER BY FIELD(h.dia_semana,'Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'), h.hora_inicio"
        );
        $st->execute([$idDocente]);

        $fila = $carga[0];
        $fila['clases_detalle'] = $st->fetchAll();
        ok($fila);
    }

    if (isset($_GET['soloExcedidos']) && ($_GET['soloExcedidos'] === '1' || $_GET['soloExcedidos'] === 'true')) {
        $carga = array_values(array_filter($carga, fn ($c) => $c['excede']));
    }

    ok([
        'topes' => [
            'Tiempo Completo' => HORAS_MAX_TIEMPO_COMPLETO,
            'Medio Tiempo'    => HORAS_MAX_MEDIO_TIEMPO,
        ],
        'total_docentes'  => count($carga),
        'total_excedidos' => count(array_filter($carga, fn ($c) => $c['excede'])),
        'horas_totales'   => round(array_sum(array_column($carga, 'horas')), 2),
        'docentes'        => $carga,
    ]);
});
