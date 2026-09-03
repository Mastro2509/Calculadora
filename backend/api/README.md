# API REST — Gestión Académica

API en PHP + PDO/MySQL para el módulo de **Programación Académica** (cursos,
docentes, asignaturas, asignaciones y horarios) y, como extra, una versión
REST de la gestión de notas.

- **Estilo:** un archivo por recurso (sin enrutador ni `.htaccess`).
- **Base de datos:** `gestion_notas` (ver [`../schema.sql`](../schema.sql)).
- **Conexión:** reutiliza [`../conexion.php`](../conexion.php) (MySQL en
  `localhost`, usuario `root` sin contraseña — configuración típica de XAMPP/MAMP).

---

## Puesta en marcha (XAMPP / MAMP)

1. Copiar el proyecto dentro de `htdocs/` (p. ej. `htdocs/Calculadora/`).
2. Crear la base de datos y las tablas:
   ```sql
   SOURCE backend/schema.sql;
   ```
3. (Opcional pero recomendado) aplicar
   [`mejoras_schema.sql`](mejoras_schema.sql) para el índice único de la
   terna y los índices de horario.
4. (Opcional) cargar datos de ejemplo:
   ```sql
   SOURCE backend/api/seed.sql;
   ```
5. Arrancar Apache + MySQL desde el panel de XAMPP.
6. Probar: `GET http://localhost/Calculadora/backend/api/index.php`

**URL base** en los ejemplos:
`http://localhost/Calculadora/backend/api`

---

## Convenciones

| Aspecto | Detalle |
|---|---|
| Registro individual | `?id=N` en la URL (también se acepta `recurso.php/N` vía PATH_INFO). |
| Métodos | `GET`, `POST`, `PUT`/`PATCH`, `DELETE`. `OPTIONS` responde al preflight CORS. |
| Override de método | `POST ...?_method=PUT` para clientes que no envían PUT/DELETE. |
| Cuerpo | JSON en el *body* (`Content-Type: application/json`). |
| Respuesta OK | `{ "status": "success", "data": ... }` |
| Respuesta error | `{ "status": "error", "mensaje": "..." }` (+ `campos`/`conflictos`/`detalle` según el caso) |
| Códigos | `200` OK · `201` creado · `400` petición inválida · `404` no existe · `405` método · `409` conflicto/integridad · `422` validación · `500` error de BD |

### Valores permitidos (según el schema)

- **jornada:** `Mañana`, `Tarde`, `Mixta`
- **tipo_contrato:** `Tiempo Completo`, `Medio Tiempo`
- **día (dia_semana / dias_trabajo):** `Lunes`, `Martes`, `Miercoles`, `Jueves`,
  `Viernes`, `Sabado` — la API normaliza tildes y mayúsculas
  (`"miércoles"` → `"Miercoles"`).
- **horas:** `HH:MM` o `HH:MM:SS`; se almacenan como `HH:MM:SS`.

> El frontend actual usa además las jornadas `Noche` y `Única`. Para admitirlas
> hay que ampliar el `ENUM` y `JORNADAS_VALIDAS` (ver `mejoras_schema.sql`).

---

## Recursos

### `cursos.php`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/cursos.php` | Lista todos los cursos. |
| GET | `/cursos.php?id=N` | Un curso. |
| POST | `/cursos.php` | Crea un curso. |
| PUT | `/cursos.php?id=N` | Actualiza (campos omitidos se conservan). |
| DELETE | `/cursos.php?id=N` | Elimina (borra en cascada asignaciones y horarios). |

**Cuerpo:** `grado` (texto), `curso` (texto), `jornada`, `numero_estudiantes` (entero).

```bash
curl -X POST http://localhost/Calculadora/backend/api/cursos.php \
  -H 'Content-Type: application/json' \
  -d '{"grado":"10","curso":"10-A","jornada":"Mañana","numero_estudiantes":32}'
```

---

### `asignaturas.php`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/asignaturas.php` | Lista. |
| GET | `/asignaturas.php?id=N` | Una asignatura. |
| POST | `/asignaturas.php` | Crea. |
| PUT | `/asignaturas.php?id=N` | Actualiza. |
| DELETE | `/asignaturas.php?id=N` | Elimina (cascada). |

**Cuerpo:** `nombre_asignatura` (texto), `intensidad_horaria` (entero > 0).

```bash
curl -X POST http://localhost/Calculadora/backend/api/asignaturas.php \
  -H 'Content-Type: application/json' \
  -d '{"nombre_asignatura":"Matemáticas","intensidad_horaria":5}'
```

---

### `docentes.php`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/docentes.php` | Lista. |
| GET | `/docentes.php?id=N` | Un docente. |
| POST | `/docentes.php` | Crea. |
| PUT | `/docentes.php?id=N` | Actualiza. |
| DELETE | `/docentes.php?id=N` | Elimina (cascada). |

**Cuerpo:** `documento` (texto, único), `nombres`, `apellidos`, `tipo_contrato`,
`jornada`, `dias_trabajo` (**arreglo** de días).
`dias_trabajo` se devuelve siempre como arreglo.

```bash
curl -X POST http://localhost/Calculadora/backend/api/docentes.php \
  -H 'Content-Type: application/json' \
  -d '{"documento":"1088123456","nombres":"María","apellidos":"Gómez",
       "tipo_contrato":"Tiempo Completo","jornada":"Mañana",
       "dias_trabajo":["Lunes","Martes","Miercoles","Jueves","Viernes"]}'
```

---

### `asignaciones.php` (asignacion_academica)

Relaciona **docente + curso + asignatura**. Es la base de los horarios.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/asignaciones.php` | Lista enriquecida (nombres + nº de horarios). |
| GET | `/asignaciones.php?id=N` | Una asignación. |
| GET | `/asignaciones.php?idDocente=N` · `?idCurso=N` · `?idAsignatura=N` | Filtros. |
| POST | `/asignaciones.php` | Crea `{ idDocente, idCurso, idAsignatura }`. |
| DELETE | `/asignaciones.php?id=N` | Elimina (cascada sobre horarios). |

No se permiten ternas duplicadas (→ `409`). Si alguna FK no existe → `422`.

```bash
curl -X POST http://localhost/Calculadora/backend/api/asignaciones.php \
  -H 'Content-Type: application/json' \
  -d '{"idDocente":1,"idCurso":1,"idAsignatura":1}'
```

---

### `horarios.php`

Clase recurrente (día + franja horaria) sobre una asignación.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/horarios.php` | Lista enriquecida (curso, docente, asignatura). |
| GET | `/horarios.php?id=N` | Un horario. |
| GET | `/horarios.php?idCurso=N` · `?idDocente=N` · `?idAsignatura=N` · `?dia=Lunes` · `?jornada=Mañana` | Filtros combinables. |
| POST | `/horarios.php` | Programa una clase. |
| PUT | `/horarios.php?id=N` | Reprograma. |
| DELETE | `/horarios.php?id=N` | Elimina. |

**Cuerpo (dos formas):**

- **A** — asignación existente:
  ```json
  { "idAsignacion": 3, "dia_semana": "Lunes", "hora_inicio": "07:00", "hora_fin": "09:00" }
  ```
- **B** — terna (la asignación se busca o **se crea automáticamente**):
  ```json
  { "idCurso": 1, "idDocente": 1, "idAsignatura": 1,
    "dia_semana": "Lunes", "hora_inicio": "07:00", "hora_fin": "09:00" }
  ```

**Detección de conflictos.** Antes de guardar se comprueba si el mismo docente
o el mismo curso ya tienen otra clase solapada ese día. Si la hay:

```
409  { "status":"error",
       "mensaje":"Conflicto de horario detectado. Use ?force=1 ...",
       "conflictos":[ { ...horario..., "motivo":"Docente" } ] }
```

Para guardar igualmente: `POST /horarios.php?force=1`. En ese caso la respuesta
incluye `advertencia` y la lista de `conflictos`.

```bash
curl -X POST http://localhost/Calculadora/backend/api/horarios.php \
  -H 'Content-Type: application/json' \
  -d '{"idCurso":1,"idDocente":1,"idAsignatura":1,
       "dia_semana":"Lunes","hora_inicio":"07:00","hora_fin":"09:00"}'
```

---

### `resumen.php` (solo `GET`)

Datos agregados para el dashboard:

```json
{
  "status": "success",
  "data": {
    "totales": { "cursos": 2, "docentes": 2, "asignaturas": 3,
                 "asignaciones": 3, "horarios": 3,
                 "estudiantes_en_cursos": 60, "estudiantes_registrados": 5 },
    "por_jornada": [ { "jornada":"Mañana", "cursos":1, "estudiantes":32, "clases":2 }, ... ],
    "conflictos": [ { "dia_semana":"Lunes", "motivo":"Docente", "a": {...}, "b": {...} } ]
  }
}
```

---

### `estudiantes.php` (gestión de notas, REST)

Alternativa unificada a `guardar.php` / `consultar.php` / `actualizar.php` /
`eliminar.php` (que siguen existiendo para el `index.html` actual).

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/estudiantes.php` · `?id=N` | Lista / uno. |
| POST | `/estudiantes.php` | Crea. |
| PUT | `/estudiantes.php?id=N` | Actualiza. |
| DELETE | `/estudiantes.php?id=N` | Elimina. |

**Cuerpo:** `nombre` (o `nombre_Estudiante`) y `nota1..nota4` (o
`nota_Uno..nota_Cuatro`), notas entre `0.0` y `5.0`.
El **promedio** y el **resultado cualitativo** se calculan en el servidor:

| Promedio | Resultado |
|---|---|
| ≤ 2.9 | Rendimiento insuficiente |
| 3.0 – 3.9 | Aprobado |
| 4.0 – 4.5 | Aprobado con sobresaliente |
| 4.6 – 5.0 | Aprobado con excelente |

---

## Estructura

```
backend/
├── conexion.php          # PDO -> gestion_notas  (sin cambios)
├── schema.sql            # esquema de la BD       (sin cambios)
├── guardar.php … etc.    # scripts de notas previos (sin cambios)
└── api/
    ├── _bootstrap.php    # cabeceras, PDO, helpers y validaciones comunes
    ├── index.php         # catálogo de endpoints
    ├── cursos.php
    ├── asignaturas.php
    ├── docentes.php
    ├── asignaciones.php
    ├── horarios.php
    ├── resumen.php
    ├── estudiantes.php
    ├── mejoras_schema.sql   # índices y restricción única (opcional)
    ├── seed.sql             # datos de ejemplo (opcional)
    └── README.md
```
