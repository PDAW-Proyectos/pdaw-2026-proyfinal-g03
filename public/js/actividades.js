const crearElemento = (etiqueta, clases, texto) => {
  const elemento = document.createElement(etiqueta);
  elemento.className = clases;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
};

const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
  contenedor.replaceChildren(crearElemento('p', clase, mensaje));
  contenedor.setAttribute('aria-busy', 'false');
};

const obtenerDatos = async (recurso) => {
  const respuesta = await fetch(`/api/publico/${recurso}?limit=50`);
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.error || 'No se pudieron cargar los datos.');
  return resultado.data;
};

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Argentina/Buenos_Aires',
});

const formatoHora = new Intl.DateTimeFormat('es-AR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Argentina/Buenos_Aires',
});

const renderizarActividades = (actividades) => {
  const contenedor = document.getElementById('actividades-lista');
  contenedor.replaceChildren();

  if (actividades.length === 0) {
    mostrarMensaje(contenedor, 'Por el momento no hay actividades publicadas.');
    return;
  }

  actividades.forEach((actividad) => {
    const columna = crearElemento('div', 'col-md-4');
    const tarjeta = crearElemento(
      'article',
      'bg-pulso-card p-4 h-100 d-flex flex-column border border-secondary',
    );
    const titulo = crearElemento('h2', 'h3 text-white mb-2', actividad.titulo);
    const descripcion = crearElemento(
      'p',
      'text-gray mb-3',
      actividad.descripcion || 'Consultá en el gimnasio para conocer más sobre esta actividad.',
    );
    const fechaHora = new Date(actividad.fechaHora);
    const fecha = formatoFecha.format(fechaHora);
    const hora = formatoHora.format(fechaHora);
    const horario = crearElemento('p', 'text-gray mb-0 fs-14');
    const icono = crearElemento('i', 'bi bi-clock me-2 text-green');
    horario.append(
      icono,
      `${fecha.charAt(0).toUpperCase()}${fecha.slice(1)} · ${hora} · ${actividad.duracionMin} min`,
    );
    const reservar = crearElemento('a', 'btn btn-green w-100 mt-auto', 'RESERVAR LUGAR');
    reservar.href = 'login.html';
    tarjeta.append(titulo, descripcion, horario, reservar);
    columna.append(tarjeta);
    contenedor.append(columna);
  });

  contenedor.setAttribute('aria-busy', 'false');
};

const renderizarHorarios = (horarios) => {
  const contenedor = document.getElementById('horarios-lista');
  contenedor.replaceChildren();

  if (horarios.length === 0) {
    mostrarMensaje(contenedor, 'Los horarios del gimnasio todavía no están publicados.');
    return;
  }

  horarios.forEach((horario) => {
    const columna = crearElemento('div', 'col-sm-6 col-lg-4');
    const tarjeta = crearElemento(
      'div',
      'bg-pulso-card p-3 h-100 border border-secondary d-flex justify-content-between align-items-center',
    );
    const dia = crearElemento(
      'h3',
      'h5 text-white mb-0',
      `${horario.dia.charAt(0).toUpperCase()}${horario.dia.slice(1)}`,
    );
    const rango = crearElemento('p', 'text-gray mb-0', `${horario.apertura} a ${horario.cierre}`);
    tarjeta.append(dia, rango);
    columna.append(tarjeta);
    contenedor.append(columna);
  });

  contenedor.setAttribute('aria-busy', 'false');
};

const actividadesLista = document.getElementById('actividades-lista');
const horariosLista = document.getElementById('horarios-lista');

const cargarActividades = async () => {
  try {
    const actividades = await obtenerDatos('actividades');
    renderizarActividades(actividades);
  } catch (error) {
    mostrarMensaje(
      actividadesLista,
      'No se pudieron cargar las actividades. Intentá nuevamente más tarde.',
      'text-danger',
    );
  }
};

const cargarHorarios = async () => {
  try {
    const horarios = await obtenerDatos('horarios');
    renderizarHorarios(horarios);
  } catch (error) {
    mostrarMensaje(
      horariosLista,
      'No se pudieron cargar los horarios. Intentá nuevamente más tarde.',
      'text-danger',
    );
  }
};

cargarActividades();
cargarHorarios();
