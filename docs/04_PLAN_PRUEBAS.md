# 4. PLAN DE PRUEBAS
## Aplicación Web para la Programación Académica

**Versión:** 1.0  
**Fecha:** Septiembre 2026  
**Responsable:** QA / Grupo Desarrollo

---

## 4.1 OBJETIVO DE LAS PRUEBAS

Validar que la aplicación cumple con todos los requerimientos funcionales y no funcionales especificados en el análisis y diseño, asegurando:

1. ✅ Funcionalidad correcta de todos los módulos CRUD
2. ✅ Cálculo exacto de promedios y resultados
3. ✅ Detección confiable de conflictos de horarios
4. ✅ Integridad de datos en la base de datos
5. ✅ Rendimiento aceptable (< 2 seg en consultas)
6. ✅ Usabilidad en diferentes navegadores
7. ✅ Seguridad básica contra inyecciones

---

## 4.2 ESTRATEGIA DE PRUEBAS

### Niveles de Prueba

| Nivel | Tipo | Cobertura | Herramientas |
|-------|------|-----------|--------------|
| **Unitarias** | Funciones individuales | Funciones críticas | Console.log, phpunit (future) |
| **Integración** | Módulos interactuando | Frontend ↔ Backend ↔ BD | Postman, curl |
| **Sistema** | Aplicación completa | Flujos completos | Manual, navegador |
| **Aceptación** | Cumplimiento RQ | Historias de usuario | Manual, checklist |

### Tipos de Prueba

1. **Funcionales:** ¿Hace lo que debe hacer?
2. **No funcionales:** ¿Rendimiento, seguridad, usabilidad?
3. **De regresión:** ¿Los cambios rompieron algo existente?
4. **De conflictos:** ¿Detecta solapamientos de horarios?

---

## 4.3 CASOS DE PRUEBA

### Módulo 1: Gestión de Notas

#### TC-001: Registrar Estudiante Válido
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Crear un nuevo estudiante con notas válidas |
| **Precondición** | Aplicación abierta en index.html |
| **Pasos** | 1. Ingresar nombre: "Juan Pérez" <br> 2. Nota 1: 4.0, Nota 2: 3.5, Nota 3: 4.2, Nota 4: 4.8 <br> 3. Click "Calcular Promedio" |
| **Resultado Esperado** | Promedio: 4.125 <br> Resultado: "Aprobado con sobresaliente" <br> Botón "Guardar Registro" se habilita |
| **Estado** | ⏳ Pendiente |

#### TC-002: Rechazar Nota Fuera de Rango
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Validar que notas solo acepten valores 0-5 |
| **Precondición** | Formulario en index.html |
| **Pasos** | 1. Ingresar Nota 1: 5.5 (fuera de rango) <br> 2. Click "Calcular Promedio" |
| **Resultado Esperado** | Alerta: "Nota debe estar entre 0 y 5" <br> No se calcula promedio |
| **Estado** | ⏳ Pendiente |

#### TC-003: Guardar Estudiante en BD
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Verificar que estudiante se persiste en BD |
| **Precondición** | Estudiante calculado con promedio válido |
| **Pasos** | 1. Click "Guardar Registro" <br> 2. Recarga página |
| **Resultado Esperado** | Estudiante aparece en tabla "Registros Almacenados" <br> BD contiene registro (verificar en phpMyAdmin) |
| **Estado** | ⏳ Pendiente |

#### TC-004: Resultado Cualitativo Insuficiente
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Promedio ≤ 2.9 genera resultado "Rendimiento insuficiente" |
| **Precondición** | Formulario en index.html |
| **Pasos** | 1. Notas: 2.0, 2.5, 2.0, 2.0 (promedio 2.125) <br> 2. Click "Calcular" |
| **Resultado Esperado** | Estado: "Rendimiento insuficiente" |
| **Estado** | ⏳ Pendiente |

#### TC-005: Actualizar Notas de Estudiante
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Editar notas existentes |
| **Precondición** | Estudiante registrado en tabla |
| **Pasos** | 1. Click "Editar" en fila estudiante <br> 2. Cambiar notas <br> 3. Click "Guardar" |
| **Resultado Esperado** | Promedio recalculado <br> Registro actualizado en tabla |
| **Estado** | ⏳ Pendiente |

#### TC-006: Eliminar Estudiante
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Remover estudiante de BD |
| **Precondición** | Estudiante en tabla |
| **Pasos** | 1. Click "Eliminar" en fila <br> 2. Confirmar eliminación |
| **Resultado Esperado** | Estudiante desaparece de tabla <br> No existe en BD |
| **Estado** | ⏳ Pendiente |

### Módulo 2: Gestión de Cursos

#### TC-007: Crear Curso
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Registrar nuevo curso |
| **Precondición** | En módulo "Cursos" de programacion.html |
| **Pasos** | 1. Grado: "10" <br> 2. Curso: "10-A" <br> 3. Jornada: "Mañana" <br> 4. Estudiantes: "32" <br> 5. Click "Guardar Curso" |
| **Resultado Esperado** | Confirmación: "Curso creado exitosamente" <br> Curso aparece en tabla "Cursos registrados" <br> Existe en BD |
| **Estado** | ⏳ Pendiente |

#### TC-008: Validar Campos Requeridos
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Campos requeridos no pueden estar vacíos |
| **Precondición** | Formulario en módulo Cursos |
| **Pasos** | 1. Dejar campo "Grado" vacío <br> 2. Click "Guardar Curso" |
| **Resultado Esperado** | Error: "Campo grado es requerido" (en cliente o servidor) |
| **Estado** | ⏳ Pendiente |

#### TC-009: Filtrar Cursos por Jornada
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Listar solo cursos de una jornada específica |
| **Precondición** | Múltiples cursos en BD (Mañana, Tarde) |
| **Pasos** | 1. (Futuro: agregar filtro en UI) <br> 2. GET /api/cursos.php?jornada=Mañana |
| **Resultado Esperado** | Se devuelven solo cursos de Mañana |
| **Estado** | ⏳ Pendiente |

### Módulo 3: Gestión de Docentes

#### TC-010: Crear Docente
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Registrar nuevo docente |
| **Precondición** | En módulo "Docentes" |
| **Pasos** | 1. Documento: "1088123456" <br> 2. Nombre: "María Gómez" <br> 3. Tipo Contrato: "Tiempo Completo" <br> 4. Jornada: "Mañana" <br> 5. Click "Guardar Docente" |
| **Resultado Esperado** | Docente guardado <br> Aparece en tabla |
| **Estado** | ⏳ Pendiente |

#### TC-011: Validar Documento Único
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | No permitir documentos duplicados |
| **Precondición** | Docente con documento "1088123456" ya existe |
| **Pasos** | 1. Intentar crear otro docente con mismo documento |
| **Resultado Esperado** | Error: "Documento ya existe" (409 Conflict) |
| **Estado** | ⏳ Pendiente |

### Módulo 4: Gestión de Asignaturas

#### TC-012: Crear Asignatura
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Registrar nueva asignatura |
| **Precondición** | En módulo "Asignaturas" |
| **Pasos** | 1. Nombre: "Matemáticas" <br> 2. Intensidad: "5" horas/semana <br> 3. Click "Guardar Asignatura" |
| **Resultado Esperado** | Asignatura guardada en tabla |
| **Estado** | ⏳ Pendiente |

### Módulo 5: Gestión de Horarios y Conflictos

#### TC-013: Programar Clase Sin Conflictos
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Asignar clase a docente y curso sin solapamiento |
| **Precondición** | Docente, Curso, Asignatura ya existen <br> Docente libre el Lunes 07:00-09:00 |
| **Pasos** | 1. Módulo Horarios <br> 2. Curso: "10-A" <br> 3. Docente: "María Gómez" <br> 4. Asignatura: "Matemáticas" <br> 5. Día: "Lunes" <br> 6. Hora inicio: "07:00", Hora fin: "09:00" <br> 7. Click "Programar Clase" |
| **Resultado Esperado** | Confirmación: "Clase programada exitosamente" <br> Clase aparece en calendario <br> Existe en tabla "Clases programadas" |
| **Estado** | ⏳ Pendiente |

#### TC-014: Detectar Conflicto de Docente
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Sistema advierte si docente ya tiene clase ese día/hora |
| **Precondición** | María Gómez ya tiene clase Lunes 07:00-09:00 |
| **Pasos** | 1. Intentar programar a María Gómez en Lunes 08:00-10:00 |
| **Resultado Esperado** | Alerta: "Conflicto de horario detectado. Docente ya tiene clase" <br> Se muestra clase conflictiva <br> Respuesta 409 Conflict |
| **Estado** | ⏳ Pendiente |

#### TC-015: Detectar Conflicto de Curso
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Sistema advierte si curso ya tiene clase ese día/hora |
| **Precondición** | Curso 10-A ya tiene clase Lunes 07:00-09:00 |
| **Pasos** | 1. Intentar programar otra asignatura para 10-A en Lunes 08:00-10:00 |
| **Resultado Esperado** | Alerta: "Conflicto de horario detectado. Curso ya tiene clase" |
| **Estado** | ⏳ Pendiente |

#### TC-016: Forzar Guardado con Conflicto
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Permitir guardar a pesar del conflicto (force=1) |
| **Precondición** | Conflicto detectado en TC-014 |
| **Pasos** | 1. Usuario hace click en "Forzar Guardado" / check "Ignorar conflicto" <br> 2. POST con ?force=1 |
| **Resultado Esperado** | Clase se guarda con advertencia <br> Respuesta 201 + mensaje "Guardado con conflicto" |
| **Estado** | ⏳ Pendiente |

#### TC-017: Ver Calendario (Semana)
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Visualizar clases en vista de semana |
| **Precondición** | Múltiples clases programadas |
| **Pasos** | 1. Módulo Horarios <br> 2. Click en botón "Semana" <br> 3. Navegar con flechas |
| **Resultado Esperado** | Se muestra semana actual con clases <br> Se puede navegar a semanas anteriores/posteriores |
| **Estado** | ⏳ Pendiente |

#### TC-018: Ver Calendario (Mes)
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Visualizar clases en vista de mes |
| **Precondición** | Clases programadas |
| **Pasos** | 1. Click "Mes" <br> 2. Ver clases en grid mensual |
| **Resultado Esperado** | Calendario muestra mes con clases marcadas |
| **Estado** | ⏳ Pendiente |

### Módulo 6: Consultas Avanzadas

#### TC-019: Consultar por Docente
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Listar todas las clases de un docente |
| **Precondición** | Docente tiene 3 clases programadas |
| **Pasos** | 1. Módulo Consultas <br> 2. Tipo: "Docente" <br> 3. Seleccionar "María Gómez" <br> 4. Click "Consultar" |
| **Resultado Esperado** | Tabla muestra 3 clases con detalles (curso, asignatura, día, hora) |
| **Estado** | ⏳ Pendiente |

#### TC-020: Consultar por Curso
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Listar programación de un curso específico |
| **Precondición** | Curso 10-A tiene 5 clases |
| **Pasos** | 1. Tipo: "Curso" <br> 2. Seleccionar "10-A" <br> 3. Click "Consultar" |
| **Resultado Esperado** | Tabla muestra 5 clases con docentes y asignaturas |
| **Estado** | ⏳ Pendiente |

#### TC-021: Consultar por Jornada
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Ver todas las clases de una jornada |
| **Precondición** | Clases distribuidas en Mañana/Tarde |
| **Pasos** | 1. Tipo: "Jornada" <br> 2. Seleccionar "Mañana" <br> 3. Click "Consultar" |
| **Resultado Esperado** | Se listan todas las clases de jornada Mañana |
| **Estado** | ⏳ Pendiente |

### Módulo 7: Dashboard

#### TC-022: Cargar Estadísticas
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Dashboard muestra totales correctos |
| **Precondición** | BD tiene: 5 cursos, 8 docentes, 12 asignaturas, 24 clases, 120 estudiantes |
| **Pasos** | 1. Acceder a programacion.html <br> 2. Ir a Dashboard |
| **Resultado Esperado** | Se muestran los números correctos en tarjetas de estadísticas |
| **Estado** | ⏳ Pendiente |

#### TC-023: Mostrar Conflictos en Dashboard
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Dashboard lista conflictos detectados |
| **Precondición** | BD contiene 2 conflictos de horario |
| **Pasos** | 1. Ir a Dashboard |
| **Resultado Esperado** | Tarjeta de conflictos muestra "2" <br> Lista detalla conflictos (docente, curso, día, hora) |
| **Estado** | ⏳ Pendiente |

#### TC-024: Distribución por Jornada
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | Tabla de jornadas muestra distribución correcta |
| **Precondición** | Datos: Mañana (3 cursos, 80 est, 15 clases), Tarde (2 cursos, 40 est, 9 clases) |
| **Pasos** | 1. Dashboard <br> 2. Ver tabla "Distribución por Jornada" |
| **Resultado Esperado** | Tabla muestra datos correctos |
| **Estado** | ⏳ Pendiente |

### API REST

#### TC-025: GET /api/cursos.php - Listar Todos
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | API devuelve lista de cursos |
| **Precondición** | BD tiene 3 cursos |
| **Pasos** | ```bash <br> curl http://localhost/Calculadora/backend/api/cursos.php <br> ``` |
| **Resultado Esperado** | 200 OK <br> JSON: { "status":"success", "data": [{ id:1, ... }, ...] } |
| **Estado** | ⏳ Pendiente |

#### TC-026: GET /api/cursos.php?id=1 - Obtener Uno
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | API devuelve un curso específico |
| **Pasos** | ```bash <br> curl http://localhost/.../cursos.php?id=1 <br> ``` |
| **Resultado Esperado** | 200 OK <br> JSON de un curso |
| **Estado** | ⏳ Pendiente |

#### TC-027: POST /api/cursos.php - Crear
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | API crea un nuevo curso |
| **Pasos** | ```bash <br> curl -X POST -H "Content-Type: application/json" <br> -d '{"grado":"10","curso":"10-A","jornada":"Mañana","numero_estudiantes":32}' <br> http://localhost/.../cursos.php <br> ``` |
| **Resultado Esperado** | 201 Created <br> JSON: { "status":"success", "data": { id:4, ... } } |
| **Estado** | ⏳ Pendiente |

#### TC-028: DELETE /api/cursos.php?id=1 - Eliminar
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | API elimina curso (y sus referencias en cascada) |
| **Pasos** | ```bash <br> curl -X DELETE http://localhost/.../cursos.php?id=1 <br> ``` |
| **Resultado Esperado** | 200 OK <br> Curso eliminado en BD <br> Asignaciones y horarios relacionados también se eliminan |
| **Estado** | ⏳ Pendiente |

#### TC-029: POST /api/horarios.php?force=1 - Forzar Conflicto
| Aspecto | Detalle |
|--------|---------|
| **Descripción** | API permite guardar con conflicto usando force=1 |
| **Pasos** | POST /horarios.php?force=1 con datos que causarían conflicto |
| **Resultado Esperado** | 201 Created con advertencia en respuesta |
| **Estado** | ⏳ Pendiente |

---

## 4.4 PRUEBAS DE INTEGRACIÓN

### IT-001: Frontend ↔ Backend
```
1. Frontend (programacion.js) llama GET /api/cursos.php
2. Backend carga conexión PDO
3. Backend ejecuta SELECT
4. Backend devuelve JSON
5. Frontend recibe respuesta y renderiza tabla
Resultado: ✅ Se muestra tabla actualizada
```

### IT-002: Transacción de Horario
```
1. POST /api/horarios.php con docente, curso, asignatura
2. Backend valida integridad referencial
3. Backend detecta conflictos
4. Backend inserta asignacion_academica (si no existe)
5. Backend inserta horario
6. Frontend recibe confirmación
7. Frontend carga calendario
Resultado: ✅ Calendario actualizado con nueva clase
```

### IT-003: Cascada de Eliminación
```
1. DELETE /api/cursos.php?id=1
2. Backend elimina curso
3. BD cascada: elimina asignaciones relacionadas
4. BD cascada: elimina horarios relacionados
5. Verificar en BD no existen registros huérfanos
Resultado: ✅ Integridad referencial mantenida
```

---

## 4.5 PRUEBAS DE RENDIMIENTO

### PT-001: Listar 1000 estudiantes
- **Tiempo esperado:** < 2 seg
- **Herramienta:** Navegador (F12 > Network)
- **Comando:** GET /api/estudiantes.php con 1000 registros
- **Status:** ⏳ Pendiente

### PT-002: Detectar conflictos en 500 horarios
- **Tiempo esperado:** < 500 ms
- **Prueba:** POST /api/horarios.php con BD llena
- **Status:** ⏳ Pendiente

### PT-003: Cargar dashboard
- **Tiempo esperado:** < 1 seg
- **Prueba:** Navegador a programacion.html
- **Status:** ⏳ Pendiente

---

## 4.6 PRUEBAS DE COMPATIBILIDAD

### Navegadores
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile (iOS Safari, Android Chrome)

### Resoluciones
- [ ] 1920x1080 (Desktop)
- [ ] 1366x768 (Laptop)
- [ ] 768x1024 (Tablet)
- [ ] 360x640 (Mobile)

---

## 4.7 PRUEBAS DE SEGURIDAD

### SEC-001: Inyección SQL
```
Prueba: Ingresar ' OR '1'='1 en búsqueda
Resultado: ✅ No devuelve datos no autorizados (prepared statements)
```

### SEC-002: XSS
```
Prueba: Ingresar <script>alert('XSS')</script> en nombre
Resultado: ✅ Se escapan caracteres, no ejecuta script
```

### SEC-003: Validación de Entrada
```
Prueba: Nota fuera de rango (6.0)
Resultado: ✅ Rechaza en cliente y servidor
```

---

## 4.8 MATRIZ DE TRAZABILIDAD

| Caso Prueba | Requerimiento | Status |
|-------------|--------------|--------|
| TC-001 | RF-5.1 | ⏳ |
| TC-002 | RNF-2.2 | ⏳ |
| TC-007 | RF-1.1 | ⏳ |
| TC-013 | RF-4.1 | ⏳ |
| TC-014 | RF-4.2 | ⏳ |
| TC-022 | RF-7.1 | ⏳ |

---

## 4.9 CRITERIOS DE ACEPTACIÓN

### Funcional
- ✅ 100% de casos de prueba ejecutados
- ✅ 95% de casos pasados (máximo 5% fallos aceptables)
- ✅ Cero defectos críticos
- ✅ Máximo 3 defectos mayores

### Rendimiento
- ✅ Tiempo respuesta < 2 seg en 95% de consultas
- ✅ Dashboard carga en < 1 seg

### Seguridad
- ✅ Sin inyecciones SQL
- ✅ Sin XSS
- ✅ Validación en cliente y servidor

---

## 4.10 REPORTE DE EJECUCIÓN

### Resumen
| Métrica | Valor |
|---------|-------|
| Total Casos | 29 |
| Ejecutados | __ |
| Pasados | __ |
| Fallidos | __ |
| Bloqueados | __ |
| Cobertura | __% |

### Defectos Encontrados
| ID | Descripción | Severidad | Estado |
|----|-------------|-----------|--------|
|    |             |           |        |

### Recomendaciones
- [ ] Aplicación lista para producción
- [ ] Requiere correcciones menores
- [ ] Requiere correcciones mayores
- [ ] No apta para entrega

---

**Aprobado por:** _______________  
**Fecha:** _______________  
**Próxima revisión:** Antes de entrega final
