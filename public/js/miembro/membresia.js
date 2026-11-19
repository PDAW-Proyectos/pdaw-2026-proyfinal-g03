import { mostrarToast } from '../componentes/toast.js';

export function inicializarSolicitudBaja(usuario) {
    const boton = document.getElementById('confirmarSolicitudBaja');
    const mensaje = document.getElementById('mensajeSolicitud');
    const modal = document.getElementById('modalSolicitarBaja');
    const botonBaja = document.getElementById('btnSolicitarBaja');
    const botonCambio = document.getElementById('btnCambiarPlan');

    if (!boton || !mensaje || !modal || !botonBaja) return;

    // Si ya hay una baja programada, ocultamos ambas opciones.
    if (usuario?.bajaMembresiaPendiente) {
        botonBaja.classList.add('d-none');
        botonCambio?.classList.add('d-none');

        mensaje.textContent =
            'Tu baja está programada. Tu membresía seguirá activa hasta la fecha de vencimiento.';
        mensaje.className = 'text-warning fs-13 mb-0';

        return;
    }

    boton.addEventListener('click', async () => {
        boton.disabled = true;
        boton.textContent = 'Enviando...';

        try {
            const respuesta = await fetch('/api/solicitudesMembresia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ tipo: 'baja' }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.detail ||
                    datos.error ||
                    'No se pudo solicitar la baja.'
                );
            }

            bootstrap.Modal.getOrCreateInstance(modal).hide();

            botonBaja.classList.add('d-none');
            botonCambio?.classList.add('d-none');

            mensaje.textContent =
                'Tu baja está programada. Tu membresía seguirá activa hasta la fecha de vencimiento.';
            mensaje.className = 'text-warning fs-13 mb-0';

            mostrarToast(
                'Solicitud enviada',
                'Tu baja entrará en vigencia cuando finalice el período abonado.',
                'success'
            );

        } catch (error) {
            mostrarToast('Error', error.message, 'error');

        } finally {
            boton.disabled = false;
            boton.textContent = 'Confirmar baja';
        }
    });
}

export function inicializarCambioPlan(usuario, solicitudCambio = null) {
    const boton = document.getElementById('confirmarCambioPlan');
    const select = document.getElementById('selectNuevoPlan');
    const mensaje = document.getElementById('mensajeSolicitud');
    const modal = document.getElementById('modalCambiarPlan');
    const botonAbrir = document.getElementById('btnCambiarPlan');
    const botonBaja = document.getElementById('btnSolicitarBaja');

    if (!boton || !select || !mensaje || !modal || !botonAbrir) return;

    // Baja programada: no se permiten más solicitudes.
    if (usuario?.bajaMembresiaPendiente) {
        botonAbrir.classList.add('d-none');
        botonBaja?.classList.add('d-none');

        mensaje.textContent =
            'Tu baja está programada. Tu membresía seguirá activa hasta la fecha de vencimiento.';
        mensaje.className = 'text-warning fs-13 mb-0';

        return;
    }

    // Cambio de plan pendiente: ocultamos ambas opciones.
    if (solicitudCambio?.estado === 'pendiente') {
        botonAbrir.classList.add('d-none');
        botonBaja?.classList.add('d-none');

        mensaje.textContent =
            'Tu solicitud de cambio de plan está pendiente de revisión.';
        mensaje.className = 'text-warning fs-13 mb-0';

        return;
    }

    // Cambio aprobado: se aplica cuando se confirme el próximo pago.
    // Cambio aprobado: mostrar el mensaje solamente si todavía falta aplicar el plan.
    if (solicitudCambio?.estado === 'aprobada') {
        if (usuario?.planMembresiaPendienteId) {
            mensaje.textContent =
                'Tu cambio de plan fue aprobado. Se aplicará cuando se confirme el próximo pago.';
            mensaje.className = 'text-warning fs-13 mb-0';
        } else {
            mensaje.textContent = '';
            mensaje.className = 'd-none';
        }
    } else if (solicitudCambio?.estado === 'rechazada') {
        mensaje.textContent =
            'Tu solicitud de cambio de plan fue rechazada. Podés realizar una nueva solicitud.';
        mensaje.className = 'text-danger fs-13 mb-0';
    }

    async function cargarPlanes() {
        select.replaceChildren();

        const opcionInicial = document.createElement('option');
        opcionInicial.value = '';
        opcionInicial.textContent = 'Cargando planes...';
        select.append(opcionInicial);
        select.disabled = true;

        try {
            const respuesta = await fetch('/api/membresias?page=1&limit=50', {
                credentials: 'include',
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.detail || datos.error || 'No se pudieron cargar los planes.'
                );
            }

            const planes = datos.data ?? [];

            select.replaceChildren();

            const opcionSeleccion = document.createElement('option');
            opcionSeleccion.value = '';
            opcionSeleccion.textContent = 'Seleccioná un plan';
            select.append(opcionSeleccion);

            const planesDisponibles = planes.filter(
                plan =>
                    plan.activo &&
                    String(plan.id) !== String(usuario?.planMembresiaId)
            );

            planesDisponibles.forEach(plan => {
                const opcion = document.createElement('option');
                opcion.value = plan.id;
                opcion.textContent =
                    `${plan.nombre} - $${plan.precioMensual}/mes`;
                select.append(opcion);
            });

            if (planesDisponibles.length === 0) {
                opcionSeleccion.textContent = 'No hay otros planes disponibles';
            }

            select.disabled = planesDisponibles.length === 0;
            boton.disabled = planesDisponibles.length === 0;

        } catch (error) {
            select.replaceChildren();

            const opcionError = document.createElement('option');
            opcionError.value = '';
            opcionError.textContent = 'Error al cargar los planes';
            select.append(opcionError);

            mensaje.textContent = error.message;
            mensaje.className = 'text-danger fs-13 mb-0';

            boton.disabled = true;
        }
    }

    modal.addEventListener('show.bs.modal', () => {
        cargarPlanes();
    });

    select.addEventListener('change', () => {
        if (mensaje.classList.contains('text-danger')) {
            mensaje.textContent = '';
        }
    });

    boton.addEventListener('click', async () => {
        const planSolicitadoId = select.value;

        if (!planSolicitadoId) {
            mensaje.textContent = 'Seleccioná un plan para continuar.';
            mensaje.className = 'text-danger fs-13 mb-0';
            return;
        }

        boton.disabled = true;
        boton.textContent = 'Enviando...';

        try {
            const respuesta = await fetch('/api/solicitudesMembresia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    tipo: 'cambio_plan',
                    planSolicitadoId,
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.detail ||
                    datos.error ||
                    'No se pudo solicitar el cambio de plan.'
                );
            }

            bootstrap.Modal.getOrCreateInstance(modal).hide();

            botonAbrir.classList.add('d-none');
            botonBaja?.classList.add('d-none');

            mensaje.textContent =
                'Tu solicitud de cambio de plan está pendiente de revisión.';
            mensaje.className = 'text-warning fs-13 mb-0';

            mostrarToast(
                'Solicitud enviada',
                'Tu solicitud de cambio de plan fue enviada correctamente.',
                'success'
            );

        } catch (error) {
            mensaje.textContent = error.message;
            mensaje.className = 'text-danger fs-13 mb-0';

        } finally {
            boton.textContent = 'Solicitar cambio';
            boton.disabled = false;
        }
    });
}