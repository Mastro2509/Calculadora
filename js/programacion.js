
document.addEventListener('DOMContentLoaded', () => {

    const db = {
        cursos: [], docentes: [], asignaturas: [], horarios: [],
        asignaciones: [],
        perfiles: [],
        cargas: []
    };

    let docenteFiltrado = null;

    async function recargarTodo() {
        const [cursos, docentes, asignaturas, horarios, asignaciones, perfiles, carga] = await Promise.all([
            API.obtenerCursos(),
            API.obtenerDocentes(),
            API.obtenerAsignaturas(),
            API.obtenerHorarios(),
            API.obtenerAsignaciones(),
            API.obtenerDocenteAsignaturas(),
            API.obtenerCargaDocentes()
        ]);
        db.cursos = cursos;
        db.docentes = docentes;
        db.asignaturas = asignaturas;
        db.horarios = horarios;
        db.asignaciones = asignaciones;
        db.perfiles = perfiles;
        db.cargas = (carga && carga.docentes) ? carga.docentes : [];
        renderTodo();
    }

    function renderTodo() {
        renderCursos();
        renderAsignaturas();
        renderDocentes();
        refrescarFiltroDocente();
        renderHorarios();
        renderDashboard();
        actualizarValoresConsulta();
    }

    const $ = (id) => document.getElementById(id);

    function escapeHTML(texto) {
        return String(texto == null ? '' : texto)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    const GUION = '<span class="stat-label">—</span>';

    function badgeJornada(jornada) {
        const clases = {
            'Mañana': 'badge-manana',
            'Tarde': 'badge-tarde',
            'Mixta': 'badge-unica'
        };
        return `<span class="badge ${clases[jornada] || ''}">${escapeHTML(jornada)}</span>`;
    }

    function filaVacia(colspan, texto) {
        return `<tr class="empty-row"><td colspan="${colspan}">${texto}</td></tr>`;
    }

    function mostrarMensaje(idContenedor, texto, tipo = 'danger') {
        const cont = $(idContenedor);
        if (!cont) return;
        if (!texto) { cont.innerHTML = ''; return; }
        cont.innerHTML = `<div class="alert alert-${tipo}">${escapeHTML(texto)}</div>`;
        if (tipo === 'success') {
            setTimeout(() => { if (cont.innerHTML.includes(texto)) cont.innerHTML = ''; }, 3000);
        }
    }

    const buscarCurso = (id) => db.cursos.find(c => Number(c.idCurso) === Number(id));
    const buscarDocente = (id) => db.docentes.find(d => Number(d.idDocente) === Number(id));
    const buscarAsignatura = (id) => db.asignaturas.find(a => Number(a.idAsignatura) === Number(id));
    const buscarHorario = (id) => db.horarios.find(h => Number(h.idHorario) === Number(id));

    const nombreDocente = (d) => d ? `${d.nombres || ''} ${d.apellidos || ''}`.trim() : '';
    const nombreAsignatura = (a) => a ? (a.nombre_asignatura || '') : '';

    const GRADOS_POR_ASIGNATURA = {
        'física': [9, 10, 11],
        'fisica': [9, 10, 11],
        'química': [9, 10, 11],
        'quimica': [9, 10, 11],
        'filosofía': [10, 11],
        'filosofia': [10, 11],
        'trigonometría': [10, 11],
        'trigonometria': [10, 11],
        'cálculo': [11],
        'calculo': [11],
        'economía': [10, 11],
        'economia': [10, 11],
        'ciencias políticas': [10, 11],
        'ciencias politicas': [10, 11],
        'biología': [6, 7, 8, 9, 10, 11],
        'biologia': [6, 7, 8, 9, 10, 11],
        'ciencias sociales': [4, 5, 6, 7, 8, 9, 10, 11]
    };

    const DIAS_LECTIVOS = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    const ETIQUETA_DIA = {
        'Lunes': 'Lunes', 'Martes': 'Martes', 'Miercoles': 'Miércoles',
        'Jueves': 'Jueves', 'Viernes': 'Viernes', 'Sabado': 'Sábado'
    };

    const FRANJA_JORNADA = {
        'Mañana': { min: '06:00', max: '12:30' },
        'Tarde':  { min: '12:30', max: '18:30' },
        'Mixta':  { min: '06:00', max: '18:30' }
    };

    function numeroGrado(grado) {
        const m = String(grado == null ? '' : grado).match(/\d+/);
        return m ? parseInt(m[0], 10) : null;
    }

    function gradosPermitidos(asignatura) {
        if (!asignatura) return null;
        const clave = nombreAsignatura(asignatura).trim().toLowerCase();
        return GRADOS_POR_ASIGNATURA[clave] || null;
    }

    function asignaturaAplicaACurso(asignatura, curso) {
        const permitidos = gradosPermitidos(asignatura);
        if (!permitidos) return true;
        const g = numeroGrado(curso && curso.grado);
        if (g === null) return true;
        return permitidos.includes(g);
    }

    function textoGrados(asignatura) {
        const permitidos = gradosPermitidos(asignatura);
        if (!permitidos) return 'todos los grados';
        if (permitidos.length === 1) return `grado ${permitidos[0]}`;
        return `grados ${permitidos.join(', ')}`;
    }

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

    async function conBoton(idBoton, textoOcupado, tarea) {
        const btn = $(idBoton);
        const original = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = textoOcupado; }
        try {
            await tarea();
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = original; }
        }
    }

    const formCurso = $('form-curso');

    formCurso.addEventListener('submit', (e) => {
        e.preventDefault();
        mostrarMensaje('mensaje-curso', '');

        const id = $('curso-id').value;
        const datos = {
            grado: $('curso-grado').value.trim(),
            curso: $('curso-nombre').value.trim(),
            jornada: $('curso-jornada').value,
            numero_estudiantes: parseInt($('curso-estudiantes').value, 10) || 0
        };

        if (!datos.grado || !datos.curso || !datos.jornada) {
            mostrarMensaje('mensaje-curso', 'Complete grado, curso y jornada.');
            return;
        }

        conBoton('btn-guardar-curso', 'Guardando...', async () => {
            try {
                if (id) {
                    await API.actualizarCurso(parseInt(id, 10), datos);
                } else {
                    await API.crearCurso(datos);
                }
                await recargarTodo();
                resetFormCurso();
                mostrarMensaje('mensaje-curso', id ? 'Curso actualizado.' : 'Curso creado.', 'success');
            } catch (err) {
                mostrarMensaje('mensaje-curso', err.message);
            }
        });
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
        mostrarMensaje('mensaje-curso', '');
        $('curso-id').value = c.idCurso;
        $('curso-grado').value = c.grado || '';
        $('curso-nombre').value = c.curso || '';
        $('curso-jornada').value = c.jornada || '';
        $('curso-estudiantes').value = c.numero_estudiantes ?? 0;
        $('titulo-form-curso').textContent = `Editar Curso: ${c.curso}`;
        $('btn-guardar-curso').textContent = 'Actualizar Curso';
        $('btn-cancelar-curso').style.display = 'inline-block';
        formCurso.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function eliminarCurso(id) {
        const c = buscarCurso(id);
        if (!c) return;
        const clases = db.horarios.filter(h => Number(h.idCurso) === Number(id)).length;
        const aviso = clases > 0
            ? `El curso "${c.curso}" tiene ${clases} clase(s) programada(s) que también se eliminarán. ¿Continuar?`
            : `¿Eliminar el curso "${c.curso}"?`;
        if (!confirm(aviso)) return;

        try {
            await API.eliminarCurso(id);
            await recargarTodo();
        } catch (err) {
            mostrarMensaje('mensaje-curso', err.message);
        }
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
                    <td>${c.numero_estudiantes ?? 0}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-accion="editar-curso" data-id="${c.idCurso}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-accion="eliminar-curso" data-id="${c.idCurso}">Eliminar</button>
                    </td>
                </tr>`).join('');
        }
        refrescarSelectsHorario();
    }

    const formAsignatura = $('form-asignatura');

    formAsignatura.addEventListener('submit', (e) => {
        e.preventDefault();
        mostrarMensaje('mensaje-asignatura', '');

        const id = $('asignatura-id').value;
        const datos = {
            nombre_asignatura: $('asignatura-nombre').value.trim(),
            intensidad_horaria: parseInt($('asignatura-intensidad').value, 10) || 0
        };
        if (!datos.nombre_asignatura || datos.intensidad_horaria <= 0) {
            mostrarMensaje('mensaje-asignatura', 'Ingrese nombre e intensidad horaria mayor que 0.');
            return;
        }

        conBoton('btn-guardar-asignatura', 'Guardando...', async () => {
            try {
                if (id) {
                    await API.actualizarAsignatura(parseInt(id, 10), datos);
                } else {
                    await API.crearAsignatura(datos);
                }
                await recargarTodo();
                resetFormAsignatura();
                mostrarMensaje('mensaje-asignatura', id ? 'Asignatura actualizada.' : 'Asignatura creada.', 'success');
            } catch (err) {
                mostrarMensaje('mensaje-asignatura', err.message);
            }
        });
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
        mostrarMensaje('mensaje-asignatura', '');
        $('asignatura-id').value = a.idAsignatura;
        $('asignatura-nombre').value = a.nombre_asignatura || '';
        $('asignatura-intensidad').value = a.intensidad_horaria ?? '';
        $('titulo-form-asignatura').textContent = `Editar Asignatura: ${a.nombre_asignatura}`;
        $('btn-guardar-asignatura').textContent = 'Actualizar Asignatura';
        $('btn-cancelar-asignatura').style.display = 'inline-block';
        formAsignatura.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function eliminarAsignatura(id) {
        const a = buscarAsignatura(id);
        if (!a) return;
        const clases = db.horarios.filter(h => Number(h.idAsignatura) === Number(id)).length;
        const aviso = clases > 0
            ? `La asignatura "${a.nombre_asignatura}" tiene ${clases} clase(s) programada(s) que también se eliminarán. ¿Continuar?`
            : `¿Eliminar la asignatura "${a.nombre_asignatura}"?`;
        if (!confirm(aviso)) return;

        try {
            await API.eliminarAsignatura(id);
            await recargarTodo();
        } catch (err) {
            mostrarMensaje('mensaje-asignatura', err.message);
        }
    }

    function renderAsignaturas() {
        const tbody = $('tabla-asignaturas');
        if (db.asignaturas.length === 0) {
            tbody.innerHTML = filaVacia(3, 'No hay asignaturas registradas.');
        } else {
            tbody.innerHTML = db.asignaturas.map(a => `
                <tr>
                    <td>${escapeHTML(a.nombre_asignatura)}<br><small class="stat-label">Aplica a ${escapeHTML(textoGrados(a))}</small></td>
                    <td>${a.intensidad_horaria ?? 0} h/semana</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-accion="editar-asignatura" data-id="${a.idAsignatura}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-accion="eliminar-asignatura" data-id="${a.idAsignatura}">Eliminar</button>
                    </td>
                </tr>`).join('');
        }
        renderCheckboxesAsignaturas();
        refrescarSelectsHorario();
    }

    const formDocente = $('form-docente');
    function asignaturasDeDocente(idDocente) {
        const ids = new Set();
        db.perfiles
            .filter(p => Number(p.idDocente) === Number(idDocente))
            .forEach(p => ids.add(Number(p.idAsignatura)));
        db.asignaciones
            .filter(a => Number(a.idDocente) === Number(idDocente))
            .forEach(a => ids.add(Number(a.idAsignatura)));
        return Array.from(ids);
    }

    function docentesDeAsignatura(idAsignatura) {
        return db.docentes.filter(d =>
            asignaturasDeDocente(d.idDocente).includes(Number(idAsignatura)));
    }

    function renderCheckboxesAsignaturas(seleccionadas, idDocente) {
        const cont = $('docente-asignaturas');
        const sel = (seleccionadas || []).map(Number);
        if (db.asignaturas.length === 0) {
            cont.innerHTML = '<span class="stat-label">Primero registre asignaturas.</span>';
            return;
        }

        const conClases = new Set(
            idDocente
                ? db.asignaciones
                    .filter(a => Number(a.idDocente) === Number(idDocente) && Number(a.total_horarios) > 0)
                    .map(a => Number(a.idAsignatura))
                : []
        );

        cont.innerHTML = db.asignaturas.map(a => {
            const idA = Number(a.idAsignatura);
            const bloqueada = conClases.has(idA);
            return `
            <label class="${bloqueada ? 'chk-bloqueada' : ''}"
                   ${bloqueada ? 'title="Tiene clases programadas: elimínelas primero para poder quitarla."' : ''}>
                <input type="checkbox" value="${a.idAsignatura}"
                    ${sel.includes(idA) || bloqueada ? 'checked' : ''}
                    ${bloqueada ? 'disabled' : ''}>
                ${escapeHTML(a.nombre_asignatura)}${bloqueada ? ' <small>(en uso)</small>' : ''}
            </label>`;
        }).join('');
    }

    function diasSeleccionados() {
        return Array.from($('docente-dias').querySelectorAll('input:checked')).map(i => i.value);
    }

    function marcarDias(dias) {
        const set = new Set((dias || []).map(d => String(d).trim()));
        $('docente-dias').querySelectorAll('input').forEach(i => { i.checked = set.has(i.value); });
    }

    formDocente.addEventListener('submit', (e) => {
        e.preventDefault();
        mostrarMensaje('mensaje-docente', '');

        const id = $('docente-id').value;
        const dias = diasSeleccionados();
        const datos = {
            nombres: $('docente-nombres').value.trim(),
            apellidos: $('docente-apellidos').value.trim(),
            documento: $('docente-documento').value.trim(),
            tipo_contrato: $('docente-contrato').value,
            jornada: $('docente-jornada').value,
            dias_trabajo: dias
        };

        if (!datos.nombres || !datos.apellidos || !datos.documento) {
            mostrarMensaje('mensaje-docente', 'Ingrese nombres, apellidos y documento del docente.');
            return;
        }
        if (dias.length === 0) {
            mostrarMensaje('mensaje-docente', 'Seleccione al menos un día de trabajo.');
            return;
        }

        const asignaturasSel = Array.from($('docente-asignaturas').querySelectorAll('input:checked'))
            .map(i => parseInt(i.value, 10));

        conBoton('btn-guardar-docente', 'Guardando...', async () => {
            try {
                const guardado = id
                    ? await API.actualizarDocente(parseInt(id, 10), datos)
                    : await API.crearDocente(datos);

                const bloqueadas = await sincronizarAsignaturasDocente(guardado.idDocente, asignaturasSel);
                await recargarTodo();
                resetFormDocente();

                if (bloqueadas.length) {
                    mostrarMensaje('mensaje-docente',
                        `Docente guardado. No se pudo quitar ${bloqueadas.join(', ')}: ` +
                        `tiene clases programadas. Elimine primero esas clases en Horarios.`, 'warning');
                } else {
                    mostrarMensaje('mensaje-docente', id ? 'Docente actualizado.' : 'Docente creado.', 'success');
                }
            } catch (err) {
                mostrarMensaje('mensaje-docente', err.message);
            }
        });
    });
    async function sincronizarAsignaturasDocente(idDocente, idsAsignaturas) {
        const deseadas = new Set(idsAsignaturas.map(Number));

        const conClases = db.asignaciones
            .filter(a => Number(a.idDocente) === Number(idDocente) && Number(a.total_horarios) > 0)
            .map(a => Number(a.idAsignatura));

        const bloqueadas = conClases.filter(idA => !deseadas.has(idA));
        bloqueadas.forEach(idA => deseadas.add(idA));

        await API.guardarAsignaturasDocente(idDocente, Array.from(deseadas));

        for (const a of db.asignaciones) {
            if (Number(a.idDocente) !== Number(idDocente)) continue;
            if (deseadas.has(Number(a.idAsignatura))) continue;
            if (Number(a.total_horarios) > 0) continue;
            try {
                await API.eliminarAsignacion(a.idAsignacion);
            } catch (e) {
                console.warn('No se pudo eliminar la asignación', a.idAsignacion, e.message);
            }
        }

        return bloqueadas.map(idA => nombreAsignatura(buscarAsignatura(idA))).filter(Boolean);
    }

    $('btn-cancelar-docente').addEventListener('click', resetFormDocente);

    function resetFormDocente() {
        formDocente.reset();
        $('docente-id').value = '';
        renderCheckboxesAsignaturas();
        marcarDias([]);
        $('titulo-form-docente').textContent = 'Registrar Docente';
        $('btn-guardar-docente').textContent = 'Guardar Docente';
        $('btn-cancelar-docente').style.display = 'none';
    }

    function editarDocente(id) {
        const d = buscarDocente(id);
        if (!d) return;
        mostrarMensaje('mensaje-docente', '');
        $('docente-id').value = d.idDocente;
        $('docente-nombres').value = d.nombres || '';
        $('docente-apellidos').value = d.apellidos || '';
        $('docente-documento').value = d.documento || '';
        $('docente-contrato').value = d.tipo_contrato || 'Tiempo Completo';
        $('docente-jornada').value = d.jornada || 'Mañana';
        marcarDias(d.dias_trabajo || []);
        renderCheckboxesAsignaturas(asignaturasDeDocente(d.idDocente), d.idDocente);
        $('titulo-form-docente').textContent = `Editar Docente: ${nombreDocente(d)}`;
        $('btn-guardar-docente').textContent = 'Actualizar Docente';
        $('btn-cancelar-docente').style.display = 'inline-block';
        formDocente.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function eliminarDocente(id) {
        const d = buscarDocente(id);
        if (!d) return;
        const clases = db.horarios.filter(h => Number(h.idDocente) === Number(id)).length;
        const aviso = clases > 0
            ? `El docente "${nombreDocente(d)}" tiene ${clases} clase(s) programada(s) que también se eliminarán. ¿Continuar?`
            : `¿Eliminar al docente "${nombreDocente(d)}"?`;
        if (!confirm(aviso)) return;

        try {
            await API.eliminarDocente(id);
            await recargarTodo();
        } catch (err) {
            mostrarMensaje('mensaje-docente', err.message);
        }
    }

    function listaAsignaturasDocente(idDocente) {
        const nombres = asignaturasDeDocente(idDocente)
            .map(idA => nombreAsignatura(buscarAsignatura(idA)))
            .filter(Boolean)
            .sort();
        return nombres.length ? escapeHTML(nombres.join(', ')) : GUION;
    }

    function renderDocentes() {
        const tbody = $('tabla-docentes');
        if (db.docentes.length === 0) {
            tbody.innerHTML = filaVacia(7, 'No hay docentes registrados.');
            refrescarSelectsHorario();
            return;
        }
        tbody.innerHTML = db.docentes.map(d => {
            const dias = Array.isArray(d.dias_trabajo) ? d.dias_trabajo : [];
            const disponibilidad = dias.length
                ? `${escapeHTML(dias.join(', '))}<br><small class="stat-label">Jornada ${escapeHTML(d.jornada || '')}</small>`
                : GUION;
            return `
                <tr>
                    <td>${escapeHTML(nombreDocente(d)) || GUION}</td>
                    <td>${escapeHTML(d.documento) || GUION}</td>
                    <td>${escapeHTML(d.tipo_contrato) || GUION}</td>
                    <td>${barraCarga(buscarCarga(d.idDocente))}</td>
                    <td>${listaAsignaturasDocente(d.idDocente)}</td>
                    <td>${disponibilidad}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-accion="editar-docente" data-id="${d.idDocente}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-accion="eliminar-docente" data-id="${d.idDocente}">Eliminar</button>
                    </td>
                </tr>`;
        }).join('');
        refrescarSelectsHorario();
    }

    const formHorario = $('form-horario');

    function refrescarSelectsHorario() {
        const selCurso = $('horario-curso');
        const selAsig = $('horario-asignatura');
        const selDoc = $('horario-docente');
        if (!selCurso) return;

        const vc = selCurso.value, va = selAsig.value, vd = selDoc.value;

        selCurso.innerHTML = '<option value="">Seleccione curso...</option>' +
            db.cursos.map(c =>
                `<option value="${c.idCurso}">${escapeHTML(`${c.curso} — ${c.jornada}`)}</option>`).join('');

        selCurso.value = vc;
        refrescarAsignaturasSegunCurso(va);
        refrescarDocentesSegunAsignatura(vd);
    }
    function refrescarDocentesSegunAsignatura(valorPrevio) {
        const selAsig = $('horario-asignatura');
        const selDoc = $('horario-docente');
        if (!selDoc) return;

        const idAsig = parseInt(selAsig.value, 10);
        const asignatura = buscarAsignatura(idAsig);
        const aptos = idAsig ? docentesDeAsignatura(idAsig) : db.docentes;

        const placeholder = !idAsig
            ? 'Primero elija la asignatura...'
            : (aptos.length ? 'Seleccione docente...' : 'Ningún docente dicta esta asignatura');

        selDoc.innerHTML = `<option value="">${escapeHTML(placeholder)}</option>` +
            aptos.map(d => {
                const dias = Array.isArray(d.dias_trabajo) ? d.dias_trabajo : [];
                const detalle = dias.length ? ` (${dias.length} día(s), ${d.jornada || ''})` : '';
                return `<option value="${d.idDocente}">${escapeHTML(nombreDocente(d) + detalle)}</option>`;
            }).join('');

        if (valorPrevio && aptos.some(d => String(d.idDocente) === String(valorPrevio))) {
            selDoc.value = valorPrevio;
        }

        const aviso = $('aviso-docentes');
        if (aviso) {
            if (idAsig && aptos.length === 0) {
                aviso.innerHTML = `<small class="stat-label">Ningún docente tiene ` +
                    `${escapeHTML(nombreAsignatura(asignatura))} en su perfil. ` +
                    `Agréguesela a un docente en la pestaña Docentes.</small>`;
            } else if (idAsig) {
                const ocultos = db.docentes.length - aptos.length;
                aviso.innerHTML = ocultos > 0
                    ? `<small class="stat-label">${aptos.length} docente(s) apto(s); ` +
                      `${ocultos} no dictan esta asignatura.</small>`
                    : '';
            } else {
                aviso.innerHTML = '';
            }
        }

        refrescarDisponibilidadDocente();
    }
    function refrescarDisponibilidadDocente() {
        const selDoc = $('horario-docente');
        const selDia = $('horario-dia');
        if (!selDia) return;

        const docente = buscarDocente(selDoc.value);
        const dias = docente && Array.isArray(docente.dias_trabajo) ? docente.dias_trabajo : [];
        const valorPrevio = selDia.value;

        const disponibles = dias.length ? dias : DIAS_LECTIVOS;
        const placeholder = docente
            ? (dias.length ? 'Días que trabaja el docente...' : 'Seleccione día...')
            : 'Seleccione día...';

        selDia.innerHTML = `<option value="">${escapeHTML(placeholder)}</option>` +
            disponibles.map(d =>
                `<option value="${d}">${escapeHTML(ETIQUETA_DIA[d] || d)}</option>`).join('');

        if (valorPrevio && disponibles.includes(valorPrevio)) {
            selDia.value = valorPrevio;
        }

        const franja = FRANJA_JORNADA[docente && docente.jornada] || FRANJA_JORNADA.Mixta;
        const ini = $('horario-inicio'), fin = $('horario-fin');
        if (ini && fin) {
            ini.min = franja.min; ini.max = franja.max;
            fin.min = franja.min; fin.max = franja.max;
        }

        const aviso = $('aviso-disponibilidad');
        if (aviso) {
            let carga = '';
            if (docente) {
                const c = buscarCarga(docente.idDocente);
                if (c) {
                    carga = c.excede
                        ? `<br><small class="carga-texto excede">Ya supera su tope: ` +
                          `${textoHoras(c.horas)} de ${c.tope_horas} h.</small>`
                        : `<br><small class="carga-texto ${nivelCarga(c)}">Carga actual ` +
                          `${textoHoras(c.horas)} de ${c.tope_horas} h · ` +
                          `quedan ${textoHoras(c.horas_disponibles)} disponibles.</small>`;
                }
            }
            aviso.innerHTML = docente
                ? `<small class="stat-label">${escapeHTML(nombreDocente(docente))} trabaja ` +
                  `${dias.length ? escapeHTML(dias.join(', ')) : 'sin días registrados'} · ` +
                  `jornada ${escapeHTML(docente.jornada || '—')} (${franja.min}–${franja.max}).</small>` + carga
                : '';
        }
    }
    function refrescarAsignaturasSegunCurso(valorPrevio) {
        const selCurso = $('horario-curso');
        const selAsig = $('horario-asignatura');
        if (!selAsig) return;

        const curso = buscarCurso(selCurso.value);
        const disponibles = curso
            ? db.asignaturas.filter(a => asignaturaAplicaACurso(a, curso))
            : db.asignaturas;

        const placeholder = curso
            ? `Asignaturas de grado ${escapeHTML(curso.grado)}...`
            : 'Seleccione asignatura...';

        selAsig.innerHTML = `<option value="">${placeholder}</option>` +
            disponibles.map(a =>
                `<option value="${a.idAsignatura}">${escapeHTML(a.nombre_asignatura)}</option>`).join('');

        if (valorPrevio && disponibles.some(a => String(a.idAsignatura) === String(valorPrevio))) {
            selAsig.value = valorPrevio;
        }

        const ocultas = db.asignaturas.length - disponibles.length;
        const aviso = $('aviso-asignaturas');
        if (aviso) {
            aviso.innerHTML = (curso && ocultas > 0)
                ? `<small class="stat-label">${ocultas} asignatura(s) no aplican al grado ${escapeHTML(curso.grado)}.</small>`
                : '';
        }
    }

    $('horario-curso').addEventListener('change', () => {
        refrescarAsignaturasSegunCurso($('horario-asignatura').value);
        refrescarDocentesSegunAsignatura($('horario-docente').value);
    });

    $('horario-asignatura').addEventListener('change', () => {
        refrescarDocentesSegunAsignatura($('horario-docente').value);
    });

    $('horario-docente').addEventListener('change', refrescarDisponibilidadDocente);

    formHorario.addEventListener('submit', (e) => {
        e.preventDefault();
        mostrarMensaje('mensaje-horario', '');

        const id = $('horario-id').value;
        const idCurso = parseInt($('horario-curso').value, 10);
        const idAsignatura = parseInt($('horario-asignatura').value, 10);
        const idDocente = parseInt($('horario-docente').value, 10);
        const dia = $('horario-dia').value;
        const horaInicio = $('horario-inicio').value;
        const horaFin = $('horario-fin').value;

        if (!idCurso || !idAsignatura || !idDocente || !dia || !horaInicio || !horaFin) {
            mostrarMensaje('mensaje-horario', 'Complete todos los campos.');
            return;
        }
        if (horaInicio >= horaFin) {
            mostrarMensaje('mensaje-horario', 'La hora de inicio debe ser anterior a la hora de fin.');
            return;
        }

        const curso = buscarCurso(idCurso);
        const asignatura = buscarAsignatura(idAsignatura);
        if (!asignaturaAplicaACurso(asignatura, curso)) {
            mostrarMensaje('mensaje-horario',
                `${nombreAsignatura(asignatura)} solo se dicta en ${textoGrados(asignatura)}. ` +
                `El curso ${curso.curso} es de grado ${curso.grado}.`);
            return;
        }

        const docente = buscarDocente(idDocente);
        if (!asignaturasDeDocente(idDocente).includes(idAsignatura)) {
            mostrarMensaje('mensaje-horario',
                `${nombreDocente(docente)} no tiene ${nombreAsignatura(asignatura)} entre sus ` +
                `asignaturas. Agréguesela en la pestaña Docentes o elija otro docente.`);
            return;
        }

        const dias = Array.isArray(docente.dias_trabajo) ? docente.dias_trabajo : [];
        if (dias.length && !dias.includes(dia)) {
            if (!confirm(`${nombreDocente(docente)} no trabaja los ${ETIQUETA_DIA[dia] || dia} (días: ${dias.join(', ')}).\n\n¿Programar de todos modos?`)) {
                return;
            }
        }

        const franja = FRANJA_JORNADA[docente.jornada];
        if (franja && (horaInicio < franja.min || horaFin > franja.max)) {
            if (!confirm(`La jornada ${docente.jornada} de ${nombreDocente(docente)} va de ` +
                `${franja.min} a ${franja.max}, y la clase es de ${horaInicio} a ${horaFin}.\n\n` +
                `¿Programar de todos modos?`)) {
                return;
            }
        }

        const datos = {
            idCurso, idAsignatura, idDocente,
            dia_semana: dia,
            hora_inicio: horaInicio,
            hora_fin: horaFin
        };

        conBoton('btn-guardar-horario', 'Guardando...', async () => {
            try {
                await guardarHorario(id, datos, false);
            } catch (err) {
                if (err.codigo === 409 && err.extra.exceso_carga) {
                    const x = err.extra.exceso_carga;
                    const mensaje =
                        `${x.docente} tiene un contrato de ${x.tipo_contrato}, con tope de ${x.tope_horas} h semanales.

` +
                        `Horas actuales: ${x.horas_actuales} h
` +
                        `Esta clase suma: ${x.horas_de_la_clase} h
` +
                        `Quedaría en: ${x.horas_resultantes} h (${x.horas_exceso} h por encima del tope)

` +
                        `¿Programar de todos modos?`;
                    if (confirm(mensaje)) {
                        try {
                            await guardarHorario(id, datos, true);
                        } catch (e2) {
                            mostrarMensaje('mensaje-horario', e2.message);
                        }
                    }
                    return;
                }
                if (err.codigo === 409 && Array.isArray(err.extra.conflictos)) {
                    const detalle = err.extra.conflictos.map(c =>
                        `${c.motivo === 'Docente' ? 'El docente' : 'El curso'} ya tiene ` +
                        `${c.asignatura} el ${c.dia_semana} de ${c.hora_inicio} a ${c.hora_fin}`
                    ).join('\n');
                    if (confirm(`Conflicto detectado:\n${detalle}\n\n¿Programar de todos modos?`)) {
                        try {
                            await guardarHorario(id, datos, true);
                        } catch (e2) {
                            mostrarMensaje('mensaje-horario', e2.message);
                        }
                    }
                    return;
                }
                mostrarMensaje('mensaje-horario', err.message);
            }
        });
    });

    async function guardarHorario(id, datos, forzar) {
        if (id) {
            await API.actualizarHorario(parseInt(id, 10), datos, forzar);
        } else {
            await API.crearHorario(datos, forzar);
        }
        await recargarTodo();
        resetFormHorario();
        mostrarMensaje('mensaje-horario', id ? 'Clase actualizada.' : 'Clase programada.', 'success');
    }

    $('btn-cancelar-horario').addEventListener('click', resetFormHorario);

    function resetFormHorario() {
        formHorario.reset();
        $('horario-id').value = '';
        $('titulo-form-horario').textContent = 'Programar Clase';
        $('btn-guardar-horario').textContent = 'Programar Clase';
        $('btn-cancelar-horario').style.display = 'none';
        refrescarSelectsHorario();
    }

    function editarHorario(id) {
        const h = buscarHorario(id);
        if (!h) return;
        mostrarMensaje('mensaje-horario', '');

        $('horario-id').value = h.idHorario;
        $('horario-curso').value = h.idCurso;
        refrescarAsignaturasSegunCurso(h.idAsignatura);
        $('horario-asignatura').value = h.idAsignatura;
        refrescarDocentesSegunAsignatura(h.idDocente);
        $('horario-docente').value = h.idDocente;
        refrescarDisponibilidadDocente();
        $('horario-dia').value = h.dia_semana;
        $('horario-inicio').value = String(h.hora_inicio).slice(0, 5);
        $('horario-fin').value = String(h.hora_fin).slice(0, 5);

        $('titulo-form-horario').textContent = `Editar Clase: ${h.asignatura} — ${h.curso}`;
        $('btn-guardar-horario').textContent = 'Actualizar Clase';
        $('btn-cancelar-horario').style.display = 'inline-block';
        formHorario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    async function eliminarHorario(id) {
        const h = buscarHorario(id);
        if (!h) return;
        if (!confirm(`¿Eliminar la clase de ${h.asignatura} (${h.curso}, ${h.dia_semana} ${String(h.hora_inicio).slice(0, 5)})?`)) return;
        try {
            await API.eliminarHorario(id);
            await recargarTodo();
        } catch (err) {
            mostrarMensaje('mensaje-horario', err.message);
        }
    }

    function seSolapan(i1, f1, i2, f2) {
        return i1 < f2 && i2 < f1;
    }

    function conflictosDe(h) {
        return db.horarios.filter(o => {
            if (Number(o.idHorario) === Number(h.idHorario)) return false;
            if (o.dia_semana !== h.dia_semana) return false;
            if (!seSolapan(h.hora_inicio, h.hora_fin, o.hora_inicio, o.hora_fin)) return false;
            return Number(o.idDocente) === Number(h.idDocente) ||
                   Number(o.idCurso) === Number(h.idCurso);
        });
    }

    const hhmm = (h) => String(h == null ? '' : h).slice(0, 5);

    function renderHorarios() {
        const tbody = $('tabla-horarios');
        const visibles = horariosVisibles();

        const titulo = $('titulo-tabla-horarios');
        if (titulo) {
            const doc = docenteFiltrado === null ? null : buscarDocente(docenteFiltrado);
            titulo.textContent = doc
                ? `Clases de ${nombreDocente(doc)}`
                : 'Clases programadas';
        }

        if (visibles.length === 0) {
            tbody.innerHTML = filaVacia(7, docenteFiltrado === null
                ? 'No hay clases programadas.'
                : 'Este docente no tiene clases programadas.');
        } else {
            tbody.innerHTML = visibles.map(h => {
                const enConflicto = conflictosDe(h).length > 0;
                return `
                <tr class="${enConflicto ? 'row-conflict' : ''}">
                    <td>${escapeHTML(h.curso) || GUION}</td>
                    <td>${escapeHTML(h.asignatura) || GUION}</td>
                    <td>${escapeHTML(h.docente) || GUION}</td>
                    <td>${escapeHTML(h.dia_semana)}</td>
                    <td>${hhmm(h.hora_inicio)} - ${hhmm(h.hora_fin)}</td>
                    <td>${enConflicto
                        ? '<span class="badge badge-tarde">Conflicto</span>'
                        : '<span class="badge badge-unica">OK</span>'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" data-accion="editar-horario" data-id="${h.idHorario}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-accion="eliminar-horario" data-id="${h.idHorario}">Eliminar</button>
                    </td>
                </tr>`;
            }).join('');
        }
        renderPanelCarga();
        renderCalendario();
    }

    function buscarCarga(idDocente) {
        return db.cargas.find(c => Number(c.idDocente) === Number(idDocente));
    }

    function textoHoras(horas) {
        const total = Math.round((Number(horas) || 0) * 60);
        const h = Math.floor(total / 60);
        const m = total % 60;
        if (m === 0) return `${h} h`;
        return h === 0 ? `${m} min` : `${h} h ${m} min`;
    }

    function nivelCarga(c) {
        if (!c || !c.tope_horas) return 'ok';
        if (c.excede) return 'excede';
        if (c.porcentaje >= 90) return 'alta';
        return 'ok';
    }

    function barraCarga(c) {
        if (!c) return GUION;
        const nivel = nivelCarga(c);
        const ancho = Math.min(c.porcentaje, 100);
        const titulo = `${textoHoras(c.horas)} de ${c.tope_horas} h (${c.tipo_contrato})`;
        return `<div class="carga-barra" title="${escapeHTML(titulo)}">
            <div class="carga-pista"><div class="carga-relleno ${nivel}" style="width:${ancho}%"></div></div>
            <span class="carga-texto ${nivel}">${textoHoras(c.horas)} / ${c.tope_horas} h</span>
        </div>`;
    }

    function refrescarFiltroDocente() {
        const sel = $('filtro-horario-docente');
        if (!sel) return;
        const conClases = db.docentes.filter(d =>
            db.horarios.some(h => Number(h.idDocente) === Number(d.idDocente)));

        sel.innerHTML = '<option value="">Todos los docentes</option>' +
            conClases.map(d => {
                const c = buscarCarga(d.idDocente);
                const detalle = c ? ` — ${textoHoras(c.horas)} / ${c.tope_horas} h` : '';
                return `<option value="${d.idDocente}">${escapeHTML(nombreDocente(d) + detalle)}</option>`;
            }).join('');
        if (docenteFiltrado && !conClases.some(d => Number(d.idDocente) === Number(docenteFiltrado))) {
            docenteFiltrado = null;
        }
        sel.value = docenteFiltrado === null ? '' : String(docenteFiltrado);
    }

    function horariosVisibles() {
        return docenteFiltrado === null
            ? db.horarios
            : db.horarios.filter(h => Number(h.idDocente) === Number(docenteFiltrado));
    }

    function renderPanelCarga() {
        const cont = $('panel-carga-docente');
        if (!cont) return;

        if (docenteFiltrado === null) {
            const excedidos = db.cargas.filter(c => c.excede);
            const activos = db.cargas.filter(c => c.clases > 0);
            const detalle = excedidos
                .map(c => `${escapeHTML(c.docente)} (${textoHoras(c.horas)} de ${c.tope_horas} h)`)
                .join('; ');
            const aviso = excedidos.length
                ? `<div class="alert alert-danger">
                     <strong>${excedidos.length} docente(s) superan su tope de horas:</strong> ${detalle}.
                   </div>`
                : `<div class="alert alert-success">
                     Ningún docente supera su tope de horas semanales.
                   </div>`;
            cont.innerHTML = `${aviso}
                <p class="stat-label">
                    ${activos.length} docente(s) con clases programadas ·
                    Tope semanal: 40 h tiempo completo, 20 h medio tiempo.
                    Elija un docente para ver únicamente su horario.
                </p>`;
            return;
        }

        const c = buscarCarga(docenteFiltrado);
        if (!c) { cont.innerHTML = ''; return; }

        const nivel = nivelCarga(c);
        const clases = horariosVisibles();

        const porDia = DIAS_LECTIVOS.map(dia => {
            const delDia = clases.filter(h => h.dia_semana === dia);
            const min = delDia.reduce((s, h) => s + (minutos(h.hora_fin) - minutos(h.hora_inicio)), 0);
            return { dia, horas: min / 60, clases: delDia.length };
        }).filter(d => d.clases > 0);

        const estado = c.excede
            ? `<div class="alert alert-danger">
                 <strong>Excede el tope.</strong> ${escapeHTML(c.docente)} tiene
                 ${textoHoras(c.horas)} programadas y su contrato de ${escapeHTML(c.tipo_contrato)}
                 permite ${c.tope_horas} h: se pasa por ${textoHoras(c.horas - c.tope_horas)}.
               </div>`
            : `<div class="alert alert-success">
                 Dentro del tope: le quedan ${textoHoras(c.horas_disponibles)} disponibles
                 de las ${c.tope_horas} h que permite su contrato de ${escapeHTML(c.tipo_contrato)}.
               </div>`;

        const dias = porDia.length
            ? porDia.map(d => `<div class="carga-dia">
                   <span class="carga-dia-nombre">${escapeHTML(ETIQUETA_DIA[d.dia] || d.dia)}</span>
                   <span class="carga-dia-horas">${textoHoras(d.horas)}</span>
                   <span class="stat-label">${d.clases} clase(s)</span>
               </div>`).join('')
            : '<span class="stat-label">Sin clases programadas.</span>';

        cont.innerHTML = `
            <div class="carga-detalle">
                <div class="carga-cabecera">
                    <div>
                        <h3>${escapeHTML(c.docente)}</h3>
                        <span class="stat-label">
                            ${escapeHTML(c.tipo_contrato)} · Jornada ${escapeHTML(c.jornada || '—')} ·
                            ${c.clases} clase(s) programada(s)
                        </span>
                    </div>
                    <div class="carga-cifra ${nivel}">
                        <span class="carga-horas">${textoHoras(c.horas)}</span>
                        <span class="stat-label">de ${c.tope_horas} h · ${c.porcentaje}%</span>
                    </div>
                </div>
                <div class="carga-pista grande">
                    <div class="carga-relleno ${nivel}" style="width:${Math.min(c.porcentaje, 100)}%"></div>
                </div>
                ${estado}
                <div class="carga-dias">${dias}</div>
            </div>`;
    }

    function aplicarFiltroDocente(valor) {
        docenteFiltrado = (valor === '' || valor === null) ? null : parseInt(valor, 10);
        const sel = $('filtro-horario-docente');
        if (sel) sel.value = docenteFiltrado === null ? '' : String(docenteFiltrado);
        renderHorarios();
    }

    if ($('filtro-horario-docente')) {
        $('filtro-horario-docente').addEventListener('change', (e) => aplicarFiltroDocente(e.target.value));
        $('btn-limpiar-filtro-docente').addEventListener('click', () => aplicarFiltroDocente(''));
    }
    const HORA_PX = 56;
    const DIAS_BD = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
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

    function minutos(hhmmss) {
        const partes = String(hhmmss).split(':');
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
    function colorAsignatura(id) { return PALETA_CAL[Math.abs(Number(id) || 0) % PALETA_CAL.length]; }
    function capitalizar(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

    function clasesDeFecha(fecha) {
        const nombreDia = DIAS_BD[fecha.getDay()];
        return horariosVisibles()
            .filter(h => h.dia_semana === nombreDia)
            .sort((a, b) => String(a.hora_inicio).localeCompare(String(b.hora_inicio)));
    }

    function rangoHoras() {
        let ini = 6 * 60, fin = 18 * 60;
        horariosVisibles().forEach(h => {
            ini = Math.min(ini, minutos(h.hora_inicio));
            fin = Math.max(fin, minutos(h.hora_fin));
        });
        ini = Math.floor(ini / 60) * 60;
        fin = Math.ceil(fin / 60) * 60;
        if (fin <= ini) fin = ini + 60;
        return { ini, fin };
    }

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
        const top = ((it.ini - offsetIni) / 60) * HORA_PX;
        const alto = Math.max(((it.fin - it.ini) / 60) * HORA_PX - 3, 22);
        const ancho = 100 / it.totalCols;
        const izq = it.col * ancho;
        const conflicto = conflictosDe(h).length > 0;
        const compacto = alto < 46 ? ' compacto' : '';
        const titulo = `${h.asignatura} · ${h.curso} · ${h.docente} (${hhmm(h.hora_inicio)}-${hhmm(h.hora_fin)})`;
        return `<div class="cal-evento${compacto}${conflicto ? ' conflicto' : ''}"
            style="top:${top}px;height:${alto}px;left:calc(${izq}% + 2px);width:calc(${ancho}% - 4px);background:${colorAsignatura(h.idAsignatura)}"
            data-id="${h.idHorario}"
            title="${escapeHTML(titulo)}">
            <span class="ev-hora">${hhmm(h.hora_inicio)}–${hhmm(h.hora_fin)}</span>
            <span class="ev-titulo">${escapeHTML(h.asignatura || '—')}</span>
            <span class="ev-sub">${escapeHTML(h.curso || '—')} · ${escapeHTML(h.docente || '—')}</span>
        </div>`;
    }

    function renderColumnaDia(fecha, ini, fin) {
        const nLineas = Math.round((fin - ini) / 60);
        let lineas = '';
        for (let i = 0; i <= nLineas; i++) {
            lineas += `<div class="cal-hline" style="top:${i * HORA_PX}px"></div>`;
        }
        const items = clasesDeFecha(fecha).map(h => ({
            h, ini: minutos(h.hora_inicio), fin: minutos(h.hora_fin)
        }));
        empaquetarEventos(items);
        const eventos = items.map(it => eventoHTML(it, ini)).join('');
        const hoy = new Date();
        const clase = mismaFecha(fecha, hoy) ? 'cal-col hoy' : 'cal-col';
        return `<div class="${clase}" data-fecha="${isoFecha(fecha)}">${lineas}${eventos}</div>`;
    }

    function renderSemanaODia(dias) {
        const { ini, fin } = rangoHoras();
        const altura = ((fin - ini) / 60) * HORA_PX;
        const hoy = new Date();

        const cabecera = dias.map(f => `
            <div class="cal-dia-cab ${mismaFecha(f, hoy) ? 'hoy' : ''}" data-fecha="${isoFecha(f)}" data-ir-dia="1">
                <span class="dia">${DIAS_CORTO[f.getDay()]}</span>
                <span class="num">${f.getDate()}</span>
            </div>`).join('');

        let etiquetas = '';
        for (let m = ini, i = 0; m <= fin; m += 60, i++) {
            etiquetas += `<div class="cal-hlbl" style="top:${(i * HORA_PX) - 7}px">${pad2(m / 60)}:00</div>`;
        }

        const columnas = dias.map(f => renderColumnaDia(f, ini, fin)).join('');
        const nDias = dias.length;

        return `
        <div class="cal-semana" style="--cal-dias:${nDias}">
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
            const chips = clases.slice(0, 3).map(h =>
                `<div class="cal-chip" data-id="${h.idHorario}" style="background:${colorAsignatura(h.idAsignatura)}"
                    title="${escapeHTML(`${h.asignatura} · ${h.curso} · ${h.docente}`)}">
                    ${hhmm(h.hora_inicio)} ${escapeHTML(h.asignatura || '—')}</div>`).join('');
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
        const sab = sumarDias(lun, 5);
        return `${lun.getDate()} ${MESES_CORTO[lun.getMonth()]} – ` +
            `${sab.getDate()} ${MESES_CORTO[sab.getMonth()]} ${sab.getFullYear()}`;
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
            for (let i = 0; i < 6; i++) semana.push(sumarDias(lun, i));
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

    function listarConflictos() {
        const pares = [];
        for (let i = 0; i < db.horarios.length; i++) {
            for (let j = i + 1; j < db.horarios.length; j++) {
                const a = db.horarios[i], b = db.horarios[j];
                if (a.dia_semana === b.dia_semana &&
                    seSolapan(a.hora_inicio, a.hora_fin, b.hora_inicio, b.hora_fin) &&
                    (Number(a.idDocente) === Number(b.idDocente) || Number(a.idCurso) === Number(b.idCurso))) {
                    pares.push({ a, b, motivo: Number(a.idDocente) === Number(b.idDocente) ? 'Docente' : 'Curso' });
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
        $('stat-estudiantes').textContent =
            db.cursos.reduce((s, c) => s + (Number(c.numero_estudiantes) || 0), 0);

        const conflictos = listarConflictos();
        $('stat-conflictos').textContent = conflictos.length;

        const jornadas = ['Mañana', 'Tarde', 'Mixta'];
        $('tabla-jornadas').innerHTML = jornadas.map(j => {
            const cursosJ = db.cursos.filter(c => c.jornada === j);
            const idsJ = cursosJ.map(c => Number(c.idCurso));
            const clasesJ = db.horarios.filter(h => idsJ.includes(Number(h.idCurso))).length;
            const estJ = cursosJ.reduce((s, c) => s + (Number(c.numero_estudiantes) || 0), 0);
            return `<tr>
                <td>${badgeJornada(j)}</td>
                <td>${cursosJ.length}</td>
                <td>${estJ}</td>
                <td>${clasesJ}</td>
            </tr>`;
        }).join('');

        const cont = $('lista-conflictos');
        if (conflictos.length === 0) {
            cont.innerHTML = '<div class="alert alert-success">No hay conflictos de horario en la programación actual.</div>';
        } else {
            cont.innerHTML = conflictos.map(({ a, b, motivo }) => {
                const ref = motivo === 'Docente'
                    ? `El docente <strong>${escapeHTML(a.docente)}</strong>`
                    : `El curso <strong>${escapeHTML(a.curso)}</strong>`;
                return `<div class="alert alert-danger">
                    ${ref} está asignado simultáneamente el <strong>${escapeHTML(a.dia_semana)}</strong>:
                    ${hhmm(a.hora_inicio)}-${hhmm(a.hora_fin)} (${escapeHTML(a.asignatura)} / ${escapeHTML(a.curso)})
                    y ${hhmm(b.hora_inicio)}-${hhmm(b.hora_fin)} (${escapeHTML(b.asignatura)} / ${escapeHTML(b.curso)}).
                </div>`;
            }).join('');
        }
    }

    $('consulta-tipo').addEventListener('change', actualizarValoresConsulta);
    $('btn-consultar').addEventListener('click', ejecutarConsulta);

    function actualizarValoresConsulta() {
        const tipo = $('consulta-tipo').value;
        const sel = $('consulta-valor');
        let opciones = [];
        if (tipo === 'curso') {
            opciones = db.cursos.map(c => ({ v: c.idCurso, t: `${c.curso} — ${c.jornada}` }));
        } else if (tipo === 'docente') {
            opciones = db.docentes.map(d => ({ v: d.idDocente, t: nombreDocente(d) }));
        } else if (tipo === 'asignatura') {
            opciones = db.asignaturas.map(a => ({ v: a.idAsignatura, t: a.nombre_asignatura }));
        } else if (tipo === 'jornada') {
            opciones = ['Mañana', 'Tarde', 'Mixta'].map(j => ({ v: j, t: j }));
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
            filas = filas.filter(h => Number(h.idCurso) === parseInt(valor, 10));
        } else if (tipo === 'docente') {
            filas = filas.filter(h => Number(h.idDocente) === parseInt(valor, 10));
        } else if (tipo === 'asignatura') {
            filas = filas.filter(h => Number(h.idAsignatura) === parseInt(valor, 10));
        } else if (tipo === 'jornada') {
            filas = filas.filter(h => h.jornada === valor);
        }

        const ordenDias = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        filas.sort((x, y) => (ordenDias.indexOf(x.dia_semana) - ordenDias.indexOf(y.dia_semana)) ||
            String(x.hora_inicio).localeCompare(String(y.hora_inicio)));

        if (filas.length === 0) {
            tbody.innerHTML = filaVacia(6, 'No se encontraron clases para esta consulta.');
            return;
        }

        tbody.innerHTML = filas.map(h => `
            <tr>
                <td>${escapeHTML(h.curso)}</td>
                <td>${badgeJornada(h.jornada)}</td>
                <td>${escapeHTML(h.asignatura)}</td>
                <td>${escapeHTML(h.docente)}</td>
                <td>${escapeHTML(h.dia_semana)}</td>
                <td>${hhmm(h.hora_inicio)} - ${hhmm(h.hora_fin)}</td>
            </tr>`).join('');
    }

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

    (async () => {
        initCalendario();
        try {
            await recargarTodo();
        } catch (error) {
            console.error('Error al inicializar:', error);
            document.querySelector('.container').insertAdjacentHTML('afterbegin',
                '<div class="alert alert-danger">No se pudieron cargar los datos desde el servidor. ' +
                'Verifique que Apache y MySQL estén activos en XAMPP y recargue la página.</div>');
        }
    })();
});
