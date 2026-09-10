# 2. DISEÑO DEL PROYECTO
## Aplicación Web para la Programación Académica

**Fecha:** Septiembre 2026  
**Versión:** 1.0

---

## 2.1 ARQUITECTURA DE SOFTWARE

### Descripción General
La aplicación sigue una arquitectura en **tres capas** (3-tier architecture):

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                 │
│  HTML5 + CSS3 + JavaScript Vanilla (Frontend Web)       │
│  - index.html (Gestión de notas)                        │
│  - programacion.html (Programación académica)           │
│  - Estilos: style.css, programacion.css                 │
│  - Lógica: app.js, Estudiante.js, programacion.js       │
└──────────────────────────────────────────────────────────┘
                             ↓ HTTP/HTTPS
                          API REST
┌──────────────────────────────────────────────────────────┐
│               CAPA DE LÓGICA DE NEGOCIO                  │
│  PHP + PDO (Backend Web Service)                        │
│  - Validación de datos                                  │
│  - Cálculo de promedios y rankings                       │
│  - Detección de conflictos de horarios                   │
│  - Consultas y filtros avanzados                         │
│  - Endpoints CRUD para todos los recursos               │
│  - Transacciones y manejo de errores                     │
└──────────────────────────────────────────────────────────┘
                             ↓ SQL
┌──────────────────────────────────────────────────────────┐
│                  CAPA DE DATOS                           │
│  MySQL / MariaDB                                        │
│  - Tablas: estudiante, curso, docente, asignatura       │
│  - Tablas transaccionales: asignacion_academica, horario│
│  - Índices y restricciones de integridad                │
│  - Transacciones ACID                                   │
└──────────────────────────────────────────────────────────┘
```

### Componentes Principales

#### 1. Frontend (Presentación)
- **Tecnología:** HTML5, CSS3, JavaScript Vanilla
- **Módulos:**
  - Módulo de Notas: Gestión de estudiantes y calificaciones
  - Módulo de Programación: Dashboard, CRUD de cursos/docentes/asignaturas, horarios
  - Módulo de Consultas: Búsqueda y filtros avanzados
  - Módulo de Calendario: Visualización de clases programadas

**Responsabilidades:**
- Captura de datos de usuario
- Validación básica en cliente
- Visualización de información
- Interacción con Backend vía API REST

#### 2. Backend (Lógica de Negocio)
- **Tecnología:** PHP 7.4+, PDO
- **Archivos:** `backend/conexion.php`, `backend/api/*.php`
- **Componentes:**
  - Controladores REST (cursos.php, docentes.php, etc.)
  - Lógica de validación
  - Detección de conflictos
  - Funciones helper

**Responsabilidades:**
- Autenticación y autorización (futura)
- Validación de datos
- Lógica de negocio
- Manejo de transacciones
- Gestión de errores

#### 3. Base de Datos (Persistencia)
- **Tecnología:** MySQL / MariaDB
- **Archivos:** `backend/schema.sql`
- **Tablas:** 6 tablas normalizadas

**Responsabilidades:**
- Almacenamiento persistente
- Integridad de datos
- Consultas eficientes

### Patrones de Diseño

1. **REST (Representational State Transfer):** API sin estado
2. **MVC (Model-View-Controller):** Separación de responsabilidades
3. **DAO (Data Access Object):** Acceso a BD mediante PDO
4. **Factory:** Creación de objetos de modelos

---

## 2.2 ARQUITECTURA DE INFRAESTRUCTURA

### Diagrama de Despliegue

```
┌──────────────────────────────────────────────────────────────────┐
│                      NAVEGADOR WEB (Cliente)                     │
│  - Chrome, Firefox, Safari, Edge (Desktop, Mobile)               │
│  - Requiere: JavaScript habilitado                               │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP/HTTPS (Puerto 80/443)
                             ↓
┌──────────────────────────────────────────────────────────────────┐
│                     SERVIDOR WEB (Apache)                        │
│  - XAMPP / LAMP (Linux, Apache, MySQL, PHP)                      │
│  - Puerto: 80 (HTTP) / 443 (HTTPS)                               │
│  - Localización: htdocs/Calculadora/                             │
│                                                                   │
│  ├── Frontend                                                     │
│  │   ├── index.html                                              │
│  │   ├── programacion.html                                       │
│  │   ├── css/ (estilos)                                          │
│  │   └── js/ (lógica cliente)                                    │
│  │                                                                │
│  └── Backend                                                      │
│      ├── conexion.php (conexión BD)                              │
│      ├── guardar.php, consultar.php, etc. (legacy)               │
│      └── api/                                                     │
│          ├── _bootstrap.php (configuración)                      │
│          ├── cursos.php                                          │
│          ├── docentes.php                                        │
│          ├── asignaturas.php                                     │
│          ├── asignaciones.php                                    │
│          ├── horarios.php                                        │
│          ├── consultas.php                                       │
│          ├── resumen.php                                         │
│          └── estudiantes.php                                     │
└────────────────────────────┬─────────────────────────────────────┘
                             │ TCP/IP (Puerto 3306)
                             ↓
┌──────────────────────────────────────────────────────────────────┐
│                   SERVIDOR DE BASE DE DATOS                      │
│  - MySQL 5.7+ / MariaDB 10.3+                                    │
│  - Puerto: 3306 (local)                                          │
│  - Base de datos: gestion_notas                                  │
│  - Usuario: root (sin contraseña en desarrollo)                  │
│                                                                   │
│  Tablas:                                                          │
│  ├── estudiante (id, nombre, nota1-4, promedio, resultado)       │
│  ├── curso (id, grado, curso, jornada, num_estudiantes)          │
│  ├── docente (id, doc, nombres, apellidos, contrato, jornada)    │
│  ├── asignatura (id, nombre, intensidad_horaria)                 │
│  ├── asignacion_academica (id, idDocente, idCurso, idAsignatura) │
│  └── horario (id, idAsignacion, dia, hora_inicio, hora_fin)      │
└──────────────────────────────────────────────────────────────────┘
```

### Requisitos del Sistema

#### Cliente
- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Conexión a internet
- JavaScript habilitado
- Resolución mínima: 360px (mobile)

#### Servidor (Desarrollo)
- XAMPP 7.4+ o similar (Apache + MySQL + PHP)
- PHP 7.4+
- MySQL 5.7+ o MariaDB 10.3+
- 100 MB de espacio en disco (aplicación + BD)
- 512 MB RAM mínimo

#### Producción (Recomendado)
- Servidor Linux (Ubuntu 20.04+)
- Apache 2.4+ con SSL/TLS
- PHP 8.0+
- MySQL 8.0+ con replicación
- 1 GB RAM mínimo
- IP pública / Dominio
- CDN para assets estáticos

---

## 2.3 MODELO DE BASE DE DATOS

### Diagrama Entidad-Relación (ER)

```
┌─────────────────────────────┐
│        ESTUDIANTE           │
├─────────────────────────────┤
│ PK  idEstudiante (INT)      │
│     nombre_Estudiante (VARCHAR)
│     nota_Uno (INT)          │
│     nota_Dos (INT)          │
│     nota_Tres (INT)         │
│     nota_Cuatro (INT)       │
│     promedio (DECIMAL)      │
│     resultado_Cualitativo   │
│     (VARCHAR)               │
└─────────────────────────────┘

┌──────────────────────────────┐
│         CURSO                │
├──────────────────────────────┤
│ PK  idCurso (INT)            │
│     grado (VARCHAR)          │
│     curso (VARCHAR)          │
│     jornada (ENUM)           │
│     numero_estudiantes (INT) │
└──────────────────────────────┘

┌───────────────────────────────────────────┐
│          DOCENTE                          │
├───────────────────────────────────────────┤
│ PK  idDocente (INT)                       │
│     documento (VARCHAR) UNIQUE            │
│     nombres (VARCHAR)                     │
│     apellidos (VARCHAR)                   │
│     tipo_contrato (ENUM)                  │
│     jornada (ENUM)                        │
│     dias_trabajo (SET)                    │
└───────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│         ASIGNATURA                       │
├──────────────────────────────────────────┤
│ PK  idAsignatura (INT)                   │
│     nombre_asignatura (VARCHAR)          │
│     intensidad_horaria (INT)             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│    ASIGNACION_ACADEMICA (Transaccional)  │
├──────────────────────────────────────────┤
│ PK  idAsignacion (INT)                   │
│ FK  idDocente → Docente(idDocente)       │
│ FK  idCurso → Curso(idCurso)             │
│ FK  idAsignatura → Asignatura(id)        │
│     UNIQUE (idDocente, idCurso, idAs)    │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│          HORARIO (Transaccional)         │
├──────────────────────────────────────────┤
│ PK  idHorario (INT)                      │
│ FK  idAsignacion → AsignacionAcad(id)    │
│     dia_semana (ENUM)                    │
│     hora_inicio (TIME)                   │
│     hora_fin (TIME)                      │
│     INDEX (idAsignacion, dia_semana)     │
│     CHECK (hora_fin > hora_inicio)       │
└──────────────────────────────────────────┘

Relaciones:
- ASIGNACION_ACADEMICA.idDocente 1 ← → N DOCENTE
- ASIGNACION_ACADEMICA.idCurso 1 ← → N CURSO
- ASIGNACION_ACADEMICA.idAsignatura 1 ← → N ASIGNATURA
- HORARIO.idAsignacion 1 ← → N ASIGNACION_ACADEMICA (CASCADE)
- Integridad referencial: ON DELETE CASCADE
```

### Especificación de Tablas

#### Tabla: ESTUDIANTE
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| idEstudiante | INT | PK, AUTO_INCREMENT | Identificador único |
| nombre_Estudiante | VARCHAR(50) | NOT NULL | Nombre completo |
| nota_Uno | INT | NOT NULL | Primera nota (0-5) |
| nota_Dos | INT | NOT NULL | Segunda nota (0-5) |
| nota_Tres | INT | NOT NULL | Tercera nota (0-5) |
| nota_Cuatro | INT | NOT NULL | Cuarta nota (0-5) |
| promedio | DECIMAL(10,2) | | Promedio calculado |
| resultado_Cualitativo | VARCHAR(50) | | Rendimiento (Aprobado, etc) |

#### Tabla: CURSO
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| idCurso | INT | PK, AUTO_INCREMENT | Identificador único |
| grado | VARCHAR(20) | NOT NULL | Grado (10, 11, etc) |
| curso | VARCHAR(20) | NOT NULL | Identificador curso (10-A) |
| jornada | ENUM | NOT NULL | Mañana, Tarde, Mixta |
| numero_estudiantes | INT | NOT NULL | Cantidad estudiantes |

#### Tabla: DOCENTE
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| idDocente | INT | PK, AUTO_INCREMENT | Identificador único |
| documento | VARCHAR(20) | UNIQUE, NOT NULL | Cédula/Documento |
| nombres | VARCHAR(50) | NOT NULL | Nombres |
| apellidos | VARCHAR(50) | NOT NULL | Apellidos |
| tipo_contrato | ENUM | NOT NULL | Tiempo Completo / Medio |
| jornada | ENUM | NOT NULL | Mañana, Tarde, Mixta |
| dias_trabajo | SET | NOT NULL | L,M,X,J,V,S |

#### Tabla: ASIGNATURA
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| idAsignatura | INT | PK, AUTO_INCREMENT | Identificador único |
| nombre_asignatura | VARCHAR(100) | NOT NULL | Nombre (Matemáticas) |
| intensidad_horaria | INT | NOT NULL | Horas/semana |

#### Tabla: ASIGNACION_ACADEMICA
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| idAsignacion | INT | PK, AUTO_INCREMENT | Identificador único |
| idDocente | INT | FK, NOT NULL | Referencia a docente |
| idCurso | INT | FK, NOT NULL | Referencia a curso |
| idAsignatura | INT | FK, NOT NULL | Referencia a asignatura |
| | | UNIQUE (idDocente, idCurso, idAsignatura) | Sin duplicados |

#### Tabla: HORARIO
| Campo | Tipo | Restricción | Descripción |
|-------|------|-------------|-------------|
| idHorario | INT | PK, AUTO_INCREMENT | Identificador único |
| idAsignacion | INT | FK, NOT NULL | Referencia a asignación |
| dia_semana | ENUM | NOT NULL | L,M,X,J,V,S |
| hora_inicio | TIME | NOT NULL | HH:MM:SS |
| hora_fin | TIME | NOT NULL | HH:MM:SS |
| | | INDEX (idAsignacion, dia_semana) | Optimización |
| | | CHECK (hora_fin > hora_inicio) | Validación |

---

## 2.4 FLUJOS DE PROCESOS

### Flujo 1: Registrar Programación de Clase

```
Usuario                 Frontend                   Backend                    BD
  │                        │                          │                        │
  │─ Selecciona Curso ─────→│                          │                        │
  │                        │─ GET /api/cursos.php ────→│─ SQL: SELECT * ────────→│
  │                        │←────────── Cursos ────────│←── Cursos ─────────────│
  │                        │                          │                        │
  │─ Selecciona Docente ──→│                          │                        │
  │─ Selecciona Asignatura→│                          │                        │
  │─ Define Día y Hora ───→│                          │                        │
  │                        │─ POST /api/horarios.php ──→│                        │
  │                        │  (idCurso, idDocente,     │                        │
  │                        │   idAsignatura, día, hora)│                        │
  │                        │                          │─ Validar conflictos ───→│
  │                        │                          │  SELECT * FROM horario  │
  │                        │                          │  WHERE docente/curso    │
  │                        │                          │  y dia_semana =?        │
  │                        │                          │←── Resultado ───────────│
  │                        │                          │                        │
  │                        │    ¿Hay conflicto?       │                        │
  │                        │    Sí: Mostrar advertencia│                        │
  │                        │←─ 409 + conflictos ──────│                        │
  │                        │                          │                        │
  │─ ¿Fuerza guardado? ───→│                          │                        │
  │  (flag force=1)        │─ POST ?force=1 ──────────→│─ INSERT horario ───────→│
  │                        │                          │←── OK ─────────────────│
  │                        │←─ 201 + horario guardado ─│                        │
  │←────── Confirmación ───│                          │                        │
```

### Flujo 2: Calcular Promedio de Estudiante

```
Usuario                 Frontend               Backend               BD
  │                        │                      │                   │
  │─ Ingresa 4 notas ─────→│                      │                   │
  │                        │ Calcula promedio      │                   │
  │                        │ = (n1+n2+n3+n4)/4    │                   │
  │                        │ Asigna resultado      │                   │
  │                        │ (if ≤2.9: insuficiente│                   │
  │                        │  if 3.0-3.9: aprobado)│                   │
  │                        │                      │                   │
  │─ Guardar ─────────────→│─ POST /api/estudian ──→│─ INSERT ────────→│
  │                        │     tes.php            │  estudiante      │
  │                        │  (nombre, notas,      │←── OK ────────────│
  │                        │   promedio, resultado) │                   │
  │                        │←── 201 ┼ Guardado ────│                   │
  │←────── Confirmación ───│                      │                   │
```

### Flujo 3: Consultar Programación por Docente

```
Usuario                 Frontend               Backend               BD
  │                        │                      │                   │
  │─ Accede a Consultas ──→│                      │                   │
  │                        │─ GET /api/consultas.php?
  │─ Selecciona Docente ──→│    tipo=docente&valor=1 ───→│            │
  │                        │                      │─ SELECT horario ──→│
  │                        │                      │  JOIN con docente, │
  │                        │                      │  curso, asignatura │
  │                        │                      │←── Horarios ───────│
  │                        │←── 200 + horarios ────│                   │
  │                        │                      │                   │
  │                        │ Renderiza tabla /    │                   │
  │                        │ calendario con clases│                   │
  │←────── Visualiza ──────│                      │                   │
```

---

## 2.5 DIAGRAMAS DE INTERFACES

### Panel 1: Módulo de Gestión de Notas (index.html)

```
╔════════════════════════════════════════════════════════════════╗
║           GESTIÓN DE NOTAS ACADÉMICAS                          ║
║   Sistema de registro y cálculo de promedios                   ║
║            [Abrir Programación Académica >>]                   ║
╚════════════════════════════════════════════════════════════════╝

┌─ REGISTRAR ESTUDIANTE ───────────────────────────────────────────┐
│ Nombre: [____________]                                          │
│                                                                  │
│ Nota 1: [____]  Nota 2: [____]  Nota 3: [____]  Nota 4: [____] │
│                                                                  │
│ [  Calcular Promedio  ]  [  Guardar Registro (deshabilitado) ]  │
└──────────────────────────────────────────────────────────────────┘

┌─ RESULTADOS DEL CÁLCULO (si aplica) ─────────────────────────────┐
│ Promedio:      4.5                                              │
│ Estado:        Aprobado                                         │
│ Rendimiento:   Aprobado con sobresaliente                       │
└──────────────────────────────────────────────────────────────────┘

┌─ REGISTROS ALMACENADOS ──────────────────────────────────────────┐
│ ┌──────────┬───────┬───────┬───────┬───────┬────────┬──────────┐ │
│ │ Nombre   │ N1    │ N2    │ N3    │ N4    │Promedio│Resultado│ │
│ ├──────────┼───────┼───────┼───────┼───────┼────────┼──────────┤ │
│ │ Juan P.  │ 4.0   │ 3.5   │ 4.2   │ 4.8   │ 4.125  │Aprobado  │ │
│ │           │[Edit] [Eliminar]                                 │ │
│ └──────────┴───────┴───────┴───────┴───────┴────────┴──────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Panel 2: Módulo de Programación Académica (programacion.html)

```
╔════════════════════════════════════════════════════════════════╗
║        PROGRAMACIÓN ACADÉMICA                                   ║
║   Gestión de cursos, docentes, asignaturas y horarios           ║
║            [<< Volver a Gestión de Notas]                       ║
╚════════════════════════════════════════════════════════════════╝

[ Dashboard | Cursos | Docentes | Asignaturas | Horarios | Consultas ]

┌─ DASHBOARD (Vista por defecto) ───────────────────────────────────┐
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ 5        │ │ 8        │ │ 12       │ │ 24       │             │
│  │ Cursos   │ │ Docentes │ │Asignat.  │ │ Clases   │             │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘             │
│                                                                   │
│  ┌──────────┐ ┌────────────────────────────────────────────┐     │
│  │ 120      │ │ ⚠️  2 CONFLICTOS DETECTADOS               │     │
│  │Estudiantes
│  │ ↓ Mañana: Docente X Docente Y (Lunes 7-9)            │     │
│  └──────────┘ │ ↓ Tarde: Curso A (Martes 1-3)             │     │
│               └────────────────────────────────────────────┘     │
│                                                                   │
│ Distribución por Jornada:                                        │
│ ┌────────┬────────┬──────────┬────────────┐                      │
│ │Jornada │ Cursos │ Estud.   │ Clases     │                      │
│ ├────────┼────────┼──────────┼────────────┤                      │
│ │Mañana  │   3    │   80     │    15      │                      │
│ │Tarde   │   2    │   40     │     9      │                      │
│ └────────┴────────┴──────────┴────────────┘                      │
└───────────────────────────────────────────────────────────────────┘

┌─ CURSOS (Cuando se selecciona la pestaña) ─────────────────────────┐
│ ┌─ REGISTRAR CURSO ──────────────────────────────────┐             │
│ │ Grado: [10]  Curso: [10-A]  Jornada: [Mañana ▼]    │             │
│ │ N.º de estudiantes: [32]                           │             │
│ │ [  Guardar Curso  ]  [Cancelar]                    │             │
│ └────────────────────────────────────────────────────┘             │
│                                                                    │
│ Cursos registrados:                                                │
│ ┌──────┬────────┬────────┬───────────┬──────────┐                 │
│ │Grado │ Curso  │Jornada │ Estudiantes│ Acciones│                 │
│ ├──────┼────────┼────────┼───────────┼──────────┤                 │
│ │ 10   │ 10-A   │ Mañana │    32     │ Editar  Eliminar│          │
│ │ 10   │ 10-B   │ Tarde  │    30     │ Editar  Eliminar│          │
│ └──────┴────────┴────────┴───────────┴──────────┘                 │
└───────────────────────────────────────────────────────────────────┘

┌─ HORARIOS - CALENDARIO (Vista Semana) ────────────────────────────┐
│ [◄] [  Hoy  ] [►]     SEMANA DEL 10 - 14 SEPTIEMBRE              │
│ [Mes] [Semana] [Día]                                              │
│                                                                   │
│       LUNES      MARTES      MIÉRCOLES   JUEVES      VIERNES     │
│ 07:00 ┌─────────────────────────────────────────┐               │
│       │ Matemáticas (10-A)                      │               │
│       │ Docente: María Gómez                    │               │
│ 09:00 ├─────────────────────────────────────────┤               │
│       │                 ┌─────────────┐                         │
│       │                 │ Inglés (9-A)│                         │
│       │                 │ Carlos López│                         │
│ 11:00 ├─────────────────┴─────────────┤                         │
│       │                                                          │
│ 13:00 └──────────────────────────────────────────────────────────┘
│      [Tarde]
│ 14:00 ┌──────────────────────────────────────────────────────────┐
│       │                          ┌─────────┐                     │
│       │                          │ Español │                     │
│ 16:00 │                          │ (10-A)  │                     │
│       │                          └─────────┘                     │
└───────┴──────────────────────────────────────────────────────────┘
└────────────────────────────────────────────────────────────────────┘
```

---

## 2.6 GUÍA DE COLORES Y ESTILOS

### Paleta de Colores
- **Primario:** #007bff (Azul)
- **Secundario:** #6c757d (Gris)
- **Éxito:** #28a745 (Verde)
- **Peligro:** #dc3545 (Rojo)
- **Advertencia:** #ffc107 (Amarillo)
- **Fondo:** #f5f5f5 (Gris claro)
- **Texto:** #333333 (Gris oscuro)
- **Borde:** #ddd (Gris muy claro)

### Tipografía
- **Fuente principal:** System Font Stack (Segoe UI, Roboto, etc.)
- **Tamaño base:** 14px
- **Encabezados:** 24px (h1), 20px (h2), 18px (h3)

---

## 2.7 DECISIONES DE DISEÑO

### 1. Separación Frontend-Backend
✅ **Ventaja:** Escalabilidad, independencia de componentes  
⚠️ **Desventaja:** Mayor complejidad en coordinación

### 2. API REST sin framework
✅ **Ventaja:** Libertad, control total, sin dependencias  
⚠️ **Desventaja:** Más código manual, menos validaciones automáticas

### 3. Validación en cliente Y servidor
✅ **Ventaja:** Mejor UX, seguridad  
⚠️ **Desventaja:** Duplicación de lógica

### 4. Detección de conflictos pre-guardado
✅ **Ventaja:** Prevención de datos inconsistentes  
⚠️ **Desventaja:** Mayor latencia en petición POST

### 5. Sin autenticación en Corte I
✅ **Ventaja:** Simplifica desarrollo inicial  
⚠️ **Desventaja:** No apto para producción sin control de acceso

---

**Aprobado por:** Ing. Jairo Armando Salcedo Aranda  
**Versión:** 1.0  
**Fecha:** Septiembre 2026
