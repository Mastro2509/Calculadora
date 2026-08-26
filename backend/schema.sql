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