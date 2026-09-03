<?php
/* ==========================================================================
   Recurso: consultas  (solo lectura)
   --------------------------------------------------------------------------
   Respalda el panel "Consultar la programación" del frontend
   (programacion.html -> #panel-consultas): buscar las clases programadas
   filtrando por curso, docente, asignatura o jornada.

   GET /consultas.php
       -> { opciones: {...}, resultados: [ ...todas las clases... ] }
          `opciones` trae las listas para poblar el <select> de valores.

   GET /consultas.php?tipo=curso&valor=3
   GET /consultas.php?tipo=docente&valor=1
   GET /consultas.php?tipo=asignatura&valor=2
   GET /consultas.php?tipo=jornada&valor=Mañana
   GET /consultas.php?tipo=texto&valor=matem      (búsqueda libre)
       -> { tipo, valor, total, resultados: [ ...clases que coinciden... ] }

   Cada fila de `resultados` es un horario enriquecido: curso, grado, jornada,
   docente, asignatura, día y franja horaria.
   ========================================================================== */

require __DIR__ . '/_bootstrap.php';

if (metodo() !== 'GET') {
    metodoNoPermitido(['GET']);
}

const TIPOS_CONSULTA = ['curso', 'docente', 'asignatura', 'jornada', 'texto'];

ejecutar(function () use ($pdo) {

    $orden = ' ORDER BY ' .
        "FIELD(h.dia_semana,'Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'), " .
        'h.hora_inicio';

    $tipo  = queryTexto('tipo');
    $valor = queryTexto('valor');

    /* --- Sin filtro: catálogo de opciones + todas las clases --------------- */
    if ($tipo === null) {
        $cursos = $pdo->query(
            "SELECT idCurso AS valor, CONCAT(grado, ' - ', curso, ' (', jornada, ')') AS etiqueta
             FROM curso ORDER BY grado, curso"
        )->fetchAll();
        $docentes = $pdo->query(
            "SELECT idDocente AS valor, CONCAT(nombres, ' ', apellidos) AS etiqueta
             FROM docente ORDER BY apellidos, nombres"
        )->fetchAll();
        $asignaturas = $pdo->query(
            "SELECT idAsignatura AS valor, nombre_asignatura AS etiqueta
             FROM asignatura ORDER BY nombre_asignatura"
        )->fetchAll();

        $resultados = $pdo->query(sqlHorarioEnriquecido() . $orden)->fetchAll();

        ok([
            'opciones' => [
                'curso'       => $cursos,
                'docente'     => $docentes,
                'asignatura'  => $asignaturas,
                'jornada'     => array_map(fn ($j) => ['valor' => $j, 'etiqueta' => $j], JORNADAS_VALIDAS),
            ],
            'total'      => count($resultados),
            'resultados' => $resultados,
        ]);
    }

    /* --- Con filtro ------------------------------------------------------------ */
    exigirEnum($tipo, TIPOS_CONSULTA, 'tipo');
    if ($valor === null) {
        error("Indique 'valor' para la consulta por $tipo.", 422);
    }

    switch ($tipo) {
        case 'curso':
            $cond = 'aa.idCurso = ?';
            $par  = [(int) $valor];
            break;
        case 'docente':
            $cond = 'aa.idDocente = ?';
            $par  = [(int) $valor];
            break;
        case 'asignatura':
            $cond = 'aa.idAsignatura = ?';
            $par  = [(int) $valor];
            break;
        case 'jornada':
            $cond = 'c.jornada = ?';
            $par  = [$valor];
            break;
        case 'texto':
        default:
            $cond = "(CONCAT(d.nombres, ' ', d.apellidos) LIKE ? OR c.curso LIKE ?
                      OR c.grado LIKE ? OR a.nombre_asignatura LIKE ?)";
            $like = comoLike($valor);
            $par  = [$like, $like, $like, $like];
            break;
    }

    $st = $pdo->prepare(sqlHorarioEnriquecido() . ' WHERE ' . $cond . $orden);
    $st->execute($par);
    $resultados = $st->fetchAll();

    ok([
        'tipo'       => $tipo,
        'valor'      => $valor,
        'total'      => count($resultados),
        'resultados' => $resultados,
    ]);
});
