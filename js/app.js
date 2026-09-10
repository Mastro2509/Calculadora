document.addEventListener('DOMContentLoaded', () => {
    
    const btnCalcular = document.getElementById('btn-calcular');
    const btnGuardar = document.getElementById('btn-guardar');
    const formNotas = document.getElementById('form-notas');
    const areaResultados = document.getElementById('area-resultados');

    let estudianteActual = null;
    let idEstudianteEnEdicion = null;

    btnCalcular.addEventListener('click', () => {
        
        const nombre = document.getElementById('nombre').value.trim();
        const nota1 = parseFloat(document.getElementById('nota1').value);
        const nota2 = parseFloat(document.getElementById('nota2').value);
        const nota3 = parseFloat(document.getElementById('nota3').value);
        const nota4 = parseFloat(document.getElementById('nota4').value);

        if (nombre === "") {
            alert("El nombre del estudiante es obligatorio.");
            return;
        }

        if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3) || isNaN(nota4)) {
            alert("Todas las notas son obligatorias y deben ser números.");
            return;
        }

        const notas = [nota1, nota2, nota3, nota4];
        const notasInvalidas = notas.some(nota => nota < 0.0 || nota > 5.0);
        
        if (notasInvalidas) {
            alert("Error: Las notas deben estar en un rango de 0.0 a 5.0.");
            return;
        }

        estudianteActual = new Estudiante(nombre, nota1, nota2, nota3, nota4);

        const promedio = estudianteActual.calcularPromedio();
        const estado = estudianteActual.determinarAprobacion();
        const rendimiento = estudianteActual.determinarRendimientoCualitativo();

        document.getElementById('res-promedio').textContent = promedio;
        document.getElementById('res-estado').textContent = estado;
        document.getElementById('res-rendimiento').textContent = rendimiento;

        areaResultados.style.display = 'block';
        btnGuardar.disabled = false;
    });

    btnGuardar.addEventListener('click', () => {
        if (!estudianteActual) {
            alert("Primero debes calcular el promedio antes de guardar.");
            return;
        }

        const urlPeticion = idEstudianteEnEdicion ? 'backend/actualizar.php' : 'backend/guardar.php';
        
        if (idEstudianteEnEdicion) {
            estudianteActual.id = idEstudianteEnEdicion;
        }

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
                
                formNotas.reset();
                areaResultados.style.display = 'none';
                btnGuardar.disabled = true;
                estudianteActual = null;
                
                idEstudianteEnEdicion = null;
                btnGuardar.textContent = "Guardar Registro";

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

    function cargarEstudiantes() {
        fetch('backend/consultar.php')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const tbody = document.getElementById('tabla-estudiantes');
                tbody.innerHTML = '';
                
                data.data.forEach(estudiante => {

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

    cargarEstudiantes();

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
                    cargarEstudiantes();
                } else {
                    alert("Error: " + data.mensaje);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    };

    window.prepararEdicion = function(id, nombre, nota1, nota2, nota3, nota4) {
        document.getElementById('nombre').value = nombre;
        document.getElementById('nota1').value = nota1;
        document.getElementById('nota2').value = nota2;
        document.getElementById('nota3').value = nota3;
        document.getElementById('nota4').value = nota4;
        
        idEstudianteEnEdicion = id;
        
        btnGuardar.textContent = "Actualizar Registro";
        btnGuardar.disabled = false; 
    };
});