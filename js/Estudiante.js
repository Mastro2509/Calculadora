class Estudiante {
    constructor(nombre, nota1, nota2, nota3, nota4) {
        this.nombre = nombre;
        this.nota1 = parseFloat(nota1);
        this.nota2 = parseFloat(nota2);
        this.nota3 = parseFloat(nota3);
        this.nota4 = parseFloat(nota4);
        this.promedio = 0.0;
        this.resultadoCualitativo = "";
    }

    calcularPromedio() {
        const suma = this.nota1 + this.nota2 + this.nota3 + this.nota4;
        this.promedio = suma / 4;

        return parseFloat(this.promedio.toFixed(1));
    }

    determinarAprobacion() {

        return this.promedio >= 3.0 ? "Aprobado" : "Reprobado";
    }

    determinarRendimientoCualitativo() {
        if (this.promedio >= 0.0 && this.promedio <= 2.9) {
            this.resultadoCualitativo = "Rendimiento insuficiente";
        } else if (this.promedio >= 3.0 && this.promedio <= 3.9) {
            this.resultadoCualitativo = "Aprobado";
        } else if (this.promedio >= 4.0 && this.promedio <= 4.5) {
            this.resultadoCualitativo = "Aprobado con sobresaliente";
        } else if (this.promedio >= 4.6 && this.promedio <= 5.0) {
            this.resultadoCualitativo = "Aprobado con excelente";
        }
        
        return this.resultadoCualitativo;
    }
}