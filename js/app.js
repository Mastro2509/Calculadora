// Esperar a que el documento HTML cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Capturar los elementos del DOM (HTML)
    const btnCalcular = document.getElementById('btn-calcular');
    const btnGuardar = document.getElementById('btn-guardar');
    const formNotas = document.getElementById('form-notas');
    const areaResultados = document.getElementById('area-resultados');

    // Variable global para almacenar temporalmente el estudiante actual
    let estudianteActual = null;

    // 2. Evento para el botón "Calcular Promedio"
    btnCalcular.addEventListener('click', () => {
        
        // Capturar valores
        const nombre = document.getElementById('nombre').value.trim();
        const nota1 = parseFloat(document.getElementById('nota1').value);
        const nota2 = parseFloat(document.getElementById('nota2').value);
        const nota3 = parseFloat(document.getElementById('nota3').value);
        const nota4 = parseFloat(document.getElementById('nota4').value);

        // 3. Validaciones Obligatorias
        // Validar que el nombre sea obligatorio
        if (nombre === "") {
            alert("El nombre del estudiante es obligatorio.");
            return;
        }

        // Validar que las cuatro notas sean obligatorias y numéricas
        if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3) || isNaN(nota4)) {
            alert("Todas las notas son obligatorias y deben ser números.");
            return;
        }

        // Validar que ninguna nota sea inferior a 0.0 o superior a 5.0
        const notas = [nota1, nota2, nota3, nota4];
        const notasInvalidas = notas.some(nota => nota < 0.0 || nota > 5.0);
        
        if (notasInvalidas) {
            alert("Error: Las notas deben estar en un rango de 0.0 a 5.0.");
            return;
        }

        // 4. Implementación de POO: Instanciar la clase Estudiante
        estudianteActual = new Estudiante(nombre, nota1, nota2, nota3, nota4);

        // Ejecutar los métodos de la clase[cite: 1]
        const promedio = estudianteActual.calcularPromedio();
        const estado = estudianteActual.determinarAprobacion();
        const rendimiento = estudianteActual.determinarRendimientoCualitativo();

        // 5. Presentación del resultado en pantalla[cite: 1]
        document.getElementById('res-promedio').textContent = promedio;
        document.getElementById('res-estado').textContent = estado;
        document.getElementById('res-rendimiento').textContent = rendimiento;

        // Mostrar la tarjeta de resultados y habilitar el botón de guardar
        areaResultados.style.display = 'block';
        btnGuardar.disabled = false;
    });

    // 6. Evento para el botón "Guardar Registro" (Preparación para BD)
    btnGuardar.addEventListener('click', () => {
        if (!estudianteActual) {
            alert("Primero debes calcular el promedio antes de guardar.");
            return;
        }

        // Aquí enviaremos los datos al backend (PHP, Node, Java, etc.)
        console.log("Datos listos para enviar a la Base de Datos:", estudianteActual);
        
        alert(`¡Registro de ${estudianteActual.nombre} preparado para guardar!`);
        
        // Limpiar el formulario para un nuevo registro
        formNotas.reset();
        areaResultados.style.display = 'none';
        btnGuardar.disabled = true;
        estudianteActual = null;
    });
});