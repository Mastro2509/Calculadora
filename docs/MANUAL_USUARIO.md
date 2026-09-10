# 📖 Manual de Usuario
## Aplicación Web para la Programación Académica

**Versión:** 1.0  
**Fecha:** Septiembre 2026

---

## 📚 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Módulo de Gestión de Notas](#módulo-1-gestión-de-notas)
3. [Módulo de Programación Académica](#módulo-2-programación-académica)
4. [Preguntas Frecuentes](#preguntas-frecuentes)
5. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Introducción

Esta aplicación web facilita la gestión integral de notas académicas y programación de cursos en instituciones educativas. Consta de dos módulos principales:

1. **Módulo de Gestión de Notas** - Registrar estudiantes y sus calificaciones
2. **Módulo de Programación Académica** - Gestionar cursos, docentes, horarios

### Acceso Rápido
- **Gestión de Notas:** http://localhost/Calculadora/index.html
- **Programación Académica:** http://localhost/Calculadora/programacion.html

### Navegadores Soportados
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Tablets y móviles

---

## Módulo 1: Gestión de Notas

### Descripción
Permite registrar estudiantes, ingresar sus 4 notas de período, calcular automáticamente el promedio y asignar un resultado cualitativo basado en escala de 0-5.

### Pantalla Principal

```
┌────────────────────────────────────────────────┐
│ GESTIÓN DE NOTAS ACADÉMICAS                   │
│ Sistema de registro y cálculo de promedios    │
│ [Abrir Programación Académica >>]             │
├────────────────────────────────────────────────┤
│                                                │
│ REGISTRAR ESTUDIANTE                          │
│ Nombre: [____________________]                │
│                                                │
│ Nota 1: [____]  Nota 2: [____]                │
│ Nota 3: [____]  Nota 4: [____]                │
│                                                │
│ [Calcular Promedio]  [Guardar Registro]       │
│                                                │
│ REGISTROS ALMACENADOS                         │
│ (tabla con estudiantes guardados)             │
└────────────────────────────────────────────────┘
```

### Paso a Paso: Registrar un Estudiante

#### 1. Ingresar Nombre
```
1. Haz click en el campo "Nombre"
2. Escribe el nombre completo del estudiante
   Ejemplo: "Juan Pérez"
3. El campo acepta cualquier texto
```

#### 2. Ingresar Notas
```
1. Completa los cuatro campos de notas:
   - Nota 1 (primer período)
   - Nota 2 (segundo período)
   - Nota 3 (tercer período)
   - Nota 4 (cuarto período)

2. Restricciones:
   ✓ Valores entre 0.0 y 5.0
   ✓ Puedes usar decimales (ej. 4.5)
   ✓ No se aceptan números fuera del rango

3. Ejemplo de entrada válida:
   - Nota 1: 4.0
   - Nota 2: 3.5
   - Nota 3: 4.2
   - Nota 4: 4.8
```

#### 3. Calcular Promedio
```
1. Después de ingresar las 4 notas, haz click en:
   [Calcular Promedio]

2. El sistema automáticamente:
   ✓ Suma las 4 notas
   ✓ Divide entre 4
   ✓ Muestra el promedio
   ✓ Asigna resultado cualitativo

3. Ejemplo:
   Notas: 4.0 + 3.5 + 4.2 + 4.8 = 16.5
   Promedio = 16.5 / 4 = 4.125
   Resultado: "Aprobado con sobresaliente"
```

#### 4. Ver Resultado
```
Se muestra una sección con:

RESULTADOS DEL CÁLCULO
├─ Promedio: 4.125
├─ Estado: Aprobado
└─ Rendimiento: Aprobado con sobresaliente

Escala de Resultados:
├─ Promedio ≤ 2.9 → Rendimiento insuficiente
├─ Promedio 3.0 - 3.9 → Aprobado
├─ Promedio 4.0 - 4.5 → Aprobado con sobresaliente
└─ Promedio 4.6 - 5.0 → Aprobado con excelente
```

#### 5. Guardar Registro
```
1. El botón [Guardar Registro] está DESHABILITADO hasta
   que calcules el promedio

2. Después de calcular, haz click:
   [Guardar Registro]

3. El sistema:
   ✓ Valida que todos los datos sean correctos
   ✓ Guarda en la base de datos
   ✓ Muestra confirmación
   ✓ Limpia el formulario

4. El estudiante aparece en la tabla inferior
```

### Tabla de Registros Almacenados

```
┌──────────┬───────┬───────┬───────┬───────┬────────┬──────────────┬─────────┐
│ Nombre   │ N1    │ N2    │ N3    │ N4    │Promedio│ Resultado    │Acciones │
├──────────┼───────┼───────┼───────┼───────┼────────┼──────────────┼─────────┤
│ Juan P.  │ 4.0   │ 3.5   │ 4.2   │ 4.8   │ 4.125  │ Aprobado     │Edit     │
│          │       │       │       │       │        │ con sobre...  │Eliminar │
├──────────┼───────┼───────┼───────┼───────┼────────┼──────────────┼─────────┤
│ María G. │ 3.0   │ 3.5   │ 3.8   │ 3.2   │ 3.375  │ Aprobado     │Edit     │
│          │       │       │       │       │        │              │Eliminar │
└──────────┴───────┴───────┴───────┴───────┴────────┴──────────────┴─────────┘
```

#### Editar un Estudiante
```
1. Haz click en [Edit] en la fila del estudiante
2. Se cargan los datos en el formulario
3. Cambia las notas que desees
4. Haz click [Calcular Promedio] de nuevo
5. Click [Guardar Registro]
6. Los cambios se persisten en BD
```

#### Eliminar un Estudiante
```
1. Haz click en [Eliminar] en la fila
2. Confirma la eliminación en el cuadro de diálogo
3. El estudiante se elimina de la tabla y la BD
4. ⚠️  No se puede deshacer esta acción
```

### Validaciones

#### ✅ Entrada Válida
```
✓ Nombre: "Juan Pérez" (cualquier texto)
✓ Nota 1: 4.0 (número 0-5, puede tener decimales)
✓ Nota 2: 3.5
✓ Nota 3: 4.2
✓ Nota 4: 4.8
→ Promedio calculado: 4.125
→ Guardado exitoso
```

#### ❌ Entrada Inválida
```
✗ Nota fuera de rango: 6.0 o -1.0
  → Error: "Nota debe estar entre 0 y 5"

✗ Campo de nota vacío
  → Error: "Todos los campos son requeridos"

✗ Nombre vacío
  → Error: "Ingresa el nombre del estudiante"
```

---

## Módulo 2: Programación Académica

### Descripción General
Herramienta completa para gestionar la programación de cursos, asignación de docentes, horarios y detectar automáticamente conflictos.

### Acceso
1. Haz click en [Abrir Programación Académica >>] desde index.html
2. O accede directamente: http://localhost/Calculadora/programacion.html

### Pantalla Principal

```
┌─────────────────────────────────────────────────────────┐
│ PROGRAMACIÓN ACADÉMICA                                  │
│ Gestión de cursos, docentes, asignaturas y horarios     │
│ [<< Volver a Gestión de Notas]                          │
├─────────────────────────────────────────────────────────┤
│ [ Dashboard | Cursos | Docentes | Asignaturas |...  ]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Contenido del módulo seleccionado                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Módulo 2.1: Dashboard

**Propósito:** Ver estadísticas y conflictos activos de un vistazo

#### Pantalla

```
┌─ RESUMEN GENERAL ────────────────────────────────────┐
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │    5     │ │    8     │ │   12     │ │   24     │ │
│ │ Cursos   │ │Docentes  │ │Asignat.  │ │ Clases   │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                     │
│ ┌──────────┐ ┌────────────────────────────────┐    │
│ │   120    │ │ ⚠️  Conflictos: 2              │    │
│ │Estudiantes                                 │    │
│ │ (en cursos)                                │    │
│ └──────────┘ └────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘

┌─ DISTRIBUCIÓN POR JORNADA ───────────────────────────┐
│ ┌────────┬────────┬──────────┬────────────┐          │
│ │Jornada │ Cursos │ Estudian.│ Clases     │          │
│ ├────────┼────────┼──────────┼────────────┤          │
│ │Mañana  │   3    │   80     │    15      │          │
│ │Tarde   │   2    │   40     │     9      │          │
│ └────────┴────────┴──────────┴────────────┘          │
└─────────────────────────────────────────────────────┘

┌─ CONFLICTOS DETECTADOS ──────────────────────────────┐
│ 1. Docente: María Gómez                             │
│    Día: Lunes | Hora: 7:00 - 9:00                   │
│    Conflicto: Clase duplicada                       │
│                                                     │
│ 2. Curso: 10-A                                      │
│    Día: Martes | Hora: 1:00 - 3:00                  │
│    Conflicto: Dos asignaturas simultáneas           │
└─────────────────────────────────────────────────────┘
```

#### Cómo Leer el Dashboard
- **Tarjetas de estadísticas:** Número total de cada recurso
- **Conflictos:** Muestra problemas detectados automáticamente
- **Distribución:** Cómo está dividida la carga por jornada

---

### Módulo 2.2: Gestión de Cursos

**Propósito:** Crear, editar y eliminar cursos

#### Paso a Paso: Crear un Curso

```
1. Click en pestaña [ Cursos ]

2. Completa el formulario:
   
   Grado: [10]
   └─ Número de grado (10, 11, etc.)
   
   Curso: [10-A]
   └─ Identificador del curso (A, B, C, etc.)
   
   Jornada: [Mañana ▼]
   └─ Selecciona: Mañana / Tarde / Noche / Única
   
   N.º de estudiantes: [32]
   └─ Cantidad máxima de estudiantes

3. Click [Guardar Curso]
   └─ Se guarda en BD
   └─ Aparece en tabla inferior

4. Resultado: El curso está disponible para programar clases
```

#### Tabla de Cursos Registrados

```
┌──────┬────────┬────────┬───────────┬──────────┐
│Grado │ Curso  │Jornada │Estudiantes│ Acciones │
├──────┼────────┼────────┼───────────┼──────────┤
│ 10   │ 10-A   │ Mañana │    32     │[Edit][X] │
│ 10   │ 10-B   │ Tarde  │    30     │[Edit][X] │
│ 11   │ 11-A   │ Mañana │    28     │[Edit][X] │
└──────┴────────┴────────┴───────────┴──────────┘
```

#### Editar un Curso
```
1. Click en [Edit] en la fila del curso
2. Los datos se cargan en el formulario
3. Modifica los campos necesarios
4. Click [Guardar Curso] nuevamente
5. Los cambios se guardan automáticamente
```

#### Eliminar un Curso
```
1. Click en [X] (Eliminar) en la fila
2. ⚠️  Confirma que entiendes:
   - Se elimina el curso
   - Se eliminan todas sus asignaciones
   - Se eliminan todos sus horarios
3. Click "Confirmar" para proceder
4. El curso se elimina permanentemente
```

---

### Módulo 2.3: Gestión de Docentes

**Propósito:** Registrar docentes y sus características

#### Paso a Paso: Crear un Docente

```
1. Click en pestaña [ Docentes ]

2. Completa el formulario:

   Nombre completo: [María Gómez]
   └─ Nombres y apellidos
   
   Documento: [1088123456]
   └─ Cédula o documento de identidad
   └─ ⚠️  Debe ser ÚNICO (no puede repetirse)
   
   Email: [maria@institucion.edu.co]
   └─ Correo electrónico (opcional)
   
   Teléfono: [300 123 4567]
   └─ Número de celular/teléfono (opcional)

3. Asignaturas que puede dictar:
   ☐ Matemáticas
   ☐ Inglés
   ☑ Español
   └─ Marca las asignaturas disponibles
   └─ Primero debes crear las asignaturas

4. Disponibilidad: [Lunes a Viernes 7:00 - 13:00]
   └─ Texto descriptivo de su disponibilidad

5. Click [Guardar Docente]
   └─ Se guarda el docente
   └─ Aparece en tabla inferior
```

#### Validaciones
```
✓ Documento único (no puede haber dos con igual cédula)
✓ Nombre requerido
✓ Tipo de contrato y jornada requeridos
✓ Días de trabajo requeridos
```

#### Tabla de Docentes Registrados

```
┌──────────────┬─────────────┬─────────────────────┬──────────────┐
│ Nombre       │ Documento   │ Asignaturas         │ Acciones     │
├──────────────┼─────────────┼─────────────────────┼──────────────┤
│ María Gómez  │ 1088123456  │ Matemáticas, Inglés │ [Edit] [X]    │
│ Carlos López │ 1099876543  │ Español             │ [Edit] [X]    │
└──────────────┴─────────────┴─────────────────────┴──────────────┘
```

---

### Módulo 2.4: Gestión de Asignaturas

**Propósito:** Definir las asignaturas que se enseñan

#### Paso a Paso: Crear una Asignatura

```
1. Click en pestaña [ Asignaturas ]

2. Completa el formulario:
   
   Nombre: [Matemáticas]
   └─ Nombre de la asignatura
   
   Intensidad horaria: [5]
   └─ Horas por semana que dura la clase
   └─ Ejemplo: Matemáticas = 5 horas/semana

3. Click [Guardar Asignatura]
   └─ Se crea la asignatura
   └─ Ya está disponible para asignar a docentes y cursos
```

#### Tabla de Asignaturas Registradas

```
┌─────────────────┬──────────────────────┬──────────┐
│ Nombre          │ Intensidad horaria   │ Acciones │
├─────────────────┼──────────────────────┼──────────┤
│ Matemáticas     │       5 h/semana     │ [Edit][X]│
│ Español         │       4 h/semana     │ [Edit][X]│
│ Inglés          │       4 h/semana     │ [Edit][X]│
│ Ciencias        │       5 h/semana     │ [Edit][X]│
└─────────────────┴──────────────────────┴──────────┘
```

---

### Módulo 2.5: Gestión de Horarios

**Propósito:** Programar clases y detectar conflictos

#### Paso a Paso: Programar una Clase

```
1. Click en pestaña [ Horarios ]

2. Completa el formulario de programación:
   
   Curso: [10-A ▼]
   └─ Selecciona el curso
   
   Asignatura: [Matemáticas ▼]
   └─ Selecciona la asignatura a enseñar
   
   Docente: [María Gómez ▼]
   └─ Selecciona quién enseña
   
   Día: [Lunes ▼]
   └─ Lunes a Viernes (Sábado en algunos casos)
   
   Hora inicio: [07:00]
   └─ Hora en que comienza (formato 24h)
   
   Hora fin: [09:00]
   └─ Hora en que termina
   └─ Debe ser POSTERIOR a hora inicio

3. Click [Programar Clase]

4. El sistema VALIDA AUTOMÁTICAMENTE:
   ✓ ¿El docente está libre a esa hora?
   ✓ ¿El curso está libre a esa hora?
   ✓ ¿No hay otra asignatura simultánea?
```

#### Escenarios Posibles

**ESCENARIO A: Sin Conflictos**
```
✅ Confirmación: "Clase programada exitosamente"
✅ La clase aparece en el calendario
✅ Aparece en tabla "Clases programadas"
```

**ESCENARIO B: Conflicto Detectado**
```
⚠️  ALERTA: "Conflicto de horario detectado"

Detalles:
- Docente: María Gómez
- Conflicto: Lunes 7:00 - 9:00
- Clase existente: Matemáticas (10-A)
- Nueva clase: Inglés (11-A)
- Problema: Docente no puede estar en dos lugares

Opciones:
[  Cancelar  ]  [  Forzar Guardado  ]

Opción 1: Cancelar
└─ Elige otro docente, día u hora
└─ Intenta de nuevo

Opción 2: Forzar Guardado
└─ Guarda la clase IGUALMENTE
└─ El conflicto aparecerá en el dashboard
└─ Recomendado solo si es necesario
```

#### Ver Calendario

**Cambiar Vista**
```
Botones disponibles:
[Mes]    - Ver calendario mensual
[Semana] - Ver semana completa
[Día]    - Ver solo un día

Ejemplo de vista Semana:
       LUNES      MARTES      MIÉRCOLES  JUEVES     VIERNES
07:00  Matem.     -           Inglés     -          Español
       (10-A)                 (9-A)                 (11-A)

09:00  -          Ciencias    -          Matem.     -
                  (10-A)                 (9-A)

11:00  Inglés     -           Matem.     -          -
       (9-A)                  (10-A)
```

**Navegar**
```
[◄]  [Hoy]  [►]
└─ Navegar a semana anterior/siguiente
└─ Volver a hoy

O seleccionar periodo manualmente
```

#### Tabla de Clases Programadas

```
┌────────┬─────────────┬────────────┬─────┬───────────┬────────┐
│ Curso  │ Asignatura  │ Docente    │ Día │ Hora      │Estado  │
├────────┼─────────────┼────────────┼─────┼───────────┼────────┤
│ 10-A   │ Matemáticas │ María G.   │ Lun │ 07:00-09:0│ ✓      │
│ 10-A   │ Español     │ Carlos L.  │ Mar │ 09:00-11:0│ ⚠️ C.  │
│ 9-A    │ Inglés      │ María G.   │ Lun │ 07:00-09:0│ ⚠️ C.  │
└────────┴─────────────┴────────────┴─────┴───────────┴────────┘

Leyenda:
✓ = Normal (sin conflictos)
⚠️ C. = Con conflicto (forzado)
```

#### Editar una Clase Programada
```
1. Haz click en [Editar] en la tabla
2. Se cargan los datos en el formulario
3. Modifica lo necesario
4. El sistema valida de nuevo
5. Click [Guardar] para confirmar cambios
```

#### Eliminar una Clase Programada
```
1. Haz click en [Eliminar] en la tabla
2. Confirma la eliminación
3. La clase desaparece del calendario
4. ⚠️  No se puede deshacer
```

---

### Módulo 2.6: Consultas Avanzadas

**Propósito:** Buscar y filtrar la programación de manera flexible

#### Paso a Paso: Consultar Programación

```
1. Click en pestaña [ Consultas ]

2. Selecciona tipo de búsqueda:
   
   Consultar por: [Curso ▼]
   
   Opciones disponibles:
   ├─ Curso → Ver clases de un curso específico
   ├─ Docente → Ver clases de un docente
   ├─ Asignatura → Ver dónde se enseña una asignatura
   └─ Jornada → Ver todas las clases de una jornada

3. Selecciona el valor:
   
   Valor: [10-A ▼]
   └─ Se llena dinámicamente según el tipo
   └─ Si seleccionas "Curso" ves lista de cursos
   └─ Si seleccionas "Docente" ves lista de docentes

4. Click [Consultar]
   └─ Se ejecuta la búsqueda
   └─ Aparecen resultados en tabla

5. Analiza resultados:
   ✓ Ve todas las clases del filtro seleccionado
   ✓ Detalles: Docente, Asignatura, Día, Hora
   ✓ Puedes exportar o copiar información
```

#### Ejemplos de Consultas

**Consulta 1: Programación de un Curso**
```
Tipo: Curso
Valor: 10-A

Resultados:
┌─────────────────┬──────────┬─────────────┬──────────────┐
│ Asignatura      │ Docente  │ Día         │ Hora         │
├─────────────────┼──────────┼─────────────┼──────────────┤
│ Matemáticas     │ María G. │ Lunes       │ 07:00 - 09:00│
│ Español         │ Carlos L.│ Martes      │ 09:00 - 11:00│
│ Inglés          │ Pedro M. │ Miércoles   │ 07:00 - 09:00│
│ Ciencias        │ Ana R.   │ Jueves      │ 11:00 - 13:00│
│ Educación Física│ Luis T.  │ Viernes     │ 14:00 - 16:00│
└─────────────────┴──────────┴─────────────┴──────────────┘

Conclusión: Curso 10-A tiene 5 clases a la semana
```

**Consulta 2: Programación de un Docente**
```
Tipo: Docente
Valor: María Gómez

Resultados:
┌────────┬─────────────┬─────────┬──────────────┐
│ Curso  │ Asignatura  │ Día     │ Hora         │
├────────┼─────────────┼─────────┼──────────────┤
│ 10-A   │ Matemáticas │ Lunes   │ 07:00 - 09:00│
│ 9-A    │ Matemáticas │ Martes  │ 09:00 - 11:00│
│ 11-A   │ Matemáticas │ Miércoles│ 11:00 - 13:00│
└────────┴─────────────┴─────────┴──────────────┘

Conclusión: María Gómez enseña Matemáticas en 3 cursos
           3 horas por semana (distribuidas)
           Sin conflictos de horario
```

**Consulta 3: Clases de una Jornada**
```
Tipo: Jornada
Valor: Mañana

Resultados:
(Se muestran todas las clases de jornada Mañana)
... (15 filas) ...

Total: 15 clases programadas en jornada Mañana
```

---

## Preguntas Frecuentes

### Sobre Notas

**P: ¿Cuál es la escala de calificación?**
R: 0.0 a 5.0. Puedes usar decimales (ej. 4.5).

**P: ¿Se redondea el promedio?**
R: No, se muestra con 2 decimales (ej. 4.125).

**P: ¿Puedo cambiar las 4 notas?**
R: Sí, haz click en [Edit] y modifica las notas que desees.

---

### Sobre Cursos

**P: ¿Qué diferencia hay entre "grado" y "curso"?**
R: 
- Grado: Número (10, 11)
- Curso: Identificador (10-A, 10-B) para distinguir secciones

**P: ¿Qué son las "jornadas"?**
R: Turnos: Mañana (7-13h), Tarde (13-19h), etc.

**P: ¿Puedo tener dos cursos con el mismo grado pero diferente jornada?**
R: Sí (ej. 10-A Mañana y 10-A Tarde son posibles).

---

### Sobre Docentes

**P: ¿El documento debe ser único?**
R: Sí, no puedes registrar dos docentes con el mismo documento.

**P: ¿Qué pasa si elimino un docente?**
R: Se eliminan todas sus asignaciones y clases programadas.

---

### Sobre Horarios y Conflictos

**P: ¿Qué es un conflicto de horario?**
R: Cuando un docente o curso tiene DOS clases simultáneamente.

**P: ¿Puedo guardar una clase con conflicto?**
R: Sí, usando [Forzar Guardado], pero aparecerá en alertas.

**P: ¿Cómo se detectan los conflictos?**
R: El sistema compara fechas/horas antes de guardar.

**P: ¿Puedo tener un docente en dos cursos al mismo tiempo?**
R: No, a menos que fuerces la opción. El conflicto se mostrará.

---

### Sobre Consultas

**P: ¿Dónde veo el horario de un docente?**
R: En módulo Consultas, selecciona "Docente" y elige el nombre.

**P: ¿Puedo exportar los resultados?**
R: Actualmente se muestran en tabla. Puedes copiar o capturar pantalla.

---

## Solución de Problemas

### Problema 1: La BD no conecta

**Síntomas:**
- Error: "Error de conexión: No database selected"
- Formularios no guardan

**Soluciones:**
```
1. Verifica que MySQL esté ejecutándose
   ├─ XAMPP Control Panel > MySQL [Start]
   └─ phpMyAdmin: http://localhost/phpmyadmin

2. Verifica que schema.sql fue ejecutado
   ├─ phpMyAdmin > BD "gestion_notas" debe existir
   └─ Si no: Importa backend/schema.sql

3. Verifica conexion.php
   └─ Backend/conexion.php debe tener credenciales correctas
   └─ Usuario: root, Password: (vacío en desarrollo)
```

---

### Problema 2: Conflictos no se detectan

**Síntomas:**
- Puedo programar dos clases al mismo tiempo sin alerta

**Soluciones:**
```
1. Recarga la página (Ctrl+F5)
2. Verifica que frontend esté sincronizado con backend
3. Comprueba que ambas clases están en la misma BD
4. Si persiste, contacta al administrador
```

---

### Problema 3: Los datos no se guardan

**Síntomas:**
- Completo el formulario, hago click guardar, pero no aparecen

**Soluciones:**
1. Verifica que BD está conectada (ver Problema 1)
2. Comprueba que todos los campos sean válidos:
   - Notas entre 0-5 ✓
   - Nombre completo ✓
   - Documento único ✓
3. Abre consola (F12 > Console) y busca errores
4. Intenta de nuevo

---

### Problema 4: Calendario no carga clases

**Síntomas:**
- Calendario vacío aunque existen clases programadas

**Soluciones:**
```
1. Recarga la página
2. Verifica que existan clases programadas
   └─ Ve a tabla "Clases programadas"
3. Si la tabla tiene datos pero calendario no:
   └─ Problema de renderizado
   └─ Intenta cambiar vista (Mes/Semana/Día)
4. Limpia cache: Ctrl+Shift+Del
```

---

### Problema 5: Botones deshabilitados

**Síntomas:**
- [Guardar Registro] está gris en módulo de Notas

**Solución:**
```
Esto es NORMAL y ESPERADO
- El botón está deshabilitado hasta que calcules el promedio
- Después de click [Calcular Promedio], se habilita
```

---

### Problema 6: Tabla vacía

**Síntomas:**
- "Registros Almacenados" / "Cursos registrados" está vacío

**Soluciones:**
```
1. Verifica que hayas guardado datos
   └─ Completa formulario y click Guardar

2. Si acabas de instalar:
   └─ Es normal, no hay datos
   └─ Agrega datos manualmente

3. Si antes había datos:
   └─ Verifica BD en phpMyAdmin
   └─ Si está vacía, recarga seed.sql
```

---

### Problema 7: Error al eliminar

**Síntomas:**
- "Error al eliminar" cuando hago click [X]

**Soluciones:**
```
1. Recarga página
2. Verifica que tienes permisos
3. Comprueba que BD está disponible
4. Si persiste: contacta administrador
```

---

## 📞 Contacto y Soporte

Si tienes dudas adicionales:
- **Consulta:** docs/03_DOCUMENTACION_TECNICA.md (manual técnico)
- **Profesor:** Ing. Jairo Armando Salcedo Aranda
- **Institución:** Universidad de San Buenaventura
- **Horario:** Según clase de Ingeniería Web

---

**Versión Manual:** 1.0  
**Última actualización:** Septiembre 2026  
**Aplicable a:** Versión 1.0.0 de la aplicación
