// Crea un elemento HTML de forma segura .
const crearElemento = (etiqueta, clases, texto) => {
    const el = document.createElement(etiqueta)
    if (clases) el.className = clases
    if (texto !== undefined) el.textContent = texto
    return el
}
// Crea un párrafo (<p>) que contiene un ícono de Bootstrap Icons seguido de un texto.
const crearParrafoConIcono = (clases, iconoClases, texto) => {
    const p = crearElemento('p', clases)
    const i = crearElemento('i', iconoClases)
    p.append(i, document.createTextNode(` ${texto}`))
    return p
}

// Muestra un mensaje centrado dentro de un contenedor (ideal para estados vacíos o de error).
const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
    contenedor.replaceChildren(crearElemento('div', `user-card text-center py-4 ${clase}`, mensaje))
    contenedor.setAttribute('aria-busy', 'false')
}

// Petición fetch "segura" que maneja errores y adapta la respuesta a un array.
// Dependiendo de cómo responda el backend, extrae los datos de "json.data" o "json.items".
const fetchSeguro = async (url) => {
    try {
        const res = await fetch(url, { credentials: 'include' })
        if (!res.ok) return null
        const json = await res.json()
        if (Array.isArray(json)) return json
        if (json.data && Array.isArray(json.data)) return json.data
        if (json.items && Array.isArray(json.items)) return json.items
        return json
    } catch {
        return null
    }
}
// Dibuja un gráfico de líneas usando SVG nativo, sin librerías externas.
// Recibe un array con los registros de peso para graficar la evolución.
const dibujarGrafico = (registros) => {
    const contenedor = document.getElementById('contenedor-grafico')
    if (!contenedor) return

    // Validación: se necesitan al menos 2 pesajes para trazar una línea
    if (registros.length < 2) {
        contenedor.replaceChildren(crearElemento('div', 'text-gray text-center w-100 py-5', 'Registrá al menos 2 pesajes para ver tu gráfico de evolución.'))
        return
    }

    // Limpieza y preparación del contenedor
    contenedor.replaceChildren()
    contenedor.style.borderStyle = 'solid'
    contenedor.style.backgroundColor = '#1e1e1e'

    // Separación de datos para los ejes X e Y
    const datos = registros.map(r => Number(r.peso))
    const etiquetas = registros.map(r => { const d = new Date(r.fecha); return `${d.getDate()}/${d.getMonth() + 1}` })

    // Configuración de dimensiones del gráfico
    const width = 700, height = 280, paddingLeft = 50, paddingBottom = 40, paddingTop = 30, paddingRight = 30
    const chartWidth = width - paddingLeft - paddingRight
    const chartHeight = height - paddingTop - paddingBottom
    const maxPeso = Math.max(...datos) + 5
    const minPeso = Math.min(...datos) - 5
    const rangoPeso = (maxPeso - minPeso) || 1

    // Creación del lienzo SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%')

    // Dibujo de la cuadrícula y textos del eje Y (peso)
    for (let i = 0; i <= 4; i++) {
        const y = paddingTop + (i * (chartHeight / 4))
        const valorY = maxPeso - (i * (rangoPeso / 4))
        const linea = document.createElementNS('http://www.w3.org/2000/svg', 'line')
        linea.setAttribute('x1', paddingLeft); linea.setAttribute('y1', y)
        linea.setAttribute('x2', width - paddingRight); linea.setAttribute('y2', y)
        linea.setAttribute('stroke', '#333'); svg.appendChild(linea)

        const textoY = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        textoY.setAttribute('x', paddingLeft - 10); textoY.setAttribute('y', y + 4)
        textoY.setAttribute('fill', '#888'); textoY.setAttribute('font-size', '12'); textoY.setAttribute('text-anchor', 'end')
        textoY.textContent = valorY.toFixed(0); svg.appendChild(textoY)
    }

    // Cálculo de las coordenadas (x, y) de cada punto
    const puntos = datos.map((peso, index) => {
        const x = paddingLeft + (index * (chartWidth / (datos.length - 1)))
        const y = height - paddingBottom - ((peso - minPeso) / rangoPeso) * chartHeight
        return { x, y, peso, etiqueta: etiquetas[index] }
    })

    // Dibujo de la línea que une los puntos
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    polyline.setAttribute('points', puntos.map(p => `${p.x},${p.y}`).join(' '))
    polyline.setAttribute('fill', 'none'); polyline.setAttribute('stroke', '#3b82f6'); polyline.setAttribute('stroke-width', '3')
    svg.appendChild(polyline)

    // Dibujo de los círculos (puntos), el peso arriba y la fecha abajo
    puntos.forEach((p) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        circle.setAttribute('cx', p.x); circle.setAttribute('cy', p.y); circle.setAttribute('r', '5')
        circle.setAttribute('fill', '#1e1e1e'); circle.setAttribute('stroke', '#3b82f6'); circle.setAttribute('stroke-width', '2')
        svg.appendChild(circle)

        const textoPeso = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        textoPeso.setAttribute('x', p.x); textoPeso.setAttribute('y', p.y - 12)
        textoPeso.setAttribute('fill', '#3b82f6'); textoPeso.setAttribute('font-size', '12'); textoPeso.setAttribute('text-anchor', 'middle')
        textoPeso.textContent = p.peso; svg.appendChild(textoPeso)

        const textoX = document.createElementNS('http://www.w3.org/2000/svg', 'text')
        textoX.setAttribute('x', p.x); textoX.setAttribute('y', height - paddingBottom + 20)
        textoX.setAttribute('fill', '#ccc'); textoX.setAttribute('font-size', '12'); textoX.setAttribute('text-anchor', 'middle')
        textoX.textContent = p.etiqueta; svg.appendChild(textoX)
    })
    
    contenedor.appendChild(svg)
}

// Renderiza las tarjetas superiores del historial (IMC, Meta, Peso actual), 
// el resumen de progreso (Peso inicial, Diferencia) y arma la tabla de registros.
const renderizarHistorialYGrafico = (usuario) => {
    const seccion = document.getElementById('user-historial')
    if (!seccion) return

    // Se busca el historial en el JSON. Si no hay, se usa un array vacío.
    let registros = Array.isArray(usuario.historialPesos) ? [...usuario.historialPesos] : []
    
    // Ordenamos el historial del más antiguo al más nuevo
    registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha))

    const pesoDelUsuario = Number(usuario.peso || 0)
    const pesoInicial = registros.length > 0 ? Number(registros[0].peso) : pesoDelUsuario 
    const pesoMeta = Number(usuario.pesoMeta || 0)

    let imc = '-', diferencia = '-', pesoActualTxt = '-', pesoInicialTxt = '-', claseDif = 'text-gray';

    // Si hay altura y peso, calculamos el IMC y la diferencia
    if (pesoDelUsuario > 0 && usuario.altura) {
        const alturaM = usuario.altura / 100
        imc = (pesoDelUsuario / (alturaM * alturaM)).toFixed(1)
        pesoActualTxt = `${pesoDelUsuario} kg`
        pesoInicialTxt = `${pesoInicial} kg`
        
        const difNum = pesoDelUsuario - pesoInicial
        diferencia = `${difNum > 0 ? '+' : ''}${difNum.toFixed(1)} kg`
        claseDif = difNum <= 0 ? 'text-green' : 'text-danger'

        // Renderizado de la tabla de progreso
        const tbody = document.querySelector('#user-progreso tbody')
        if (tbody) {
            tbody.replaceChildren()
            if (registros.length === 0) {
                // Si no hay historial, mostramos una única fila con el peso actual
                const tr = crearElemento('tr')
                tr.append(
                    crearElemento('td', 'py-3 px-4 text-white', new Date().toLocaleDateString('es-AR')),
                    crearElemento('td', 'py-3 px-4 text-white', `${pesoDelUsuario} kg`),
                    crearElemento('td', 'py-3 px-4 text-end text-gray', '-')
                )
                tbody.append(tr)
            } else {
                // Si hay historial, mostramos las últimas 5 filas
                const ultimos = [...registros].reverse().slice(0, 5)
                ultimos.forEach((reg, index) => {
                    const tr = crearElemento('tr')
                    const fecha = new Date(reg.fecha)
                    const anterior = ultimos[index + 1]
                    const difReg = anterior ? (reg.peso - anterior.peso) : 0
                    const difTxt = difReg === 0 ? '-' : `${difReg > 0 ? '+' : ''}${difReg.toFixed(1)} kg`
                    const claseReg = difReg < 0 ? 'text-green' : (difReg > 0 ? 'text-danger' : 'text-gray')

                    tr.append(
                        crearElemento('td', 'py-3 px-4 text-white', fecha.toLocaleDateString('es-AR')),
                        crearElemento('td', 'py-3 px-4 text-white', `${reg.peso} kg`),
                        crearElemento('td', `py-3 px-4 text-end ${claseReg}`, difTxt)
                    )
                    tbody.append(tr)
                })
            }
        }
        // Llamamos a la función que dibuja el gráfico
        dibujarGrafico(registros)
    }

    // Actualización de los textos de las tarjetas superiores
    const tarjetas = seccion.querySelectorAll('.user-card h3')
    if (tarjetas.length >= 3) {
        tarjetas[0].textContent = imc
        tarjetas[1].textContent = pesoMeta > 0 ? `${pesoMeta} kg` : '-'
        tarjetas[2].textContent = pesoActualTxt
    }
    
    const h4s = seccion.querySelectorAll('.user-card h4')
    if (h4s.length >= 2) {
        h4s[0].textContent = pesoInicialTxt
        h4s[1].textContent = diferencia
        h4s[1].className = claseDif
    }
}

// Obtiene las clases disponibles desde el backend y las muestra en formato de lista.
// Muestra el botón "RESERVAR" solo si hay cupos disponibles.
const renderizarReservas = async () => {
    const contenedor = document.querySelector('#user-reservar .row.g-4')
    if (!contenedor) return   
    contenedor.className = 'd-flex flex-column gap-3 mb-5' 
    contenedor.replaceChildren()

    const clases = await fetchSeguro('/api/clases')
    const lista = Array.isArray(clases) ? clases : []

    if (lista.length === 0) {
        mostrarMensaje(contenedor, 'No hay clases disponibles en este momento.')
        return
    }

    // Ordenamos las clases por fecha
    lista.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))

    lista.forEach(clase => {
        const card = crearElemento('div', 'user-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3')
        const info = crearElemento('div', 'flex-grow-1')
        const titulo = crearElemento('h4', 'text-white mb-1 fs-5', clase.titulo || 'Clase')
        
        // Formateo de la fecha de "2026-12-05T18:00:00.000Z" a "05/12/2026 · 18:00 hs"
        let textoFechaHora = 'Fecha a confirmar'
        if (clase.fechaHora) {
            const [fecha, horaCompleta] = clase.fechaHora.split('T')
            const [anio, mes, dia] = fecha.split('-')
            const hora = horaCompleta.slice(0, 5)
            textoFechaHora = `${dia}/${mes}/${anio} · ${hora} hs`
        }

        const pFecha = crearParrafoConIcono('text-gray mb-1 fs-14', 'bi bi-calendar-event me-2 text-green', textoFechaHora)
        const pProfesor = crearParrafoConIcono('text-gray mb-0 fs-14', 'bi bi-person-badge me-2 text-green', clase.instructorNombre || `Prof. Asignado`)
        
        info.append(titulo, pFecha, pProfesor)

        const acciones = crearElemento('div', 'd-flex align-items-center gap-3')
        const cupo = clase.cupo || clase.cupoMaximo || 0
        const inscriptos = Array.isArray(clase.inscriptosIds) ? clase.inscriptosIds.length : 0
        const disponibles = clase.cuposDisponibles !== undefined ? clase.cuposDisponibles : (cupo - inscriptos)

        // Si hay cupos, mostramos el botón. Si no, solo el texto en rojo.
        if (disponibles > 0) {
            const textoCupo = crearElemento('span', 'text-green fs-14 fw-bold', `Quedan ${disponibles} lugares`)
            const btn = crearElemento('button', 'btn btn-green py-2 px-4 fs-14', 'RESERVAR')
            acciones.append(textoCupo, btn)
        } else {
            const textoCupo = crearElemento('span', 'text-danger fs-14 fw-bold', 'Sin cupo')
            acciones.append(textoCupo)
        }

        card.append(info, acciones)
        contenedor.append(card)
    })
}

// Obtiene y renderiza los turnos médicos disponibles desde el backend.
const renderizarTurnos = async () => {
    const contenedor = document.querySelector('#user-turnos .row.g-4')
    if (!contenedor) return
    contenedor.replaceChildren()

    const turnos = await fetchSeguro('/api/turnos')
    const lista = Array.isArray(turnos) ? turnos : []

    if (lista.length === 0) {
        mostrarMensaje(contenedor, 'No hay turnos médicos disponibles.')
        return
    }

    lista.forEach(turno => {
        const col = crearElemento('div', 'col-lg-6')
        const card = crearElemento('div', 'user-card h-100')   
        
        const header = crearElemento('div', 'd-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-secondary')
        const avatar = crearElemento('div', '')
        avatar.style.cssText = 'width: 60px; height: 60px; border-radius: 50%; background-color: #333; border: 2px solid var(--pulso-green); display: flex; align-items: center; justify-content: center; flex-shrink: 0;'
        
        const icon = crearElemento('i', 'bi bi-person text-green fs-4')
        avatar.append(icon)

        const infoHeader = crearElemento('div')
        infoHeader.append(
            crearElemento('h4', 'text-white mb-1', turno.profesional || 'Médico'),
            crearElemento('span', 'badge bg-dark border border-secondary text-gray fs-12', turno.especialidad || 'General')
        )
        header.append(avatar, infoHeader)

        const fechaObj = new Date(turno.fecha)
        const pFecha = crearParrafoConIcono('text-gray mb-2 fs-14', 'bi bi-calendar-event text-green me-2', `${fechaObj.toLocaleDateString('es-AR')} · ${turno.hora || '--:--'} hs`)

        card.append(header, pFecha)
        
        const btnReservar = crearElemento('button', 'btn btn-outline-custom py-1 px-3 fs-13 w-100 mt-3', 'RESERVAR TURNO')
        btnReservar.style.borderColor = 'var(--pulso-green)'
        btnReservar.style.color = 'var(--pulso-green)'
        card.append(btnReservar)

        col.append(card)
        contenedor.append(col)
    })
}
// Llena los inputs del perfil con los datos reales del usuario logueado.
const renderizarPerfil = (usuario) => {
    const asignarValor = (id, valor) => {
        const input = document.getElementById(id)
        if (input) input.value = valor !== undefined && valor !== null ? valor : ''
    }

    asignarValor('perfil-nombre', usuario.nombre)
    asignarValor('perfil-dni', usuario.dni || usuario.id)
    asignarValor('perfil-email', usuario.email)
    asignarValor('perfil-telefono', usuario.telefono)
    asignarValor('perfil-altura', usuario.altura)
    asignarValor('perfil-peso-inicial', usuario.peso)
    asignarValor('perfil-peso-meta', usuario.pesoMeta)
    
    // Traduce los valores del JSON ("perder_peso") a los values del HTML ("deficit")
    const selectObjetivo = document.getElementById('selectObjetivo')
    if (selectObjetivo && usuario.objetivo) {
        let valorSelect = usuario.objetivo;
        if (usuario.objetivo === 'perder_peso') valorSelect = 'deficit';
        if (usuario.objetivo === 'ganar_musculo') valorSelect = 'volumen';
        selectObjetivo.value = valorSelect;
    }
}
// Renderiza las notificaciones del miembro. 
// Si el backend no envía notificaciones, muestra un mensaje por defecto.
const renderizarNotificaciones = async (usuario) => {
    const contenedor = document.querySelector('#user-notificaciones .d-flex.flex-column.gap-3')
    if (!contenedor) return
    contenedor.replaceChildren()

    let lista = usuario.notificaciones

    if (!Array.isArray(lista) || lista.length === 0) {
        mostrarMensaje(contenedor, 'No tenés notificaciones nuevas.')
        return
    }

    lista.forEach(n => {
        const titulo = n.titulo || 'Aviso';
        const texto = n.texto || n.mensaje || '';
        const fecha = n.fecha ? new Date(n.fecha).toLocaleDateString('es-AR') : 'Reciente';
        const leida = n.leida || false;
        const icono = n.icono || 'bi-bell';

        const card = crearElemento('div', `user-card d-flex align-items-start gap-3 ${leida ? 'opacity-50' : 'border-start-green'}`)
        
        const iconDiv = crearElemento('div', 'p-3 rounded bg-pulso-darker')
        const iconTag = crearElemento('i', `bi ${icono} ${leida ? 'text-gray' : 'text-green'} fs-4`)
        iconDiv.append(iconTag)

        const info = crearElemento('div', 'flex-grow-1')
        const header = crearElemento('div', 'd-flex justify-content-between align-items-start')
        header.append(
            crearElemento('h5', 'text-white mb-1', titulo),
            crearElemento('span', 'badge bg-dark border border-secondary text-gray fs-12', fecha)
        )
        info.append(header, crearElemento('p', 'text-gray mb-0 fs-14', texto))

        card.append(iconDiv, info)
        contenedor.append(card)
    })
}
// Función principal que llama a todos los renderizadores para armar el panel.
export async function inicializarRenderizadoMiembro(usuario) {
    renderizarPerfil(usuario)
    renderizarHistorialYGrafico(usuario)
    await renderizarReservas()
    await renderizarTurnos()
    await renderizarNotificaciones(usuario)
}