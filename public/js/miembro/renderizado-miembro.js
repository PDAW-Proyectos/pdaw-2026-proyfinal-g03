// Crea un elemento HTML de forma segura .
const crearElemento = (etiqueta, clases, texto) => {
  const el = document.createElement(etiqueta);
  if (clases) el.className = clases;
  if (texto !== undefined) el.textContent = texto;
  return el;
};
// Crea un párrafo (<p>) que contiene un ícono de Bootstrap Icons seguido de un texto.
const crearParrafoConIcono = (clases, iconoClases, texto) => {
  const p = crearElemento('p', clases);
  const i = crearElemento('i', iconoClases);
  p.append(i, document.createTextNode(` ${texto}`));
  return p;
};

// Muestra un mensaje centrado dentro de un contenedor (ideal para estados vacíos o de error).
const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
  contenedor.replaceChildren(crearElemento('div', `user-card text-center py-4 ${clase}`, mensaje));
  contenedor.setAttribute('aria-busy', 'false');
};

// Petición fetch "segura" que maneja errores y adapta la respuesta a un array.
// Dependiendo de cómo responda el backend, extrae los datos de "json.data" o "json.items".
const fetchSeguro = async (url) => {
  try {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) return null;
    const json = await res.json();
    if (Array.isArray(json)) return json;
    if (json.data && Array.isArray(json.data)) return json.data;
    if (json.items && Array.isArray(json.items)) return json.items;
    return json;
  } catch {
    return null;
  }
};
// Dibuja un gráfico de líneas usando SVG nativo, sin librerías externas.
// Recibe un array con los registros de peso para graficar la evolución.
const dibujarGrafico = (registros) => {
  const contenedor = document.getElementById('contenedor-grafico');
  if (!contenedor) return;

  // Validación: se necesitan al menos 2 pesajes para trazar una línea
  if (registros.length < 2) {
    contenedor.replaceChildren(
      crearElemento(
        'div',
        'text-gray text-center w-100 py-5',
        'Registrá al menos 2 pesajes para ver tu gráfico de evolución.',
      ),
    );
    return;
  }

  // Limpieza y preparación del contenedor
  contenedor.replaceChildren();
  contenedor.style.borderStyle = 'solid';
  contenedor.style.backgroundColor = '#1e1e1e';

  // Separación de datos para los ejes X e Y
  const datos = registros.map((r) => Number(r.peso));
  const etiquetas = registros.map((r) => {
    const d = new Date(r.fecha);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  // Configuración de dimensiones del gráfico
  const width = 700,
    height = 280,
    paddingLeft = 50,
    paddingBottom = 40,
    paddingTop = 30,
    paddingRight = 30;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxPeso = Math.max(...datos) + 5;
  const minPeso = Math.min(...datos) - 5;
  const rangoPeso = maxPeso - minPeso || 1;

  // Creación del lienzo SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  // Dibujo de la cuadrícula y textos del eje Y (peso)
  for (let i = 0; i <= 4; i++) {
    const y = paddingTop + i * (chartHeight / 4);
    const valorY = maxPeso - i * (rangoPeso / 4);
    const linea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    linea.setAttribute('x1', paddingLeft);
    linea.setAttribute('y1', y);
    linea.setAttribute('x2', width - paddingRight);
    linea.setAttribute('y2', y);
    linea.setAttribute('stroke', '#333');
    svg.appendChild(linea);

    const textoY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textoY.setAttribute('x', paddingLeft - 10);
    textoY.setAttribute('y', y + 4);
    textoY.setAttribute('fill', '#888');
    textoY.setAttribute('font-size', '12');
    textoY.setAttribute('text-anchor', 'end');
    textoY.textContent = valorY.toFixed(0);
    svg.appendChild(textoY);
  }

  // Cálculo de las coordenadas (x, y) de cada punto
  const puntos = datos.map((peso, index) => {
    const x = paddingLeft + index * (chartWidth / (datos.length - 1));
    const y = height - paddingBottom - ((peso - minPeso) / rangoPeso) * chartHeight;
    return { x, y, peso, etiqueta: etiquetas[index] };
  });

  // Dibujo de la línea que une los puntos
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', puntos.map((p) => `${p.x},${p.y}`).join(' '));
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', '#3b82f6');
  polyline.setAttribute('stroke-width', '3');
  svg.appendChild(polyline);

  // Dibujo de los círculos (puntos), el peso arriba y la fecha abajo
  puntos.forEach((p) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', p.x);
    circle.setAttribute('cy', p.y);
    circle.setAttribute('r', '5');
    circle.setAttribute('fill', '#1e1e1e');
    circle.setAttribute('stroke', '#3b82f6');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);

    const textoPeso = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textoPeso.setAttribute('x', p.x);
    textoPeso.setAttribute('y', p.y - 12);
    textoPeso.setAttribute('fill', '#3b82f6');
    textoPeso.setAttribute('font-size', '12');
    textoPeso.setAttribute('text-anchor', 'middle');
    textoPeso.textContent = p.peso;
    svg.appendChild(textoPeso);

    const textoX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textoX.setAttribute('x', p.x);
    textoX.setAttribute('y', height - paddingBottom + 20);
    textoX.setAttribute('fill', '#ccc');
    textoX.setAttribute('font-size', '12');
    textoX.setAttribute('text-anchor', 'middle');
    textoX.textContent = p.etiqueta;
    svg.appendChild(textoX);
  });

  contenedor.appendChild(svg);
};

// Renderiza las tarjetas superiores del historial (IMC, Meta, Peso actual),
// el resumen de progreso (Peso inicial, Diferencia) y arma la tabla de registros.
const renderizarHistorialYGrafico = (usuario) => {
  const seccion = document.getElementById('user-historial');
  if (!seccion) return;

  // Se busca el historial en el JSON. Si no hay, se usa un array vacío.
  const registros = Array.isArray(usuario.historialPesos) ? [...usuario.historialPesos] : [];

  // Ordenamos el historial del más antiguo al más nuevo
  registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const pesoDelUsuario = Number(usuario.peso || 0);
  const pesoInicial = registros.length > 0 ? Number(registros[0].peso) : pesoDelUsuario;
  const pesoMeta = Number(usuario.pesoMeta || 0);

  let imc = '-',
    diferencia = '-',
    pesoActualTxt = '-',
    pesoInicialTxt = '-',
    claseDif = 'text-gray';

  // Si hay altura y peso, calculamos el IMC y la diferencia
  if (pesoDelUsuario > 0 && usuario.altura) {
    const alturaM = usuario.altura / 100;
    imc = (pesoDelUsuario / (alturaM * alturaM)).toFixed(1);
    pesoActualTxt = `${pesoDelUsuario} kg`;
    pesoInicialTxt = `${pesoInicial} kg`;

    const difNum = pesoDelUsuario - pesoInicial;
    diferencia = `${difNum > 0 ? '+' : ''}${difNum.toFixed(1)} kg`;
    claseDif = difNum <= 0 ? 'text-green' : 'text-danger';

    // Renderizado de la tabla de progreso
    const tbody = document.querySelector('#user-progreso tbody');
    if (tbody) {
      tbody.replaceChildren();
      if (registros.length === 0) {
        // Si no hay historial, mostramos una única fila con el peso actual
        const tr = crearElemento('tr');
        tr.append(
          crearElemento('td', 'py-3 px-4 text-white', new Date().toLocaleDateString('es-AR')),
          crearElemento('td', 'py-3 px-4 text-white', `${pesoDelUsuario} kg`),
          crearElemento('td', 'py-3 px-4 text-end text-gray', '-'),
        );
        tbody.append(tr);
      } else {
        // Si hay historial, mostramos las últimas 5 filas
        const ultimos = [...registros].reverse().slice(0, 5);
        ultimos.forEach((reg, index) => {
          const tr = crearElemento('tr');
          const fecha = new Date(reg.fecha);
          const anterior = ultimos[index + 1];
          const difReg = anterior ? reg.peso - anterior.peso : 0;
          const difTxt = difReg === 0 ? '-' : `${difReg > 0 ? '+' : ''}${difReg.toFixed(1)} kg`;
          const claseReg = difReg < 0 ? 'text-green' : difReg > 0 ? 'text-danger' : 'text-gray';

          tr.append(
            crearElemento('td', 'py-3 px-4 text-white', fecha.toLocaleDateString('es-AR')),
            crearElemento('td', 'py-3 px-4 text-white', `${reg.peso} kg`),
            crearElemento('td', `py-3 px-4 text-end ${claseReg}`, difTxt),
          );
          tbody.append(tr);
        });
      }
    }
    // Llamamos a la función que dibuja el gráfico
    dibujarGrafico(registros);
  }

  // Actualización de los textos de las tarjetas superiores
  const tarjetas = seccion.querySelectorAll('.user-card h3');
  if (tarjetas.length >= 3) {
    tarjetas[0].textContent = imc;
    tarjetas[1].textContent = pesoMeta > 0 ? `${pesoMeta} kg` : '-';
    tarjetas[2].textContent = pesoActualTxt;
  }

  const h4s = seccion.querySelectorAll('.user-card h4');
  if (h4s.length >= 2) {
    h4s[0].textContent = pesoInicialTxt;
    h4s[1].textContent = diferencia;
    h4s[1].className = claseDif;
  }
};

// Obtiene las clases disponibles y las renderiza con su estado de inscripcion
// Muestra el botón "RESERVAR" solo si hay cupos disponibles.
// si el usuario ya está inscripto, muestra un btn para desinscribirse
export const renderizarReservas = async (usuario) => {
  const contenedor = document.getElementById('contenedorReservas');
  if (!contenedor) return;
  contenedor.className = 'd-flex flex-column gap-3 mb-5';
  contenedor.replaceChildren();

  // se piden las clases y a la vez al usuario actual para saber sus inscripciones
  const [clases, usuarioActual] = await Promise.all([
    fetchSeguro('/api/clases'),
    fetchSeguro('/api/auth/me'),
  ]);

  const lista = Array.isArray(clases) ? clases : [];
  const usuarioData = usuarioActual?.usuario || usuarioActual || usuario;

  if (lista.length === 0) {
    mostrarMensaje(contenedor, 'No hay clases disponibles en este momento.');
    return;
  }

  lista.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

  lista.forEach((clase) => {
    const card = crearElemento(
      'div',
      'user-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3',
    );
    const info = crearElemento('div', 'flex-grow-1');
    const titulo = crearElemento('h4', 'text-white mb-1 fs-5', clase.titulo || 'Clase');

    let textoFechaHora = 'Fecha a confirmar';
    if (clase.fechaHora) {
      const [fecha, horaCompleta] = clase.fechaHora.split('T');
      const [anio, mes, dia] = fecha.split('-');
      const hora = horaCompleta.slice(0, 5);
      textoFechaHora = `${dia}/${mes}/${anio} · ${hora} hs`;
    }

    const pFecha = crearParrafoConIcono(
      'text-gray mb-1 fs-14',
      'bi bi-calendar-event me-2 text-green',
      textoFechaHora,
    );

    // para saber si el usuario ya esta inscripto se ve si su ID ya está en inscriptosIds
    const inscriptos = Array.isArray(clase.inscriptosIds) ? clase.inscriptosIds : [];
    const yaInscripto = usuarioData?.id && inscriptos.map(String).includes(String(usuarioData.id));

    info.append(titulo, pFecha);

    const acciones = crearElemento('div', 'd-flex align-items-center gap-3');
    const cupo = clase.cupo || clase.cupoMaximo || 0;
    const disponibles =
      clase.cuposDisponibles !== undefined ? clase.cuposDisponibles : cupo - inscriptos.length;

    if (yaInscripto) {
      acciones.append(crearElemento('span', 'text-green fs-14 fw-bold', '✓ Ya estás inscripto'));
      const btnCancelar = crearElemento(
        'button',
        'btn user-btn-outline text-danger border-danger py-2 px-4 fs-14',
        'CANCELAR',
      );
      btnCancelar.dataset.accion = 'cancelar';
      btnCancelar.dataset.id = clase.id;
      acciones.append(btnCancelar);
    } else if (disponibles > 0) {
      acciones.append(
        crearElemento('span', 'text-green fs-14 fw-bold', `Quedan ${disponibles} lugares`),
      );
      const btnReservar = crearElemento('button', 'btn btn-green py-2 px-4 fs-14', 'RESERVAR');
      btnReservar.dataset.accion = 'reservar';
      btnReservar.dataset.id = clase.id;
      acciones.append(btnReservar);
    } else {
      acciones.append(crearElemento('span', 'text-danger fs-14 fw-bold', 'Sin cupo'));
    }

    card.append(info, acciones);
    contenedor.append(card);
  });
};

// se inicializan los listeners de reservar o cancelar
export function inicializarAccionesReservas(usuario) {
  const contenedor = document.getElementById('user-reservar');
  if (!contenedor) return;

  contenedor.addEventListener('click', async (event) => {
    const boton = event.target.closest('[data-accion]');
    if (!boton) return;

    const accion = boton.dataset.accion;
    const claseId = boton.dataset.id;
    if (!claseId) return;

    boton.disabled = true;
    const textoOriginal = boton.textContent;
    boton.textContent = 'Procesando...';

    try {
      const respuesta = await fetch(
        `/api/clases/${claseId}/${accion === 'reservar' ? 'inscribir' : 'desinscribir'}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo procesar la solicitud.');
      }

      await renderizarReservas(usuario);
    } catch (error) {
      alert(error.message);
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}

// Obtiene y renderiza los turnos médicos disponibles desde el backend.
// se agrega el renderizado de los turnos disponibles y los que el usuario ya reservó
export const renderizarTurnos = async (usuario) => {
  const contenedor = document.getElementById('contenedorTurnos');
  if (!contenedor) return;

  contenedor.replaceChildren();

  const [turnosDisponibles, turnosMios] = await Promise.all([
    fetchSeguro('/api/turnos'),
    fetchSeguro('/api/turnos/mios'),
  ]);

  const disponibles = Array.isArray(turnosDisponibles) ? turnosDisponibles : [];
  const mios = Array.isArray(turnosMios) ? turnosMios : [];

  const etiquetasTipo = {
    chequeo_medico: 'Chequeo médico',
    nutricionista: 'Nutrición',
  };

  // turnos reservados
  const seccionMios = crearElemento('div', 'mb-5');
  seccionMios.append(crearElemento('h3', 'text-white mb-3 fs-15', 'Mis turnos reservados'));

  if (mios.length === 0) {
    seccionMios.append(
      crearElemento('p', 'text-gray fs-14', 'No tenés turnos reservados actualmente.'),
    );
  } else {
    const listaMios = crearElemento('div', 'd-flex flex-column gap-3');
    mios.forEach((turno) => {
      const card = crearElemento(
        'div',
        'user-card d-flex justify-content-between align-items-center flex-wrap gap-3',
      );
      const info = crearElemento('div');
      info.append(
        crearElemento('h4', 'text-white mb-1 fs-5', etiquetasTipo[turno.tipo] || turno.tipo),
        crearElemento(
          'p',
          'text-gray mb-0 fs-14',
          `${turno.fecha} · ${turno.hora} hs · ${turno.duracionMin} min`,
        ),
      );
      const btnCancelar = crearElemento(
        'button',
        'btn user-btn-outline text-danger border-danger py-2 px-4 fs-14',
        'CANCELAR',
      );
      btnCancelar.dataset.accion = 'cancelar-turno';
      btnCancelar.dataset.id = turno.id;
      card.append(info, btnCancelar);
      listaMios.append(card);
    });
    seccionMios.append(listaMios);
  }

  // turnos disponibles
  const seccionDisponibles = crearElemento('div');
  seccionDisponibles.append(crearElemento('h3', 'text-white mb-3 fs-15', 'Turnos disponibles'));

  if (disponibles.length === 0) {
    seccionDisponibles.append(
      crearElemento('p', 'text-gray fs-14', 'No hay turnos médicos disponibles.'),
    );
  } else {
    const listaDisponibles = crearElemento('div', 'd-flex flex-column gap-3');
    disponibles
      .slice()
      .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`))
      .forEach((turno) => {
        const card = crearElemento(
          'div',
          'user-card d-flex justify-content-between align-items-center flex-wrap gap-3',
        );
        const info = crearElemento('div');
        info.append(
          crearElemento('h4', 'text-white mb-1 fs-5', etiquetasTipo[turno.tipo] || turno.tipo),
          crearElemento(
            'p',
            'text-gray mb-0 fs-14',
            `${turno.fecha} · ${turno.hora} hs · ${turno.duracionMin} min`,
          ),
        );
        const btnReservar = crearElemento('button', 'btn btn-green py-2 px-4 fs-14', 'RESERVAR');
        btnReservar.dataset.accion = 'reservar-turno';
        btnReservar.dataset.id = turno.id;
        card.append(info, btnReservar);
        listaDisponibles.append(card);
      });
    seccionDisponibles.append(listaDisponibles);
  }

  contenedor.append(seccionMios, seccionDisponibles);
};

// se inicializa los listeners de reservar/cancelar turnos
export function inicializarAccionesTurnos(usuario) {
  const contenedor = document.getElementById('user-turnos');
  if (!contenedor) return;

  contenedor.addEventListener('click', async (event) => {
    const boton = event.target.closest('[data-accion]');
    if (!boton) return;

    const accion = boton.dataset.accion;
    const turnoId = boton.dataset.id;
    if (!turnoId) return;

    const endpoint = accion === 'reservar-turno' ? 'reservar' : 'cancelar';

    boton.disabled = true;
    const textoOriginal = boton.textContent;
    boton.textContent = 'Procesando...';

    try {
      const respuesta = await fetch(`/api/turnos/${turnoId}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo procesar la solicitud.');
      }

      await renderizarTurnos(usuario);
    } catch (error) {
      alert(error.message);
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}
// Llena los inputs del perfil con los datos reales del usuario logueado.
const renderizarPerfil = (usuario) => {
  const asignarValor = (id, valor) => {
    const input = document.getElementById(id);
    if (input) input.value = valor !== undefined && valor !== null ? valor : '';
  };

  asignarValor('perfil-nombre', usuario.nombre);
  asignarValor('perfil-dni', usuario.dni || usuario.id);
  asignarValor('perfil-email', usuario.email);
  asignarValor('perfil-telefono', usuario.telefono);
  asignarValor('perfil-altura', usuario.altura);
  asignarValor('perfil-peso-inicial', usuario.peso);
  asignarValor('perfil-peso-meta', usuario.pesoMeta);

  // Traduce los valores del JSON ("perder_peso") a los values del HTML ("deficit")
  const selectObjetivo = document.getElementById('selectObjetivo');
  if (selectObjetivo && usuario.objetivo) {
    let valorSelect = usuario.objetivo;
    if (usuario.objetivo === 'perder_peso') valorSelect = 'deficit';
    if (usuario.objetivo === 'ganar_musculo') valorSelect = 'volumen';
    selectObjetivo.value = valorSelect;
  }
};
// Renderiza las notificaciones del miembro.
// Si el backend no envía notificaciones, muestra un mensaje por defecto.
const renderizarNotificaciones = async (usuario) => {
  const contenedor = document.querySelector('#user-notificaciones .d-flex.flex-column.gap-3');
  if (!contenedor) return;
  contenedor.replaceChildren();

  const lista = usuario.notificaciones;

  if (!Array.isArray(lista) || lista.length === 0) {
    mostrarMensaje(contenedor, 'No tenés notificaciones nuevas.');
    return;
  }

  lista.forEach((n) => {
    const titulo = n.titulo || 'Aviso';
    const texto = n.texto || n.mensaje || '';
    const fecha = n.fecha ? new Date(n.fecha).toLocaleDateString('es-AR') : 'Reciente';
    const leida = n.leida || false;
    const icono = n.icono || 'bi-bell';

    const card = crearElemento(
      'div',
      `user-card d-flex align-items-start gap-3 ${leida ? 'opacity-50' : 'border-start-green'}`,
    );

    const iconDiv = crearElemento('div', 'p-3 rounded bg-pulso-darker');
    const iconTag = crearElemento('i', `bi ${icono} ${leida ? 'text-gray' : 'text-green'} fs-4`);
    iconDiv.append(iconTag);

    const info = crearElemento('div', 'flex-grow-1');
    const header = crearElemento('div', 'd-flex justify-content-between align-items-start');
    header.append(
      crearElemento('h5', 'text-white mb-1', titulo),
      crearElemento('span', 'badge bg-dark border border-secondary text-gray fs-12', fecha),
    );
    info.append(header, crearElemento('p', 'text-gray mb-0 fs-14', texto));

    card.append(iconDiv, info);
    contenedor.append(card);
  });
};
// Función principal que llama a todos los renderizadores para armar el panel.
export async function inicializarRenderizadoMiembro(usuario) {
  renderizarPerfil(usuario);
  renderizarHistorialYGrafico(usuario);
  await renderizarReservas(usuario);
  inicializarAccionesReservas(usuario);
  await renderizarTurnos(usuario);
  inicializarAccionesTurnos(usuario);
  await renderizarNotificaciones(usuario);
}
