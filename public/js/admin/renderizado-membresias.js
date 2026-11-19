async function obtenerJSON(url) {
    const respuesta = await fetch(url, {
        credentials: 'include',
    });
    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudieron cargar los datos');
    }
    return datos;
}

function crearElemento(etiqueta, clases, texto = '') {
    const elemento = document.createElement(etiqueta);
    if (clases) elemento.className = clases;
    elemento.textContent = texto;
    return elemento;
}

function formatearFecha(fecha) {
    if (!fecha) return 'Sin fecha';
    return new Date(fecha).toLocaleDateString('es-AR');
}

function obtenerNombreMiembro(miembros, id) {
    const miembro = miembros.find(miembro => String(miembro.id) === String(id));
    return miembro?.nombre || `Miembro ${id}`;
}

function obtenerNombrePlan(planes, id) {
    const plan = planes.find(plan => String(plan.id) === String(id));
    return plan?.nombre || 'Plan no disponible';
}

export async function cargarGestionMembresias() {
    const contenedorSolicitudes = document.getElementById('admin-solicitudes-membresia');
    const contenedorVencimientos = document.getElementById('admin-membresias-vencer');

    if (!contenedorSolicitudes || !contenedorVencimientos) return;
    try {
        const [datosSolicitudes, datosVencimientos, datosUsuarios, datosPlanes] =
            await Promise.all([
                obtenerJSON('/api/solicitudesMembresia'),
                obtenerJSON(`/api/solicitudesMembresia/miembros/por-vencer`),
                obtenerJSON(`/api/usuarios/miembros`),
                obtenerJSON('/api/membresias'),
            ]);

        const solicitudes = datosSolicitudes.solicitudes ?? [];
        const miembros = datosUsuarios.miembros ?? datosUsuarios.usuarios ?? [];
        const vencimientos = datosVencimientos.miembros ?? [];
        const planes = datosPlanes.data ?? [];

        renderizarSolicitudes(solicitudes, miembros, planes);
        renderizarVencimientos(vencimientos, planes);

    } catch (error) {
        contenedorSolicitudes.replaceChildren(
            crearElemento('div', 'admin-card text-danger', 'Error al cargar las solicitudes.')
        );
        contenedorVencimientos.replaceChildren(
            crearElemento('div', 'admin-card text-danger', 'Error al cargar los vencimientos.')
        );
        console.error(error);
    }
}


function renderizarSolicitudes(solicitudes, miembros, planes) {
    const contenedor = document.getElementById('admin-solicitudes-membresia');

    const pendientes = solicitudes.filter(
        solicitud => solicitud.tipo === 'cambio_plan' && solicitud.estado === 'pendiente'
    );

    if (!pendientes.length) {
        const vacio = crearElemento('div', 'membresia-vacio', 'No hay solicitudes de cambio de plan pendientes.');
        contenedor.replaceChildren(vacio);
        return;
    }

    const fragmento = document.createDocumentFragment();
    pendientes.forEach(solicitud => {
        const tarjeta = crearElemento('article', 'membresia-card membresia-card--solicitud');
        const informacion = crearElemento('div', 'membresia-info');
        const nombre = crearElemento('h4', 'membresia-nombre', obtenerNombreMiembro(miembros, solicitud.miembroId));
        const detalle = crearElemento('p', 'membresia-detalle', `Solicita cambiar al plan ${obtenerNombrePlan(planes, solicitud.planSolicitadoId)}`);
        const fecha = crearElemento('p', 'membresia-fecha', `Solicitud recibida el ${formatearFecha(solicitud.fechaSolicitud)}`);
        const estado = crearElemento('span', 'membresia-estado membresia-estado--proxima', 'Pendiente de revisión');
        informacion.append(nombre, detalle, fecha, estado);

        const acciones = crearElemento('div', 'membresia-acciones');

        const aprobar = crearElemento('button', 'membresia-btn membresia-btn-aprobar', 'Aprobar');
        aprobar.type = 'button';
        aprobar.dataset.accion = 'aprobar-solicitud';
        aprobar.dataset.id = solicitud.id;

        const rechazar = crearElemento('button', 'membresia-btn membresia-btn-rechazar', 'Rechazar');
        rechazar.type = 'button';
        rechazar.dataset.accion = 'rechazar-solicitud';
        rechazar.dataset.id = solicitud.id;

        acciones.append(aprobar, rechazar);
        tarjeta.append(informacion, acciones);
        fragmento.append(tarjeta);
    });

    contenedor.replaceChildren(fragmento);
}

function renderizarVencimientos(miembros, planes) {
    const contenedor = document.getElementById('admin-membresias-vencer');
    if (!miembros.length) {
        contenedor.replaceChildren(
            crearElemento('div', 'membresia-vacio', 'No hay membresías próximas a vencer.')
        );
        return;
    }

    const fragmento = document.createDocumentFragment();
    miembros.forEach(miembro => {
        const vencimiento = new Date(miembro.fechaVencimiento);
        const hoy = new Date();

        vencimiento.setHours(0, 0, 0, 0);
        hoy.setHours(0, 0, 0, 0);

        const vencida = vencimiento < hoy;
        const bajaPendiente = miembro.bajaMembresiaPendiente;

        const claseTarjeta = bajaPendiente
            ? 'membresia-card'
            : vencida
                ? 'membresia-card membresia-card--vencida'
                : 'membresia-card membresia-card--proxima';

        const tarjeta = crearElemento('article', claseTarjeta);
        const informacion = crearElemento('div', 'membresia-info');
        const nombre = crearElemento('h4', 'membresia-nombre', miembro.nombre);
        const plan = crearElemento('p', 'membresia-detalle', `Plan actual: ${obtenerNombrePlan(planes, miembro.planMembresiaId)}`);
        const fecha = crearElemento('p', 'membresia-fecha', `Vencimiento: ${formatearFecha(miembro.fechaVencimiento)}`);
        const estado = crearElemento('span',
            bajaPendiente
                ? 'membresia-estado membresia-estado--baja'
                : vencida
                    ? 'membresia-estado membresia-estado--vencida'
                    : 'membresia-estado membresia-estado--proxima',
            bajaPendiente
                ? 'Baja programada'
                : vencida
                    ? 'Membresía vencida'
                    : 'Próxima a vencer'
        );

        informacion.append(nombre, plan, fecha, estado);
        tarjeta.append(informacion);

        if (!bajaPendiente) {
            const acciones = crearElemento('div', 'membresia-acciones');

            const renovar = crearElemento('button', 'membresia-btn membresia-btn-renovar', 'Confirmar pago y renovar');
            renovar.type = 'button';
            renovar.dataset.accion = 'renovar-membresia';
            renovar.dataset.id = miembro.id;
            acciones.append(renovar);
            tarjeta.append(acciones);
        }

        fragmento.append(tarjeta);
    });

    contenedor.replaceChildren(fragmento);
}
