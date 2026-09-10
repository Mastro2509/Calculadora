# 📑 Índice de Documentación
## Aplicación Web para la Programación Académica

**Versión:** 1.0  
**Última actualización:** 10 de septiembre de 2026

---

## 📂 Estructura de Documentación

### 1️⃣ **Análisis** 
**Archivo:** [01_ANALISIS.md](01_ANALISIS.md)  
**Contenido:**
- Problema identificado
- Objetivos generales y específicos
- Requerimientos funcionales (RF-1 a RF-8)
- Requerimientos no funcionales (RNF-1 a RNF-6)
- 8 Historias de usuario
- 5 Casos de uso con flujos
- Supuestos y restricciones
- Criterios de éxito

**Para quién:** Stakeholders, gestores, equipo de desarrollo

---

### 2️⃣ **Diseño**
**Archivo:** [02_DISENO.md](02_DISENO.md)  
**Contenido:**
- Arquitectura de software (3 capas)
- Diagrama de arquitectura en ASCII
- Arquitectura de infraestructura y despliegue
- Modelo de base de datos (ER)
- Especificación de 6 tablas
- Relaciones y restricciones
- 3 Flujos de procesos principales
- Diagramas de interfaces (mockups)
- Guía de colores y estilos
- Decisiones de diseño con trade-offs

**Para quién:** Arquitectos, desarrolladores frontend/backend, diseñadores

---

### 3️⃣ **Documentación Técnica**
**Archivo:** [03_DOCUMENTACION_TECNICA.md](03_DOCUMENTACION_TECNICA.md)  
**Contenido:**
- Guía de instalación paso a paso (5 min)
- Configuración de XAMPP
- Creación de base de datos
- Estructura completa del proyecto
- Descripción de archivos clave
  - Frontend (HTML, CSS, JS)
  - Backend (PHP, API REST)
  - Base de datos (schema.sql)
- Flujos de datos con diagramas
- Códigos HTTP y respuestas API
- Validaciones en cliente y servidor
- Índices y optimizaciones SQL
- Medidas de seguridad
- Troubleshooting de problemas comunes
- Métricas de performance
- Guía de versionamiento Git

**Para quién:** Desarrolladores, DevOps, técnicos de soporte

---

### 4️⃣ **Plan de Pruebas**
**Archivo:** [04_PLAN_PRUEBAS.md](04_PLAN_PRUEBAS.md)  
**Contenido:**
- Objetivos de testing
- Estrategia de pruebas (4 niveles)
- **29 Casos de Prueba** organizados por módulo:
  - TC-001 a TC-006: Gestión de Notas (6 casos)
  - TC-007 a TC-009: Gestión de Cursos (3 casos)
  - TC-010 a TC-011: Gestión de Docentes (2 casos)
  - TC-012: Gestión de Asignaturas (1 caso)
  - TC-013 a TC-018: Gestión de Horarios (6 casos)
  - TC-019 a TC-021: Consultas Avanzadas (3 casos)
  - TC-022 a TC-024: Dashboard (3 casos)
  - TC-025 a TC-029: API REST (5 casos)
- Pruebas de integración (3 escenarios)
- Pruebas de rendimiento (3 métricas)
- Pruebas de compatibilidad (navegadores, resoluciones)
- Pruebas de seguridad (3 ataques)
- Matriz de trazabilidad
- Criterios de aceptación
- Reporte de ejecución (plantilla)

**Para quién:** QA, testers, líderes de proyecto

---

### 5️⃣ **Manual de Usuario**
**Archivo:** [MANUAL_USUARIO.md](MANUAL_USUARIO.md)  
**Contenido:**
- Introducción y navegadores soportados
- **Módulo 1: Gestión de Notas**
  - Paso a paso completo: Registrar → Calcular → Guardar → Editar → Eliminar
  - Validaciones y errores comunes
  - Escala de resultados cualitativos
- **Módulo 2: Programación Académica**
  - Dashboard (2.1): Cómo leer estadísticas
  - Gestión de Cursos (2.2): Crear, editar, eliminar
  - Gestión de Docentes (2.3): Crear, validaciones
  - Gestión de Asignaturas (2.4): Crear y mantener
  - Gestión de Horarios (2.5): Programar clases, detectar conflictos, calendario
  - Consultas Avanzadas (2.6): 3 ejemplos prácticos
- **20 Preguntas Frecuentes** (FAQ)
- **7 Soluciones de Problemas** con pasos
  1. BD no conecta
  2. Conflictos no se detectan
  3. Datos no se guardan
  4. Calendario no carga
  5. Botones deshabilitados
  6. Tabla vacía
  7. Errores al eliminar

**Para quién:** Usuarios finales, coordinadores académicos, docentes, administradores

---

### 📌 **Archivos Principales Raíz**

#### README.md
**Propósito:** Inicio rápido y referencia general  
**Contenido:**
- Descripción general del proyecto
- 6 Características principales
- Guía rápida (5 minutos)
- Links a documentación detallada
- Estructura del proyecto
- Tecnologías usadas
- Instalación básica
- Ejemplos de API
- Checklist de entrega

**Acceso:** Raíz del proyecto / Primera lectura recomendada

---

#### ESTADO_PROYECTO.md
**Propósito:** Evaluación del progreso del proyecto  
**Contenido:**
- Tabla de avance por entrega (%)
- Lo que tenemos (✅)
- Lo que falta (❌)
- Plan de acción por fase (5 fases)
- Tecnologías implementadas
- Notas importantes
- Checklist para entrega final

**Acceso:** Raíz del proyecto / Seguimiento de progreso

---

## 🎯 Guía de Lectura Según Rol

### 👨‍💼 Gestores / Coordinadores Académicos
**Lee primero:**
1. README.md (visión general)
2. MANUAL_USUARIO.md (cómo usar)
3. ESTADO_PROYECTO.md (progreso)

**Conoce:**
- Qué hace la aplicación
- Cómo usarla día a día
- Cuál es el avance

---

### 👨‍💻 Desarrolladores Backend
**Lee primero:**
1. README.md (contexto)
2. 01_ANALISIS.md (requerimientos)
3. 02_DISENO.md (arquitectura SW)
4. 03_DOCUMENTACION_TECNICA.md (instalación, API, flujos)
5. 04_PLAN_PRUEBAS.md (validar trabajo)

**Profundiza en:**
- `backend/api/*.php` - Endpoints REST
- `backend/schema.sql` - Modelo de datos
- Validaciones servidor
- Detección de conflictos

---

### 👨‍🎨 Desarrolladores Frontend
**Lee primero:**
1. README.md (contexto)
2. 02_DISENO.md (diagramas de interfaces)
3. MANUAL_USUARIO.md (flujos de usuario)
4. 03_DOCUMENTACION_TECNICA.md (guía de instalación, validaciones cliente)
5. 04_PLAN_PRUEBAS.md (casos en UI)

**Profundiza en:**
- `js/*.js` - Lógica de cliente
- `css/*.css` - Estilos y responsive
- Validaciones cliente
- Renderizado dinámico

---

### 🧪 QA / Testers
**Lee primero:**
1. MANUAL_USUARIO.md (casos de uso)
2. 04_PLAN_PRUEBAS.md (29 casos de prueba)
3. 03_DOCUMENTACION_TECNICA.md (troubleshooting)

**Ejecuta:**
- 29 casos de prueba
- Pruebas de regresión
- Pruebas de navegadores
- Reporte de defectos

---

### 🏗️ Arquitectos / Líderes Técnicos
**Lee primero:**
1. README.md (visión)
2. 01_ANALISIS.md (requerimientos)
3. 02_DISENO.md (arquitectura SW + infraestructura)
4. 03_DOCUMENTACION_TECNICA.md (decisiones técnicas)

**Valida:**
- Cumplimiento de requerimientos
- Calidad de arquitectura
- Riesgos técnicos
- Escalabilidad

---

### 📚 Estudiantes / Aprendices
**Lee primero:**
1. README.md (introducción)
2. 01_ANALISIS.md (contexto del problema)
3. 02_DISENO.md (decisiones de diseño)
4. 03_DOCUMENTACION_TECNICA.md (aprender instalación)
5. Código comentado en repositorio

**Experimenta:**
- Instala la aplicación
- Crea casos de prueba
- Modifica código
- Aprende git

---

## 📊 Matriz de Cobertura Documental

| Aspecto | Análisis | Diseño | Técnico | Pruebas | Manual |
|---------|----------|--------|---------|---------|--------|
| Requerimientos | ✅✅✅ | ✅ | ✅ | ✅ | - |
| Arquitectura | ✅ | ✅✅✅ | ✅ | - | - |
| Base de datos | ✅ | ✅✅✅ | ✅ | ✅ | - |
| API REST | ✅ | ✅ | ✅✅✅ | ✅ | - |
| Frontend | ✅ | ✅✅ | ✅✅ | ✅ | ✅✅✅ |
| Instalación | - | - | ✅✅✅ | - | ✅ |
| Validaciones | ✅ | ✅ | ✅✅✅ | ✅ | ✅ |
| Seguridad | ✅ | ✅ | ✅✅ | ✅ | ✅ |
| Performance | ✅ | - | ✅ | ✅ | - |
| Troubleshooting | - | - | ✅✅✅ | - | ✅✅ |

---

## 🔍 Buscar por Tema

### ¿Cómo instalo la aplicación?
→ **03_DOCUMENTACION_TECNICA.md** > Sección 3.1

### ¿Cuál es la estructura de BD?
→ **02_DISENO.md** > Sección 2.3  
→ **03_DOCUMENTACION_TECNICA.md** > Sección 3.3

### ¿Cómo uso el módulo de Notas?
→ **MANUAL_USUARIO.md** > Módulo 1

### ¿Cómo programo clases?
→ **MANUAL_USUARIO.md** > Módulo 2.5

### ¿Cuáles son los endpoints de API?
→ **03_DOCUMENTACION_TECNICA.md** > Sección 3.5  
→ **backend/api/README.md** (documentación completa)

### ¿Qué pruebas ejecuto?
→ **04_PLAN_PRUEBAS.md** > Sección 4.3 (29 casos)

### ¿Cuál es el estado del proyecto?
→ **ESTADO_PROYECTO.md** (avance por entrega)

### ¿Hay algún problema?
→ **03_DOCUMENTACION_TECNICA.md** > Sección 3.9  
→ **MANUAL_USUARIO.md** > Solución de Problemas

---

## 📅 Cronograma de Lecturas

### Semana 1: Fundamentos
- [ ] README.md (30 min)
- [ ] 01_ANALISIS.md (1 hora)
- [ ] MANUAL_USUARIO.md (1 hora)

### Semana 2: Técnico
- [ ] 02_DISENO.md (1.5 horas)
- [ ] 03_DOCUMENTACION_TECNICA.md (1 hora)
- [ ] backend/api/README.md (30 min)

### Semana 3: Validación
- [ ] 04_PLAN_PRUEBAS.md (1 hora)
- [ ] Ejecutar casos de prueba (2-3 horas)
- [ ] Reporte de resultados (30 min)

### Semana 4: Presentación
- [ ] Preparar demo (1 hora)
- [ ] Slides de presentación (1 hora)
- [ ] Práctica presentación (1 hora)

---

## 📞 Dudas Frecuentes sobre Documentación

**P: ¿Cuál es el documento más importante?**  
R: **01_ANALISIS.md** - Contiene requerimientos y justificación

**P: ¿Por dónde empiezo?**  
R: **README.md** - Introducción rápida

**P: ¿Cómo instalo?**  
R: **03_DOCUMENTACION_TECNICA.md** Sección 3.1

**P: ¿Qué pruebo?**  
R: **04_PLAN_PRUEBAS.md** - 29 casos de prueba

**P: ¿Cómo lo uso?**  
R: **MANUAL_USUARIO.md** - Guías paso a paso

**P: ¿Cuál es el progreso?**  
R: **ESTADO_PROYECTO.md** - Checklist de entrega

---

## 📦 Entregables Documentales

Para la **entrega final** se requiere:

- ✅ README.md (raíz)
- ✅ 01_ANALISIS.md
- ✅ 02_DISENO.md
- ✅ 03_DOCUMENTACION_TECNICA.md
- ✅ 04_PLAN_PRUEBAS.md
- ✅ MANUAL_USUARIO.md
- ✅ INDICE.md (este archivo)
- ✅ ESTADO_PROYECTO.md
- ✅ backend/api/README.md
- ✅ Código en GitHub/GitLab con commits significativos
- ✅ Base de datos (schema.sql + seed.sql)
- ✅ Presentación powerpoint/pdf

---

**Versión:** 1.0  
**Completado:** 10 de septiembre de 2026  
**Listo para:** Entrega final - Corte I  
**Profesor:** Ing. Jairo Armando Salcedo Aranda
