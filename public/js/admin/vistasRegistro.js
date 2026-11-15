import { datosUsuario } from './estadoRegistro.js';
import { crearMensajeError, limpiarError } from './validacionesRegistro.js';
import { obtenerMembresias } from './servicioRegistro.js';

export const OBJETIVOS = [
    { id: 'perder_peso', valor: 'Perder peso', requierePesoMeta: true },
    { id: 'ganar_musculo', valor: 'Ganar músculo', requierePesoMeta: true },
    { id: 'mantener', valor: 'Mantener forma', requierePesoMeta: false },
    { id: 'resistencia', valor: 'Mejorar resistencia', requierePesoMeta: false }
];

// Genera la estructura inicial del modal.
export function formularioRegistroUsuario(contenedor) {
    contenedor.innerHTML = '';

    // Diálogo del modal.
    const div = document.createElement('div');
    div.classList.add('modal-dialog', 'modal-dialog-centered');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Encabezado.
    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = 'Registrar Nuevo Usuario';

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('btn-close');
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Cerrar');

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Formulario.
    const form = document.createElement('form');
    form.id = 'formRegistroUsuario';

    // Contenedor donde mostraremos los distintos pasos.
    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    const contenido = document.createElement('div');
    contenido.id = 'contenidoRegistro';

    const mensaje = document.createElement('div');
    mensaje.id = 'mensajeRegistro';

    modalBody.appendChild(contenido);
    modalBody.appendChild(mensaje);

    // Pie del modal.
    const modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer');

    const volver = document.createElement('button');
    volver.type = 'button';
    volver.id = 'volverRegistro';
    volver.classList.add('btn', 'btn-secondary');
    volver.textContent = 'Volver';
    volver.hidden = true;

    const siguiente = document.createElement('button');
    siguiente.type = 'button';
    siguiente.id = 'siguienteRegistro';
    siguiente.classList.add('btn', 'btn-primary');
    siguiente.textContent = 'Siguiente';

    modalFooter.appendChild(volver);
    modalFooter.appendChild(siguiente);

    // Armamos la estructura.
    form.appendChild(modalBody);
    form.appendChild(modalFooter);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(form);

    div.appendChild(modalContent);
    contenedor.appendChild(div);
}

// Muestra el primer paso del registro.
export function mostrarDatosPersonales() {
    const contenido = document.getElementById('contenidoRegistro');
    contenido.innerHTML = '';

    const campos = [
        { label: 'Nombre', type: 'text', id: 'nombre' },
        { label: 'Email', type: 'text', id: 'email' },
        { label: 'DNI', type: 'text', id: 'dni' },
        { label: 'Teléfono', type: 'text', id: 'telefono' }
    ];

    campos.forEach((campo) => {
        const divCampo = document.createElement('div');
        divCampo.classList.add('mb-3');

        const label = document.createElement('label');
        label.setAttribute('for', campo.id);
        label.classList.add('form-label');
        label.textContent = campo.label;

        const input = document.createElement('input');
        input.type = campo.type;
        input.id = campo.id;
        input.classList.add('form-control');
        input.value = datosUsuario[campo.id] || '';

        const error = crearMensajeError(campo.id);

        input.addEventListener('input', () => {
            limpiarError(campo.id);
        });

        divCampo.appendChild(label);
        divCampo.appendChild(input);
        divCampo.appendChild(error);

        contenido.appendChild(divCampo);
    });

    // Selector de rol.
    const divRol = document.createElement('div');
    divRol.classList.add('mb-3');

    const labelRol = document.createElement('label');
    labelRol.setAttribute('for', 'rol');
    labelRol.classList.add('form-label');
    labelRol.textContent = 'Rol';

    const selectRol = document.createElement('select');
    selectRol.id = 'rol';
    selectRol.classList.add('form-select');

    const opciones = [
        { value: '', text: 'Seleccionar rol' },
        { value: 'miembro', text: 'Alumno' },
        { value: 'instructor', text: 'Entrenador' }
    ];

    opciones.forEach((opcion) => {
        const option = document.createElement('option');
        option.value = opcion.value;
        option.textContent = opcion.text;
        selectRol.appendChild(option);
    });

    selectRol.value = datosUsuario.rol || '';

    const errorRol = crearMensajeError('rol');

    selectRol.addEventListener('change', () => limpiarError('rol'));

    divRol.appendChild(labelRol);
    divRol.appendChild(selectRol);
    divRol.appendChild(errorRol);

    contenido.appendChild(divRol);
}

// Muestra los datos específicos de un miembro.
export function mostrarDatosMiembro() {
    const contenido = document.getElementById('contenidoRegistro');
    contenido.innerHTML = '';

    const campos = [
        {
            label: 'Peso (kg)',
            id: 'peso',
            type: 'number',
            min: 20,
            max: 400,
            step: 0.1
        },
        {
            label: 'Altura (cm)',
            id: 'altura',
            type: 'number',
            min: 80,
            max: 250,
            step: 0.1
        },
        {
            label: 'Edad',
            id: 'edad',
            type: 'number',
            min: 14,
            max: 110,
            step: 1
        }
    ];

    campos.forEach((campo) => {
        const divCampo = document.createElement('div');
        divCampo.classList.add('mb-3');

        const label = document.createElement('label');
        label.setAttribute('for', campo.id);
        label.classList.add('form-label');
        label.textContent = campo.label;

        const input = document.createElement('input');
        input.type = campo.type;
        input.id = campo.id;
        input.classList.add('form-control');
        input.required = true;
        input.value = datosUsuario[campo.id] || '';

        const error = crearMensajeError(campo.id);

        input.addEventListener('input', () => {
            limpiarError(campo.id);
        });

        divCampo.appendChild(label);
        divCampo.appendChild(input);
        divCampo.appendChild(error);

        contenido.appendChild(divCampo);
    });

    const divObjetivo = document.createElement('div');
    divObjetivo.classList.add('mb-3');

    const labelObjetivo = document.createElement('label');
    labelObjetivo.setAttribute('for', 'objetivo');
    labelObjetivo.classList.add('form-label');
    labelObjetivo.textContent = 'Meta u objetivo';

    const selectObjetivo = document.createElement('select');
    selectObjetivo.id = 'objetivo';
    selectObjetivo.classList.add('form-select');
    selectObjetivo.required = true;

    const errorObjetivo = crearMensajeError('objetivo');

    selectObjetivo.addEventListener('change', () => {
        limpiarError('objetivo');
    });

    const opcionInicial = document.createElement('option');
    opcionInicial.value = '';
    opcionInicial.textContent = 'Seleccioná un objetivo';
    selectObjetivo.appendChild(opcionInicial);

    OBJETIVOS.forEach(objetivo => {
        const option = document.createElement('option');
        option.value = objetivo.id;
        option.textContent = objetivo.valor;
        selectObjetivo.appendChild(option);
    });

    selectObjetivo.value = datosUsuario.objetivo || '';

    divObjetivo.appendChild(labelObjetivo);
    divObjetivo.appendChild(selectObjetivo);
    divObjetivo.appendChild(errorObjetivo);

    contenido.appendChild(divObjetivo);

    // Contenedor para renderizar dinámicamente el peso meta.
    const divPesoMeta = document.createElement('div');
    divPesoMeta.id = 'campoPesoMeta';

    contenido.appendChild(divPesoMeta);

    // Renderizamos según el objetivo previamente seleccionado.
    mostrarCampoPesoMeta(selectObjetivo.value);

    // Escuchamos los cambios de objetivo.
    selectObjetivo.addEventListener('change', () => {
        mostrarCampoPesoMeta(selectObjetivo.value);
    });
}

export function mostrarCampoPesoMeta(objetivoId) {
    const contenedor = document.getElementById('campoPesoMeta');
    const inputAnterior = document.getElementById('pesoMeta');

    if (inputAnterior) {
        datosUsuario.pesoMeta = inputAnterior.value;
    }

    contenedor.innerHTML = '';

    const objetivo = OBJETIVOS.find(obj => obj.id === objetivoId);

    if (!objetivo || !objetivo.requierePesoMeta) {
        datosUsuario.pesoMeta = null;
        return;
    }

    const divCampo = document.createElement('div');
    divCampo.classList.add('mb-3');

    const label = document.createElement('label');
    label.setAttribute('for', 'pesoMeta');
    label.classList.add('form-label');
    label.textContent = 'Peso meta (kg)';

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'pesoMeta';
    input.classList.add('form-control');

    input.value = datosUsuario.pesoMeta ?? '';

    const error = crearMensajeError('pesoMeta');

    input.addEventListener('input', () => {
        limpiarError('pesoMeta');
    });

    divCampo.appendChild(label);
    divCampo.appendChild(input);
    divCampo.appendChild(error);
    contenedor.appendChild(divCampo);
}

// Muestra las membresías disponibles para el alumno.
export async function mostrarMembresias() {
    const contenido = document.getElementById('contenidoRegistro');
    contenido.innerHTML = '';

    const titulo = document.createElement('h6');
    titulo.textContent = 'Seleccioná una membresía';
    contenido.appendChild(titulo);

    try {
        const membresias = await obtenerMembresias();

        if (membresias.length === 0) {
            contenido.textContent = 'No hay membresías disponibles.';
            return;
        }

        const select = document.createElement('select');
        select.id = 'planMembresiaId';
        select.classList.add('form-select');

        const error = crearMensajeError('planMembresiaId');

        select.addEventListener('change', () => {
            limpiarError('planMembresiaId');
        });


        const opcionInicial = document.createElement('option');
        opcionInicial.value = '';
        opcionInicial.textContent = 'Seleccionar membresía';
        select.appendChild(opcionInicial);

        membresias.forEach((membresia) => {
            const opcion = document.createElement('option');

            opcion.value = membresia.id;
            opcion.textContent = `${membresia.nombre} - $${membresia.precioMensual} por mes`;

            select.appendChild(opcion);
        });

        select.value = datosUsuario.planMembresiaId || '';

        contenido.appendChild(select);
        contenido.appendChild(error);
    } catch (error) {
        const mensaje = document.getElementById('mensajeRegistro');
        mensaje.textContent = error.message;
    }
}

// Muestra la especialidad de un instructor.
export function mostrarDatosInstructor() {
    const contenido = document.getElementById('contenidoRegistro');
    contenido.innerHTML = '';

    const divCampo = document.createElement('div');
    divCampo.classList.add('mb-3');

    const label = document.createElement('label');
    label.setAttribute('for', 'especialidad');
    label.classList.add('form-label');
    label.textContent = 'Especialidad';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'especialidad';
    input.classList.add('form-control');
    input.required = true;
    input.maxLength = 80;
    input.value = datosUsuario.especialidad || '';

    const error = crearMensajeError('especialidad');

    input.addEventListener('input', () => {
        limpiarError('especialidad');
    });

    divCampo.appendChild(label);
    divCampo.appendChild(input);
    divCampo.appendChild(error);

    contenido.appendChild(divCampo);
}

export const mostrarToast = (titulo, mensaje, tipo = 'success') => {
    const toastEl = document.getElementById('miToast');
    const toastTitulo = document.getElementById('toast-titulo');
    const toastMensaje = document.getElementById('toast-mensaje');
    const toastIcono = document.getElementById('toast-icono');

    if (!toastEl) {
        alert(`${titulo}: ${mensaje}`);
        return;
    }

    toastTitulo.textContent = titulo;
    toastMensaje.textContent = mensaje;

    if (tipo === 'success') {
        toastIcono.className = 'bi bi-check-circle-fill text-success fs-5';
        toastEl.classList.remove('border-danger');
        toastEl.classList.add('border-start', 'border-4', 'border-success');
    } else {
        toastIcono.className = 'bi bi-exclamation-triangle-fill text-danger fs-5';
        toastEl.classList.remove('border-start', 'border-4', 'border-success');
        toastEl.classList.add('border-danger');
    }

    const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
        delay: 4000,
        autohide: true
    });
    toast.show();
};