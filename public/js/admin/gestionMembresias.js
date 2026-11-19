
import { cargarGestionMembresias } from './renderizado-membresias.js';
import { mostrarToast } from '../componentes/toast.js';

let modalConfirmacion = null;
let botonConfirmar = null;
let tituloModal = null;
let textoModal = null;
let errorModal = null;
let accionPendiente = null;

export function inicializarGestionMembresias() {
    const contenedorSolicitudes = document.getElementById(
        'admin-solicitudes-membresia'
    );
    const contenedorVencimientos = document.getElementById(
        'admin-membresias-vencer'
    );

    const elementoModal = document.getElementById(
        'modalConfirmarMembresia'
    );

    botonConfirmar = document.getElementById(
        'btnEjecutarConfirmacionMembresia'
    );
    tituloModal = document.getElementById(
        'tituloConfirmarMembresia'
    );
    textoModal = document.getElementById(
        'textoConfirmarMembresia'
    );
    errorModal = document.getElementById(
        'errorConfirmarMembresia'
    );

    if (
        !contenedorSolicitudes ||
        !contenedorVencimientos ||
        !elementoModal ||
        !botonConfirmar ||
        !tituloModal ||
        !textoModal ||
        !errorModal
    ) {
        return;
    }

    modalConfirmacion = bootstrap.Modal.getOrCreateInstance(
        elementoModal
    );

    contenedorSolicitudes.addEventListener(
        'click',
        manejarSolicitud
    );

    contenedorVencimientos.addEventListener(
        'click',
        manejarRenovacion
    );

    botonConfirmar.addEventListener(
        'click',
        confirmarAccion
    );

    elementoModal.addEventListener('hidden.bs.modal', () => {
        if (botonConfirmar.disabled) return;

        accionPendiente = null;
        limpiarModal();
    });
}

function abrirModal({
    titulo,
    mensaje,
    textoBoton,
    claseBoton = 'btn-green',
    accion
}) {
    if (!modalConfirmacion) return;

    accionPendiente = accion;

    tituloModal.textContent = titulo;
    textoModal.textContent = mensaje;

    botonConfirmar.textContent = textoBoton;
    botonConfirmar.className = `btn ${claseBoton}`;
    botonConfirmar.disabled = false;

    limpiarError();

    modalConfirmacion.show();
}

function limpiarError() {
    errorModal.textContent = '';
    errorModal.classList.add('d-none');
}

function limpiarModal() {
    limpiarError();

    tituloModal.textContent = 'CONFIRMAR OPERACIÓN';
    textoModal.textContent = '¿Querés continuar?';

    botonConfirmar.textContent = 'CONFIRMAR';
    botonConfirmar.className = 'btn btn-green';
    botonConfirmar.disabled = false;
}

async function manejarSolicitud(event) {
    const boton = event.target.closest('[data-accion]');
    if (!boton) return;

    const accion = boton.dataset.accion;

    if (!['aprobar-solicitud', 'rechazar-solicitud'].includes(accion)) {
        return;
    }

    const id = boton.dataset.id;
    const aprobar = accion === 'aprobar-solicitud';

    abrirModal({
        titulo: aprobar
            ? 'APROBAR CAMBIO DE PLAN'
            : 'RECHAZAR SOLICITUD',

        mensaje: aprobar
            ? '¿Confirmás la aprobación? El nuevo plan quedará pendiente y se aplicará cuando confirmes el próximo pago del miembro.'
            : '¿Estás seguro de que querés rechazar esta solicitud de cambio de plan?',

        textoBoton: aprobar ? 'APROBAR SOLICITUD' : 'RECHAZAR SOLICITUD',

        claseBoton: aprobar
            ? 'btn-green'
            : 'btn-danger',

        accion: async () => {
            await ejecutarAccion(
                boton,
                aprobar ? 'Aprobando...' : 'Rechazando...',
                `/api/solicitudesMembresia/${id}/${aprobar ? 'aprobar' : 'rechazar'}`,
                aprobar ? 'Solicitud aprobada' : 'Solicitud rechazada'
            );
        }
    });
}

async function manejarRenovacion(event) {
    const boton = event.target.closest(
        '[data-accion="renovar-membresia"]'
    );

    if (!boton) return;

    const miembroId = boton.dataset.id;

    abrirModal({
        titulo: 'CONFIRMAR PAGO Y RENOVACIÓN',

        mensaje: '¿Confirmás que recibiste el pago? Se renovará la membresía por 30 días. Si hay un cambio de plan aprobado, también se aplicará el nuevo plan.',

        textoBoton: 'CONFIRMAR PAGO',

        claseBoton: 'btn-green',

        accion: async () => {
            await ejecutarAccion(
                boton,
                'Renovando...',
                `/api/solicitudesMembresia/miembros/${miembroId}/renovar`,
                'Membresía renovada correctamente'
            );
        }
    });
}

async function confirmarAccion() {
    if (!accionPendiente || botonConfirmar.disabled) return;

    const accion = accionPendiente;

    botonConfirmar.disabled = true;
    botonConfirmar.textContent = 'PROCESANDO...';

    try {
        await accion();
        accionPendiente = null;
        modalConfirmacion.hide();
    } catch (error) {
        errorModal.textContent = error.message;
        errorModal.classList.remove('d-none');

        botonConfirmar.disabled = false;
        botonConfirmar.textContent = 'REINTENTAR';
    }
}

async function ejecutarAccion(
    boton,
    textoCarga,
    url,
    mensajeExito
) {
    const textoOriginal = boton.textContent;

    boton.disabled = true;
    boton.textContent = textoCarga;

    try {
        const respuesta = await fetch(url, {
            method: 'PATCH',
            credentials: 'include'
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.error || 'No se pudo completar la operación'
            );
        }

        mostrarToast(
            'Operación exitosa',
            mensajeExito,
            'success'
        );

        await cargarGestionMembresias();

    } catch (error) {
        boton.disabled = false;
        boton.textContent = textoOriginal;
        throw error;
    }
}
