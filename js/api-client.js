class ApiError extends Error {
    constructor(mensaje, codigo, extra) {
        super(mensaje);
        this.name = 'ApiError';
        this.codigo = codigo;
        this.extra = extra || {};
    }
}

const API = {
    BASE: 'backend/api',

    async peticion(recurso, { metodo = 'GET', datos = null, params = null } = {}) {
        let url = `${this.BASE}/${recurso}`;
        if (params) {
            const qs = new URLSearchParams(params).toString();
            if (qs) url += `?${qs}`;
        }

        const opciones = { method: metodo };
        if (datos !== null) {
            opciones.headers = { 'Content-Type': 'application/json' };
            opciones.body = JSON.stringify(datos);
        }

        let respuesta;
        try {
            respuesta = await fetch(url, opciones);
        } catch (e) {
            throw new ApiError('No se pudo conectar con el servidor. Verifique que Apache y MySQL estén activos.', 0);
        }

        let cuerpo;
        try {
            cuerpo = await respuesta.json();
        } catch (e) {
            throw new ApiError(`Respuesta inválida del servidor (HTTP ${respuesta.status}).`, respuesta.status);
        }

        if (cuerpo.status !== 'success') {
            const { status, mensaje, ...extra } = cuerpo;
            throw new ApiError(mensaje || 'Error desconocido del servidor.', respuesta.status, extra);
        }
        return cuerpo.data;
    },

    async leer(recurso, porDefecto) {
        try {
            return await this.peticion(recurso);
        } catch (e) {
            console.error(`Error al leer ${recurso}:`, e.message);
            return porDefecto;
        }
    },

    obtenerCursos()       { return this.leer('cursos.php', []); },
    obtenerDocentes()     { return this.leer('docentes.php', []); },
    obtenerAsignaturas()  { return this.leer('asignaturas.php', []); },
    obtenerHorarios()     { return this.leer('horarios.php', []); },
    obtenerAsignaciones() { return this.leer('asignaciones.php', []); },
    obtenerResumen()      { return this.leer('resumen.php', null); },
    obtenerDocenteAsignaturas() { return this.leer('docente_asignaturas.php', []); },

    obtenerCargaDocentes() { return this.leer('carga_docentes.php', null); },

    obtenerCargaDocente(idDocente) {
        return this.peticion('carga_docentes.php', { params: { idDocente } });
    },

    crearCurso(datos)          { return this.peticion('cursos.php', { metodo: 'POST', datos }); },
    actualizarCurso(id, datos) { return this.peticion('cursos.php', { metodo: 'PUT', datos, params: { id } }); },
    eliminarCurso(id)          { return this.peticion('cursos.php', { metodo: 'DELETE', params: { id } }); },

    crearAsignatura(datos)          { return this.peticion('asignaturas.php', { metodo: 'POST', datos }); },
    actualizarAsignatura(id, datos) { return this.peticion('asignaturas.php', { metodo: 'PUT', datos, params: { id } }); },
    eliminarAsignatura(id)          { return this.peticion('asignaturas.php', { metodo: 'DELETE', params: { id } }); },

    crearDocente(datos)          { return this.peticion('docentes.php', { metodo: 'POST', datos }); },
    actualizarDocente(id, datos) { return this.peticion('docentes.php', { metodo: 'PUT', datos, params: { id } }); },
    eliminarDocente(id)          { return this.peticion('docentes.php', { metodo: 'DELETE', params: { id } }); },

    guardarAsignaturasDocente(idDocente, idAsignaturas) {
        return this.peticion('docente_asignaturas.php', {
            metodo: 'PUT', datos: { idAsignaturas }, params: { idDocente }
        });
    },

    crearHorario(datos, forzar)          {
        return this.peticion('horarios.php', { metodo: 'POST', datos, params: forzar ? { force: 1 } : null });
    },
    actualizarHorario(id, datos, forzar) {
        const params = forzar ? { id, force: 1 } : { id };
        return this.peticion('horarios.php', { metodo: 'PUT', datos, params });
    },
    eliminarHorario(id) { return this.peticion('horarios.php', { metodo: 'DELETE', params: { id } }); },

    crearAsignacion(datos) { return this.peticion('asignaciones.php', { metodo: 'POST', datos }); },
    eliminarAsignacion(id) { return this.peticion('asignaciones.php', { metodo: 'DELETE', params: { id } }); }
};
