-- ============================================================================
-- Migración: tabla de carga horaria de docentes
-- ----------------------------------------------------------------------------
-- Aplica la tabla `carga_docente` (y su mantenimiento automático) sobre una
-- base de datos gestion_notas que ya tiene datos, sin recrear nada.
--
-- Uso desde la consola de XAMPP:
--     mysql -u root gestion_notas < backend/migracion_carga.sql
-- o pegando el contenido en la pestaña SQL de phpMyAdmin.
-- ============================================================================
USE gestion_notas;

-- Se eliminan primero por si la migración se ejecuta más de una vez.
DROP TRIGGER IF EXISTS carga_docente_alta;
DROP TRIGGER IF EXISTS carga_docente_cambio;
DROP TRIGGER IF EXISTS carga_horario_alta;
DROP TRIGGER IF EXISTS carga_horario_cambio;
DROP TRIGGER IF EXISTS carga_horario_baja;
DROP PROCEDURE IF EXISTS recalcular_carga_docente;

CREATE TABLE IF NOT EXISTS carga_docente (
    idDocente INT PRIMARY KEY,
    tope_horas DECIMAL(5,2) NOT NULL,
    minutos_programados INT NOT NULL DEFAULT 0,
    horas_programadas DECIMAL(5,2) AS (minutos_programados / 60) STORED,
    clases_programadas INT NOT NULL DEFAULT 0,
    excede BOOLEAN AS (minutos_programados > tope_horas * 60) STORED,
    actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (idDocente) REFERENCES docente(idDocente) ON DELETE CASCADE
);

DELIMITER $$

CREATE PROCEDURE recalcular_carga_docente(IN p_idDocente INT)
BEGIN
    DECLARE v_tope    DECIMAL(5,2);
    DECLARE v_minutos INT;
    DECLARE v_clases  INT;

    SELECT CASE tipo_contrato
               WHEN 'Medio Tiempo' THEN 20
               ELSE 40
           END
      INTO v_tope
      FROM docente
     WHERE idDocente = p_idDocente;

    IF v_tope IS NOT NULL THEN
        SELECT COALESCE(SUM(TIMESTAMPDIFF(MINUTE, h.hora_inicio, h.hora_fin)), 0),
               COUNT(*)
          INTO v_minutos, v_clases
          FROM horario h
          JOIN asignacion_academica aa ON aa.idAsignacion = h.idAsignacion
         WHERE aa.idDocente = p_idDocente;

        INSERT INTO carga_docente (idDocente, tope_horas, minutos_programados, clases_programadas)
        VALUES (p_idDocente, v_tope, v_minutos, v_clases)
        ON DUPLICATE KEY UPDATE
            tope_horas          = v_tope,
            minutos_programados = v_minutos,
            clases_programadas  = v_clases;
    END IF;
END$$

CREATE TRIGGER carga_docente_alta
AFTER INSERT ON docente FOR EACH ROW
BEGIN
    CALL recalcular_carga_docente(NEW.idDocente);
END$$

CREATE TRIGGER carga_docente_cambio
AFTER UPDATE ON docente FOR EACH ROW
BEGIN
    IF NEW.tipo_contrato <> OLD.tipo_contrato THEN
        CALL recalcular_carga_docente(NEW.idDocente);
    END IF;
END$$

CREATE TRIGGER carga_horario_alta
AFTER INSERT ON horario FOR EACH ROW
BEGIN
    DECLARE v_doc INT;
    SELECT idDocente INTO v_doc FROM asignacion_academica WHERE idAsignacion = NEW.idAsignacion;
    CALL recalcular_carga_docente(v_doc);
END$$

CREATE TRIGGER carga_horario_cambio
AFTER UPDATE ON horario FOR EACH ROW
BEGIN
    DECLARE v_doc_nuevo INT;
    DECLARE v_doc_viejo INT;
    SELECT idDocente INTO v_doc_nuevo FROM asignacion_academica WHERE idAsignacion = NEW.idAsignacion;
    SELECT idDocente INTO v_doc_viejo FROM asignacion_academica WHERE idAsignacion = OLD.idAsignacion;
    CALL recalcular_carga_docente(v_doc_nuevo);
    IF v_doc_viejo <> v_doc_nuevo THEN
        CALL recalcular_carga_docente(v_doc_viejo);
    END IF;
END$$

CREATE TRIGGER carga_horario_baja
AFTER DELETE ON horario FOR EACH ROW
BEGIN
    DECLARE v_doc INT;
    SELECT idDocente INTO v_doc FROM asignacion_academica WHERE idAsignacion = OLD.idAsignacion;
    CALL recalcular_carga_docente(v_doc);
END$$

DELIMITER ;

-- Sincroniza la tabla con lo que ya existe en `horario`.
INSERT INTO carga_docente (idDocente, tope_horas, minutos_programados, clases_programadas)
SELECT d.idDocente,
       CASE d.tipo_contrato WHEN 'Medio Tiempo' THEN 20 ELSE 40 END,
       COALESCE(SUM(TIMESTAMPDIFF(MINUTE, h.hora_inicio, h.hora_fin)), 0),
       COUNT(h.idHorario)
  FROM docente d
  LEFT JOIN asignacion_academica aa ON aa.idDocente = d.idDocente
  LEFT JOIN horario h ON h.idAsignacion = aa.idAsignacion
 GROUP BY d.idDocente, d.tipo_contrato
ON DUPLICATE KEY UPDATE
    tope_horas          = VALUES(tope_horas),
    minutos_programados = VALUES(minutos_programados),
    clases_programadas  = VALUES(clases_programadas);

SELECT idDocente, tope_horas, horas_programadas, clases_programadas, excede
  FROM carga_docente ORDER BY idDocente;
