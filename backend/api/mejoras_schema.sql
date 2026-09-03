-- ==========================================================================
-- Mejoras OPCIONALES al schema (backend/schema.sql)
-- --------------------------------------------------------------------------
-- La API funciona sin aplicar esto, pero estas restricciones e índices
-- refuerzan la integridad y aceleran las consultas más frecuentes.
-- Ejecutar sobre la base `gestion_notas`.
-- ==========================================================================

USE gestion_notas;

-- 1. Evitar ternas docente/curso/asignatura duplicadas.
--    (La API ya lo controla, pero conviene garantizarlo en la BD.)
ALTER TABLE asignacion_academica
    ADD UNIQUE KEY uk_terna (idDocente, idCurso, idAsignatura);

-- 2. Índices para los filtros y la detección de conflictos de horario.
ALTER TABLE horario
    ADD INDEX ix_horario_dia (dia_semana),
    ADD INDEX ix_horario_franja (dia_semana, hora_inicio, hora_fin);

-- 3. Índices en las llaves foráneas de asignacion_academica
--    (MySQL crea uno por FK automáticamente; se listan por claridad).
-- ALTER TABLE asignacion_academica ADD INDEX ix_aa_docente (idDocente);
-- ALTER TABLE asignacion_academica ADD INDEX ix_aa_curso (idCurso);
-- ALTER TABLE asignacion_academica ADD INDEX ix_aa_asignatura (idAsignatura);

-- ==========================================================================
-- Nota sobre las jornadas
-- --------------------------------------------------------------------------
-- El schema define  jornada ENUM('Mañana','Tarde','Mixta')  y la API valida
-- contra esos tres valores. El frontend actual (programacion.js) usa
-- 'Noche' y 'Única'. Si se quiere admitirlos, ampliar el ENUM:
--
-- ALTER TABLE curso   MODIFY jornada ENUM('Mañana','Tarde','Mixta','Noche','Única') NOT NULL;
-- ALTER TABLE docente MODIFY jornada ENUM('Mañana','Tarde','Mixta','Noche','Única') NOT NULL;
--
-- y añadir esos valores a JORNADAS_VALIDAS en backend/api/_bootstrap.php.
-- ==========================================================================
