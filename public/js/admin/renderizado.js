import { mostrarToast } from '../componentes/toast.js';
const diasOrdenados = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
let turnosDisponibles = [];
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
      const estadoDestacada = crearElemento('span',
        clase.destacada
          ? 'badge bg-warning text-dark fs-12'
          : 'badge bg-secondary fs-12',
        clase.destacada ? '★ Destacada' : 'No destacada',
      );
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

      encabezado.append(titulo, estadoDestacada);
      informacion.append(encabezado, detalle, cupo);

      if (clase.descripcion) {
        informacion.append(crearElemento('p', 'text-gray mb-0 mt-2', clase.descripcion));
      }
      const botonDestacar = crearElemento(
        'button',
        clase.destacada
          ? 'btn btn-sm btn-outline-warning'
          : 'btn btn-sm btn-outline-success',
        clase.destacada ? '★ Quitar destacada' : '☆ Destacar',
      );

      botonDestacar.type = 'button';
      botonDestacar.dataset.accion = 'destacar-clase';
      botonDestacar.dataset.id = clase.id;
      tarjeta.append(informacion, botonDestacar);
      contenedor.append(tarjeta);
    });

  contenedor.setAttribute('aria-busy', 'false');
};

const destacarClase = async (claseId, boton) => {
  const textoOriginal = boton.textContent;

  boton.disabled = true;
  boton.textContent = 'Actualizando...';

  try {
    const respuesta = await fetch(`/api/clases/${claseId}/destacar`, {
      method: 'POST',
      credentials: 'include',
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.detail || datos.error || 'No se pudo actualizar la clase.');
    }

    mostrarToast(
      'Clase actualizada',
      datos.destacada
        ? 'La clase ahora está destacada.'
        : 'La clase ya no está destacada.',
      'success',
    );

    await cargarYRenderizar(
      'clases',
      renderizarClases,
      'admin-clases-lista',
      'admin-clases-resumen',
    );

  } catch (error) {
    mostrarToast('Error', error.message, 'error');
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
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
    const tarjeta = crearElemento('article', 'admin-card d-flex justify-content-between align-items-center');
    const informacion = crearElemento('div', 'admin-card-info');
    const nombre = crearElemento('h4', 'mb-0', miembro.nombre);
    const email = crearElemento('p', 'mb-0 fs-13', miembro.email);
    const datosFisicos = crearElemento(
      'p',
      'mb-0 fs-13 text-gray',
      `${miembro.peso} kg · ${miembro.altura} cm · ${miembro.edad} años`,
    );

    informacion.append(nombre, email, datosFisicos);

    const botonEliminar = crearElemento(
      'button',
      'btn btn-sm btn-outline-danger ms-2',
      ''
    );
    botonEliminar.innerHTML = '<i class="bi bi-trash3"></i>';
    botonEliminar.title = 'Eliminar miembro';
    botonEliminar.dataset.accion = 'eliminar-usuario';
    botonEliminar.dataset.id = miembro.id;
    botonEliminar.dataset.tipo = 'miembro';
    botonEliminar.dataset.nombre = miembro.nombre;
    tarjeta.append(informacion, botonEliminar);
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
    const tarjeta = crearElemento('article', 'admin-card d-flex justify-content-between align-items-center');
    const informacion = crearElemento('div', 'admin-card-info');
    const nombre = crearElemento('h4', 'mb-0', instructor.nombre);
    const email = crearElemento('p', 'mb-0 fs-13', instructor.email);
    const especialidad = crearElemento(
      'p',
      'mb-0 fs-13 text-green',
      instructor.especialidad || 'Sin especialidad',
    );

    informacion.append(nombre, email, especialidad);

    const botonEliminar = crearElemento(
      'button',
      'btn btn-sm btn-outline-danger ms-2',
      ''
    );
    botonEliminar.innerHTML = '<i class="bi bi-trash3"></i>';
    botonEliminar.title = 'Eliminar instructor';
    botonEliminar.dataset.accion = 'eliminar-usuario';
    botonEliminar.dataset.id = instructor.id;
    botonEliminar.dataset.tipo = 'instructor';
    botonEliminar.dataset.nombre = instructor.nombre;
    tarjeta.append(informacion, botonEliminar);
    contenedor.append(tarjeta);
  });

  contenedor.setAttribute('aria-busy', 'false');
};
// --- VARIABLES GLOBALES PARA PLANES ---
let paginaActualPlanes = 1;
const planesPorPagina = 2;
let filtroEstadoPlanes = 'todos';

export const renderizarMembresias = (membresias) => {
  const contenedor = document.getElementById('admin-membresias-lista');
  const contenedorPaginado = document.getElementById('paginado-planes');
  const selectFiltro = document.getElementById('filtroEstadoPlanes');
  
  contenedor.replaceChildren();
  contenedorPaginado.replaceChildren();

  // 1. Configurar el filtro
  if (selectFiltro) {
    selectFiltro.value = filtroEstadoPlanes;
    if (!selectFiltro.dataset.listener) {
      selectFiltro.addEventListener('change', (e) => {
        filtroEstadoPlanes = e.target.value;
        paginaActualPlanes = 1; // Resetear a la primera página
        renderizarMembresias(membresias);
      });
      selectFiltro.dataset.listener = 'true';
    }
  }

  // 2. Resumen General
  const activas = membresias.filter((m) => m.activo).length;
  actualizarResumen(
    'admin-membresias-resumen',
    `${membresias.length} planes · ${activas} activos · ${membresias.length - activas} inactivos`,
  );

  // 3. Filtrar datos
  let planesFiltrados = membresias;
  if (filtroEstadoPlanes === 'activos') planesFiltrados = membresias.filter(m => m.activo);
  if (filtroEstadoPlanes === 'inactivos') planesFiltrados = membresias.filter(m => !m.activo);

  if (planesFiltrados.length === 0) {
    mostrarMensaje(contenedor, 'No hay planes que coincidan con el filtro.');
    contenedor.setAttribute('aria-busy', 'false');
    return;
  }

  // 4. Paginación
  const totalPaginas = Math.ceil(planesFiltrados.length / planesPorPagina);
  if (paginaActualPlanes > totalPaginas) paginaActualPlanes = totalPaginas;
  
  const inicio = (paginaActualPlanes - 1) * planesPorPagina;
  const fin = inicio + planesPorPagina;
  const planesAMostrar = planesFiltrados.slice(inicio, fin);

  // 5. Renderizar Tarjetas
  planesAMostrar.forEach((membresia) => {
    const tarjeta = crearElemento('article', 'admin-card d-flex justify-content-between align-items-center flex-wrap gap-3');
    const informacion = crearElemento('div', 'admin-card-info flex-grow-1');
    
    const encabezado = crearElemento('div', 'd-flex align-items-center gap-2 mb-1 flex-wrap');
    const nombre = crearElemento('h4', 'mb-0', membresia.nombre);
    const estado = crearElemento(
      'span',
      membresia.activo ? 'badge bg-success fs-12' : 'badge bg-secondary fs-12',
      membresia.activo ? 'Activo' : 'Inactivo',
    );
    const precio = crearElemento('p', 'text-green mb-1 fs-15 fw-bold', `${formatoPrecio.format(membresia.precioMensual)} / mes`);

    encabezado.append(nombre, estado);
    informacion.append(encabezado, precio);

    if (membresia.descripcion) {
      informacion.append(crearElemento('p', 'mb-0 fs-13 text-gray', membresia.descripcion));
    }

       // --- BOTONES ---
    const divAcciones = crearElemento('div', 'd-flex gap-2');
    
    // Botón Habilitar/Deshabilitar
    // 1. Creamos el botón vacío (sin el tercer parámetro)
    const btnToggle = crearElemento('button', `btn btn-sm ${membresia.activo ? 'btn-outline-warning' : 'btn-outline-success'}`);
    // 2. Le inyectamos el HTML del ícono
    btnToggle.innerHTML = membresia.activo ? '<i class="bi bi-pause-circle"></i>' : '<i class="bi bi-play-circle"></i>';
    btnToggle.title = membresia.activo ? 'Deshabilitar' : 'Habilitar';
    btnToggle.dataset.accion = 'toggle-plan';
    btnToggle.dataset.id = membresia.id;
    btnToggle.dataset.activo = membresia.activo;
    // El PUT del backend reemplaza el plan completo, así que el toggle necesita todos los datos
    btnToggle.dataset.nombre = membresia.nombre;
    btnToggle.dataset.precio = membresia.precioMensual;
    btnToggle.dataset.descripcion = membresia.descripcion || '';

    // Botón Editar
    const btnEditar = crearElemento('button', 'btn btn-sm btn-outline-light');
    btnEditar.innerHTML = '<i class="bi bi-pencil"></i>';
    btnEditar.title = 'Editar plan';
    btnEditar.dataset.accion = 'editar-plan';
    btnEditar.dataset.id = membresia.id;
    btnEditar.dataset.nombre = membresia.nombre;
    btnEditar.dataset.precio = membresia.precioMensual;
    btnEditar.dataset.descripcion = membresia.descripcion || '';
    btnEditar.dataset.activo = membresia.activo;

    // Botón Eliminar
    const btnEliminar = crearElemento('button', 'btn btn-sm btn-outline-danger');
    btnEliminar.innerHTML = '<i class="bi bi-trash3"></i>';
    btnEliminar.title = 'Eliminar plan';
    btnEliminar.dataset.accion = 'eliminar-plan';
    btnEliminar.dataset.id = membresia.id;
    btnEliminar.dataset.nombre = membresia.nombre;

    divAcciones.append(btnToggle, btnEditar, btnEliminar);
    tarjeta.append(informacion, divAcciones);
    contenedor.append(tarjeta);
  });

  // 6. Renderizar paginado
  if (totalPaginas > 1) {
    // Botón Anterior
    const btnPrev = crearElemento('button', 'btn btn-sm btn-outline-secondary');
    btnPrev.innerHTML = '<i class="bi bi-chevron-left"></i>'; // Usamos innerHTML
    btnPrev.disabled = paginaActualPlanes === 1;
    btnPrev.onclick = () => {
      paginaActualPlanes--;
      renderizarMembresias(membresias);
    };

    const textoPag = crearElemento('span', 'text-gray fs-14', `Página ${paginaActualPlanes} de ${totalPaginas}`);

    // Botón Siguiente
    const btnNext = crearElemento('button', 'btn btn-sm btn-outline-secondary');
    btnNext.innerHTML = '<i class="bi bi-chevron-right"></i>'; // Usamos innerHTML
    btnNext.disabled = paginaActualPlanes === totalPaginas;
    btnNext.onclick = () => {
      paginaActualPlanes++;
      renderizarMembresias(membresias);
    };

    contenedorPaginado.append(btnPrev, textoPag, btnNext);
  }

  contenedor.setAttribute('aria-busy', 'false');
};

let agruparDiasIguales = false;

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

  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const hoy = diasSemana[new Date().getDay()];

  const contieneHoy = (diasArray) => diasArray.includes(hoy);

  let elementosAMostrar = [];

  if (agruparDiasIguales) {
    const agrupados = {};
    horarios.forEach(h => {
      const clave = `${h.apertura}-${h.cierre}`;
      if (!agrupados[clave]) {
        agrupados[clave] = { apertura: h.apertura, cierre: h.cierre, dias: [], ids: [] };
      }
      agrupados[clave].dias.push(h.dia);
      agrupados[clave].ids.push(h.id);
    });
    elementosAMostrar = Object.values(agrupados).sort((a, b) =>
      diasOrdenados.indexOf(a.dias[0]) - diasOrdenados.indexOf(b.dias[0])
    );
  } else {
    elementosAMostrar = horarios
      .slice()
      .sort((a, b) => diasOrdenados.indexOf(a.dia) - diasOrdenados.indexOf(b.dia))
      .map(h => ({ apertura: h.apertura, cierre: h.cierre, dias: [h.dia], ids: [h.id] }));
  }
  elementosAMostrar.forEach((grupo, index) => {
    const esUltimo = index === elementosAMostrar.length - 1;
    const esGrupoHoy = contieneHoy(grupo.dias);

    const fila = crearElemento('div', `fila-horario d-flex align-items-center justify-content-between position-relative ${!esUltimo ? 'border-bottom border-secondary' : ''}`);

    const contenedorDia = crearElemento('div', 'd-flex flex-column');
    const tituloDiaDiv = crearElemento('div', 'd-flex align-items-center gap-2');

    let textoDia = grupo.dias[0].substring(0, 3).toUpperCase();
    let subtexto = grupo.dias[0].charAt(0).toUpperCase() + grupo.dias[0].slice(1);

    if (grupo.dias.length > 1) {
      const primerDia = grupo.dias[0].substring(0, 3).toUpperCase();
      const ultimoDia = grupo.dias[grupo.dias.length - 1].substring(0, 3).toUpperCase();
      textoDia = `${primerDia}–${ultimoDia}`;
      const nombresCompletos = grupo.dias.map(d => d.charAt(0).toUpperCase() + d.slice(1));
      subtexto = `${nombresCompletos[0]} a ${nombresCompletos[nombresCompletos.length - 1]}`;
    }

    const tituloDia = crearElemento('span', 'text-white fw-bold fs-5', textoDia);
    tituloDia.style.fontFamily = "'Oswald', sans-serif";
    tituloDia.style.letterSpacing = '1px';

    tituloDiaDiv.append(tituloDia);

    if (esGrupoHoy) {
      const badgeHoy = crearElemento('span', 'badge bg-transparent text-green border border-success rounded-pill px-2 py-1', 'HOY');
      badgeHoy.style.fontSize = '10px';
      badgeHoy.style.borderColor = '#a3e635 !important';
      tituloDiaDiv.append(badgeHoy);
      tituloDia.classList.add('text-green');
    }

    const subtituloDia = crearElemento('span', 'text-gray fs-13', subtexto);
    contenedorDia.append(tituloDiaDiv, subtituloDia);

    const lineaConectora = crearElemento('div', 'linea-conectora flex-grow-1 mx-3 d-none d-md-block');

    const contenedorDerecha = crearElemento('div', 'd-flex align-items-center gap-3 gap-md-4');

    const horarioTexto = crearElemento('span', 'text-white fw-bold fs-4', `${grupo.apertura}–${grupo.cierre}`);
    horarioTexto.style.fontFamily = "'Oswald', sans-serif";
    horarioTexto.style.letterSpacing = '1px';

    const [hApertura, mApertura] = grupo.apertura.split(':').map(Number);
    const [hCierre, mCierre] = grupo.cierre.split(':').map(Number);
    const minutosDia = (hCierre * 60 + mCierre) - (hApertura * 60 + mApertura);
    const duracionTexto = crearElemento('span', 'text-gray fs-13 text-end', `${Math.floor(minutosDia / 60)} h`);
    duracionTexto.style.width = '30px';

    contenedorDerecha.append(horarioTexto, duracionTexto);
    if (grupo.dias.length === 1) {
      const btnEliminar = crearElemento('button', 'btn-accion ms-2');
      btnEliminar.innerHTML = '<i class="bi bi-trash fs-5"></i>';
      btnEliminar.title = 'Eliminar horario';
      btnEliminar.dataset.accion = 'eliminar-horario';
      btnEliminar.dataset.id = grupo.ids[0];

      contenedorDerecha.append(btnEliminar);
    }

    fila.append(contenedorDia, lineaConectora, contenedorDerecha);
    contenedor.append(fila);
  });

  contenedor.setAttribute('aria-busy', 'false');
};

// Función para que admin.js cambie el estado del switch
window.setAgruparDias = (valor) => {
  agruparDiasIguales = valor;
};
export const renderizarTurnos = (turnos) => {
  const contenedorChequeos = document.getElementById('admin-turnos-chequeos');
  const contenedorNutricion = document.getElementById('admin-turnos-nutricion');

  if (!contenedorChequeos || !contenedorNutricion) return;

  turnosDisponibles = turnos;

  const inputNombre = document.getElementById('filtroNombreTurno');
  const inputFecha = document.getElementById('filtroFechaTurno');

  const nombreBuscado = normalizarTextoBusqueda(inputNombre?.value ?? '');
  const fechaBuscada = inputFecha?.value ?? '';

  const turnosFiltrados = turnosDisponibles.filter((turno) => {
    const coincideNombre = normalizarTextoBusqueda(turno.medico ?? '')
      .includes(nombreBuscado);

    const coincideFecha = !fechaBuscada || turno.fecha === fechaBuscada;

    return coincideNombre && coincideFecha;
  });

  contenedorChequeos.replaceChildren();
  contenedorNutricion.replaceChildren();
  contenedorChequeos.setAttribute('aria-busy', 'true');
  contenedorNutricion.setAttribute('aria-busy', 'true');

  const chequeos = turnosFiltrados.filter((turno) => turno.tipo === 'chequeo_medico').length;
  const nutricion = turnosFiltrados.filter((turno) => turno.tipo === 'nutricionista').length;

  actualizarResumen(
    'admin-turnos-resumen',
    `${turnosFiltrados.length} turnos encontrados · ${chequeos} chequeos médicos · ${nutricion} de nutrición`,
  );

  const crearTarjetaTurno = (turno) => {
    const tarjeta = crearElemento('article', 'admin-card d-flex justify-content-between align-items-center');
    const informacion = crearElemento('div', 'admin-card-info');
    const encabezado = crearElemento('div', 'd-flex align-items-center gap-2 mb-1 flex-wrap');
    const titulo = crearElemento('h4', 'mb-0', tiposTurno[turno.tipo] || turno.tipo);
    const estado = crearElemento('span', 'badge bg-success fs-12', 'Disponible');
    const fecha = new Date(`${turno.fecha}T00:00:00`);

    encabezado.append(titulo, estado);
    informacion.append(encabezado);
    let detalleTexto = `${formatoFecha.format(fecha)} · ${turno.hora} · ${turno.duracionMin} min`;
    if (turno.medico) {
      detalleTexto += ` · ${turno.medico}`;
    }

    informacion.append(crearElemento('p', 'mb-0 text-gray fs-13', detalleTexto));

    const botonEliminar = crearElemento('button', 'btn btn-sm btn-outline-danger ms-2', '');
    botonEliminar.innerHTML = '<i class="bi bi-trash3"></i>';
    botonEliminar.title = 'Eliminar turno';
    botonEliminar.dataset.accion = 'eliminar-turno';
    botonEliminar.dataset.id = turno.id;

    tarjeta.append(informacion, botonEliminar);
    return tarjeta;
  };

  const turnosChequeo = turnosFiltrados.filter((t) => t.tipo === 'chequeo_medico');
  if (turnosChequeo.length === 0) {
    mostrarMensaje(contenedorChequeos, 'No hay turnos de chequeo médico.');
  } else {
    turnosChequeo
      .sort((a, b) => new Date(`${a.fecha}T${a.hora}:00`) - new Date(`${b.fecha}T${b.hora}:00`))
      .forEach((turno) => contenedorChequeos.append(crearTarjetaTurno(turno)));
    contenedorChequeos.setAttribute('aria-busy', 'false');
  }

  const turnosNutricion = turnosFiltrados.filter((t) => t.tipo === 'nutricionista');
  if (turnosNutricion.length === 0) {
    mostrarMensaje(contenedorNutricion, 'No hay turnos de nutrición.');
  } else {
    turnosNutricion
      .sort((a, b) => new Date(`${a.fecha}T${a.hora}:00`) - new Date(`${b.fecha}T${b.hora}:00`))
      .forEach((turno) => contenedorNutricion.append(crearTarjetaTurno(turno)));
    contenedorNutricion.setAttribute('aria-busy', 'false');
  }
};

const normalizarTextoBusqueda = (texto) =>
  String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

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
  document.getElementById('perfil-telefono').value = usuario.telefono || '';

  const inputNombreTurno = document.getElementById('filtroNombreTurno');
  const inputFechaTurno = document.getElementById('filtroFechaTurno');

  inputNombreTurno?.addEventListener('input', () => {
    renderizarTurnos(turnosDisponibles);
  });

  inputFechaTurno?.addEventListener('change', () => {
    renderizarTurnos(turnosDisponibles);
  });

  const contenedorClases = document.getElementById('admin-clases-lista');

  if (contenedorClases && contenedorClases.dataset.eventos !== 'true') {
    contenedorClases.dataset.eventos = 'true';

    contenedorClases.addEventListener('click', (event) => {
      const boton = event.target.closest('[data-accion="destacar-clase"]');

      if (!boton) return;

      destacarClase(boton.dataset.id, boton);
    });
  }

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