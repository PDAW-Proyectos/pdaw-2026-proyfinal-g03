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
                obtenerJSON(`/miembros`),
                obtenerJSON('/api/membresias'),
            ]);

        const solicitudes = datosSolicitudes.solicitudes ?? [];
        const miembros = datosUsuarios.miembros ?? datosUsuarios.usuarios ?? [];
        const vencimientos = datosVencimientos.miembros ?? [];
        const planes = datosPlanes.membresias ?? datosPlanes.planes ?? [];

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
    if (!solicitudes.length) {
        contenedor.replaceChildren(
            crearElemento('div', 'admin-card', 'No hay solicitudes pendientes.')
        );
        return;
    }

    solicitudes = solicitudes.filter(solicitud => solicitud.tipo === 'cambio_plan');
    const fragmento = document.createDocumentFragment();

    solicitudes.forEach(solicitud => {
        const tarjeta = crearElemento('div', 'admin-card');
        const fila = crearElemento('div', 'd-flex justify-content-between align-items-start flex-wrap gap-3');
        const informacion = crearElemento('div');
        const nombre = crearElemento('h5', 'text-white mb-2', obtenerNombreMiembro(miembros, solicitud.miembroId));
        const detalle =
            `Solicita cambiar al plan ${obtenerNombrePlan(
                planes,
                solicitud.planSolicitadoId
            )}.`;

        const descripcion = crearElemento('p', 'text-gray mb-1', detalle);
        const fecha = crearElemento('small', 'text-gray', `Solicitud del ${formatearFecha(solicitud.fechaSolicitud)}`);
        informacion.append(nombre, descripcion, fecha);

        const acciones = crearElemento('div', 'd-flex gap-2');

        const aprobar = crearElemento('button', 'btn btn-success btn-sm', 'Aprobar');
        aprobar.type = 'button';
        aprobar.dataset.accion = 'aprobar-solicitud';
        aprobar.dataset.id = solicitud.id;

        const rechazar = crearElemento('button', 'btn btn-outline-danger btn-sm', 'Rechazar');
        rechazar.type = 'button';
        rechazar.dataset.accion = 'rechazar-solicitud';
        rechazar.dataset.id = solicitud.id;

        acciones.append(aprobar, rechazar);
        fila.append(informacion, acciones);
        tarjeta.append(fila);
        fragmento.append(tarjeta);
    });

    contenedor.replaceChildren(fragmento);
}

function renderizarVencimientos(miembros, planes) {
    const contenedor = document.getElementById('admin-membresias-vencer');

    if (!miembros.length) {
        contenedor.replaceChildren(
            crearElemento('div', 'admin-card', 'No hay membresías próximas a vencer.'));
        return;
    }

    const fragmento = document.createDocumentFragment();
    miembros.forEach(miembro => {
        const tarjeta = crearElemento('div', 'admin-card');
        const fila = crearElemento('div', 'd-flex justify-content-between align-items-center flex-wrap gap-3');
        const informacion = crearElemento('div');
        const nombre = crearElemento('h5', 'text-white mb-2', miembro.nombre);

        const plan = crearElemento('p', 'text-gray mb-1', `Plan: ${obtenerNombrePlan(planes, miembro.planMembresiaId)}`);
        const fecha = crearElemento('p', 'text-gray mb-0', `Vencimiento: ${formatearFecha(miembro.fechaVencimiento)}`);
        const vencimiento = new Date(miembro.fechaVencimiento);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        vencimiento.setHours(0, 0, 0, 0);

        const vencida = vencimiento < hoy;
        const estado = crearElemento('span', vencida ? 'text-danger' : 'text-warning', vencida ? 'Membresía vencida' : 'Próxima a vencer');

        informacion.append(nombre, plan, fecha, estado);
        fila.append(informacion);

        if (!miembro.bajaMembresiaPendiente) {
            const renovar = crearElemento('button', 'btn btn-success btn-sm', 'Confirmar pago y renovar');
            renovar.type = 'button';
            renovar.dataset.accion = 'renovar-membresia';
            renovar.dataset.id = miembro.id;
            fila.append(renovar);
        } else {
            fila.append(crearElemento('span', 'text-gray', 'Baja aprobada'));
        }
        tarjeta.append(fila);
        fragmento.append(tarjeta);
    });
    contenedor.replaceChildren(fragmento);
}