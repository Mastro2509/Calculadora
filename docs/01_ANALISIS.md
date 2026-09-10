# 1. ANÁLISIS DEL PROYECTO
## Aplicación Web para la Programación Académica

**Universidad:** Universidad de San Buenaventura  
**Curso:** Ingeniería Web  
**Profesor:** Ing. Jairo Armando Salcedo Aranda  
**Período:** Corte I  
**Fecha:** Septiembre 2026

---

## 1.1 PROBLEMA

Las instituciones educativas enfrentan desafíos significativos en la gestión manual de su programación académica:

- **Falta de automatización:** La asignación de docentes, cursos y horarios se realiza manualmente, propenso a errores
- **Conflictos de horarios:** Docentes y cursos pueden ser asignados simultáneamente sin detectarse
- **Información dispersa:** Datos en múltiples sistemas o documentos, difícil de consultar y actualizar
- **Ineficiencia administrativa:** Tiempo excesivo dedicado a tareas operativas (CRUD) en lugar de análisis
- **Falta de visibilidad:** Gestores académicos no tienen dashboard o visión integral de la programación
- **Escalabilidad:** Sistemas manuales no escalan con el crecimiento de la institución

### Impacto
- Estudiantes sin claridad de horarios
- Docentes con conflictos de asignación
- Gestión académica ineficiente
- Errores administrativos costosos

---

## 1.2 OBJETIVOS

### Objetivo General
Desarrollar una **aplicación web integrada** que automatice la gestión de la programación académica, permitiendo a la institución educativa asignar docentes, cursos, asignaturas, horarios y detectar conflictos de forma eficiente.

### Objetivos Específicos

1. **Implementar módulos CRUD** para gestionar:
   - Cursos (grado, identificador, jornada, cantidad de estudiantes)
   - Docentes (información básica, asignaturas que pueden dictar, disponibilidad)
   - Asignaturas (nombre, intensidad horaria)
   - Horarios (asignación de clase a día y franja horaria)
   - Estudiantes (gestión de notas académicas)

2. **Detectar automáticamente conflictos de horarios**:
   - Evitar que un docente sea asignado a dos clases simultáneamente
   - Evitar que un curso sea asignado a dos asignaturas simultáneamente
   - Permitir visualización de conflictos en el dashboard

3. **Proporcionar consultas avanzadas**:
   - Filtrar programación por curso, docente, asignatura o jornada
   - Búsqueda libre de información
   - Exportación de datos

4. **Crear un dashboard analítico**:
   - Estadísticas generales (total de cursos, docentes, asignaturas, clases)
   - Distribución por jornada
   - Identificación de conflictos activos
   - Información en tiempo real

5. **Integrar tecnologías modernas**:
   - Frontend responsivo con HTML5, CSS3 y JavaScript
   - Backend robusto con PHP y API REST
   - Base de datos relacional (MySQL/MariaDB)
   - Control de versiones con Git

---

## 1.3 REQUERIMIENTOS

### 1.3.1 Requerimientos Funcionales (RF)

#### RF-1: Gestión de Cursos
- RF-1.1: Crear curso con grado, identificador, jornada y cantidad de estudiantes
- RF-1.2: Leer/consultar todos los cursos o uno específico
- RF-1.3: Actualizar datos de un curso
- RF-1.4: Eliminar un curso (con cascada de asignaciones y horarios)
- RF-1.5: Filtrar cursos por grado, jornada o búsqueda libre

#### RF-2: Gestión de Docentes
- RF-2.1: Crear docente con documento, nombres, apellidos, tipo de contrato, jornada y días de trabajo
- RF-2.2: Asignar asignaturas que el docente puede dictar
- RF-2.3: Especificar disponibilidad del docente
- RF-2.4: Leer/consultar todos los docentes o uno específico
- RF-2.5: Actualizar datos del docente
- RF-2.6: Eliminar docente (con cascada)
- RF-2.7: Filtrar por jornada, tipo de contrato o búsqueda libre

#### RF-3: Gestión de Asignaturas
- RF-3.1: Crear asignatura con nombre e intensidad horaria
- RF-3.2: Leer/consultar todas las asignaturas o una específica
- RF-3.3: Actualizar nombre e intensidad de una asignatura
- RF-3.4: Eliminar asignatura (con cascada)
- RF-3.5: Filtrar asignaturas por nombre

#### RF-4: Gestión de Horarios
- RF-4.1: Asignar una clase (docente + curso + asignatura) a un día y franja horaria
- RF-4.2: Detectar conflictos de horario antes de guardar
- RF-4.3: Permitir guardar con conflicto si es necesario (flag `force=1`)
- RF-4.4: Visualizar horarios en calendario (vista mes, semana, día)
- RF-4.5: Consultar clases programadas por docente, curso, asignatura o día
- RF-4.6: Actualizar/reprogramar una clase
- RF-4.7: Eliminar una clase programada
- RF-4.8: Mostrar lista de clases programadas en tabla

#### RF-5: Gestión de Estudiantes y Notas
- RF-5.1: Registrar estudiante con nombre y 4 notas
- RF-5.2: Calcular promedio automáticamente (promedio de las 4 notas)
- RF-5.3: Generar resultado cualitativo basado en promedio:
  - ≤ 2.9: "Rendimiento insuficiente"
  - 3.0 – 3.9: "Aprobado"
  - 4.0 – 4.5: "Aprobado con sobresaliente"
  - 4.6 – 5.0: "Aprobado con excelente"
- RF-5.4: Actualizar notas de un estudiante
- RF-5.5: Eliminar estudiante
- RF-5.6: Consultar estudiantes (listar o filtrar)

#### RF-6: Consultas Avanzadas
- RF-6.1: Consultar programación por curso
- RF-6.2: Consultar programación por docente
- RF-6.3: Consultar programación por asignatura
- RF-6.4: Consultar programación por jornada
- RF-6.5: Búsqueda libre en cualquier módulo

#### RF-7: Dashboard
- RF-7.1: Mostrar total de cursos, docentes, asignaturas, clases programadas
- RF-7.2: Mostrar total de estudiantes registrados
- RF-7.3: Mostrar cantidad de conflictos detectados
- RF-7.4: Distribuir información por jornada
- RF-7.5: Listar conflictos activos con detalles

#### RF-8: API REST
- RF-8.1: Endpoints CRUD para todos los recursos
- RF-8.2: Filtros y búsqueda en GET
- RF-8.3: Validación de integridad referencial
- RF-8.4: Manejo de errores con códigos HTTP apropiados
- RF-8.5: Respuestas en formato JSON

### 1.3.2 Requerimientos No Funcionales (RNF)

#### RNF-1: Rendimiento
- RNF-1.1: Tiempo de respuesta < 2 segundos para consultas de hasta 1000 registros
- RNF-1.2: Dashboard debe cargar en < 1 segundo
- RNF-1.3: Detectar conflictos en < 500 ms

#### RNF-2: Usabilidad
- RNF-2.1: Interfaz intuitiva y responsive (mobile, tablet, desktop)
- RNF-2.2: Navegación clara entre módulos
- RNF-2.3: Mensajes de error y confirmación en lenguaje comprensible
- RNF-2.4: Soporte para idioma español

#### RNF-3: Seguridad
- RNF-3.1: Validación de entrada en cliente y servidor
- RNF-3.2: Protección contra inyección SQL (usar prepared statements)
- RNF-3.3: HTTPS recomendado en producción
- RNF-3.4: Gestión básica de sesiones

#### RNF-4: Confiabilidad
- RNF-4.1: Manejo de transacciones para operaciones críticas
- RNF-4.2: Integridad referencial mediante FK (Foreign Keys)
- RNF-4.3: Backups regulares de la BD

#### RNF-5: Mantenibilidad
- RNF-5.1: Código bien estructurado y comentado
- RNF-5.2: Documentación técnica completa
- RNF-5.3: Control de versiones con Git

#### RNF-6: Escalabilidad
- RNF-6.1: Arquitectura modular (Frontend, Backend, BD separados)
- RNF-6.1: API REST sin estado (stateless)

---

## 1.4 HISTORIAS DE USUARIO

### Historia 1: Registrar Curso
```
Como: Coordinador académico
Quiero: Crear un nuevo curso especificando grado, identificador, jornada y cantidad de estudiantes
Para: Organizar la estructura de cursos de la institución
Criterios de aceptación:
- El sistema valida que no exista un curso duplicado
- Se muestra confirmación al crear exitosamente
- El curso aparece en la lista de cursos
```

### Historia 2: Asignar Docente a Clase
```
Como: Gestor académico
Quiero: Asignar un docente a una clase (curso + asignatura) en un día y hora específica
Para: Programar la enseñanza de la institución
Criterios de aceptación:
- El sistema detecta si hay conflicto de horario
- Se advierte al usuario antes de guardar
- Se puede guardar a pesar del conflicto si es necesario (flag)
- La clase aparece en el calendario
```

### Historia 3: Consultar Horario de Docente
```
Como: Docente
Quiero: Consultar mis clases programadas por día, semana o mes
Para: Planificar mi trabajo académico
Criterios de aceptación:
- Veo mis clases en vista de calendario
- Puedo filtrar por semana o mes
- Veo cursos, asignaturas y horas de cada clase
```

### Historia 4: Ver Dashboard
```
Como: Director académico
Quiero: Ver un resumen ejecutivo con estadísticas de programación
Para: Monitorear el estado general de la institución
Criterios de aceptación:
- Veo totales de cursos, docentes, asignaturas, clases
- Veo distribución por jornada
- Veo conflictos detectados
- Los datos se actualizan automáticamente
```

### Historia 5: Registrar Notas de Estudiante
```
Como: Docente
Quiero: Registrar las 4 notas de un estudiante
Para: Llevar seguimiento académico
Criterios de aceptación:
- El sistema calcula automáticamente el promedio
- El promedio se clasifica en rendimiento
- Puedo ver el historial de notas
```

### Historia 6: Buscar Información
```
Como: Usuario (cualquier rol)
Quiero: Buscar información sobre cursos, docentes o asignaturas
Para: Encontrar rápidamente lo que necesito
Criterios de aceptación:
- La búsqueda es libre (por cualquier campo)
- Los resultados aparecen en tiempo real
- Puedo filtrar los resultados
```

### Historia 7: Detectar Conflictos
```
Como: Gestor académico
Quiero: El sistema detecte automáticamente conflictos de horario
Para: Evitar asignaciones inválidas
Criterios de aceptación:
- El sistema advierte si un docente o curso tiene clase simultánea
- Se muestra la hora, docente/curso y asignatura en conflicto
- Puedo forzar la asignación si es necesario
```

### Historia 8: Generar Reporte de Programación
```
Como: Coordinador académico
Quiero: Consultar la programación académica por curso, docente, asignatura o jornada
Para: Validar que la programación es correcta
Criterios de aceptación:
- Puedo filtrar por cualquier criterio
- Veo todos los detalles (docente, asignatura, hora, etc.)
- Puedo exportar los resultados
```

---

## 1.5 CASOS DE USO

### Caso de Uso 1: Crear Programación de un Curso

**Actor Primario:** Gestor Académico  
**Precondiciones:** Curso, docentes y asignaturas ya registrados  
**Flujo Principal:**

1. Gestor accede a módulo de Horarios
2. Selecciona un curso
3. Para cada asignatura del curso:
   - Selecciona docente disponible
   - Selecciona asignatura
   - Define día y hora
4. Sistema valida conflictos
5. Si hay conflicto, sistema advierte
6. Gestor confirma o modifica
7. Sistema guarda horario

**Flujo Alternativo (Conflicto):**
- En paso 4, si hay conflicto, gestor elige:
  - Cancelar y reprogramar
  - Forzar guardado con conflicto

**Postcondiciones:** Horario guardado en BD, visible en calendario

---

### Caso de Uso 2: Consultar Horario de Docente

**Actor Primario:** Docente  
**Precondiciones:** Docente tiene clases programadas  
**Flujo Principal:**

1. Docente accede a módulo de Consultas
2. Selecciona "Consultar por Docente"
3. Selecciona su nombre
4. Sistema muestra sus clases programadas
5. Docente puede filtrar por semana o mes
6. Docente ve detalles (curso, asignatura, hora)

**Postcondiciones:** Horario del docente visualizado

---

### Caso de Uso 3: Detectar y Resolver Conflictos

**Actor Primario:** Gestor Académico  
**Precondiciones:** Conflicto de horario existe  
**Flujo Principal:**

1. Sistema detecta conflicto al programar clase
2. Sistema advierte al gestor
3. Gestor puede:
   - Cambiar hora de una clase existente
   - Cambiar docente asignado
   - Cambiar curso
4. Sistema valida nuevamente
5. Cuando no hay conflicto, se guarda

**Postcondiciones:** Conflicto resuelto, programación sin solapamientos

---

### Caso de Uso 4: Ver Dashboard

**Actor Primario:** Director Académico  
**Precondiciones:** Datos de programación cargados en BD  
**Flujo Principal:**

1. Director accede al dashboard
2. Sistema carga estadísticas (totales de cursos, docentes, etc.)
3. Sistema calcula distribución por jornada
4. Sistema identifica conflictos activos
5. Director ve información agregada

**Postcondiciones:** Dashboard visualizado con datos actuales

---

### Caso de Uso 5: Registrar Calificaciones de Estudiante

**Actor Primario:** Docente  
**Precondiciones:** Estudiante registrado  
**Flujo Principal:**

1. Docente accede a módulo de Notas
2. Busca o selecciona estudiante
3. Ingresa 4 notas (0.0 - 5.0)
4. Sistema calcula promedio automáticamente
5. Sistema asigna resultado cualitativo
6. Docente confirma guardado

**Postcondiciones:** Notas guardadas, promedio calculado

---

## 1.6 SUPUESTOS Y RESTRICCIONES

### Supuestos
- Institución utiliza escala de calificación 0.0 - 5.0
- Jornadas son: Mañana, Tarde, Mixta (o Noche, Única según configuración)
- Semana laboral: Lunes a Viernes (Sábado opcional)
- Docentes pueden trabajar en múltiples jornadas
- Un docente no puede tener dos clases simultáneamente en el mismo día

### Restricciones
- No hay módulo de autenticación (acceso público en Corte I)
- No hay control de roles detallado (mismo acceso para todos)
- Base de datos local (no distribuida)
- Diseño responsive pero prioriza desktop
- No hay API de exportación (PDF, Excel)

---

## 1.7 CRITERIOS DE ÉXITO

1. ✅ Aplicación funcional sin errores críticos
2. ✅ Todos los CRUD funcionan correctamente
3. ✅ Detección de conflictos funciona en 100% de casos
4. ✅ Dashboard muestra datos en tiempo real
5. ✅ API REST responde correctamente a todas las peticiones
6. ✅ Documentación técnica completa
7. ✅ Presentación clara y demostración exitosa

---

**Aprobado por:** Ing. Jairo Armando Salcedo Aranda  
**Fecha:** Septiembre 2026  
**Versión:** 1.0
