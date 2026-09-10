# 3. DOCUMENTACIÓN TÉCNICA
## Aplicación Web para la Programación Académica

**Versión:** 1.0  
**Fecha:** Septiembre 2026  
**Autor:** Grupo de Ingeniería Web

---

## 3.1 GUÍA DE INSTALACIÓN Y CONFIGURACIÓN

### Requisitos Previos
- XAMPP 7.4+ (Apache + MySQL + PHP) o LAMP equivalente
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Git (para control de versiones)
- 100 MB de espacio en disco

### Pasos de Instalación

#### 1. Descargar/Clonar el Proyecto
```bash
# Opción A: Clonar desde GitHub
git clone https://github.com/usuario/calculadora.git
cd calculadora

# Opción B: Descargar ZIP
# Extraer en htdocs/Calculadora/
```

#### 2. Configurar XAMPP
```bash
# 1. Abrir XAMPP Control Panel
# 2. Iniciar Apache
# 3. Iniciar MySQL
# 4. Abrir phpMyAdmin: http://localhost/phpmyadmin
```

#### 3. Crear Base de Datos
```sql
-- En phpMyAdmin o desde terminal:
mysql -u root -p < backend/schema.sql

-- O manualmente:
CREATE DATABASE gestion_notas;
USE gestion_notas;
SOURCE backend/schema.sql;
```

#### 4. Cargar Datos de Ejemplo (Opcional)
```sql
SOURCE backend/api/seed.sql;
```

#### 5. Verificar Instalación
```bash
# Navegador: http://localhost/Calculadora/
# Debería ver la pantalla de Gestión de Notas

# Probar API:
curl http://localhost/Calculadora/backend/api/index.php
# Debería devolver JSON con catálogo de endpoints
```

### Configuración de Conexión (backend/conexion.php)
```php
$host = 'localhost';      // Servidor MySQL
$dbname = 'gestion_notas';  // Nombre BD
$username = 'root';        // Usuario (cambiar en producción)
$password = '';            // Contraseña (cambiar en producción)
```

---

## 3.2 ESTRUCTURA DEL PROYECTO

```
Calculadora/
├── index.html                 # Módulo gestión de notas
├── programacion.html          # Módulo programación académica
│
├── css/
│   ├── style.css              # Estilos generales
│   └── programacion.css       # Estilos programación
│
├── js/
│   ├── app.js                 # Lógica gestión de notas
│   ├── Estudiante.js          # Clase Estudiante
│   └── programacion.js        # Lógica programación académica
│
├── backend/
│   ├── conexion.php           # Configuración BD
│   ├── schema.sql             # Esquema BD
│   ├── guardar.php            # Guardar estudiante (legacy)
│   ├── consultar.php          # Consultar estudiantes (legacy)
│   ├── actualizar.php         # Actualizar estudiante (legacy)
│   ├── eliminar.php           # Eliminar estudiante (legacy)
│   │
│   └── api/                   # API REST
│       ├── _bootstrap.php     # Configuración común
│       ├── index.php          # Catálogo endpoints
│       ├── cursos.php         # CRUD cursos
│       ├── docentes.php       # CRUD docentes
│       ├── asignaturas.php    # CRUD asignaturas
│       ├── asignaciones.php   # Gestión asignaciones
│       ├── horarios.php       # Gestión horarios
│       ├── consultas.php      # Búsquedas avanzadas
│       ├── resumen.php        # Dashboard data
│       ├── estudiantes.php    # CRUD estudiantes (REST)
│       ├── mejoras_schema.sql # Índices opcionales
│       ├── seed.sql           # Datos de ejemplo
│       └── README.md          # Documentación API
│
└── docs/
    ├── 01_ANALISIS.md         # Análisis del proyecto
    ├── 02_DISENO.md           # Diseño y arquitectura
    ├── 03_DOCUMENTACION_TECNICA.md  # Este archivo
    └── 04_PLAN_PRUEBAS.md     # Plan de testing
```

---

## 3.3 DESCRIPCIÓN DE ARCHIVOS CLAVE

### Frontend

#### index.html
- **Propósito:** Interfaz de gestión de notas académicas
- **Módulos:**
  - Formulario de registro de estudiante
  - Entrada de 4 notas (0.0 - 5.0)
  - Botón calcular promedio
  - Botón guardar en BD
  - Tabla de estudiantes registrados
- **Imports:** style.css, Estudiante.js, app.js

#### programacion.html
- **Propósito:** Interfaz de programación académica
- **Módulos:** 6 módulos accesibles por pestañas
  1. **Dashboard:** Estadísticas y conflictos
  2. **Cursos:** CRUD de cursos
  3. **Docentes:** CRUD de docentes
  4. **Asignaturas:** CRUD de asignaturas
  5. **Horarios:** Programación de clases, calendario
  6. **Consultas:** Búsqueda y filtrado
- **Imports:** style.css, programacion.css, programacion.js

#### style.css
- **Contenido:**
  - Reset de estilos
  - Grid layout general
  - Componentes reutilizables (btn, card, table, form)
  - Responsive breakpoints
  - Dark mode (opcional)

#### programacion.css
- **Contenido:**
  - Estilos específicos del módulo de programación
  - Estilos del calendario
  - Grid de estadísticas
  - Pestañas de navegación
  - Tabla de horarios

#### app.js
- **Responsabilidades:**
  - Captura eventos del formulario
  - Cálculo de promedio
  - Comunicación con backend (`guardar.php`)
  - Carga y visualización de estudiantes
  - Validación en cliente
- **Funciones principales:**
  - `calcularPromedio()`
  - `guardarEstudiante()`
  - `cargarEstudiantes()`
  - `eliminarEstudiante()`

#### Estudiante.js
- **Propósito:** Clase modelo para Estudiante
- **Atributos:**
  - nombre
  - nota1, nota2, nota3, nota4
  - promedio
  - resultadoCualitativo
- **Métodos:**
  - `calcularPromedio()`
  - `calcularCualitativo()`
  - `toJSON()`

#### programacion.js
- **Responsabilidades:**
  - Gestión de pestañas de módulos
  - Llamadas a API REST (`backend/api/*.php`)
  - Renderizado dinámico de tablas
  - Gestión del calendario
  - Detección de conflictos en cliente
  - Carga inicial del dashboard
- **Funciones principales:**
  - Gestión CRUD para cada recurso
  - Carga de datos dinámicamente
  - Validación de conflictos
  - Cambio de vistas (Mes/Semana/Día)

### Backend

#### backend/conexion.php
```php
// Conexión PDO a MySQL
$pdo = new PDO(
    "mysql:host=$host;dbname=$dbname;charset=utf8",
    $username,
    $password
);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
```
- **Propósito:** Configuración centralizada de BD
- **Reutilizada por:** Todos los archivos backend

#### backend/schema.sql
- **Tablas creadas:**
  - `estudiante`
  - `curso`
  - `docente`
  - `asignatura`
  - `asignacion_academica`
  - `horario`
- **Características:**
  - Tipos de datos apropiados
  - Claves primarias
  - Claves foráneas
  - ON DELETE CASCADE
  - ENUM para jornadas, tipo de contrato
  - SET para días de trabajo

#### backend/api/_bootstrap.php
```php
// Configuración común para todos los endpoints
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');  // CORS
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
require '../conexion.php';

// Helpers
function success($data, $message = 'OK', $status = 200) { ... }
function error($message, $details = [], $status = 400) { ... }
function validar_fecha($fecha) { ... }
function normalizar_jornada($jornada) { ... }
```

#### backend/api/cursos.php
- **Métodos:**
  - `GET` - Listar cursos
  - `GET ?id=N` - Obtener curso específico
  - `GET ?q=texto` - Búsqueda
  - `GET ?jornada=Mañana` - Filtros
  - `POST` - Crear curso
  - `PUT ?id=N` - Actualizar
  - `DELETE ?id=N` - Eliminar

#### backend/api/horarios.php
- **Métodos:** GET, POST, PUT, DELETE
- **Funcionalidad especial:**
  - Detecta conflictos antes de guardar
  - Devuelve 409 si hay conflicto
  - Permite forzar con `?force=1`
  - Crea asignación automáticamente si no existe

#### backend/api/consultas.php
- **Propósito:** Búsquedas avanzadas de la programación
- **Filtros:** curso, docente, asignatura, jornada, texto
- **Respuesta:** Lista de horarios enriquecida con nombres

#### backend/api/resumen.php
- **Propósito:** Datos agregados para el dashboard
- **Retorna:**
  - Totales (cursos, docentes, asignaturas, horarios, estudiantes)
  - Distribución por jornada
  - Lista de conflictos detectados

---

## 3.4 FLUJOS DE DATOS

### Flujo 1: Guardar Estudiante
```
1. Usuario llena formulario en index.html
2. Click en "Calcular Promedio" → app.js
3. Valida notas → crea objeto Estudiante
4. Click en "Guardar Registro" → POST /backend/guardar.php
5. Backend valida y ejecuta INSERT
6. Devuelve JSON { status: "success" }
7. Frontend recarga tabla de estudiantes
8. GET /backend/consultar.php
9. Backend devuelve JSON con todos los estudiantes
10. Frontend renderiza tabla dinámicamente
```

### Flujo 2: Programar Clase (con detección de conflictos)
```
1. Usuario selecciona Curso, Docente, Asignatura, Día, Hora
2. Click en "Programar Clase" → programacion.js
3. Valida campos en cliente
4. POST /backend/api/horarios.php { idCurso, idDocente, ... }
5. Backend valida integridad referencial
6. Backend consulta SELECT FROM horario WHERE
   (docente y día/hora solapan) OR (curso y día/hora solapan)
7. Si hay conflicto:
   - Retorna 409 { conflictos: [...] }
   - Frontend muestra alerta con detalles
   - Usuario elige: cancelar o forzar (force=1)
8. Si no hay conflicto (o force=1):
   - INSERT en horario
   - Retorna 201 { idHorario: ... }
   - Frontend recarga calendario
9. GET /backend/api/horarios.php → cargar clases
10. Frontend renderiza calendario con nueva clase
```

### Flujo 3: Consultar Programación
```
1. Usuario accede a módulo "Consultas"
2. Selecciona tipo (Curso/Docente/Asignatura/Jornada)
3. Frontend GET /backend/api/consultas.php?tipo=X&valor=Y
4. Backend ejecuta SQL con JOINs para enriquecer datos
5. Devuelve JSON { resultados: [...] }
6. Frontend renderiza tabla con clases
```

---

## 3.5 CÓDIGOS HTTP Y RESPUESTAS

### Códigos de Éxito
| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | OK | Consulta completada |
| 201 | Created | Recurso creado |

### Códigos de Error
| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 400 | Bad Request | Datos inválidos |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Conflicto de horario / terna duplicada |
| 422 | Unprocessable Entity | Validación fallida / FK no existe |
| 500 | Server Error | Error de base de datos |

### Formato de Respuesta
```json
// Éxito
{
  "status": "success",
  "data": { /* contenido */ }
}

// Error
{
  "status": "error",
  "mensaje": "Descripción del error",
  "campos": ["campo1", "campo2"],  // Opcional
  "conflictos": [...]  // Opcional para conflictos
}
```

---

## 3.6 VALIDACIONES

### En el Cliente (JavaScript)
```javascript
// Validar que nota esté entre 0 y 5
if (nota < 0 || nota > 5) {
    alert("Nota debe estar entre 0 y 5");
    return false;
}

// Validar que hora_fin > hora_inicio
if (hora_fin <= hora_inicio) {
    alert("La hora fin debe ser posterior a la hora inicio");
    return false;
}
```

### En el Servidor (PHP)
```php
// Validar tipo de dato
if (!is_numeric($nota) || $nota < 0 || $nota > 5) {
    error("Nota inválida", 422);
}

// Validar FK existe
$stmt = $pdo->prepare("SELECT 1 FROM docente WHERE idDocente = ?");
$stmt->execute([$idDocente]);
if (!$stmt->fetch()) {
    error("Docente no existe", 422);
}

// Validar ENUM
if (!in_array($jornada, ['Mañana', 'Tarde', 'Mixta'])) {
    error("Jornada inválida", 422);
}
```

---

## 3.7 ÍNDICES Y OPTIMIZACIONES

### Índices Definidos
```sql
-- En tabla HORARIO (mejoras_schema.sql)
INDEX idx_asignacion_dia (idAsignacion, dia_semana);
-- Para búsquedas rápidas de conflictos

-- En tabla DOCENTE
UNIQUE KEY uk_documento (documento);
-- Asegurar documentos únicos

-- En tabla ASIGNACION_ACADEMICA
UNIQUE KEY uk_terna (idDocente, idCurso, idAsignatura);
-- Evitar asignaciones duplicadas
```

### Optimizaciones SQL
```sql
-- Usar LIMIT para paginación
SELECT * FROM horario LIMIT 10 OFFSET 20;

-- Usar prepared statements
$stmt = $pdo->prepare("SELECT * FROM curso WHERE jornada = ?");
$stmt->execute([$jornada]);
```

---

## 3.8 SEGURIDAD

### Protecciones Implementadas

#### 1. Inyección SQL
✅ **Mitigado:** Uso de `prepared statements` con PDO
```php
$stmt = $pdo->prepare("SELECT * FROM usuario WHERE email = ?");
$stmt->execute([$email]);
```

#### 2. XSS (Cross-Site Scripting)
⚠️ **Parcialmente:** Escapar en frontend, usar `textContent` en lugar de `innerHTML`
```javascript
// ✅ Seguro
element.textContent = datos.nombre;

// ❌ Inseguro
element.innerHTML = datos.nombre;
```

#### 3. CSRF (Cross-Site Request Forgery)
⚠️ **No implementado en Corte I** (se recomienda en producción)

#### 4. Validación de Entrada
✅ **En cliente y servidor:** Validar tipos, rangos, formatos

#### 5. Headers CORS
✅ **Permitir:** `Access-Control-Allow-Origin: *` (en desarrollo)
⚠️ **Producción:** Restringir a dominio específico

### Recomendaciones para Producción
1. Cambiar credenciales de BD (usuario/password)
2. Usar HTTPS
3. Implementar autenticación (login)
4. Implementar autorización (roles)
5. Agregar CSRF tokens
6. Rate limiting en API
7. Encriptar contraseñas (bcrypt)
8. Auditoría de cambios

---

## 3.9 TROUBLESHOOTING

### Problema: "Error de conexión: No database selected"
```
Causa: schema.sql no ejecutado
Solución: Ejecutar schema.sql en phpMyAdmin o terminal
mysql -u root < backend/schema.sql
```

### Problema: "404 Not Found" en API
```
Causa: Ruta incorrecta o archivo no existe
Solución: Verificar que archivo exista en backend/api/
Ejemplo correcto: http://localhost/Calculadora/backend/api/cursos.php
```

### Problema: "CORS error" en navegador
```
Causa: Headers CORS no configurados correctamente
Solución: Verificar que _bootstrap.php tiene:
header('Access-Control-Allow-Origin: *');
```

### Problema: Conflictos no se detectan
```
Causa: Lógica de consulta defectuosa
Solución: Verificar SQL en horarios.php
SELECT ... WHERE dia_semana = ? AND (
    (hora_inicio < ? AND hora_fin > ?) OR  // solapamiento
    (hora_inicio < ? AND hora_fin = ?) OR
    ...
)
```

### Problema: Notas no se guardan
```
Causa: Datos no válidos o BD desconectada
Solución: 
1. Verificar BD está ejecutándose (phpMyAdmin)
2. Verificar conexión.php tiene credenciales correctas
3. Ver error en consola del navegador (F12 > Console)
4. Ver error en PHP (logs o phpMyAdmin)
```

---

## 3.10 PERFORMANCE

### Tiempos Objetivo
- **Cargar página:** < 1 segundo
- **Listar 1000 registros:** < 2 segundos
- **Detectar conflictos:** < 500 ms
- **Calcular promedio:** < 100 ms

### Métricas Actuales
*Pendiente de medir en ambiente de prueba*

### Mejoras Futuras
1. Cache de consultas frecuentes (Redis)
2. Paginación automática en tablas
3. Lazy loading de imágenes
4. Minificación CSS/JS
5. Compresión GZIP
6. CDN para assets

---

## 3.11 VERSIONAMIENTO

### Rama: main
- Código productivo
- Tagged releases

### Rama: develop
- Código en desarrollo
- Integración continua

### Convención de Commits
```
[TIPO] Descripción breve

[tipo]: feat | fix | docs | style | refactor | test | chore
ejemplo:
[feat] Agregar detección de conflictos de horarios
[fix] Corregir cálculo de promedio
[docs] Documentar API REST
```

---

## 3.12 CONTACTO Y SOPORTE

- **Profesor:** Ing. Jairo Armando Salcedo Aranda
- **Institución:** Universidad de San Buenaventura
- **Correo:** (contacto del profesor)
- **Horario de atención:** (definir según profesor)

---

**Versión:** 1.0  
**Última actualización:** Septiembre 2026
