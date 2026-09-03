create database gestion_notas;
use gestion_notas;

create table estudiante (
	idEstudiante INT AUTO_INCREMENT PRIMARY KEY,
    nombre_Estudiante VARCHAR (50),
    nota_Uno INT,
    nota_Dos INT,
    nota_Tres INT,
    nota_Cuatro INT,
    promedio DECIMAL (10,2),
    resultado_Cualitativo VARCHAR (50)
);

CREATE TABLE curso (
    idCurso INT AUTO_INCREMENT PRIMARY KEY,
    grado VARCHAR(20) NOT NULL,
    curso VARCHAR(20) NOT NULL,
    jornada ENUM('Mañana', 'Tarde', 'Mixta') NOT NULL,
    numero_estudiantes INT NOT NULL
);

-- Tabla: docente
CREATE TABLE docente (
    idDocente INT AUTO_INCREMENT PRIMARY KEY,
    documento VARCHAR(20) UNIQUE NOT NULL,
    nombres VARCHAR(50) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    tipo_contrato ENUM('Tiempo Completo', 'Medio Tiempo') NOT NULL,
    jornada ENUM('Mañana', 'Tarde', 'Mixta') NOT NULL,
    dias_trabajo SET('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado') NOT NULL
);

-- Tabla: asignatura
CREATE TABLE asignatura (
    idAsignatura INT AUTO_INCREMENT PRIMARY KEY,
    nombre_asignatura VARCHAR(100) NOT NULL,
    intensidad_horaria INT NOT NULL
);

-- 3. Creación de tablas transaccionales (Dependientes)

-- Tabla: asignacion_academica (Relaciona Docente, Curso y Asignatura)
CREATE TABLE asignacion_academica (
    idAsignacion INT AUTO_INCREMENT PRIMARY KEY,
    idDocente INT NOT NULL,
    idCurso INT NOT NULL,
    idAsignatura INT NOT NULL,
    FOREIGN KEY (idDocente) REFERENCES docente(idDocente) ON DELETE CASCADE,
    FOREIGN KEY (idCurso) REFERENCES curso(idCurso) ON DELETE CASCADE,
    FOREIGN KEY (idAsignatura) REFERENCES asignatura(idAsignatura) ON DELETE CASCADE
);

-- Tabla: horario (Gestiona la programación temporal de una asignación)
CREATE TABLE horario (
    idHorario INT AUTO_INCREMENT PRIMARY KEY,
    idAsignacion INT NOT NULL,
    dia_semana ENUM('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    FOREIGN KEY (idAsignacion) REFERENCES asignacion_academica(idAsignacion) ON DELETE CASCADE
);