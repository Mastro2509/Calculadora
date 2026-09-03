<?php
/* ==========================================================================
   Recurso: estudiantes (gestión de notas)  -  versión REST
   --------------------------------------------------------------------------
   Alternativa unificada a los scripts sueltos guardar.php / consultar.php /
   actualizar.php / eliminar.php (que se mantienen para no romper el
   index.html actual).

   GET    /estudiantes.php        -> lista
   GET    /estudiantes.php?id=N   -> un estudiante
   POST   /estudiantes.php        -> crea
   PUT    /estudiantes.php?id=N   -> actualiza
   DELETE /estudiantes.php?id=N   -> elimina

   Cuerpo (se aceptan los nombres del frontend o los de la tabla):
     nombre  | nombre_Estudiante
     nota1..nota4  |  nota_Uno .. nota_Cuatro
   El promedio y el resultado cualitativo se calculan en el servidor.
   ========================================================================== */

require __DIR__ . '/_bootstrap.php';

/** Toma el primer valor no nulo entre varias claves posibles del cuerpo. */
function campo(array $d, array $claves, $defecto = null)
{
    foreach ($claves as $k) {
        if (array_key_exists($k, $d) && $d[$k] !== null && $d[$k] !== '') {
            return $d[$k];
        }
    }
    return $defecto;
}

/** Calcula promedio (1 decimal) y resultado cualitativo a partir de 4 notas. */
function calcularNotas(float $n1, float $n2, float $n3, float $n4): array
{
    $promedio = round(($n1 + $n2 + $n3 + $n4) / 4, 1);

    if ($promedio <= 2.9) {
        $resultado = 'Rendimiento insuficiente';
    } elseif ($promedio <= 3.9) {
        $resultado = 'Aprobado';
    } elseif ($promedio <= 4.5) {
        $resultado = 'Aprobado con sobresaliente';
    } else {
        $resultado = 'Aprobado con excelente';
    }

    return [$promedio, $resultado];
}

/** Extrae y valida las notas del cuerpo. Devuelve [n1, n2, n3, n4]. */
function leerNotas(array $d): array
{
    $notas = [
        (float) campo($d, ['nota1', 'nota_Uno'],    NAN),
        (float) campo($d, ['nota2', 'nota_Dos'],    NAN),
        (float) campo($d, ['nota3', 'nota_Tres'],   NAN),
        (float) campo($d, ['nota4', 'nota_Cuatro'], NAN),
    ];
    foreach ($notas as $i => $n) {
        if (is_nan($n)) {
            error('Faltan las cuatro notas (nota1..nota4).', 422);
        }
        if ($n < 0.0 || $n > 5.0) {
            error('Las notas deben estar entre 0.0 y 5.0. Nota ' . ($i + 1) . ' = ' . $n, 422);
        }
    }
    return $notas;
}

ejecutar(function () use ($pdo) {

    $id = idRecurso();

    switch (metodo()) {

        case 'GET':
            if ($id !== null) {
                $st = $pdo->prepare('SELECT * FROM estudiante WHERE idEstudiante = ?');
                $st->execute([$id]);
                $row = $st->fetch();
                $row ? ok($row) : error('Estudiante no encontrado.', 404);
            }
            $st = $pdo->query('SELECT * FROM estudiante ORDER BY nombre_Estudiante');
            ok($st->fetchAll());
            break;

        case 'POST':
            $d = cuerpo();
            $nombre = trim((string) campo($d, ['nombre', 'nombre_Estudiante'], ''));
            if ($nombre === '') {
                error('El nombre del estudiante es obligatorio.', 422);
            }
            [$n1, $n2, $n3, $n4] = leerNotas($d);
            [$promedio, $resultado] = calcularNotas($n1, $n2, $n3, $n4);

            $st = $pdo->prepare(
                'INSERT INTO estudiante
                     (nombre_Estudiante, nota_Uno, nota_Dos, nota_Tres, nota_Cuatro, promedio, resultado_Cualitativo)
                 VALUES (?, ?, ?, ?, ?, ?, ?)'
            );
            $st->execute([$nombre, $n1, $n2, $n3, $n4, $promedio, $resultado]);

            $st = $pdo->prepare('SELECT * FROM estudiante WHERE idEstudiante = ?');
            $st->execute([(int) $pdo->lastInsertId()]);
            ok($st->fetch(), 201);
            break;

        case 'PUT':
        case 'PATCH':
            if ($id === null) {
                error('Falta el id del estudiante (?id=N).', 400);
            }
            $st = $pdo->prepare('SELECT * FROM estudiante WHERE idEstudiante = ?');
            $st->execute([$id]);
            $actual = $st->fetch();
            if (!$actual) {
                error('Estudiante no encontrado.', 404);
            }

            $d = cuerpo();
            $nombre = trim((string) campo($d, ['nombre', 'nombre_Estudiante'], $actual['nombre_Estudiante']));
            $n1 = (float) campo($d, ['nota1', 'nota_Uno'],    $actual['nota_Uno']);
            $n2 = (float) campo($d, ['nota2', 'nota_Dos'],    $actual['nota_Dos']);
            $n3 = (float) campo($d, ['nota3', 'nota_Tres'],   $actual['nota_Tres']);
            $n4 = (float) campo($d, ['nota4', 'nota_Cuatro'], $actual['nota_Cuatro']);

            foreach ([$n1, $n2, $n3, $n4] as $i => $n) {
                if ($n < 0.0 || $n > 5.0) {
                    error('Las notas deben estar entre 0.0 y 5.0. Nota ' . ($i + 1) . ' = ' . $n, 422);
                }
            }
            [$promedio, $resultado] = calcularNotas($n1, $n2, $n3, $n4);

            $st = $pdo->prepare(
                'UPDATE estudiante SET
                     nombre_Estudiante = ?, nota_Uno = ?, nota_Dos = ?, nota_Tres = ?,
                     nota_Cuatro = ?, promedio = ?, resultado_Cualitativo = ?
                 WHERE idEstudiante = ?'
            );
            $st->execute([$nombre, $n1, $n2, $n3, $n4, $promedio, $resultado, $id]);

            $st = $pdo->prepare('SELECT * FROM estudiante WHERE idEstudiante = ?');
            $st->execute([$id]);
            ok($st->fetch());
            break;

        case 'DELETE':
            if ($id === null) {
                error('Falta el id del estudiante (?id=N).', 400);
            }
            $st = $pdo->prepare('DELETE FROM estudiante WHERE idEstudiante = ?');
            $st->execute([$id]);
            $st->rowCount()
                ? ok(['idEstudiante' => $id, 'mensaje' => 'Estudiante eliminado.'])
                : error('Estudiante no encontrado.', 404);
            break;

        default:
            metodoNoPermitido(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
    }
});
