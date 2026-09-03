/* ==========================================================================
   Programación Académica - Lógica de la interfaz
   --------------------------------------------------------------------------
   Los datos se guardan en localStorage para que la interfaz sea funcional
   sin necesidad de montar el backend. La estructura de cada entidad coincide
   con el modelo entidad-relación de la guía, de modo que más adelante se
   pueda reemplazar el almacenamiento local por llamadas a la API REST/PHP.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. Capa de datos (localStorage)
    // ----------------------------------------------------------------------
    const STORAGE_KEY = 'programacion_academica';

    const db = cargarDB();

    function cargarDB() {
        const base = { cursos: [], docentes: [], asignaturas: [], horarios: [], seq: 1 };
        try {
            const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return guardado && typeof guardado === 'object' ? Object.assign(base, guardado) : base;
        } catch (e) {
            return base;
        }
    }

    function guardarDB() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }

    function nuevoId() {
        return db.seq++;
    }

    // Utilidades -----------------------------------------------------------
    const $ = (id) => document.getElementById(id);

    function escapeHTML(texto) {
        return String(texto == null ? '' : texto)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function badgeJornada(jornada) {
        const clases = {
            'Mañana': 'badge-manana',
            'Tarde': 'badge-tarde',
            'Noche': 'badge-noche',
            'Única': 'badge-unica'
        };
        return `<span class="badge ${clases[jornada] || ''}">${escapeHTML(jornada)}</span>`;
    }

    function filaVacia(colspan, texto) {
        return `<tr class="empty-row"><td colspan="${colspan}">${texto}</td></tr>`;
    }

    // Búsquedas auxiliares ----------------------------------------------
    const buscarCurso = (id) => db.cursos.find(c => c.id === id);
    const buscarDocente = (id) => db.docentes.find(d => d.id === id);
    const buscarAsignatura = (id) => db.asignaturas.find(a => a.id === id);

    // ----------------------------------------------------------------------
    // 2. Navegación por pestañas
    // ----------------------------------------------------------------------
    $('nav-tabs').addEventListener('click', (e) => {
        const boton = e.target.closest('.nav-tab');
        if (!boton) return;

        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

        boton.classList.add('active');
        $(boton.dataset.panel).classList.add('active');

        if (boton.dataset.panel === 'panel-dashboard') renderDashboard();
        if (boton.dataset.panel === 'panel-consultas') actualizarValoresConsulta();
        if (boton.dataset.panel === 'panel-horarios') renderCalendario();
    });

    // ----------------------------------------------------------------------
    // 3. CRUD Cursos
    // ----------------------------------------------------------------------
    const formCurso = $('form-curso');

    formCurso.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('curso-id').value;
        const datos = {
            grado: $('curso-grado').value.trim(),
            curso: $('curso-nombre').value.trim(),
            jornada: $('curso-jornada').value,
            numEstudiantes: parseInt($('curso-estudiantes').value, 10) || 0
        };

        if (!datos.grado || !datos.curso || !datos.jornada) {
            alert('Complete grado, curso y jornada.');
            return;
        }

        if (id) {
            Object.assign(buscarCurso(parseInt(id, 10)), datos);
        } else {
            db.cursos.push(Object.assign({ id: nuevoId() }, datos));
        }

        guardarDB();
        resetFormCurso();
        renderCursos();
    });

    $('btn-cancelar-curso').addEventListener('click', resetFormCurso);

    function resetFormCurso() {
        formCurso.reset();
        $('curso-id').value = '';
        $('titulo-form-curso').textContent = 'Registrar Curso';
        $('btn-guardar-curso').textContent = 'Guardar Curso';
        $('btn-cancelar-curso').style.display = 'none';
    }

    function editarCurso(id) {
        const c = buscarCurso(id);
        if (!c) return;
        $('curso-id').value = c.id;
        $('curso-grado').value = c.grado;
        $('curso-nombre').value = c.curso;
        $('curso-jornada').value = c.jornada;
        $('curso-estudiantes').value = c.numEstudiantes;
        $('titulo-form-curso').textContent = 'Editar Curso';
        $('btn-guardar-curso').textContent = 'Actualizar Curso';
        $('btn-cancelar-curso').style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function eliminarCurso(id) {
        const usados = db.horarios.some(h => h.cursoId === id);
        if (usados && !confirm('Este curso tiene clases programadas que también se eliminarán. ¿Continuar?')) return;
        if (!usados && !confirm('¿Eliminar este curso?')) return;
        db.cursos = db.cursos.filter(c => c.id !== id);
        db.horarios = db.horarios.filter(h => h.cursoId !== id);
        guardarDB();
        renderCursos();
    }

    function renderCursos() {
        const tbody = $('tabla-cursos');
        if (db.cursos.length === 0) {
            tbody.innerHTML = filaVacia(5, 'No hay cursos registrados.');
        } else {
            tbody.innerHTML = db.cursos.map(c => `
                <tr>
                    <td>${escapeHTML(c.grado)}</td>
                    <td>${escapeHTML(c.curso)}</td>
                    <td>${badgeJornada(c.jornada)}</td>
                    <td>${c.numEstudiantes}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-accion="editar-curso" data-id="${c.id}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-accion="eliminar-curso" data-id="${c.id}">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        }
        refrescarSelectsHorario();
    }

    // ----------------------------------------------------------------------
    // 4. CRUD Asignaturas
    // ----------------------------------------------------------------------
    const formAsignatura = $('form-asignatura');

    formAsignatura.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('asignatura-id').value;
        const datos = {
            nombre: $('asignatura-nombre').value.trim(),
            intensidadHoraria: parseInt($('asignatura-intensidad').value, 10) || 0
        };
        if (!datos.nombre || datos.intensidadHoraria <= 0) {
            alert('Ingrese nombre e intensidad horaria válida.');
            return;
        }

        if (id) {
            Object.assign(buscarAsignatura(parseInt(id, 10)), datos);
        } else {
            db.asignaturas.push(Object.assign({ id: nuevoId() }, datos));
        }

        guardarDB();
        resetFormAsignatura();
        renderAsignaturas();
    });

    $('btn-cancelar-asignatura').addEventListener('click', resetFormAsignatura);

    function resetFormAsignatura() {
        formAsignatura.reset();
        $('asignatura-id').value = '';
        $('titulo-form-asignatura').textContent = 'Registrar Asignatura';
        $('btn-guardar-asignatura').textContent = 'Guardar Asignatura';
        $('btn-cancelar-asignatura').style.display = 'none';
    }

    function editarAsignatura(id) {
        const a = buscarAsignatura(id);
        if (!a) return;
        $('asignatura-id').value = a.id;
        $('asignatura-nombre').value = a.nombre;
        $('asignatura-intensidad').value = a.intensidadHoraria;
        $('titulo-form-asignatura').textContent = 'Editar Asignatura';
        $('btn-guardar-asignatura').textContent = 'Actualizar Asignatura';
        $('btn-cancelar-asignatura').style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function eliminarAsignatura(id) {
        const usada = db.horarios.some(h => h.asignaturaId === id);
        if (usada && !confirm('Esta asignatura tiene clases programadas que también se eliminarán. ¿Continuar?')) return;
        if (!usada && !confirm('¿Eliminar esta asignatura?')) return;
        db.asignaturas = db.asignaturas.filter(a => a.id !== id);
        db.horarios = db.horarios.filter(h => h.asignaturaId !== id);
        db.docentes.forEach(d => { d.asignaturas = (d.asignaturas || []).filter(x => x !== id); });
        guardarDB();
        renderAsignaturas();
        renderDocentes();
    }

    function renderAsignaturas() {
        const tbody = $('tabla-asignaturas');
        if (db.asignaturas.length === 0) {
            tbody.innerHTML = filaVacia(3, 'No hay asignaturas registradas.');
        } else {
            tbody.innerHTML = db.asignaturas.map(a => `
                <tr>
                    <td>${escapeHTML(a.nombre)}</td>
                    <td>${a.intensidadHoraria} h/semana</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-accion="editar-asignatura" data-id="${a.id}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-accion="eliminar-asignatura" data-id="${a.id}">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        }
        renderCheckboxesAsignaturas();
        refrescarSelectsHorario();
    }

    // ----------------------------------------------------------------------
    // 5. CRUD Docentes
    // ----------------------------------------------------------------------
    const formDocente = $('form-docente');

    function renderCheckboxesAsignaturas(seleccionadas) {
        const cont = $('docente-asignaturas');
        const sel = seleccionadas || [];
        if (db.asignaturas.length === 0) {
            cont.innerHTML = '<span class="stat-label">Primero registre asignaturas.</span>';
            return;
        }
        cont.innerHTML = db.asignaturas.map(a => `
            <label>
                <input type="checkbox" value="${a.id}" ${sel.includes(a.id) ? 'checked' : ''}>
                ${escapeHTML(a.nombre)}
            </label>
        `).join('');
    }

    formDocente.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('docente-id').value;
        const asignaturas = Array.from($('docente-asignaturas').querySelectorAll('input:checked'))
            .map(i => parseInt(i.value, 10));
        const datos = {
            nombre: $('docente-nombre').value.trim(),
            documento: $('docente-documento').value.trim(),
            email: $('docente-email').value.trim(),
            telefono: $('docente-telefono').value.trim(),
            asignaturas: asignaturas,
            disponibilidad: $('docente-disponibilidad').value.trim()
        };
        if (!datos.nombre || !datos.documento) {
            alert('Ingrese al menos nombre y documento del docente.');
            return;
        }

        if (id) {
            Object.assign(buscarDocente(parseInt(id, 10)), datos);
        } else {
            db.docentes.push(Object.assign({ id: nuevoId() }, datos));
        }

        guardarDB();
        resetFormDocente();
        renderDocentes();
    });

    $('btn-cancelar-docente').addEventListener('click', resetFormDocente);

    function resetFormDocente() {
        formDocente.reset();
        $('docente-id').value = '';
        renderCheckboxesAsignaturas();
        $('titulo-form-docente').textContent = 'Registrar Docente';
        $('btn-guardar-docente').textContent = 'Guardar Docente';
        $('btn-cancelar-docente').style.display = 'none';
    }

    function editarDocente(id) {
        const d = buscarDocente(id);
        if (!d) return;
        $('docente-id').value = d.id;
        $('docente-nombre').value = d.nombre;
        $('docente-documento').value = d.documento;
        $('docente-email').value = d.email || '';
        $('docente-telefono').value = d.telefono || '';
        $('docente-disponibilidad').value = d.disponibilidad || '';
        renderCheckboxesAsignaturas(d.asignaturas || []);
        $('titulo-form-docente').textContent = 'Editar Docente';
        $('btn-guardar-docente').textContent = 'Actualizar Docente';
        $('btn-cancelar-docente').style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function eliminarDocente(id) {
        const usado = db.horarios.some(h => h.docenteId === id);
        if (usado && !confirm('Este docente tiene clases programadas que también se eliminarán. ¿Continuar?')) return;
        if (!usado && !confirm('¿Eliminar este docente?')) return;
        db.docentes = db.docentes.filter(d => d.id !== id);
        db.horarios = db.horarios.filter(h => h.docenteId !== id);
        guardarDB();
        renderDocentes();
    }

    function nombresAsignaturas(ids) {
        return (ids || []).map(i => {
            const a = buscarAsignatura(i);
            return a ? escapeHTML(a.nombre) : '';
        }).filter(Boolean).join(', ') || '<span class="stat-label">—</span>';
    }

    function renderDocentes() {
        const tbody = $('tabla-docentes');
        if (db.docentes.length === 0) {
            tbody.innerHTML = filaVacia(6, 'No hay docentes registrados.');
        } else {
            tbody.innerHTML = db.docentes.map(d => `
                <tr>
                    <td>${escapeHTML(d.nombre)}</td>
                    <td>${escapeHTML(d.documento)}</td>
                    <td>${escapeHTML(d.email || '')}<br>${escapeHTML(d.telefono || '')}</td>
                    <td>${nombresAsignaturas(d.asignaturas)}</td>
                    <td>${escapeHTML(d.disponibilidad || '') || '<span class="stat-label">—</span>'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-accion="editar-docente" data-id="${d.id}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-accion="eliminar-docente" data-id="${d.id}">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        }
        refrescarSelectsHorario();
    }

    // ----------------------------------------------------------------------
    // 6. CRUD Horarios + detección de conflictos
    // ----------------------------------------------------------------------
    const formHorario = $('form-horario');

    function opcionesSelect(lista, textoFn, placeholder) {
        return `<option value="">${placeholder}</option>` +
            lista.map(item => `<option value="${item.id}">${escapeHTML(textoFn(item))}</option>`).join('');
    }

    function refrescarSelectsHorario() {
        const selCurso = $('horario-curso');
        const selAsig = $('horario-asignatura');
        const selDoc = $('horario-docente');
        if (!selCurso) return;

        const vc = selCurso.value, va = selAsig.value, vd = selDoc.value;
        selCurso.innerHTML = opcionesSelect(db.cursos, c => `${c.curso} (${c.jornada})`, 'Seleccione curso...');
        selAsig.innerHTML = opcionesSelect(db.asignaturas, a => a.nombre, 'Seleccione asignatura...');
        selDoc.innerHTML = opcionesSelect(db.docentes, d => d.nombre, 'Seleccione docente...');
        selCurso.value = vc; selAsig.value = va; selDoc.value = vd;
    }

    // Dos rangos [i1,f1) y [i2,f2) se solapan si i1 < f2 && i2 < f1
    function seSolapan(i1, f1, i2, f2) {
        return i1 < f2 && i2 < f1;
    }

    // Devuelve la lista de horarios que chocan con el horario dado
    function conflictosDe(h, ignorarId) {
        return db.horarios.filter(o => {
            if (o.id === ignorarId) return false;
            if (o.dia !== h.dia) return false;
            if (!seSolapan(h.horaInicio, h.horaFin, o.horaInicio, o.horaFin)) return false;
            return o.docenteId === h.docenteId || o.cursoId === h.cursoId;
        });
    }

    formHorario.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = $('horario-id').value;
        const h = {
            cursoId: parseInt($('horario-curso').value, 10),
            asignaturaId: parseInt($('horario-asignatura').value, 10),
            docenteId: parseInt($('horario-docente').value, 10),
            dia: $('horario-dia').value,
            horaInicio: $('horario-inicio').value,
            horaFin: $('horario-fin').value
        };
        const msg = $('mensaje-horario');
        msg.innerHTML = '';

        if (!h.cursoId || !h.asignaturaId || !h.docenteId || !h.dia || !h.horaInicio || !h.horaFin) {
            msg.innerHTML = '<div class="alert alert-danger">Complete todos los campos.</div>';
            return;
        }
        if (h.horaInicio >= h.horaFin) {
            msg.innerHTML = '<div class="alert alert-danger">La hora de inicio debe ser anterior a la hora de fin.</div>';
            return;
        }

        const choques = conflictosDe(h, id ? parseInt(id, 10) : null);
        if (choques.length > 0) {
            const detalle = choques.map(c => {
                const tipo = c.docenteId === h.docenteId ? 'el docente' : 'el curso';
                return `${tipo} ya tiene clase el ${c.dia} de ${c.horaInicio} a ${c.horaFin}`;
            }).join('; ');
            if (!confirm(`Conflicto detectado: ${detalle}.\n\n¿Desea programarla de todos modos?`)) return;
        }

        if (id) {
            Object.assign(db.horarios.find(x => x.id === parseInt(id, 10)), h);
        } else {
            db.horarios.push(Object.assign({ id: nuevoId() }, h));
        }

        guardarDB();
        resetFormHorario();
        renderHorarios();
    });

    $('btn-cancelar-horario').addEventListener('click', resetFormHorario);

    function resetFormHorario() {
        formHorario.reset();
        $('horario-id').value = '';
        $('mensaje-horario').innerHTML = '';
        $('titulo-form-horario').textContent = 'Programar Clase';
        $('btn-guardar-horario').textContent = 'Programar Clase';
        $('btn-cancelar-horario').style.display = 'none';
    }

    function editarHorario(id) {
        const h = db.horarios.find(x => x.id === id);
        if (!h) return;
        refrescarSelectsHorario();
        $('horario-id').value = h.id;
        $('horario-curso').value = h.cursoId;
        $('horario-asignatura').value = h.asignaturaId;
        $('horario-docente').value = h.docenteId;
        $('horario-dia').value = h.dia;
        $('horario-inicio').value = h.horaInicio;
        $('horario-fin').value = h.horaFin;
        $('titulo-form-horario').textContent = 'Editar Clase';
        $('btn-guardar-horario').textContent = 'Actualizar Clase';
        $('btn-cancelar-horario').style.display = 'inline-block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function eliminarHorario(id) {
        if (!confirm('¿Eliminar esta clase programada?')) return;
        db.horarios = db.horarios.filter(h => h.id !== id);
        guardarDB();
        renderHorarios();
    }

    function renderHorarios() {
        const tbody = $('tabla-horarios');
        if (db.horarios.length === 0) {
            tbody.innerHTML = filaVacia(7, 'No hay clases programadas.');
        } else {
            tbody.innerHTML = db.horarios.map(h => {
                const curso = buscarCurso(h.cursoId);
                const asig = buscarAsignatura(h.asignaturaId);
                const doc = buscarDocente(h.docenteId);
                const enConflicto = conflictosDe(h, h.id).length > 0;
                return `
                <tr class="${enConflicto ? 'row-conflict' : ''}">
                    <td>${curso ? escapeHTML(curso.curso) : '—'}</td>
                    <td>${asig ? escapeHTML(asig.nombre) : '—'}</td>
                    <td>${doc ? escapeHTML(doc.nombre) : '—'}</td>
                    <td>${escapeHTML(h.dia)}</td>
                    <td>${h.horaInicio} - ${h.horaFin}</td>
                    <td>${enConflicto
                        ? '<span class="badge badge-tarde">Conflicto</span>'
                        : '<span class="badge badge-unica">OK</span>'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-accion="editar-horario" data-id="${h.id}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-accion="eliminar-horario" data-id="${h.id}">Eliminar</button>
                    </td>
                </tr>`;
            }).join('');
        }
        renderDashboard();
        renderCalendario();
    }

    // ----------------------------------------------------------------------
    // 6b. Calendario tipo Google Calendar (vista de Horarios)
    // --------------------------------------------------------------------------
    // Los horarios son recurrentes por día de la semana. La navegación usa
    // fechas reales (mes / semana / día) y cada clase se proyecta sobre el
    // día de la semana que le corresponde.
    // ----------------------------------------------------------------------
    const HORA_PX = 48;
    const DIAS_JS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const MESES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const PALETA_CAL = ['#0056b3', '#2e7d32', '#c62828', '#6a1b9a',
        '#00838f', '#ef6c00', '#4527a0', '#ad1457'];

    const calState = {
        vista: localStorage.getItem('cal_vista') || 'semana',
        ancla: new Date()
    };
    calState.ancla.setHours(0, 0, 0, 0);

    function minutos(hhmm) {
        const partes = String(hhmm).split(':');
        return (parseInt(partes[0], 10) * 60) + (parseInt(partes[1], 10) || 0);
    }
    function pad2(n) { return String(n).padStart(2, '0'); }
    function isoFecha(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
    function mismaFecha(a, b) {
        return a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    function sumarDias(fecha, n) {
        const d = new Date(fecha);
        d.setDate(d.getDate() + n);
        return d;
    }
    function lunesDe(fecha) {
        const d = new Date(fecha);
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
        d.setHours(0, 0, 0, 0);
        return d;
    }
    function colorAsignatura(id) { return PALETA_CAL[Math.abs(id) % PALETA_CAL.length]; }
    function capitalizar(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

    // Clases recurrentes que aplican a una fecha concreta
    function clasesDeFecha(fecha) {
        const nombreDia = DIAS_JS[fecha.getDay()];
        return db.horarios
            .filter(h => h.dia === nombreDia)
            .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    }

    // Rango de horas visible en las vistas semana / día
    function rangoHoras() {
        let ini = 6 * 60, fin = 20 * 60;
        db.horarios.forEach(h => {
            ini = Math.min(ini, minutos(h.horaInicio));
            fin = Math.max(fin, minutos(h.horaFin));
        });
        ini = Math.floor(ini / 60) * 60;
        fin = Math.ceil(fin / 60) * 60;
        if (fin <= ini) fin = ini + 60;
        return { ini, fin };
    }

    // Reparte en columnas los eventos que se solapan dentro de un mismo día
    function empaquetarEventos(items) {
        let grupo = [];
        let finGrupo = -1;
        const cerrarGrupo = () => {
            const columnas = [];
            grupo.forEach(it => {
                let idx = columnas.findIndex(finCol => finCol <= it.ini);
                if (idx === -1) { idx = columnas.length; columnas.push(it.fin); }
                else columnas[idx] = it.fin;
                it.col = idx;
            });
            grupo.forEach(it => { it.totalCols = columnas.length; });
            grupo = [];
        };
        items.forEach(it => {
            if (grupo.length && it.ini >= finGrupo) cerrarGrupo();
            grupo.push(it);
            finGrupo = grupo.length === 1 ? it.fin : Math.max(finGrupo, it.fin);
        });
        if (grupo.length) cerrarGrupo();
        return items;
    }

    function eventoHTML(it, offsetIni) {
        const h = it.h;
        const curso = buscarCurso(h.cursoId);
        const asig = buscarAsignatura(h.asignaturaId);
        const doc = buscarDocente(h.docenteId);
        const top = ((it.ini - offsetIni) / 60) * HORA_PX;
        const alto = Math.max(((it.fin - it.ini) / 60) * HORA_PX - 2, 16);
        const ancho = 100 / it.totalCols;
        const izq = it.col * ancho;
        const conflicto = conflictosDe(h, h.id).length > 0;
        return `<div class="cal-evento ${conflicto ? 'conflicto' : ''}"
            style="top:${top}px;height:${alto}px;left:${izq}%;width:${ancho}%;background:${colorAsignatura(h.asignaturaId)}"
            data-id="${h.id}"
            title="${escapeHTML((asig || {}).nombre || '')} · ${escapeHTML((curso || {}).curso || '')} · ${escapeHTML((doc || {}).nombre || '')} (${h.horaInicio}-${h.horaFin})">
            <strong>${h.horaInicio}–${h.horaFin}</strong>
            <div>${escapeHTML((asig || {}).nombre || '—')}</div>
            <div class="ev-sub">${escapeHTML((curso || {}).curso || '—')} · ${escapeHTML((doc || {}).nombre || '—')}</div>
        </div>`;
    }

    function renderColumnaDia(fecha, ini, fin) {
        const nLineas = Math.round((fin - ini) / 60);
        let lineas = '';
        for (let i = 0; i <= nLineas; i++) {
            lineas += `<div class="cal-hline" style="top:${i * HORA_PX}px"></div>`;
        }
        const items = clasesDeFecha(fecha).map(h => ({
            h, ini: minutos(h.horaInicio), fin: minutos(h.horaFin)
        }));
        empaquetarEventos(items);
        const eventos = items.map(it => eventoHTML(it, ini)).join('');
        return `<div class="cal-col" data-fecha="${isoFecha(fecha)}">${lineas}${eventos}</div>`;
    }

    function renderSemanaODia(dias) {
        const { ini, fin } = rangoHoras();
        const altura = ((fin - ini) / 60) * HORA_PX;
        const hoy = new Date();

        const cabecera = dias.map(f => `
            <div class="cal-dia-cab ${mismaFecha(f, hoy) ? 'hoy' : ''}" data-fecha="${isoFecha(f)}" data-ir-dia="1">
                ${DIAS_CORTO[f.getDay()]}<span class="num">${f.getDate()}</span>
            </div>`).join('');

        let etiquetas = '';
        for (let m = ini, i = 0; m <= fin; m += 60, i++) {
            etiquetas += `<div class="cal-hlbl" style="top:${(i * HORA_PX) - 6}px">${pad2(m / 60)}:00</div>`;
        }

        const columnas = dias.map(f => renderColumnaDia(f, ini, fin)).join('');

        return `
        <div class="cal-semana">
            <div class="cal-cabecera">
                <div class="cal-esquina"></div>
                ${cabecera}
            </div>
            <div class="cal-cuerpo">
                <div class="cal-gutter" style="height:${altura}px">${etiquetas}</div>
                <div class="cal-dias" style="height:${altura}px">${columnas}</div>
            </div>
        </div>`;
    }

    function renderMes() {
        const ancla = calState.ancla;
        const inicioRejilla = lunesDe(new Date(ancla.getFullYear(), ancla.getMonth(), 1));
        const hoy = new Date();
        const mesActual = ancla.getMonth();

        let celdas = '';
        for (let i = 0; i < 42; i++) {
            const f = sumarDias(inicioRejilla, i);
            const clases = clasesDeFecha(f);
            const chips = clases.slice(0, 3).map(h => {
                const asig = buscarAsignatura(h.asignaturaId);
                const curso = buscarCurso(h.cursoId);
                return `<div class="cal-chip" data-id="${h.id}" style="background:${colorAsignatura(h.asignaturaId)}"
                    title="${escapeHTML((asig || {}).nombre || '')} · ${escapeHTML((curso || {}).curso || '')}">
                    ${h.horaInicio} ${escapeHTML((asig || {}).nombre || '—')}</div>`;
            }).join('');
            const mas = clases.length > 3 ? `<div class="cal-mes-mas">+${clases.length - 3} más</div>` : '';
            celdas += `<div class="cal-mes-dia ${f.getMonth() !== mesActual ? 'otro-mes' : ''} ${mismaFecha(f, hoy) ? 'hoy' : ''}"
                data-fecha="${isoFecha(f)}" data-ir-dia="1">
                <div class="cal-mes-num">${f.getDate()}</div>${chips}${mas}
            </div>`;
        }

        const cabecera = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
            .map(d => `<div class="cal-mes-cab">${d}</div>`).join('');

        return `<div class="cal-mes">${cabecera}${celdas}</div>`;
    }

    function tituloCalendario() {
        const a = calState.ancla;
        if (calState.vista === 'mes') {
            return capitalizar(`${MESES[a.getMonth()]} de ${a.getFullYear()}`);
        }
        if (calState.vista === 'dia') {
            return capitalizar(a.toLocaleDateString('es-ES', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            }));
        }
        const lun = lunesDe(a);
        const dom = sumarDias(lun, 6);
        return `${lun.getDate()} ${MESES_CORTO[lun.getMonth()]} – ` +
            `${dom.getDate()} ${MESES_CORTO[dom.getMonth()]} ${dom.getFullYear()}`;
    }

    function renderCalendario() {
        const cont = $('cal-contenedor');
        if (!cont) return;

        document.querySelectorAll('.cal-view-btn').forEach(b =>
            b.classList.toggle('active', b.dataset.vista === calState.vista));
        $('cal-titulo').textContent = tituloCalendario();

        if (calState.vista === 'mes') {
            cont.innerHTML = renderMes();
        } else if (calState.vista === 'dia') {
            cont.innerHTML = renderSemanaODia([new Date(calState.ancla)]);
        } else {
            const lun = lunesDe(calState.ancla);
            const semana = [];
            for (let i = 0; i < 7; i++) semana.push(sumarDias(lun, i));
            cont.innerHTML = renderSemanaODia(semana);
        }
    }

    function navegarCalendario(dir) {
        const a = calState.ancla;
        if (calState.vista === 'mes') a.setMonth(a.getMonth() + dir);
        else if (calState.vista === 'dia') a.setDate(a.getDate() + dir);
        else a.setDate(a.getDate() + (dir * 7));
        renderCalendario();
    }

    function initCalendario() {
        if (!$('cal-prev')) return;
        $('cal-prev').addEventListener('click', () => navegarCalendario(-1));
        $('cal-next').addEventListener('click', () => navegarCalendario(1));
        $('cal-hoy').addEventListener('click', () => {
            calState.ancla = new Date();
            calState.ancla.setHours(0, 0, 0, 0);
            renderCalendario();
        });
        document.querySelectorAll('.cal-view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                calState.vista = btn.dataset.vista;
                localStorage.setItem('cal_vista', calState.vista);
                renderCalendario();
            });
        });
        $('cal-contenedor').addEventListener('click', (e) => {
            const evento = e.target.closest('[data-id]');
            if (evento) {
                editarHorario(parseInt(evento.dataset.id, 10));
                return;
            }
            const celda = e.target.closest('[data-ir-dia]');
            if (celda && celda.dataset.fecha) {
                const p = celda.dataset.fecha.split('-');
                calState.ancla = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
                calState.vista = 'dia';
                localStorage.setItem('cal_vista', 'dia');
                renderCalendario();
            }
        });
    }

    // ----------------------------------------------------------------------
    // 7. Dashboard
    // ----------------------------------------------------------------------
    function listarConflictos() {
        const pares = [];
        for (let i = 0; i < db.horarios.length; i++) {
            for (let j = i + 1; j < db.horarios.length; j++) {
                const a = db.horarios[i], b = db.horarios[j];
                if (a.dia === b.dia &&
                    seSolapan(a.horaInicio, a.horaFin, b.horaInicio, b.horaFin) &&
                    (a.docenteId === b.docenteId || a.cursoId === b.cursoId)) {
                    pares.push({ a, b, motivo: a.docenteId === b.docenteId ? 'Docente' : 'Curso' });
                }
            }
        }
        return pares;
    }

    function renderDashboard() {
        $('stat-cursos').textContent = db.cursos.length;
        $('stat-docentes').textContent = db.docentes.length;
        $('stat-asignaturas').textContent = db.asignaturas.length;
        $('stat-horarios').textContent = db.horarios.length;
        $('stat-estudiantes').textContent = db.cursos.reduce((s, c) => s + (c.numEstudiantes || 0), 0);

        const conflictos = listarConflictos();
        $('stat-conflictos').textContent = conflictos.length;

        // Distribución por jornada
        const jornadas = ['Mañana', 'Tarde', 'Noche', 'Única'];
        $('tabla-jornadas').innerHTML = jornadas.map(j => {
            const cursosJ = db.cursos.filter(c => c.jornada === j);
            const idsJ = cursosJ.map(c => c.id);
            const clasesJ = db.horarios.filter(h => idsJ.includes(h.cursoId)).length;
            const estJ = cursosJ.reduce((s, c) => s + (c.numEstudiantes || 0), 0);
            return `<tr>
                <td>${badgeJornada(j)}</td>
                <td>${cursosJ.length}</td>
                <td>${estJ}</td>
                <td>${clasesJ}</td>
            </tr>`;
        }).join('');

        // Lista de conflictos
        const cont = $('lista-conflictos');
        if (conflictos.length === 0) {
            cont.innerHTML = '<div class="alert alert-success">No hay conflictos de horario en la programación actual.</div>';
        } else {
            cont.innerHTML = conflictos.map(({ a, b, motivo }) => {
                const ca = buscarCurso(a.cursoId), cb = buscarCurso(b.cursoId);
                const da = buscarDocente(a.docenteId), dbb = buscarDocente(b.docenteId);
                const ref = motivo === 'Docente'
                    ? `El docente <strong>${escapeHTML((da || {}).nombre || '—')}</strong>`
                    : `El curso <strong>${escapeHTML((ca || {}).curso || '—')}</strong>`;
                return `<div class="alert alert-danger">
                    ${ref} está asignado simultáneamente el <strong>${escapeHTML(a.dia)}</strong>:
                    ${a.horaInicio}-${a.horaFin} (${escapeHTML((ca || {}).curso || '—')} / ${escapeHTML((da || {}).nombre || '—')})
                    y ${b.horaInicio}-${b.horaFin} (${escapeHTML((cb || {}).curso || '—')} / ${escapeHTML((dbb || {}).nombre || '—')}).
                </div>`;
            }).join('');
        }
    }

    // ----------------------------------------------------------------------
    // 8. Consultas de la programación
    // ----------------------------------------------------------------------
    $('consulta-tipo').addEventListener('change', actualizarValoresConsulta);
    $('btn-consultar').addEventListener('click', ejecutarConsulta);

    function actualizarValoresConsulta() {
        const tipo = $('consulta-tipo').value;
        const sel = $('consulta-valor');
        let opciones = [];
        if (tipo === 'curso') {
            opciones = db.cursos.map(c => ({ v: c.id, t: `${c.curso} (${c.jornada})` }));
        } else if (tipo === 'docente') {
            opciones = db.docentes.map(d => ({ v: d.id, t: d.nombre }));
        } else if (tipo === 'asignatura') {
            opciones = db.asignaturas.map(a => ({ v: a.id, t: a.nombre }));
        } else if (tipo === 'jornada') {
            opciones = ['Mañana', 'Tarde', 'Noche', 'Única'].map(j => ({ v: j, t: j }));
        }
        sel.innerHTML = opciones.length
            ? opciones.map(o => `<option value="${o.v}">${escapeHTML(o.t)}</option>`).join('')
            : '<option value="">Sin datos</option>';
    }

    function ejecutarConsulta() {
        const tipo = $('consulta-tipo').value;
        const valor = $('consulta-valor').value;
        const tbody = $('tabla-consulta');

        if (!valor) {
            tbody.innerHTML = filaVacia(6, 'No hay valores para consultar.');
            return;
        }

        let filas = db.horarios.slice();
        if (tipo === 'curso') {
            filas = filas.filter(h => h.cursoId === parseInt(valor, 10));
        } else if (tipo === 'docente') {
            filas = filas.filter(h => h.docenteId === parseInt(valor, 10));
        } else if (tipo === 'asignatura') {
            filas = filas.filter(h => h.asignaturaId === parseInt(valor, 10));
        } else if (tipo === 'jornada') {
            const ids = db.cursos.filter(c => c.jornada === valor).map(c => c.id);
            filas = filas.filter(h => ids.includes(h.cursoId));
        }

        const ordenDias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        filas.sort((x, y) => (ordenDias.indexOf(x.dia) - ordenDias.indexOf(y.dia)) ||
            x.horaInicio.localeCompare(y.horaInicio));

        if (filas.length === 0) {
            tbody.innerHTML = filaVacia(6, 'No se encontraron clases para esta consulta.');
            return;
        }

        tbody.innerHTML = filas.map(h => {
            const c = buscarCurso(h.cursoId);
            const a = buscarAsignatura(h.asignaturaId);
            const d = buscarDocente(h.docenteId);
            return `<tr>
                <td>${c ? escapeHTML(c.curso) : '—'}</td>
                <td>${c ? badgeJornada(c.jornada) : '—'}</td>
                <td>${a ? escapeHTML(a.nombre) : '—'}</td>
                <td>${d ? escapeHTML(d.nombre) : '—'}</td>
                <td>${escapeHTML(h.dia)}</td>
                <td>${h.horaInicio} - ${h.horaFin}</td>
            </tr>`;
        }).join('');
    }

    // ----------------------------------------------------------------------
    // 9. Delegación de eventos para los botones de las tablas
    // ----------------------------------------------------------------------
    document.addEventListener('click', (e) => {
        const boton = e.target.closest('button[data-accion]');
        if (!boton) return;
        const id = parseInt(boton.dataset.id, 10);
        const acciones = {
            'editar-curso': editarCurso, 'eliminar-curso': eliminarCurso,
            'editar-docente': editarDocente, 'eliminar-docente': eliminarDocente,
            'editar-asignatura': editarAsignatura, 'eliminar-asignatura': eliminarAsignatura,
            'editar-horario': editarHorario, 'eliminar-horario': eliminarHorario
        };
        const fn = acciones[boton.dataset.accion];
        if (fn) fn(id);
    });

    // ----------------------------------------------------------------------
    // 10. Datos de ejemplo la primera vez (para poder ver la interfaz)
    // ----------------------------------------------------------------------
    function sembrarEjemplo() {
        if (db.cursos.length || db.docentes.length || db.asignaturas.length) return;

        const mat = { id: nuevoId(), nombre: 'Matemáticas', intensidadHoraria: 5 };
        const esp = { id: nuevoId(), nombre: 'Lengua Castellana', intensidadHoraria: 4 };
        const cie = { id: nuevoId(), nombre: 'Ciencias Naturales', intensidadHoraria: 3 };
        db.asignaturas.push(mat, esp, cie);

        const c1 = { id: nuevoId(), grado: '10', curso: '10-A', jornada: 'Mañana', numEstudiantes: 32 };
        const c2 = { id: nuevoId(), grado: '11', curso: '11-B', jornada: 'Tarde', numEstudiantes: 28 };
        db.cursos.push(c1, c2);

        const d1 = { id: nuevoId(), nombre: 'María Gómez', documento: '1088123456', email: 'mgomez@inst.edu.co', telefono: '300 111 2233', asignaturas: [mat.id, cie.id], disponibilidad: 'Lunes a Viernes 7:00 - 13:00' };
        const d2 = { id: nuevoId(), nombre: 'Carlos Ruiz', documento: '1088987654', email: 'cruiz@inst.edu.co', telefono: '301 445 6677', asignaturas: [esp.id], disponibilidad: 'Lunes a Viernes 13:00 - 18:00' };
        db.docentes.push(d1, d2);

        db.horarios.push(
            { id: nuevoId(), cursoId: c1.id, asignaturaId: mat.id, docenteId: d1.id, dia: 'Lunes', horaInicio: '07:00', horaFin: '09:00' },
            { id: nuevoId(), cursoId: c1.id, asignaturaId: cie.id, docenteId: d1.id, dia: 'Martes', horaInicio: '09:00', horaFin: '11:00' },
            { id: nuevoId(), cursoId: c2.id, asignaturaId: esp.id, docenteId: d2.id, dia: 'Lunes', horaInicio: '13:00', horaFin: '15:00' }
        );

        guardarDB();
    }

    // ----------------------------------------------------------------------
    // 11. Arranque
    // ----------------------------------------------------------------------
    sembrarEjemplo();
    initCalendario();
    renderCursos();
    renderAsignaturas();
    renderDocentes();
    renderHorarios();
    renderDashboard();
    actualizarValoresConsulta();
});
