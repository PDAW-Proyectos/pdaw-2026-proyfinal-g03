const diasOrdenados = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const tiposTurno = {
  chequeo_medico: 'Chequeo médico',
  nutricionista: 'Nutrición',
};
const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
});
const formatoFechaHora = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Argentina/Buenos_Aires',
});
const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeZone: 'America/Argentina/Buenos_Aires',
});

const crearElemento = (etiqueta, clases, texto) => {
  const elemento = document.createElement(etiqueta);
  elemento.className = clases;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
};

const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
  contenedor.replaceChildren(crearElemento('div', `admin-card ${clase}`, mensaje));
  contenedor.setAttribute('aria-busy', 'false');
};

const actualizarResumen = (id, texto) => {
  const resumen = document.getElementById(id);
  if (resumen) resumen.textContent = texto;
};

const obtenerPagina = async (recurso, pagina) => {
  const respuesta = await fetch(`/api/${recurso}?page=${pagina}&limit=50`, {
    credentials: 'include',
  });
  const resultado = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(resultado.error || `No se pudieron cargar ${recurso}.`);
  }

  if (!Array.isArray(resultado.data)) {
    throw new Error(`La respuesta de ${recurso} no tiene el formato esperado.`);
  }

  if (!Number.isInteger(resultado.total) || !Number.isInteger(resultado.limit)) {
    throw new Error(`La respuesta de ${recurso} no incluye datos de paginación válidos.`);
  }

  return resultado;
};

const obtenerDatos = async (recurso) => {
  const primeraPagina = await obtenerPagina(recurso, 1);
  const paginasRestantes = Math.ceil(primeraPagina.total / primeraPagina.limit) - 1;

  if (paginasRestantes <= 0) return primeraPagina.data;

  const respuestas = await Promise.all(
    Array.from({ length: paginasRestantes }, (_, indice) => obtenerPagina(recurso, indice + 2)),
  );

  return primeraPagina.data.concat(...respuestas.map((respuesta) => respuesta.data));
};

const renderizarClases = (clases) => {
  const contenedor = document.getElementById('admin-clases-lista');
  contenedor.replaceChildren();

  const cuposDisponibles = clases.reduce((total, clase) => {
    const inscriptos = Array.isArray(clase.inscriptosIds) ? clase.inscriptosIds.length : 0;
    return total + (clase.cuposDisponibles ?? clase.cupo - inscriptos);
  }, 0);
  actualizarResumen(
    'admin-clases-resumen',
    `${clases.length} actividades programadas · ${cuposDisponibles} cupos disponibles`,
  );

  if (clases.length === 0) {
    mostrarMensaje(contenedor, 'No hay actividades programadas.');
    return;
  }

  clases
    .slice()
    .sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora))
    .forEach((clase) => {
      const tarjeta = crearElemento('article', 'admin-card');
      const informacion = crearElemento('div', 'admin-card-info');
      const encabezado = crearElemento('div', 'd-flex align-items-center gap-2 mb-1 flex-wrap');
      const titulo = crearElemento('h4', 'mb-0', clase.titulo);
      const fecha = new Date(clase.fechaHora);
      const detalle = crearElemento(
        'p',
        'mb-0 fs-13',
        `${formatoFechaHora.format(fecha)} · ${clase.duracionMin} min`,
      );
      const inscriptos = Array.isArray(clase.inscriptosIds) ? clase.inscriptosIds.length : 0;
      const cuposDisponibles = clase.cuposDisponibles ?? clase.cupo - inscriptos;
      const cupo = crearElemento(
        'p',
        'mb-0 fs-13',
        `Cupo: ${clase.cupo} · ${inscriptos} inscriptos · ${cuposDisponibles} disponibles`,
      );

      encabezado.append(titulo);
      informacion.append(encabezado, detalle, cupo);

      if (clase.descripcion) {
        informacion.append(crearElemento('p', 'text-gray mb-0 mt-2', clase.descripcion));
      }

      tarjeta.append(informacion);
      contenedor.append(tarjeta);
    });

  contenedor.setAttribute('aria-busy', 'false');
};

export const renderizarMiembros = (miembros) => {
  const contenedor = document.getElementById('admin-miembros-lista');
  if (!contenedor) return;
  contenedor.replaceChildren();

  if (miembros.length === 0) {
    mostrarMensaje(contenedor, 'No hay miembros registrados.');
    return;
  }

  miembros.forEach((miembro) => {
    const tarjeta = crearElemento('article', 'admin-card');
    const informacion = crearElemento('div', 'admin-card-info');
    const nombre = crearElemento('h4', 'mb-0', miembro.nombre);
    const email = crearElemento('p', 'mb-0 fs-13', miembro.email);
    const datosFisicos = crearElemento(
      'p',
      'mb-0 fs-13 text-gray',
      `${miembro.peso} kg · ${miembro.altura} cm · ${miembro.edad} años`,
    );

    informacion.append(nombre, email, datosFisicos);
    tarjeta.append(informacion);
    contenedor.append(tarjeta);
  });

  contenedor.setAttribute('aria-busy', 'false');
};

export const renderizarInstructores = (instructores) => {
  const contenedor = document.getElementById('admin-instructores-lista');
  if (!contenedor) return;
  contenedor.replaceChildren();

  if (instructores.length === 0) {
    mostrarMensaje(contenedor, 'No hay instructores registrados.');
    return;
  }

  instructores.forEach((instructor) => {
    const tarjeta = crearElemento('article', 'admin-card');
    const informacion = crearElemento('div', 'admin-card-info');
    const nombre = crearElemento('h4', 'mb-0', instructor.nombre);
    const email = crearElemento('p', 'mb-0 fs-13', instructor.email);
    const especialidad = crearElemento(
      'p',
      'mb-0 fs-13 text-green',
      instructor.especialidad || 'Sin especialidad',
    );

    informacion.append(nombre, email, especialidad);
    tarjeta.append(informacion);
    contenedor.append(tarjeta);
  });

  contenedor.setAttribute('aria-busy', 'false');
};

export const renderizarMembresias = (membresias) => {
  const contenedor = document.getElementById('admin-membresias-lista');
  contenedor.replaceChildren();

  const activas = membresias.filter((membresia) => membresia.activo).length;
  actualizarResumen(
    'admin-membresias-resumen',
    `${membresias.length} planes · ${activas} activos · ${membresias.length - activas} inactivos`,
  );

  if (membresias.length === 0) {
    mostrarMensaje(contenedor, 'No hay planes de membresía registrados.');
    return;
  }

  membresias.forEach((membresia) => {
    const tarjeta = crearElemento('article', 'admin-card');
    const informacion = crearElemento('div', 'admin-card-info');
    const encabezado = crearElemento('div', 'd-flex align-items-center gap-2 mb-1 flex-wrap');
    const nombre = crearElemento('h4', 'mb-0', membresia.nombre);
    const estado = crearElemento(
      'span',
      membresia.activo ? 'badge bg-success fs-12' : 'badge bg-secondary fs-12',
      membresia.activo ? 'Activo' : 'Inactivo',
    );
    const precio = crearElemento(
      'p',
      'text-green mb-1 fs-15 fw-bold',
      `${formatoPrecio.format(membresia.precioMensual)} / mes`,
    );

    encabezado.append(nombre, estado);
    informacion.append(encabezado, precio);

    if (membresia.descripcion) {
      informacion.append(crearElemento('p', 'mb-0 fs-13', membresia.descripcion));
    }

    tarjeta.append(informacion);
    contenedor.append(tarjeta);
  });

  contenedor.setAttribute('aria-busy', 'false');
};

export const renderizarHorarios = (horarios) => {
  const contenedor = document.getElementById('admin-horarios-lista');
  contenedor.replaceChildren();

  const minutosSemanales = horarios.reduce((total, horario) => {
    const [horaApertura, minutoApertura] = horario.apertura.split(':').map(Number);
    const [horaCierre, minutoCierre] = horario.cierre.split(':').map(Number);
    return total + (horaCierre * 60 + minutoCierre) - (horaApertura * 60 + minutoApertura);
  }, 0);
  actualizarResumen(
    'admin-horarios-resumen',
    `${horarios.length} horarios · ${Math.floor(minutosSemanales / 60)} h ${minutosSemanales % 60} min por semana`,
  );

  if (horarios.length === 0) {
    mostrarMensaje(contenedor, 'No hay horarios de apertura publicados.');
    return;
  }

  horarios
    .slice()
    .sort((a, b) => diasOrdenados.indexOf(a.dia) - diasOrdenados.indexOf(b.dia))
    .forEach((horario) => {
      const dia = `${horario.dia.charAt(0).toUpperCase()}${horario.dia.slice(1)}`;
      const tarjeta = crearElemento('article', 'admin-card');
      const informacion = crearElemento('div', 'admin-card-info');
      informacion.append(
        crearElemento('h4', 'mb-0', dia),
        crearElemento('p', 'mb-0', `${horario.apertura} a ${horario.cierre}`),
      );
      const botonEliminar = crearElemento(
        'button',
        'btn btn-sm btn-outline-danger ms-2',
        'Eliminar',
      );
      botonEliminar.dataset.accion = 'eliminar-horario';
      botonEliminar.dataset.id = horario.id;
      tarjeta.append(informacion, botonEliminar);
      contenedor.append(tarjeta);
    });

  contenedor.setAttribute('aria-busy', 'false');
};

export const renderizarTurnos = (turnos) => {
  const contenedor = document.getElementById('admin-turnos-disponibles');
  contenedor.replaceChildren();

  const chequeos = turnos.filter((turno) => turno.tipo === 'chequeo_medico').length;
  const nutricion = turnos.filter((turno) => turno.tipo === 'nutricionista').length;
  actualizarResumen(
    'admin-turnos-resumen',
    `${turnos.length} turnos disponibles · ${chequeos} chequeos médicos · ${nutricion} de nutrición`,
  );

  if (turnos.length === 0) {
    mostrarMensaje(contenedor, 'No hay turnos médicos disponibles.');
    return;
  }

  turnos
    .slice()
    .sort((a, b) => new Date(`${a.fecha}T${a.hora}:00`) - new Date(`${b.fecha}T${b.hora}:00`))
    .forEach((turno) => {
      const tarjeta = crearElemento('article', 'admin-card');
      const informacion = crearElemento('div', 'admin-card-info');
      const encabezado = crearElemento('div', 'd-flex align-items-center gap-2 mb-1 flex-wrap');
      const tipo = crearElemento('h4', 'mb-0', tiposTurno[turno.tipo] || turno.tipo);
      const estado = crearElemento('span', 'badge bg-success fs-12', 'Disponible');
      const fecha = new Date(`${turno.fecha}T00:00:00`);

      encabezado.append(tipo, estado);
      informacion.append(
        encabezado,
        crearElemento(
          'p',
          'mb-0',
          `${formatoFecha.format(fecha)} · ${turno.hora} · ${turno.duracionMin} min`,
        ),
      );
      const botonEliminar = crearElemento(
        'button',
        'btn btn-sm btn-outline-danger ms-2',
        'Eliminar',
      );
      botonEliminar.dataset.accion = 'eliminar-turno';
      botonEliminar.dataset.id = turno.id;
      tarjeta.append(informacion, botonEliminar);
      contenedor.append(tarjeta);
    });

  contenedor.setAttribute('aria-busy', 'false');
};

export const cargarYRenderizar = async (recurso, renderizar, idContenedor, idResumen) => {
  const contenedor = document.getElementById(idContenedor);
  try {
    renderizar(await obtenerDatos(recurso));
  } catch (error) {
    actualizarResumen(idResumen, 'Resumen no disponible.');
    mostrarMensaje(contenedor, error.message, 'text-danger');
  }
};

export function inicializarRenderizadoAdmin(usuario) {
  document.getElementById('perfil-nombre').value = usuario.nombre;
  document.getElementById('perfil-dni').value = usuario.id;
  document.getElementById('perfil-email').value = usuario.email;
  document.getElementById('perfil-telefono').value = usuario.telefono || 'No registrado';

  cargarYRenderizar('clases', renderizarClases, 'admin-clases-lista', 'admin-clases-resumen');
  cargarYRenderizar('usuarios/miembros', renderizarMiembros, 'admin-miembros-lista', null);
  cargarYRenderizar(
    'usuarios/instructores',
    renderizarInstructores,
    'admin-instructores-lista',
    null,
  );
  cargarYRenderizar(
    'membresias',
    renderizarMembresias,
    'admin-membresias-lista',
    'admin-membresias-resumen',
  );
  cargarYRenderizar(
    'horarios',
    renderizarHorarios,
    'admin-horarios-lista',
    'admin-horarios-resumen',
  );
  cargarYRenderizar('turnos', renderizarTurnos, 'admin-turnos-disponibles', 'admin-turnos-resumen');
}
