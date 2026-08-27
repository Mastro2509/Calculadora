// Esperar a que el documento HTML cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Capturar los elementos del DOM (HTML)
    const btnCalcular = document.getElementById('btn-calcular');
    const btnGuardar = document.getElementById('btn-guardar');
    const formNotas = document.getElementById('form-notas');
    const areaResultados = document.getElementById('area-resultados');

    // Variable global para almacenar temporalmente el estudiante actual
    let estudianteActual = null;
    let idEstudianteEnEdicion = null; // null significa que estamos creando uno nuevo

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

    // 6. Evento para el botón "Guardar Registro" (Conectado a PHP)
    btnGuardar.addEventListener('click', () => {
        if (!estudianteActual) {
            alert("Primero debes calcular el promedio antes de guardar.");
            return;
        }

        // 1. Determinar a qué archivo PHP enviamos la petición
        const urlPeticion = idEstudianteEnEdicion ? 'backend/actualizar.php' : 'backend/guardar.php';
        
        // 2. Si estamos editando, le agregamos el ID al objeto antes de enviarlo
        if (idEstudianteEnEdicion) {
            estudianteActual.id = idEstudianteEnEdicion;
        }

        // Configurar la petición al backend con la URL dinámica
        fetch(urlPeticion, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(estudianteActual)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(`¡Éxito! ${data.mensaje}`);
                
                // Limpiar el formulario
                formNotas.reset();
                areaResultados.style.display = 'none';
                btnGuardar.disabled = true;
                estudianteActual = null;
                
                // 3. Resetear el modo de edición para que el próximo sea uno nuevo
                idEstudianteEnEdicion = null;
                btnGuardar.textContent = "Guardar Registro"; // O el texto original que tenía tu botón
                
                // 4. Recargar la tabla automáticamente
                cargarEstudiantes(); 
            } else {
                alert(`Hubo un problema: ${data.mensaje}`);
            }
        })
        .catch(error => {
            console.error("Error en la petición:", error);
            alert("Error al intentar conectar con el servidor.");
        });
    });

    // Función para consultar y renderizar los estudiantes
    function cargarEstudiantes() {
        fetch('backend/consultar.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const tbody = document.getElementById('tabla-estudiantes');
                tbody.innerHTML = ''; // Limpiar la tabla antes de volver a llenarla
                
                data.data.forEach(estudiante => {
                    // Crear una nueva fila por cada estudiante
                    const fila = document.createElement('tr');
                    
                    fila.innerHTML = `
                        <td>${estudiante.nombre_Estudiante}</td>
                        <td>${estudiante.nota_Uno}</td>
                        <td>${estudiante.nota_Dos}</td>
                        <td>${estudiante.nota_Tres}</td>
                        <td>${estudiante.nota_Cuatro}</td>
                        <td>${estudiante.promedio}</td>
                        <td>${estudiante.resultado_Cualitativo}</td>
                        <td>
                            <button onclick="prepararEdicion(${estudiante.idEstudiante}, '${estudiante.nombre_Estudiante}', ${estudiante.nota_Uno}, ${estudiante.nota_Dos}, ${estudiante.nota_Tres}, ${estudiante.nota_Cuatro})">Modificar</button>
                            <button onclick="eliminarEstudiante(${estudiante.idEstudiante})">Eliminar</button>
                        </td>
                    `;
                    tbody.appendChild(fila);
                });
            } else {
                console.error("Error desde PHP:", data.mensaje);
            }
        })
        .catch(error => console.error("Error en la petición fetch:", error));
    }

    // Llamar a la función apenas cargue el script para mostrar los datos existentes
    cargarEstudiantes();

    // Función para eliminar un estudiante
    window.eliminarEstudiante = function(id) {
        if (confirm("¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.")) {
            fetch('backend/eliminar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id }) 
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.mensaje);
                    cargarEstudiantes(); // Recargar la tabla automáticamente
                } else {
                    alert("Error: " + data.mensaje);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    };

    // Función para cargar los datos en el formulario
    window.prepararEdicion = function(id, nombre, nota1, nota2, nota3, nota4) {
        document.getElementById('nombre').value = nombre;
        document.getElementById('nota1').value = nota1;
        document.getElementById('nota2').value = nota2;
        document.getElementById('nota3').value = nota3;
        document.getElementById('nota4').value = nota4;
        
        idEstudianteEnEdicion = id;
        
        // Suponiendo que tu botón tiene el ID 'btnGuardar' o la variable btnGuardar
        btnGuardar.textContent = "Actualizar Registro";
        btnGuardar.disabled = false; 
    };
});