# 🎓 Aplicación Web para la Programación Académica
## Gestión de Cursos, Docentes, Asignaturas, Horarios y Notas Académicas

![Universidad de San Buenaventura](docs/assets/usb-logo.png)

**Ingeniería Web - Corte I**  
**Profesor:** Ing. Jairo Armando Salcedo Aranda  
**Entrega:** 3 de septiembre de 2026  
**Versión:** 1.0.0

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Características](#características)
3. [Guía Rápida](#guía-rápida)
4. [Documentación Completa](#documentación-completa)
5. [Tecnologías](#tecnologías)
6. [Instalación](#instalación)
7. [Uso](#uso)
8. [API REST](#api-rest)
9. [Pruebas](#pruebas)
10. [Contribuciones](#contribuciones)

---

## 🎯 Descripción General

Aplicación web integral para la **gestión automatizada de programación académica** en instituciones educativas. Permite administrar cursos, docentes, asignaturas, horarios con detección automática de conflictos, y gestión de notas estudiantiles.

### Problema Abordado
- ❌ Asignación manual de horarios (propensa a errores)
- ❌ Conflictos de docentes/cursos sin detectarse
- ❌ Información dispersa y difícil de consultar
- ❌ Falta de visibilidad integral de la programación

### Solución Propuesta
- ✅ Módulos CRUD completos y automatizados
- ✅ Detección inteligente de conflictos de horarios
- ✅ Dashboard analítico con estadísticas en tiempo real
- ✅ Consultas avanzadas (por curso, docente, asignatura, jornada)
- ✅ Gestión integrada de notas académicas

---

## ⚡ Características

### 1. Gestión de Notas Académicas
- Registro de estudiantes con 4 notas (escala 0-5)
- Cálculo automático de promedio
- Clasificación automática de resultados:
  - ≤ 2.9: Rendimiento insuficiente
  - 3.0 - 3.9: Aprobado
  - 4.0 - 4.5: Aprobado con sobresaliente
  - 4.6 - 5.0: Aprobado con excelente
- CRUD completo de estudiantes

### 2. Gestión de Programación Académica
- **Cursos:** Crear, editar, eliminar cursos (grado, identificador, jornada, cantidad estudiantes)
- **Docentes:** Gestionar docentes con documento único, información básica, asignaturas y disponibilidad
- **Asignaturas:** Administrar asignaturas con intensidad horaria
- **Horarios:** Programar clases con validación inteligente

### 3. Detección de Conflictos
- ✅ Detecta si un **docente** tiene dos clases simultáneamente
- ✅ Detecta si un **curso** tiene dos asignaturas al mismo tiempo
- ✅ Permite guardar igualmente con advertencia (`force=1`)
- ✅ Lista conflictos activos en el dashboard

### 4. Dashboard Analítico
- Estadísticas principales (cursos, docentes, asignaturas, clases, estudiantes)
- Distribución por jornada
- Identificación y listado de conflictos
- Datos en tiempo real

### 5. Consultas Avanzadas
- Programación por **curso**
- Programación por **docente**
- Programación por **asignatura**
- Programación por **jornada**
- Búsqueda libre

### 6. Calendario Interactivo
- Visualización de clases programadas
- Vistas: Mes, Semana, Día
- Navegación entre períodos
- Detalles de clase (docente, asignatura, hora)

---

## 🚀 Guía Rápida

### Instalación (5 minutos)

```bash
# 1. Descargar/clonar proyecto
cd htdocs/
git clone https://github.com/usuario/calculadora.git Calculadora
cd Calculadora

# 2. Iniciar XAMPP
# Abrir XAMPP Control Panel → Start Apache & MySQL

# 3. Crear base de datos
mysql -u root < backend/schema.sql

# 4. Acceder a la aplicación
# Navegador: http://localhost/Calculadora/
```

### Primer Uso

**Módulo de Notas:**
1. Ir a `index.html`
2. Ingresar nombre del estudiante
3. Completar 4 notas (0.0 - 5.0)
4. Click "Calcular Promedio" → se calcula automáticamente
5. Click "Guardar Registro" → se persiste en BD

**Módulo de Programación:**
1. Ir a `programacion.html`
2. Ver Dashboard con estadísticas
3. Registrar Cursos, Docentes, Asignaturas
4. Programar clases (Horarios)
5. Ver calendario y consultar programación

---

## 📚 Documentación Completa

| Documento | Contenido |
|-----------|----------|
| [01_ANALISIS.md](docs/01_ANALISIS.md) | Problema, objetivos, requerimientos, historias de usuario, casos de uso |
| [02_DISENO.md](docs/02_DISENO.md) | Arquitectura SW, arquitectura infraestructura, diagramas ER, diseño de interfaces |
| [03_DOCUMENTACION_TECNICA.md](docs/03_DOCUMENTACION_TECNICA.md) | Instalación, estructura del proyecto, flujos de datos, API, validaciones, seguridad |
| [04_PLAN_PRUEBAS.md](docs/04_PLAN_PRUEBAS.md) | Estrategia de testing, 29 casos de prueba, cobertura de funcionalidad |
| [MANUAL_USUARIO.md](docs/MANUAL_USUARIO.md) | Guías paso a paso para cada módulo |

---

## 💻 Tecnologías

### Frontend
- **HTML5** - Semántica y accesibilidad
- **CSS3** - Diseño responsivo y estilos modernos
- **JavaScript (Vanilla)** - Lógica interactiva sin frameworks
- **Compatibilidad:** Chrome, Firefox, Safari, Edge (desktop & mobile)

### Backend
- **PHP 7.4+** - Lógica de negocio y procesamiento
- **PDO (PHP Data Objects)** - Acceso seguro a BD
- **API REST** - 8 endpoints para recursos principales
- **CORS enabled** - Comunicación frontend-backend

### Base de Datos
- **MySQL 5.7+ / MariaDB 10.3+**
- **6 tablas normalizadas**
- **Relaciones con integridad referencial (FK)**
- **ON DELETE CASCADE** para eliminaciones en cascada

### Infraestructura
- **XAMPP / LAMP** - Servidor local (desarrollo)
- **Apache 2.4+** - Servidor web
- **Git** - Control de versiones

---

## 📥 Instalación Detallada

### Requisitos
- XAMPP 7.4+ (Apache + MySQL + PHP) o equivalente
- Navegador web moderno
- 100 MB espacio en disco

### Pasos

#### 1. Descargar/Clonar
```bash
# Opción A: Git clone
git clone https://github.com/usuario/calculadora.git
cd calculadora

# Opción B: Descargar ZIP y extraer en htdocs/Calculadora/
```

#### 2. Iniciar XAMPP
```bash
# Windows/Mac: Abrir XAMPP Control Panel
# Linux: sudo /opt/lampp/manager-linux-x64.run
# Start Apache & MySQL
```

#### 3. Crear Base de Datos
```bash
# Opción A: Desde terminal
mysql -u root -p < backend/schema.sql

# Opción B: Desde phpMyAdmin
# 1. Ir a http://localhost/phpmyadmin
# 2. Crear BD "gestion_notas"
# 3. Importar backend/schema.sql
```

#### 4. Cargar Datos de Ejemplo (Opcional)
```bash
mysql -u root -p gestion_notas < backend/api/seed.sql
```

#### 5. Verificar
```bash
# URL: http://localhost/Calculadora/
# Debería ver: "Gestión de Notas Académicas"
```

---

## 📖 Uso

### Módulo 1: Gestión de Notas (index.html)

```
1. Abrir http://localhost/Calculadora/index.html
2. Ingresar nombre del estudiante
3. Completar 4 notas (entre 0.0 y 5.0)
4. Click "Calcular Promedio"
   ↓ Se calcula automáticamente
   ↓ Se muestra resultado cualitativo
5. Click "Guardar Registro"
   ↓ Se guarda en BD
6. Ver en tabla "Registros Almacenados"
   ↓ Botones Editar/Eliminar disponibles
```

### Módulo 2: Programación Académica (programacion.html)

#### 2.1 Dashboard
```
1. Ver estadísticas principales
2. Ver distribución por jornada
3. Ver conflictos detectados (si existen)
```

#### 2.2 Crear Cursos
```
1. Ir a pestaña "Cursos"
2. Ingresar:
   - Grado: (ej. 10, 11)
   - Curso: (ej. 10-A, 10-B)
   - Jornada: (Mañana/Tarde/Noche/Única)
   - N.º de estudiantes
3. Click "Guardar Curso"
```

#### 2.3 Crear Docentes
```
1. Ir a pestaña "Docentes"
2. Ingresar:
   - Documento (cédula, único)
   - Nombre completo
   - Email (opcional)
   - Teléfono (opcional)
   - Asignaturas que dicta (checkboxes)
   - Disponibilidad (texto)
3. Click "Guardar Docente"
```

#### 2.4 Crear Asignaturas
```
1. Ir a pestaña "Asignaturas"
2. Ingresar:
   - Nombre (ej. Matemáticas)
   - Intensidad horaria (horas/semana)
3. Click "Guardar Asignatura"
```

#### 2.5 Programar Clases (Horarios)
```
1. Ir a pestaña "Horarios"
2. Diligenciar formulario:
   - Curso
   - Asignatura
   - Docente
   - Día (Lunes a Viernes)
   - Hora inicio / Hora fin
3. Sistema valida conflictos:
   ✅ Sin conflicto → Guardar normalmente
   ⚠️  Con conflicto → Advertencia + opción Forzar
4. Ver clase en calendario (Mes/Semana/Día)
```

#### 2.6 Consultar Programación
```
1. Ir a pestaña "Consultas"
2. Seleccionar tipo de consulta:
   - Por Curso → seleccionar curso
   - Por Docente → seleccionar docente
   - Por Asignatura → seleccionar asignatura
   - Por Jornada → seleccionar jornada
3. Click "Consultar"
4. Ver resultados en tabla
```

---

## 🔌 API REST

### Base URL
```
http://localhost/Calculadora/backend/api/
```

### Endpoints Principales

#### Cursos
```bash
GET    /cursos.php              # Listar todos
GET    /cursos.php?id=1         # Obtener uno
GET    /cursos.php?q=10-A       # Buscar
POST   /cursos.php              # Crear
PUT    /cursos.php?id=1         # Actualizar
DELETE /cursos.php?id=1         # Eliminar
```

#### Docentes
```bash
GET    /docentes.php            # Listar
POST   /docentes.php            # Crear
PUT    /docentes.php?id=1       # Actualizar
DELETE /docentes.php?id=1       # Eliminar
```

#### Asignaturas
```bash
GET    /asignaturas.php         # Listar
POST   /asignaturas.php         # Crear
PUT    /asignaturas.php?id=1    # Actualizar
DELETE /asignaturas.php?id=1    # Eliminar
```

#### Horarios (con detección de conflictos)
```bash
GET    /horarios.php            # Listar
POST   /horarios.php            # Crear (detecta conflictos)
POST   /horarios.php?force=1    # Crear ignorando conflictos
PUT    /horarios.php?id=1       # Actualizar
DELETE /horarios.php?id=1       # Eliminar
```

#### Consultas Avanzadas
```bash
GET    /consultas.php?tipo=docente&valor=1
GET    /consultas.php?tipo=curso&valor=1
GET    /consultas.php?tipo=asignatura&valor=1
GET    /consultas.php?tipo=jornada&valor=Mañana
```

#### Dashboard
```bash
GET    /resumen.php             # Datos para dashboard
```

### Ejemplo de Uso (cURL)

```bash
# Crear curso
curl -X POST http://localhost/Calculadora/backend/api/cursos.php \
  -H 'Content-Type: application/json' \
  -d '{
    "grado":"10",
    "curso":"10-A",
    "jornada":"Mañana",
    "numero_estudiantes":32
  }'

# Respuesta exitosa:
# { "status":"success", "data": { "idCurso":1, ... } }
```

### Códigos HTTP
- **200** - OK (consulta exitosa)
- **201** - Created (recurso creado)
- **400** - Bad Request (datos inválidos)
- **404** - Not Found (recurso no existe)
- **409** - Conflict (conflicto de horario / terna duplicada)
- **422** - Unprocessable Entity (validación fallida)
- **500** - Server Error (error de BD)

---

## 🧪 Pruebas

### Ejecutar Pruebas Manuales
```bash
# Ver Plan de Pruebas en:
docs/04_PLAN_PRUEBAS.md

# 29 casos de prueba cubriendo:
# - Módulos CRUD
# - Cálculo de promedios
# - Detección de conflictos
# - Consultas avanzadas
# - API REST
# - Seguridad
```

### Casos Críticos a Validar
1. ✅ Guardar estudiante y recuperarlo
2. ✅ Detectar conflicto de docente
3. ✅ Detectar conflicto de curso
4. ✅ Calcular promedio correctamente
5. ✅ Dashboard muestra estadísticas correctas
6. ✅ API devuelve JSON válido

---

## 📁 Estructura del Proyecto

```
Calculadora/
├── index.html                  # Gestión de notas
├── programacion.html           # Programación académica
├── README.md                   # Este archivo
├── ESTADO_PROYECTO.md          # Estado actual
│
├── css/
│   ├── style.css              # Estilos generales
│   └── programacion.css       # Estilos programación
│
├── js/
│   ├── app.js                 # Lógica notas
│   ├── Estudiante.js          # Clase Estudiante
│   └── programacion.js        # Lógica programación
│
├── backend/
│   ├── conexion.php           # Configuración BD
│   ├── schema.sql             # Esquema BD
│   ├── guardar.php (legacy)   
│   ├── consultar.php (legacy)
│   ├── actualizar.php (legacy)
│   ├── eliminar.php (legacy)
│   │
│   └── api/
│       ├── _bootstrap.php     # Configuración común
│       ├── index.php          # Catálogo endpoints
│       ├── cursos.php
│       ├── docentes.php
│       ├── asignaturas.php
│       ├── asignaciones.php
│       ├── horarios.php
│       ├── consultas.php
│       ├── resumen.php
│       ├── estudiantes.php
│       ├── mejoras_schema.sql
│       ├── seed.sql           # Datos de ejemplo
│       └── README.md          # Documentación API
│
└── docs/
    ├── 01_ANALISIS.md         # Análisis completo
    ├── 02_DISENO.md           # Diseño y arquitectura
    ├── 03_DOCUMENTACION_TECNICA.md
    ├── 04_PLAN_PRUEBAS.md
    └── MANUAL_USUARIO.md      # Guías de usuario
```

---

## 🤝 Contribuciones

### Reporte de Bugs
1. Verificar que no esté reportado
2. Crear issue con:
   - Descripción clara
   - Pasos para reproducir
   - Resultado actual vs esperado
   - Navegador/SO

### Mejoras Sugeridas
1. Discutir en issues primero
2. Fork → rama temática
3. Commit descriptivos
4. Pull Request con descripción

### Normas de Código
- Comentarios en español
- Nombres de variables en inglés
- 4 espacios de indentación
- Validar en cliente y servidor

---

## 📋 Checklist de Entrega

- [x] Código fuente en repositorio
- [x] BD funcional con esquema correcto
- [x] Módulos CRUD completos
- [x] Detección de conflictos
- [x] Dashboard operacional
- [x] API REST completa
- [x] Análisis documentado
- [x] Diseño y arquitectura documentados
- [x] Documentación técnica
- [x] Plan de pruebas
- [ ] Pruebas ejecutadas y reportadas
- [ ] Manual de usuario
- [ ] Presentación preparada
- [ ] Demo en vivo lista

---

## 📞 Contacto

- **Profesor:** Ing. Jairo Armando Salcedo Aranda
- **Institución:** Universidad de San Buenaventura
- **Período:** Corte I, Ingeniería Web
- **Entrega:** 3 de septiembre de 2026

---

## 📄 Licencia

Este proyecto es propiedad de la Universidad de San Buenaventura y está destinado con fines educativos en el curso de Ingeniería Web.

---

## 🙏 Agradecimientos

- A la Universidad de San Buenaventura por la oportunidad de aprendizaje
- Al Ing. Jairo Armando Salcedo Aranda por la asesoría
- A nuestros compañeros y tutores

---

**Versión:** 1.0.0  
**Última actualización:** 10 de septiembre de 2026  
**Estado:** Listo para entrega final
