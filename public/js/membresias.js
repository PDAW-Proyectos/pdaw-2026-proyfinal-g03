const listaMembresias = document.getElementById('membresias-lista')
const formatoPrecio = new Intl.NumberFormat('es-AR', { 
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2
})

const crearElemento = (etiqueta, clases, texto) => {
    const elemento = document.createElement(etiqueta)
    elemento.className = clases
    elemento.textContent = texto
    return elemento
}

const mostrarMensaje = (mensaje, clase = 'text-gray') => {
    listaMembresias.replaceChildren(crearElemento('p', clase, mensaje))
    listaMembresias.setAttribute('aria-busy', 'false')
}

const renderizarMembresias = (membresias) => {
    listaMembresias.replaceChildren()

    if (membresias.length === 0) {
        mostrarMensaje('Por el momento no hay membresías disponibles.')
        return
    }

    membresias.forEach((membresia) => {
        const columna = crearElemento('div', 'col-lg-4 col-md-6')
        const tarjeta = crearElemento('article', 'pricing-card h-100 d-flex flex-column')
        const nombre = crearElemento('h2', 'h3 mb-1', membresia.nombre)
        const precio = crearElemento('h3', 'text-white mb-3 fw-bold')
        precio.style.fontFamily = "'Oswald', sans-serif"
        precio.append(
            document.createTextNode(formatoPrecio.format(membresia.precioMensual)),
            crearElemento('span', 'text-gray fs-6 fw-normal', ' / mes')
        )
        const descripcion = crearElemento(
            'p',
            'text-gray mb-4',
            membresia.descripcion || 'Consultá en el gimnasio para conocer los detalles de este plan.'
        )
        const elegir = crearElemento('a', 'btn btn-green w-100 mt-auto', `ELEGIR PLAN ${membresia.nombre}`)
        elegir.href = 'login.html'
        tarjeta.append(nombre, precio, descripcion, elegir)
        columna.append(tarjeta)
        listaMembresias.append(columna)
    })

    listaMembresias.setAttribute('aria-busy', 'false')
}

fetch('/api/publico/membresias?limit=50')
    .then(async (respuesta) => {
        const resultado = await respuesta.json()
        if (!respuesta.ok) throw new Error(resultado.error || 'No se pudieron cargar las membresías.')
        return resultado.data
    })
    .then(renderizarMembresias)
    .catch(() => mostrarMensaje('No se pudieron cargar las membresías. Intentá nuevamente más tarde.', 'text-danger'))
