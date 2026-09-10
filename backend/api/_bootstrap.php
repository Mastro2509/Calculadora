<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/../conexion.php';   // define $pdo (PDO hacia gestion_notas)
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

/* Valores permitidos según backend/schema.sql                        */
const JORNADAS_VALIDAS   = ['Mañana', 'Tarde', 'Mixta'];
const TIPOS_CONTRATO     = ['Tiempo Completo', 'Medio Tiempo'];
const DIAS_SEMANA        = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

/* Tope de horas semanales de clase según el tipo de contrato del docente. */
const HORAS_MAX_TIEMPO_COMPLETO = 40;
const HORAS_MAX_MEDIO_TIEMPO    = 20;

/* Entrada de la petición                                             */

/** Método HTTP efectivo. Permite override con ?_method=PUT para clientes limitados. */
function metodo(): string
{
    $m = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    if ($m === 'POST' && isset($_GET['_method'])) {
        $m = strtoupper($_GET['_method']);
    }
    return $m;
}

/** Cuerpo JSON de la petición como arreglo asociativo (se lee una sola vez). */
function cuerpo(): array
{
    static $datos = null;
    if ($datos === null) {
        $raw = file_get_contents('php://input');
        $datos = ($raw === false || $raw === '') ? [] : json_decode($raw, true);
        if (!is_array($datos)) {
            error('El cuerpo de la petición no es JSON válido.', 400);
        }
    }
    return $datos;
}

/** Identificador del recurso: ?id=N  o  recurso.php/N (PATH_INFO). */
function idRecurso(): ?int
{
    if (isset($_GET['id']) && is_numeric($_GET['id'])) {
        return (int) $_GET['id'];
    }
    if (preg_match('#^/(\d+)#', $_SERVER['PATH_INFO'] ?? '', $m)) {
        return (int) $m[1];
    }
    return null;
}

/** Parámetro de query opcional como entero (o null). */
function queryInt(string $clave): ?int
{
    return isset($_GET[$clave]) && is_numeric($_GET[$clave]) ? (int) $_GET[$clave] : null;
}

/** Parámetro de query opcional como texto ya recortado (o null si viene vacío). */
function queryTexto(string $clave): ?string
{
    if (!isset($_GET[$clave])) {
        return null;
    }
    $v = trim((string) $_GET[$clave]);
    return $v === '' ? null : $v;
}

/** Convierte un texto de búsqueda en patrón LIKE ("%texto%"), escapando comodines. */
function comoLike(string $texto): string
{
    return '%' . str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $texto) . '%';
}

/* Salida                                                             */

/** Emite una respuesta JSON cruda y termina la ejecución. */
function responder($payload, int $codigo = 200): void
{
    http_response_code($codigo);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
    exit;
}

/** Respuesta de éxito con envoltura estándar. */
function ok($data = null, int $codigo = 200): void
{
    responder(['status' => 'success', 'data' => $data], $codigo);
}

/** Respuesta de error con envoltura estándar. Termina la ejecución. */
function error(string $mensaje, int $codigo = 400, array $extra = []): void
{
    responder(array_merge(['status' => 'error', 'mensaje' => $mensaje], $extra), $codigo);
}

/** Endpoint que no soporta el método recibido. */
function metodoNoPermitido(array $permitidos): void
{
    header('Allow: ' . implode(', ', $permitidos));
    error('Método no permitido. Métodos válidos: ' . implode(', ', $permitidos), 405);
}

/* Validaciones                                                       */

/** Corta con 422 si falta algún campo obligatorio o viene vacío. */
function exigir(array $datos, array $campos): void
{
    $faltan = [];
    foreach ($campos as $c) {
        $v = $datos[$c] ?? null;
        if ($v === null || (is_string($v) && trim($v) === '') || (is_array($v) && count($v) === 0)) {
            $faltan[] = $c;
        }
    }
    if ($faltan) {
        error('Faltan campos obligatorios: ' . implode(', ', $faltan), 422, ['campos' => $faltan]);
    }
}

/** Corta con 422 si el valor no está dentro de la lista permitida (ENUM). */
function exigirEnum($valor, array $permitidos, string $campo): void
{
    if (!in_array($valor, $permitidos, true)) {
        error("Valor inválido para '$campo': '" . (is_scalar($valor) ? $valor : gettype($valor)) .
              "'. Permitidos: " . implode(', ', $permitidos), 422);
    }
}

/** Normaliza el nombre de un día a la forma del ENUM del schema (sin tildes). */
function normalizarDia(string $dia): string
{
    $sinTilde = strtr($dia, ['á' => 'a', 'é' => 'e', 'í' => 'i', 'ó' => 'o', 'ú' => 'u',
                             'Á' => 'A', 'É' => 'E', 'Í' => 'I', 'Ó' => 'O', 'Ú' => 'U']);
    return ucfirst(mb_strtolower($sinTilde, 'UTF-8'));
}

/** Convierte "SET" de días (arreglo o cadena) a cadena ordenada "Lunes,Martes,...". */
function normalizarDiasTrabajo($valor): string
{
    if (is_string($valor)) {
        $valor = array_filter(array_map('trim', explode(',', $valor)), 'strlen');
    }
    if (!is_array($valor) || count($valor) === 0) {
        error("'dias_trabajo' debe ser un arreglo no vacío de días.", 422);
    }
    $presentes = [];
    foreach ($valor as $d) {
        $n = normalizarDia((string) $d);
        exigirEnum($n, DIAS_SEMANA, 'dias_trabajo');
        $presentes[$n] = true;
    }
    return implode(',', array_values(array_filter(DIAS_SEMANA, fn ($d) => isset($presentes[$d]))));
}

/** Normaliza una hora a "HH:MM:SS". Corta con 422 si el formato es inválido. */
function normalizarHora(string $h): string
{
    $h = trim($h);
    if (preg_match('/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/', $h, $m)) {
        $hh = (int) $m[1];
        $mm = (int) $m[2];
        $ss = (int) ($m[3] ?? 0);
        if ($hh <= 23 && $mm <= 59 && $ss <= 59) {
            return sprintf('%02d:%02d:%02d', $hh, $mm, $ss);
        }
    }
    error("Hora inválida: '$h'. Use el formato HH:MM.", 422);
}

/* Ejecución con manejo de errores de base de datos                   */

/** Ejecuta el manejador del endpoint capturando PDOException. */
function ejecutar(callable $fn): void
{
    try {
        $fn();
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            error('Violación de integridad referencial. Verifique llaves foráneas o valores duplicados.', 409,
                  ['detalle' => $e->getMessage()]);
        }
        error('Error de base de datos.', 500, ['detalle' => $e->getMessage()]);
    }
}

/* Helpers de dominio (compartidos por asignaciones.php y horarios.php)*/

/** Corta con 422 si no existe una fila con esa PK en la tabla indicada. */
function exigirExiste(PDO $pdo, string $tabla, string $columnaPk, int $id): void
{
    $st = $pdo->prepare("SELECT 1 FROM $tabla WHERE $columnaPk = ?");
    $st->execute([$id]);
    if (!$st->fetchColumn()) {
        error("No existe un registro en '$tabla' con id $id.", 422);
    }
}

function asignacionParaTerna(PDO $pdo, int $idDocente, int $idCurso, int $idAsignatura, bool $crear = true): ?int
{
    $st = $pdo->prepare(
        'SELECT idAsignacion FROM asignacion_academica
         WHERE idDocente = ? AND idCurso = ? AND idAsignatura = ?'
    );
    $st->execute([$idDocente, $idCurso, $idAsignatura]);
    $fila = $st->fetchColumn();
    if ($fila !== false) {
        return (int) $fila;
    }
    if (!$crear) {
        return null;
    }

    exigirExiste($pdo, 'docente', 'idDocente', $idDocente);
    exigirExiste($pdo, 'curso', 'idCurso', $idCurso);
    exigirExiste($pdo, 'asignatura', 'idAsignatura', $idAsignatura);

    $st = $pdo->prepare(
        'INSERT INTO asignacion_academica (idDocente, idCurso, idAsignatura) VALUES (?, ?, ?)'
    );
    $st->execute([$idDocente, $idCurso, $idAsignatura]);
    return (int) $pdo->lastInsertId();
}

/** SELECT enriquecido de horarios (con nombres de curso, docente y asignatura). */
function sqlHorarioEnriquecido(): string
{
    return "SELECT h.idHorario, h.idAsignacion, h.dia_semana, h.hora_inicio, h.hora_fin,
                   aa.idCurso, aa.idDocente, aa.idAsignatura,
                   c.grado, c.curso, c.jornada,
                   CONCAT(d.nombres, ' ', d.apellidos) AS docente,
                   a.nombre_asignatura AS asignatura, a.intensidad_horaria
            FROM horario h
            JOIN asignacion_academica aa ON aa.idAsignacion = h.idAsignacion
            JOIN curso       c ON c.idCurso       = aa.idCurso
            JOIN docente     d ON d.idDocente     = aa.idDocente
            JOIN asignatura  a ON a.idAsignatura  = aa.idAsignatura";
}

/* Carga horaria de los docentes (tabla `carga_docente`)               */

/** Tope de horas semanales que admite un tipo de contrato. */
function topeHoras(string $tipoContrato): int
{
    return $tipoContrato === 'Medio Tiempo'
        ? HORAS_MAX_MEDIO_TIEMPO
        : HORAS_MAX_TIEMPO_COMPLETO;
}

function leerCargaDocente(PDO $pdo, int $idDocente): ?array
{
    $st = $pdo->prepare(
        "SELECT d.idDocente, d.documento, d.tipo_contrato, d.jornada, d.dias_trabajo,
                CONCAT(d.nombres, ' ', d.apellidos) AS docente,
                COALESCE(cd.minutos_programados, 0) AS minutos,
                COALESCE(cd.clases_programadas, 0)  AS clases,
                COALESCE(cd.tope_horas,
                         CASE d.tipo_contrato WHEN 'Medio Tiempo' THEN 20 ELSE 40 END) AS tope_horas,
                cd.actualizado
         FROM docente d
         LEFT JOIN carga_docente cd ON cd.idDocente = d.idDocente
         WHERE d.idDocente = ?"
    );
    $st->execute([$idDocente]);
    $fila = $st->fetch();
    return $fila ? formatearCarga($fila) : null;
}

function formatearCarga(array $f, array $minutosPorDia = []): array
{
    $minutos = (int) $f['minutos'];
    $tope    = (float) $f['tope_horas'];
    $horas   = round($minutos / 60, 2);

    $porDia = [];
    foreach (DIAS_SEMANA as $dia) {
        if (isset($minutosPorDia[$dia])) {
            $porDia[$dia] = round($minutosPorDia[$dia] / 60, 2);
        }
    }

    return [
        'idDocente'         => (int) $f['idDocente'],
        'docente'           => $f['docente'],
        'documento'         => $f['documento'] ?? null,
        'tipo_contrato'     => $f['tipo_contrato'],
        'jornada'           => $f['jornada'] ?? null,
        'dias_trabajo'      => ($f['dias_trabajo'] ?? '') === '' ? [] : explode(',', $f['dias_trabajo']),
        'minutos'           => $minutos,
        'horas'             => $horas,
        'tope_horas'        => $tope,
        'horas_disponibles' => round($tope - $horas, 2),
        'porcentaje'        => $tope > 0 ? (int) round(($horas / $tope) * 100) : 0,
        'clases'            => (int) $f['clases'],
        'excede'            => $horas > $tope,
        'horas_por_dia'     => $porDia,
        'actualizado'       => $f['actualizado'] ?? null,
    ];
}
