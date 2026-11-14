const OBJETIVOS = [
  { "id": 'perder_peso', "valor": "Perder peso", "requierePesoMeta": true },
  { "id": 'ganar_musculo', "valor": "Ganar músculo", "requierePesoMeta": true },
  { "id": 'mantener', "valor": "Mantener forma", "requierePesoMeta": false },
  { "id": 'resistencia', "valor": "Mejorar resistencia", "requierePesoMeta": false }
];

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
function mostrarDatosMiembro() {
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

function mostrarCampoPesoMeta(objetivoId) {
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
async function mostrarMembresias() {
  const contenido = document.getElementById('contenidoRegistro');
  contenido.innerHTML = '';

  const titulo = document.createElement('h6');
  titulo.textContent = 'Seleccioná una membresía';

  contenido.appendChild(titulo);

  try {
    const respuesta = await fetch('/api/membresias', {
      method: 'GET',
      credentials: 'include',
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'No se pudieron cargar las membresías');
    }

    // Nos quedamos solamente con las membresías activas.
    const membresias = datos.data.filter((membresia) => membresia.activo);

    if (membresias.length === 0) {
      contenido.textContent = 'No hay membresías disponibles.';
      return;
    }

    const select = document.createElement('select');
    select.id = 'planMembresiaId';
    select.classList.add('form-select');
    select.required = true;

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

  const error = crearMensajeError('especialidad');

  input.addEventListener('input', () => {
    limpiarError('especialidad');
  });

  divCampo.appendChild(label);
  divCampo.appendChild(input);
  divCampo.appendChild(error);

  contenido.appendChild(divCampo);
}

// Envía los datos al servidor.
async function registrarUsuario() {
  const mensaje = document.getElementById('mensajeRegistro');
  mensaje.textContent = '';
  const url =
    datosUsuario.rol === 'miembro' ? '/api/usuarios/miembros' : '/api/usuarios/instructores';

  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(datosUsuario),
    });

    const datos = await respuesta.json();

    console.log('Datos enviados:', datosUsuario);
    console.log('Respuesta del servidor:', datos);

    if (!respuesta.ok) {
      const mensajeError =
        datos.mensaje ||
        datos.detail ||
        datos.error ||
        'No se pudo registrar el usuario';

      throw new Error(mensajeError);
    }

    alert('Usuario registrado correctamente');
    return true;
  } catch (error) {
    mostrarErrorRegistro(error.message);
    return false;
  }
}

// Inicializa el registro de usuarios.
export function inicializarRegistroUsuarios() {
  const nuevoUsuarioBtn = document.getElementById('nuevoUsuario');
  const modalElemento = document.getElementById('modalRegistroUsuario');

  formularioRegistroUsuario(modalElemento);
  mostrarDatosPersonales();
  const modal = new window.bootstrap.Modal(modalElemento);
  nuevoUsuarioBtn.addEventListener('click', () => {
    modal.show();
  });

  const siguiente = document.getElementById('siguienteRegistro');
  siguiente.addEventListener('click', async (event) => {
    event.preventDefault();

    const formulario = document.getElementById('formRegistroUsuario');
    const mensaje = document.getElementById('mensajeRegistro');

    formulario.addEventListener('input', () => {
      mensaje.textContent = '';
    });

    formulario.addEventListener('change', () => {
      mensaje.textContent = '';
    });

    let valido = true;

    if (pasoActual === 1) {
      valido = validarDatosPersonales();
    }

    if (pasoActual === 2 && datosUsuario.rol === 'miembro') {
      valido = validarDatosMiembro();
    }

    if (pasoActual === 2 && datosUsuario.rol === 'instructor') {
      valido = validarDatosInstructor();
    }

    if (pasoActual === 3 && datosUsuario.rol === 'miembro') {
      valido = validarMembresia();
    }

    if (!valido) {
      return;
    }

    const guardadoOk = guardarDatosPaso();
    if (!guardadoOk) return;

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
    Object.keys(datosUsuario).forEach((clave) => delete datosUsuario[clave]);
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
    datosUsuario.telefono = document.getElementById('telefono').value;
  }

  if (pasoActual === 2 && datosUsuario.rol === 'miembro') {
    datosUsuario.peso = document.getElementById('peso').value;
    datosUsuario.altura = document.getElementById('altura').value;
    datosUsuario.edad = document.getElementById('edad').value;
    datosUsuario.objetivo = document.getElementById('objetivo').value;
    const inputPesoMeta = document.getElementById('pesoMeta');
    datosUsuario.pesoMeta = inputPesoMeta ? (inputPesoMeta.value) : null;
  }

  if (pasoActual === 2 && datosUsuario.rol === 'instructor') {
    datosUsuario.especialidad = document.getElementById('especialidad').value;
  }

  if (pasoActual === 3) {
    const select = document.getElementById('planMembresiaId');
    if (!select) {
      const mensaje = document.getElementById('mensajeRegistro');
      mensaje.textContent = 'No hay una membresía disponible para seleccionar.';
      return false;
    }
    datosUsuario.planMembresiaId = select.value;
  }

  return true;
}

// Muestra un mensaje de error debajo de un campo.
function mostrarError(idCampo, mensaje) {
  const error = document.getElementById(`error-${idCampo}`);
  if (error) {
    error.textContent = mensaje;
  }

  const input = document.getElementById(idCampo);
  if (input) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
  }
}

// Limpia el mensaje de error de un campo.
function limpiarError(idCampo) {
  const error = document.getElementById(`error-${idCampo}`);
  if (error) {
    error.textContent = '';
  }

  const input = document.getElementById(idCampo);
  if (input) {
    input.classList.remove('is-invalid');
  }
}

// Crea el espacio donde aparecerá el mensaje.
function crearMensajeError(idCampo) {
  const error = document.createElement('small');
  error.id = `error-${idCampo}`;
  error.classList.add('text-danger', 'd-block', 'mt-1');
  return error;
}

function validarDatosPersonales() {
  let valido = true;

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const dni = document.getElementById('dni').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const rol = document.getElementById('rol').value;

  // Nombre
  if (!nombre) {
    mostrarError('nombre', 'El nombre es obligatorio.');
    valido = false;
  } else if (nombre.length < 2 || nombre.length > 80) {
    mostrarError('nombre', 'El nombre debe tener entre 2 y 80 caracteres.');
    valido = false;
  } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(nombre)) {
    mostrarError('nombre', 'El nombre solo puede contener letras y espacios.');
    valido = false;
  }

  // Email
  if (!email) {
    mostrarError('email', 'El email es obligatorio.');
    valido = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    mostrarError('email', 'Ingresá un email válido.');
    valido = false;
  } else if (email.length > 254) {
    mostrarError('email', 'El email no puede superar los 254 caracteres.');
    valido = false;
  }

  // DNI
  if (!dni) {
    mostrarError('dni', 'El DNI es obligatorio.');
    valido = false;
  } else if (!/^\d{7,8}$/.test(dni)) {
    mostrarError('dni', 'El DNI debe tener entre 7 y 8 dígitos.');
    valido = false;
  }

  // Teléfono (opcional)
  if (telefono && !/^\d{8,15}$/.test(telefono)) {
    mostrarError('telefono', 'El teléfono debe contener entre 8 y 15 dígitos.');
    valido = false;
  }

  // Rol
  if (!rol) {
    mostrarError('rol', 'Seleccioná un rol.');
    valido = false;
  }

  return valido;
}

function validarDatosMiembro() {
  let valido = true;

  const peso = Number(document.getElementById('peso').value);
  const altura = Number(document.getElementById('altura').value);
  const edad = Number(document.getElementById('edad').value);
  const objetivo = document.getElementById('objetivo').value;
  const inputPesoMeta = document.getElementById('pesoMeta');

  if (!document.getElementById('peso').value) {
    mostrarError('peso', 'Ingresá tu peso.');
    valido = false;
  } else if (!Number.isFinite(peso) || peso < 20 || peso > 400) {
    mostrarError('peso', 'El peso debe estar entre 20 y 400 kg.');
    valido = false;
  }

  if (!document.getElementById('altura').value) {
    mostrarError('altura', 'Ingresá tu altura.');
    valido = false;
  } else if (!Number.isFinite(altura) || altura < 80 || altura > 250) {
    mostrarError('altura', 'La altura debe estar entre 80 y 250 cm.');
    valido = false;
  }

  if (!document.getElementById('edad').value) {
    mostrarError('edad', 'Ingresá tu edad.');
    valido = false;
  } else if (!Number.isInteger(edad) || edad < 14 || edad > 110) {
    mostrarError('edad', 'La edad debe ser un número entero entre 14 y 110.');
    valido = false;
  }

  if (!objetivo) {
    mostrarError('objetivo', 'Seleccioná un objetivo.');
    valido = false;
  }

  if (inputPesoMeta) {
    const pesoMeta = Number(inputPesoMeta.value);

    if (!inputPesoMeta.value) {
      mostrarError('pesoMeta', 'Ingresá tu peso meta.');
      valido = false;

    } else if (!Number.isFinite(pesoMeta) || pesoMeta < 20 || pesoMeta > 400) {
      mostrarError('pesoMeta', 'El peso meta debe estar entre 20 y 400 kg.');
      valido = false;

    } else if (objetivo === 'perder_peso' && pesoMeta >= peso) {
      mostrarError('pesoMeta', 'Para perder peso, tu peso meta debe ser menor que tu peso actual.');
      valido = false;

    } else if (objetivo === 'ganar_musculo' && pesoMeta <= peso) {
      mostrarError('pesoMeta', 'Para ganar músculo, tu peso meta debe ser mayor que tu peso actual.');
      valido = false;
    }
  }

  return valido;
}

function validarMembresia() {
  const select = document.getElementById('planMembresiaId');

  if (!select) {
    const mensaje = document.getElementById('mensajeRegistro');
    mensaje.textContent = 'No hay membresías disponibles para seleccionar.';
    return false;
  }

  if (!select.value) {
    mostrarError('planMembresiaId', 'Tenés que seleccionar una membresía.');
    return false;
  }

  return true;
}

function validarDatosInstructor() {
  const especialidad = document.getElementById('especialidad').value.trim();

  if (!especialidad) {
    mostrarError('especialidad', 'La especialidad es obligatoria.');
    return false;
  }

  if (especialidad.length < 2 || especialidad.length > 80) {
    mostrarError('especialidad', 'La especialidad debe tener entre 2 y 80 caracteres.');
    return false;
  }

  return true;
}

function mostrarErrorRegistro(mensaje) {
  const texto = mensaje.toLowerCase();

  const esDni = texto.includes('dni');
  const esEmail = texto.includes('email') || texto.includes('correo');

  if (esDni || esEmail) {
    pasoActual = 1;
    mostrarDatosPersonales();

    document.getElementById('volverRegistro').hidden = true;
    document.getElementById('siguienteRegistro').textContent = 'Siguiente';

    if (esDni) mostrarError('dni', 'Este DNI ya está registrado.');
    if (esEmail) mostrarError('email', 'Este email ya está registrado.');

    return;
  }

  document.getElementById('mensajeRegistro').textContent = mensaje;
}