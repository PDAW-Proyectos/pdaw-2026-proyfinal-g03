
const diasOrdenados = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']

// Formateador nativo para mostrar las fechas en formato corto (DD/MM/YYYY).
const formatoFecha = new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short', 
    timeZone: 'America/Argentina/Buenos_Aires'
})
// Crea un elemento HTML de forma segura.
const crearElemento = (etiqueta, clases, texto) => {
    const elemento = document.createElement(etiqueta)
    if (clases) {
        elemento.className = clases
    }
    if (texto !== undefined) { 
        elemento.textContent = texto
    }
    return elemento
}

// Muestra un mensaje centrado dentro de un contenedor (usado para estados vacíos o errores).
const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
    contenedor.replaceChildren(crearElemento('div', `trainer-card ${clase}`, mensaje))
    contenedor.setAttribute('aria-busy', 'false')
}

// Muestra un indicador visual de carga ("Cargando...").
const mostrarCargando = (contenedor) => {
    contenedor.replaceChildren(crearElemento('div', 'trainer-card text-gray', 'Cargando...'))
    contenedor.setAttribute('aria-busy', 'true')
}
// Actualiza el texto de resumen (ej: "5 clases activas") en la cabecera de una sección.
const actualizarResumen = (id, texto) => {
    const resumen = document.getElementById(id)
    if (resumen) {
        resumen.textContent = texto
    }
}
// Realiza una petición HTTP para obtener una página de datos del backend.
// Maneja respuestas en formato Array plano o en formato paginado { data, total, limit }.
const obtenerPagina = async (recurso, pagina) => {
    const respuesta = await fetch(`/api/${recurso}?page=${pagina}&limit=50`, {
        credentials: 'include'
    })
    const resultado = await respuesta.json()

    if (!respuesta.ok) {
        throw new Error(resultado.error || `No se pudieron cargar ${recurso}.`)
    }
    
    // Si el backend devuelve un array directo, adaptamos la estructura
    if (Array.isArray(resultado)) {
        return { data: resultado, total: resultado.length, limit: 50 }
    }
    
    if (!Array.isArray(resultado.data)) {
        throw new Error(`La respuesta de ${recurso} no tiene el formato esperado.`)
    }

    return {
        data: resultado.data,
        total: resultado.total || resultado.data.length,
        limit: resultado.limit || 50
    }
}

// Trae todos los registros de un recurso, iterando sobre todas las páginas si es necesario.
// Hace las peticiones en paralelo para mayor velocidad.
const obtenerDatos = async (recurso) => {
    const primeraPagina = await obtenerPagina(recurso, 1)
    const paginasRestantes = Math.ceil(primeraPagina.total / primeraPagina.limit) - 1
    
    if (paginasRestantes <= 0) {
        return primeraPagina.data
    }

    const respuestas = await Promise.all(
        Array.from({ length: paginasRestantes }, (_, indice) =>
            obtenerPagina(recurso, indice + 2)
        )
    )
    
    // Juntamos los datos de todas las páginas en un solo array
    return primeraPagina.data.concat(...respuestas.map((respuesta) => respuesta.data))
}
// Renderiza la lista de actividades del instructor calculando el resumen superior
// y dibujando cada tarjeta con su título, fecha, horario y cupos.
const renderizarActividades = (actividades) => {
    const contenedor = document.getElementById('instructor-actividades-lista')
    if (!contenedor) return
    contenedor.replaceChildren()
    
    // Cálculos para el resumen superior (activas, inactivas, inscriptos)
    const activas = actividades.filter((a) => a.estado !== 'inactiva').length
    const inactivas = actividades.length - activas
    const totalInscriptos = actividades.reduce((total, actividad) => {
        const inscriptos = Array.isArray(actividad.inscriptosIds) ? actividad.inscriptosIds.length : (actividad.inscriptos || 0)
        return total + inscriptos
    }, 0)

    actualizarResumen('instructor-actividades-resumen', `${actividades.length} actividades · ${activas} activas · ${inactivas} inactivas · ${totalInscriptos} inscriptos totales`)
    
    if (actividades.length === 0) {
        mostrarMensaje(contenedor, 'No tenés actividades creadas todavía.')
        return
    }
    
    // Ordenamos las actividades por fecha antes de dibujarlas
    actividades
        .slice()
        .sort((a, b) => {
            const fechaA = a.fechaHora || ''
            const fechaB = b.fechaHora || ''
            return fechaA.localeCompare(fechaB)
        })
        .forEach((actividad) => {
            const tarjeta = crearElemento('article', 'trainer-card d-flex justify-content-between align-items-center flex-wrap gap-3')
            
            // Estilos visuales para las actividades inactivas
            if (actividad.estado === 'inactiva') {
                tarjeta.classList.add('opacity-50')
                tarjeta.style.borderStyle = 'dashed'
            }
            
            const info = crearElemento('div', 'admin-card-info flex-grow-1')
            const encabezado = crearElemento('div', 'd-flex align-items-center gap-2 mb-1 flex-wrap')
            const titulo = crearElemento('h4', 'text-white mb-0', actividad.titulo || 'Clase sin título')
            
            const estado = crearElemento('span', actividad.estado === 'inactiva' ? 'badge bg-secondary text-white fs-12' : 'badge badge-green fs-12', actividad.estado === 'inactiva' ? 'Inactiva' : 'Activa')
            const tipo = crearElemento('span', 'badge bg-dark border border-secondary text-gray fs-12', 'Fecha Única')
            
            encabezado.append(titulo, estado, tipo)
            
            // Formateo de la fecha y hora (sumando la duración para calcular el fin)
            let textoDias = 'Sin fecha'
            let horaInicio = '--:--'
            let horaFin = '--:--'

            if (actividad.fechaHora) {
                const fechaObj = new Date(actividad.fechaHora)
                textoDias = formatoFecha.format(fechaObj)
                horaInicio = fechaObj.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                
                if (actividad.duracionMin) {
                    const fechaFin = new Date(fechaObj.getTime() + actividad.duracionMin * 60000)
                    horaFin = fechaFin.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                }
            }
            
            const cupoMaximo = actividad.cupoMaximo || actividad.cupo || 10
            const detalle = crearElemento('p', 'text-gray mb-2 fs-13', `${textoDias} · ${horaInicio} a ${horaFin} hs · Cupo: ${cupoMaximo}`)
            
            const inscriptos = Array.isArray(actividad.inscriptosIds) ? actividad.inscriptosIds.length : (actividad.inscriptos || 0)
            const cuposDisponibles = cupoMaximo - inscriptos
            const claseInscriptos = inscriptos === 0 ? 'text-gray' : 'text-green'
            
            const infoInscriptos = crearElemento('div', 'd-flex align-items-center gap-2')
            infoInscriptos.append(crearElemento('span', `${claseInscriptos} fs-13`, ` ${inscriptos} inscriptos · ${cuposDisponibles} cupos disponibles`))
            info.append(encabezado, detalle, infoInscriptos)
            // Botón de acción (deshabilitado si la clase está inactiva)
            const acciones = crearElemento('div', 'd-flex gap-2 flex-wrap')
            const btnInscriptos = crearElemento('button', 'trainer-btn-icon', 'Inscriptos')
            btnInscriptos.type = 'button'
            btnInscriptos.disabled = actividad.estado === 'inactiva'
            acciones.append(btnInscriptos)
            
            tarjeta.append(info, acciones)
            contenedor.append(tarjeta)
        })
        
    contenedor.setAttribute('aria-busy', 'false')
}
// Renderiza los bloqueos de agenda (imprevistos) del instructor.
const renderizarBloqueos = (bloqueos) => {
    const contenedor = document.getElementById('instructor-bloqueos-lista')
    if (!contenedor) return
    contenedor.replaceChildren()
    
    // Contamos cuántos bloqueos están vigentes (fecha de fin mayor o igual a hoy)
    const actuales = bloqueos.filter((b) => {
        const hoy = new Date() 
        hoy.setHours(0, 0, 0, 0)
        const fin = new Date(`${b.fin}T00:00:00`)
        return fin >= hoy
    }).length
    
    actualizarResumen('instructor-bloqueos-resumen', `${bloqueos.length} bloqueos · ${actuales} vigentes`)
    
    if (bloqueos.length === 0) {
        mostrarMensaje(contenedor, 'No tenés bloqueos activos.')
        return
    }
    bloqueos
        .slice()
        .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
        .forEach((bloqueo) => {
            const tarjeta = crearElemento('div', 'p-3 rounded d-flex justify-content-between align-items-center mb-2')
            tarjeta.style.backgroundColor = '#1e1e1e'
            tarjeta.style.border = '1px solid #333'
            // Si el bloqueo fue impuesto por el admin, lo mostramos con menor opacidad
            if (bloqueo.bloqueadoPorAdmin) {
                tarjeta.style.opacity = '0.8'
            }            
            const info = crearElemento('div')
            info.append(
                crearElemento('span', 'text-white d-block fs-14', bloqueo.motivo || 'Imprevisto Personal'),
                crearElemento('span', 'text-gray fs-12', `${formatoFecha.format(new Date(`${bloqueo.inicio}T00:00:00`))} al ${formatoFecha.format(new Date(`${bloqueo.fin}T00:00:00`))}`)
            )
           tarjeta.append(info)
            
            // Los bloqueos del admin no se pueden eliminar (solo se informan)
            if (bloqueo.bloqueadoPorAdmin) {
                tarjeta.append(crearElemento('span', 'badge bg-dark border border-secondary text-gray fs-12', 'Bloqueado'))
            } else {
                const btnEliminar = crearElemento('button', 'admin-btn-icon text-danger', '✕')
                btnEliminar.type = 'button'
                btnEliminar.title = 'Eliminar bloqueo'
                btnEliminar.dataset.bloqueoId = bloqueo.id
                tarjeta.append(btnEliminar)
            }
            contenedor.append(tarjeta)
        })
    contenedor.setAttribute('aria-busy', 'false')
}
// Envuelve el proceso de buscar datos y renderizar, mostrando estados de carga y error.
const cargarYRenderizar = async (recurso, renderizar, idContenedor, idResumen) => {
    const contenedor = document.getElementById(idContenedor)
    if (!contenedor) return
    mostrarCargando(contenedor)
    try {
        renderizar(await obtenerDatos(recurso))
    } catch (error) {
        actualizarResumen(idResumen, 'Resumen no disponible.')
        mostrarMensaje(contenedor, error.message, 'text-danger')
    }
}
// Función principal que se exporta. 
// Llena los datos del perfil del instructor y dispara la carga de sus actividades.
export function inicializarRenderizadoInstructor(usuario) {
    // Llenado del perfil básico
    if (document.getElementById('perfil-nombre')) {
        document.getElementById('perfil-nombre').value = usuario.nombre || ''
    }
    if (document.getElementById('perfil-dni')) {
        document.getElementById('perfil-dni').value = usuario.dni || usuario.id || ''
    }
    if (document.getElementById('perfil-email')) {
        document.getElementById('perfil-email').value = usuario.email || ''
    }
    if (document.getElementById('perfil-telefono')) {
        document.getElementById('perfil-telefono').value = usuario.telefono || 'No registrado'
    }
    
    // Llenado del horario base
    const selectDias = document.getElementById('perfil-dias-trabajo')
    const inputEntrada = document.getElementById('perfil-horario-entrada')
    const inputSalida = document.getElementById('perfil-horario-salida')
    
    if (selectDias && usuario.diasTrabajo) {
        const match = Array.from(selectDias.options).find((o) => o.text === usuario.diasTrabajo)
        if (match) { 
            selectDias.value = match.value
        }
    }
    if (inputEntrada && usuario.horarioEntrada) {
        inputEntrada.value = usuario.horarioEntrada
    }
    if (inputSalida && usuario.horarioSalida) {
        inputSalida.value = usuario.horarioSalida
    }
    
    // Carga de la lista de actividades desde la API
    cargarYRenderizar('clases', renderizarActividades, 'instructor-actividades-lista', 'instructor-actividades-resumen')
    
    // Estado por defecto de los bloqueos (ya que el backend aún no tiene esta ruta)
    const contenedorBloqueos = document.getElementById('instructor-bloqueos-lista')
    if (contenedorBloqueos) {
        contenedorBloqueos.replaceChildren(crearElemento('div', 'trainer-card text-gray', 'No tenés bloqueos activos.'))
        actualizarResumen('instructor-bloqueos-resumen', '0 bloqueos')
    }
}