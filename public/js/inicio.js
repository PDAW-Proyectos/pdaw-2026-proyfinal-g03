const actividadesDestacadas = document.getElementById('actividades-destacadas')
const membresiasInicio = document.getElementById('membresias-inicio')
const horariosInicio = document.getElementById('horarios-inicio')
const imagenActividad = "url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop')"
const formatoPrecio = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2
})
const ordenDias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']


const crearElemento = (etiqueta, clases, texto) => {
    const elemento = document.createElement(etiqueta)
    elemento.className = clases
    elemento.textContent = texto
    return elemento
}

const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
    contenedor.replaceChildren(crearElemento('p', clase, mensaje))
    contenedor.setAttribute('aria-busy', 'false')
}

const obtenerDatos = async (recurso) => {
    const respuesta = await fetch(`/api/publico/${recurso}?limit=50`)
    const resultado = await respuesta.json()
    if (!respuesta.ok) throw new Error(resultado.error || `No se pudieron cargar ${recurso}.`)
    return resultado.data
}

const renderizarActividades = (actividades) => {
    const proximas = actividades
        .filter((actividad) => new Date(actividad.fechaHora) >= new Date())
        .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
        .slice(0, 3)

    actividadesDestacadas.replaceChildren()

    if (proximas.length === 0) {
        mostrarMensaje(actividadesDestacadas, 'Por el momento no hay próximas actividades publicadas.')
        return
    }

    proximas.forEach((actividad, indice) => {
        const columna = crearElemento('div', 'col-md-4')
        const tarjeta = crearElemento('a', 'activity-card', '')
        tarjeta.href = 'actividades.html'
        tarjeta.style.backgroundImage = imagenActividad

        const etiqueta = crearElemento('div', 'activity-label', `${String(indice + 1).padStart(2, '0')} / ACTIVIDAD`)
        const contenido = document.createElement('div')
        const titulo = crearElemento('h3', 'mb-1 text-white', actividad.titulo)
        const descripcion = crearElemento(
            'p',
            'mb-0 text-gray fs-14',
            actividad.descripcion || 'Conocé más sobre esta actividad.'
        )

        contenido.append(titulo, descripcion)
        tarjeta.append(etiqueta, contenido)
        columna.append(tarjeta)
        actividadesDestacadas.append(columna)
    })

    actividadesDestacadas.setAttribute('aria-busy', 'false')
}

const renderizarMembresias = (membresias) => {
    membresiasInicio.replaceChildren()

    if (membresias.length === 0) {
        mostrarMensaje(membresiasInicio, 'Por el momento no hay membresías disponibles.')
        return
    }

    membresias.forEach((membresia) => {
        const columna = crearElemento('div', 'col-lg-4 col-md-6')
        const tarjeta = crearElemento('article', 'pricing-card h-100')
        const nombre = crearElemento('h3', 'mb-1', membresia.nombre)
        const precio = crearElemento('h4', 'text-white mb-3 fw-bold', '')
        precio.append(document.createTextNode(formatoPrecio.format(membresia.precioMensual)), crearElemento('span', 'text-gray fs-6 fw-normal', ' / mes')
        )
        const descripcion = crearElemento('p', 'text-gray mb-4', membresia.descripcion || 'Consultá en el gimnasio para conocer los detalles de este plan.')
        const enlace = crearElemento('a', 'btn btn-outline-custom w-100 mt-auto', 'CONOCER EL PLAN ↗')
        enlace.href = 'membresia.html'

        tarjeta.append(nombre, precio, descripcion, enlace)
        columna.append(tarjeta)
        membresiasInicio.append(columna)
    })

    membresiasInicio.setAttribute('aria-busy', 'false')
}

const renderizarHorarios = (horarios) => {
    horariosInicio.replaceChildren()

    if (horarios.length === 0) {
        mostrarMensaje(horariosInicio, 'Los horarios todavía no están publicados.')
        return
    }

    horarios.slice().sort((a, b) => ordenDias.indexOf(a.dia) - ordenDias.indexOf(b.dia)).forEach((horario) => {
            const dia =  `${horario.dia.charAt(0).toUpperCase()}${horario.dia.slice(1)}`
            const linea = crearElemento(
                'p',
                'mb-1',
                `${dia}: ${horario.apertura} a ${horario.cierre}`
            )
            horariosInicio.append(linea)
        })

    horariosInicio.setAttribute('aria-busy', 'false')
}

const cargarActividades = async () => {
    try {
        const actividades = await obtenerDatos('actividades')
        renderizarActividades(actividades)
    } catch (error) {
        mostrarMensaje(actividadesDestacadas, 'No se pudieron cargar las actividades. Intentá nuevamente más tarde.', 'text-danger')
    }
}

const cargarMembresias = async () => {
    try {
        const membresias = await obtenerDatos('membresias')
        renderizarMembresias(membresias)
    } catch (error) {
        mostrarMensaje(membresiasInicio, 'No se pudieron cargar las membresías. Intentá nuevamente más tarde.', 'text-danger')
    }
}

const cargarHorarios = async () => {
    try {
        const horarios = await obtenerDatos('horarios')
        renderizarHorarios(horarios)
    } catch (error) {
        mostrarMensaje(horariosInicio, 'No se pudieron cargar los horarios. Intentá nuevamente más tarde.', 'text-danger')
    }
}

cargarActividades()
cargarMembresias()
cargarHorarios()