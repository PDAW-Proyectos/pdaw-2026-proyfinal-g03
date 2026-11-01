let pasoActual = 1;
const datosUsuario = {};

// Genera la estructura inicial del modal.
function formularioRegistroUsuario(contenedor) {
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
function mostrarDatosPersonales() {

    const contenido = document.getElementById('contenidoRegistro');

    // Limpiamos el contenido anterior.
    contenido.innerHTML = '';

    const campos = [
        { label: 'Nombre', type: 'text', id: 'nombre' },
        { label: 'Email', type: 'email', id: 'email' },
        { label: 'DNI', type: 'text', id: 'dni' }
    ];

    // Generamos los campos personales.
    campos.forEach(campo => {
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

        divCampo.appendChild(label);
        divCampo.appendChild(input);

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
    selectRol.required = true;
    selectRol.value = datosUsuario.rol || '';

    const opciones = [
        { value: '', text: 'Seleccionar rol' },
        { value: 'miembro', text: 'Alumno' },
        { value: 'instructor', text: 'Entrenador' }
    ];

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion.value;
        option.textContent = opcion.text;
        selectRol.appendChild(option);
    });

    selectRol.value = datosUsuario.rol || '';

    divRol.appendChild(labelRol);
    divRol.appendChild(selectRol);

    contenido.appendChild(divRol);
}

// Muestra los datos específicos de un miembro.
function mostrarDatosMiembro() {
    const contenido = document.getElementById('contenidoRegistro');
    contenido.innerHTML = '';

    const campos = [
        { label: 'Peso (kg)', id: 'peso', type: 'number' },
        { label: 'Altura (cm)', id: 'altura', type: 'number' },
        { label: 'Edad', id: 'edad', type: 'number' }
    ];

    campos.forEach(campo => {
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

        divCampo.appendChild(label);
        divCampo.appendChild(input);

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

    const opciones = [
        { value: '', texto: 'Seleccioná un objetivo' },
        { value: 'perder_peso', texto: 'Perder peso' },
        { value: 'ganar_musculo', texto: 'Ganar músculo' },
        { value: 'mantener', texto: 'Mantener peso' },
        { value: 'resistencia', texto: 'Mejorar resistencia' }
    ];

    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion.value;
        option.textContent = opcion.texto;
        selectObjetivo.appendChild(option);
    });

    selectObjetivo.value = datosUsuario.objetivo || '';

    divObjetivo.appendChild(labelObjetivo);
    divObjetivo.appendChild(selectObjetivo);

    contenido.appendChild(divObjetivo);
}

// Muestra las membresías disponibles para el alumno.
async function mostrarMembresias() {
    const contenido = document.getElementById('contenidoRegistro');
    contenido.innerHTML = '';

    const titulo = document.createElement('h6');
    titulo.textContent = 'Seleccioná una membresía';

    contenido.appendChild(titulo);

    try {
        const respuesta = await fetch('/api/membresias', {
            method: 'GET',
            credentials: 'include'
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'No se pudieron cargar las membresías');
        }

        // Nos quedamos solamente con las membresías activas.
        const membresias = datos.data.filter(membresia => membresia.activo);

        if (membresias.length === 0) {
            contenido.textContent = 'No hay membresías disponibles.';
            return;
        }

        const select = document.createElement('select');
        select.id = 'planMembresiaId';
        select.classList.add('form-select');
        select.required = true;

        const opcionInicial = document.createElement('option');
        opcionInicial.value = '';
        opcionInicial.textContent = 'Seleccionar membresía';
        select.appendChild(opcionInicial);

        membresias.forEach(membresia => {
            const opcion = document.createElement('option');

            opcion.value = membresia.id;
            opcion.textContent =
                `${membresia.nombre} - $${membresia.precioMensual} por mes`;

            select.appendChild(opcion);
        });

        select.value = datosUsuario.planMembresiaId || '';

        contenido.appendChild(select);

    } catch (error) {
        const mensaje = document.getElementById('mensajeRegistro');
        mensaje.textContent = error.message;
    }
}

// Muestra la especialidad de un instructor.
function mostrarDatosInstructor() {
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

    divCampo.appendChild(label);
    divCampo.appendChild(input);

    contenido.appendChild(divCampo);
}

// Envía los datos al servidor.
async function registrarUsuario() {
    const mensaje = document.getElementById('mensajeRegistro');
    mensaje.textContent = '';
    const url = datosUsuario.rol === 'miembro'
        ? '/api/usuarios/miembros'
        : '/api/usuarios/instructores';

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(datosUsuario)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'No se pudo registrar el usuario');
        }

        alert('Usuario registrado correctamente');
        return true;

    } catch (error) {
        document.getElementById('mensajeRegistro').textContent = error.message;
        return false;
    }
}

// Inicializa el registro de usuarios.
export function inicializarRegistroUsuarios() {
    const nuevoUsuarioBtn = document.getElementById('nuevoUsuario');
    const modalElemento = document.getElementById('modalRegistroUsuario');

    formularioRegistroUsuario(modalElemento);
    mostrarDatosPersonales();
    const modal = new bootstrap.Modal(modalElemento);
    nuevoUsuarioBtn.addEventListener('click', () => { modal.show(); });

    const siguiente = document.getElementById('siguienteRegistro');
    siguiente.addEventListener('click', async () => {
        const formulario = document.getElementById('formRegistroUsuario');
        const mensaje = document.getElementById('mensajeRegistro');

        formulario.addEventListener('input', () => {
            mensaje.textContent = '';
        });

        formulario.addEventListener('change', () => {
            mensaje.textContent = '';
        });

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
        }
        guardarDatosPaso();
        if (pasoActual === 1) {
            pasoActual = 2;
            if (datosUsuario.rol === 'miembro') {
                mostrarDatosMiembro();
                siguiente.textContent = 'Siguiente';
            } else if (datosUsuario.rol === 'instructor') {
                mostrarDatosInstructor();
                siguiente.textContent = 'Registrar';
            } else {
                return;
            }
            volver.hidden = false;
            return;
        }

        if (pasoActual === 2 && datosUsuario.rol === 'miembro') {
            pasoActual = 3;
            await mostrarMembresias();

            siguiente.textContent = 'Registrar';
            return;
        }

        if (pasoActual === 2 && datosUsuario.rol === 'instructor') {
            const registrado = await registrarUsuario();
            if (registrado) {
                modal.hide();
            }
            return;
        }

        if (pasoActual === 3 && datosUsuario.rol === 'miembro') {
            siguiente.textContent = 'Registrar';
            const registrado = await registrarUsuario();
            if (registrado) {
                modal.hide();
            }
            return;
        }
    });

    const volver = document.getElementById('volverRegistro');
    volver.addEventListener('click', () => {
        guardarDatosPaso();
        if (pasoActual === 3) {
            pasoActual = 2;
            mostrarDatosMiembro();
        } else if (pasoActual === 2) {
            pasoActual = 1;
            mostrarDatosPersonales();
        }

        siguiente.textContent = 'Siguiente';

        if (pasoActual === 1) {
            volver.hidden = true;
        }
    });

    modalElemento.addEventListener('hidden.bs.modal', () => {
        pasoActual = 1;
        Object.keys(datosUsuario).forEach(clave => delete datosUsuario[clave]);
        document.getElementById('mensajeRegistro').textContent = '';
        mostrarDatosPersonales();

        volver.hidden = true;
        siguiente.textContent = 'Siguiente';
    });
}

function guardarDatosPaso() {
    if (pasoActual === 1) {
        datosUsuario.nombre = document.getElementById('nombre').value;
        datosUsuario.email = document.getElementById('email').value;
        datosUsuario.dni = document.getElementById('dni').value;
        datosUsuario.rol = document.getElementById('rol').value;
    }

    if (pasoActual === 2 && datosUsuario.rol === 'miembro') {
        datosUsuario.peso = document.getElementById('peso').value;
        datosUsuario.altura = document.getElementById('altura').value;
        datosUsuario.edad = document.getElementById('edad').value;
        datosUsuario.objetivo = document.getElementById('objetivo').value;
    }

    if (pasoActual === 2 && datosUsuario.rol === 'instructor') {
        datosUsuario.especialidad = document.getElementById('especialidad').value;
    }

    if (pasoActual === 3) {
        const select = document.getElementById('planMembresiaId');
        if (!select) {
            throw new Error('No hay una membresía disponible para seleccionar');
        }
        datosUsuario.planMembresiaId = select.value;
    }
}
