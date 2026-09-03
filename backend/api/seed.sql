-- ==========================================================================
-- Datos de ejemplo para probar la API (opcional)
-- Ejecutar DESPUÉS de backend/schema.sql.  Borra y recarga las tablas de
-- programación académica (no toca la tabla `estudiante`).
-- ==========================================================================

USE gestion_notas;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE horario;
TRUNCATE TABLE asignacion_academica;
TRUNCATE TABLE asignatura;
TRUNCATE TABLE docente;
TRUNCATE TABLE curso;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO asignatura (idAsignatura, nombre_asignatura, intensidad_horaria) VALUES
    (1, 'Matemáticas', 5),
    (2, 'Lengua Castellana', 4),
    (3, 'Ciencias Naturales', 3);

INSERT INTO curso (idCurso, grado, curso, jornada, numero_estudiantes) VALUES
    (1, '10', '10-A', 'Mañana', 32),
    (2, '11', '11-B', 'Tarde', 28);

INSERT INTO docente (idDocente, documento, nombres, apellidos, tipo_contrato, jornada, dias_trabajo) VALUES
    (1, '1088123456', 'María', 'Gómez', 'Tiempo Completo', 'Mañana', 'Lunes,Martes,Miercoles,Jueves,Viernes'),
    (2, '1088987654', 'Carlos', 'Ruiz',  'Medio Tiempo',   'Tarde',  'Lunes,Martes,Miercoles');

INSERT INTO asignacion_academica (idAsignacion, idDocente, idCurso, idAsignatura) VALUES
    (1, 1, 1, 1),   -- María / 10-A / Matemáticas
    (2, 1, 1, 3),   -- María / 10-A / Ciencias
    (3, 2, 2, 2);   -- Carlos / 11-B / Lengua

INSERT INTO horario (idAsignacion, dia_semana, hora_inicio, hora_fin) VALUES
    (1, 'Lunes',  '07:00:00', '09:00:00'),
    (2, 'Martes', '09:00:00', '11:00:00'),
    (3, 'Lunes',  '13:00:00', '15:00:00');
