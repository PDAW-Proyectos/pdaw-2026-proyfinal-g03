import { mostrarToast } from '../componentes/toast.js';

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

const dibujarGrafico = (registros) => {
  const contenedor = document.getElementById('contenedor-grafico');
  if (!contenedor) return;

  if (!Array.isArray(registros) || registros.length === 0) {
    contenedor.replaceChildren(
      crearElemento('div', 'text-gray text-center w-100 py-5', 'No hay pesajes guardados en este mes.'),
    );
    contenedor.style.height = 'auto';
    contenedor.style.minHeight = '150px';
    return;
  }

  if (registros.length === 1) {
    contenedor.replaceChildren(
      crearElemento('div', 'text-gray text-center w-100 py-5', 'Registrá al menos 2 pesajes este mes para ver tu gráfico de evolución.'),
    );
    contenedor.style.height = 'auto';
    contenedor.style.minHeight = '150px';
    return;
  }

  contenedor.replaceChildren();
  contenedor.style.borderStyle = 'solid';
  contenedor.style.backgroundColor = '#1e1e1e';
  contenedor.style.height = 'auto';
  contenedor.style.minHeight = '200px';

  const datos = registros.map((r) => Number(r.peso || r.pesoActual));
  const etiquetas = registros.map((r) => {
    const d = new Date(r.fecha);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const width = 700, height = 280, paddingLeft = 50, paddingBottom = 40, paddingTop = 30, paddingRight = 30;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const maxPeso = Math.max(...datos) + 2;
  const minPeso = Math.min(...datos) - 2;
  const rangoPeso = maxPeso - minPeso || 1;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.display = 'block';

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
    textoY.textContent = valorY.toFixed(1);
    svg.appendChild(textoY);
  }

  const puntos = datos.map((peso, index) => {
    const x = paddingLeft + index * (chartWidth / (datos.length - 1));
    const y = height - paddingBottom - ((peso - minPeso) / rangoPeso) * chartHeight;
    return { x, y, peso, etiqueta: etiquetas[index] };
  });

  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  polyline.setAttribute('points', puntos.map((p) => `${p.x},${p.y}`).join(' '));
  polyline.setAttribute('fill', 'none');
  polyline.setAttribute('stroke', '#3b82f6');
  polyline.setAttribute('stroke-width', '3');
  svg.appendChild(polyline);

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
    textoPeso.setAttribute('font-weight', 'bold');
    textoPeso.setAttribute('text-anchor', 'middle');
    textoPeso.textContent = `${p.peso} kg`;
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
let mesSeleccionadoGrafico = null;

const renderizarHistorialYGrafico = (usuario) => {
  const seccion = document.getElementById('user-historial');
  if (!seccion) return;

  const registros = Array.isArray(usuario.historialPesos) ? [...usuario.historialPesos] : [];
  registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const mesesSet = new Set();
  registros.forEach(r => {
    const d = new Date(r.fecha);
    mesesSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  });
  const mesesArray = Array.from(mesesSet).sort();

  const labelMes = document.getElementById('mesActualGrafico');
  const btnAnterior = document.getElementById('btnMesAnterior');
  const btnSiguiente = document.getElementById('btnMesSiguiente');
  const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  if (labelMes && btnAnterior && btnSiguiente) {
    if (mesSeleccionadoGrafico === null) {
      const hoy = new Date();
      mesSeleccionadoGrafico = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    }

    if (mesSeleccionadoGrafico) {
      const [anio, mes] = mesSeleccionadoGrafico.split('-');
      labelMes.textContent = `${nombresMeses[parseInt(mes) - 1]} ${anio}`;

      const hoy = new Date();
      const mesActualStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;

      btnSiguiente.disabled = (mesSeleccionadoGrafico >= mesActualStr);
      btnAnterior.disabled = false;
    }
  }

  let registrosFiltrados = registros;
  if (mesSeleccionadoGrafico) {
    registrosFiltrados = registros.filter(r => {
      const d = new Date(r.fecha);
      const mesStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return mesStr === mesSeleccionadoGrafico;
    });
  }

  const pesoDelUsuario = registros.length > 0 ? Number(registros[registros.length - 1].peso) : Number(usuario.peso || 0);
  const pesoInicial = registros.length > 0 ? Number(registros[0].peso) : pesoDelUsuario;
  const pesoMeta = usuario.pesoMeta !== null && usuario.pesoMeta !== undefined ? Number(usuario.pesoMeta) : 0;

  let imc = '-', diferencia = '-', pesoActualTxt = '-', pesoInicialTxt = '-', claseDif = 'text-white';

  if (pesoDelUsuario > 0) {
    pesoActualTxt = `${pesoDelUsuario} kg`;
    pesoInicialTxt = `${pesoInicial} kg`;
    const difNum = pesoDelUsuario - pesoInicial;
    diferencia = `${difNum > 0 ? '+' : ''}${difNum.toFixed(1)} kg`;

    if (usuario.altura) {
      const alturaM = usuario.altura / 100;
      imc = (pesoDelUsuario / (alturaM * alturaM)).toFixed(1);
    }
  }

  const tbody = document.querySelector('#user-progreso tbody');
  if (tbody) {
    tbody.replaceChildren();
    const registrosParaTabla = registrosFiltrados;

    if (registrosParaTabla.length === 0) {
      const tr = crearElemento('tr');
      tr.append(
        crearElemento('td', 'py-3 px-4 text-white', '-'),
        crearElemento('td', 'py-3 px-4 text-white', '-'),
        crearElemento('td', 'py-3 px-4 text-end text-gray', '-'),
      );
      tbody.append(tr);
    } else {
      const ultimos = [...registrosParaTabla].reverse().slice(0, 10);
      ultimos.forEach((reg, index) => {
        const tr = crearElemento('tr');
        const fecha = new Date(reg.fecha);
        const anterior = ultimos[index + 1];

        const pesoActualReg = Number(reg.peso);
        const pesoAnterior = anterior ? Number(anterior.peso) : null;

        const difReg = pesoAnterior !== null ? pesoActualReg - pesoAnterior : 0;
        const difTxt = difReg === 0 ? '-' : `${difReg > 0 ? '+' : ''}${difReg.toFixed(1)} kg`;

        tr.append(
          crearElemento('td', 'py-3 px-4 text-white', fecha.toLocaleDateString('es-AR')),
          crearElemento('td', 'py-3 px-4 text-white', `${pesoActualReg} kg`),
          crearElemento('td', `py-3 px-4 text-end text-white`, difTxt),
        );
        tbody.append(tr);
      });
    }
  }

  dibujarGrafico(registrosFiltrados);
  const tarjetas = seccion.querySelectorAll('.user-card h3');
  if (tarjetas.length >= 3) {
    tarjetas[0].textContent = imc !== '-' ? imc : '-';
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
const cargarHistorialPesos = async (usuario) => {
  try {
    const respuesta = await fetch('/api/seguimientoProgreso', { credentials: 'include' });
    if (respuesta.ok) {
      const data = await respuesta.json();
      if (data.pesajes && Array.isArray(data.pesajes)) {
        usuario.historialPesos = data.pesajes.map(p => ({
          fecha: p.fecha,
          peso: p.peso
        }));
      }
    }
  } catch (error) {
    console.warn('No se pudo cargar el historial de pesos:', error);
  }
};

const inicializarRegistroPeso = (usuario) => {
  const btnRegistrar = document.getElementById('btnRegistrarPeso');
  const inputPeso = document.getElementById('inputPesoActual');

  if (!btnRegistrar || !inputPeso) return;

  inputPeso.disabled = false;
  btnRegistrar.disabled = false;

  if (btnRegistrar.dataset.registroInicializado === 'true') return;
  btnRegistrar.dataset.registroInicializado = 'true';

  btnRegistrar.addEventListener('click', async () => {
    const peso = parseFloat(inputPeso.value);

    if (isNaN(peso) || peso <= 0) {
      mostrarToast('Error', 'Por favor, ingresa un peso válido.', 'error');
      return;
    }

    if (peso < 20 || peso > 400) {
      mostrarToast('Error', 'El peso debe estar entre 20 kg y 400 kg.', 'error');
      return;
    }

    const fechaHoyStr = new Date().toISOString().split('T')[0];
    const registros = usuario.historialPesos || [];

    const indiceHoy = registros.findIndex(r => {
      const d = new Date(r.fecha);
      return d.toISOString().split('T')[0] === fechaHoyStr;
    });

    const esActualizacion = indiceHoy !== -1;

    btnRegistrar.disabled = true;
    const textoOriginal = btnRegistrar.textContent;
    btnRegistrar.textContent = 'GUARDANDO...';

    try {
      const respuesta = await fetch('/api/seguimientoProgreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ peso: peso }),
      });

      if (!respuesta.ok) {
        const errorData = await respuesta.json().catch(() => ({}));
        if (respuesta.status === 403) {
          throw new Error('No tenés permisos para registrar el peso.');
        }
        throw new Error(errorData.detail || errorData.error || 'Error al registrar el peso.');
      }

      if (!Array.isArray(usuario.historialPesos)) usuario.historialPesos = [];

      if (esActualizacion) {
        usuario.historialPesos[indiceHoy].peso = peso;
      } else {
        usuario.historialPesos.push({
          fecha: new Date().toISOString(),
          peso: peso
        });
      }

      usuario.peso = peso;
      inputPeso.value = '';

      const hoy = new Date();
      mesSeleccionadoGrafico = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;

      renderizarHistorialYGrafico(usuario);

      if (esActualizacion) {
        mostrarToast('Peso actualizado', 'El peso de hoy se guardó correctamente. Tu progreso ya está al día.', 'success');
      } else {
        mostrarToast('Peso registrado', 'Tu nuevo peso se ha guardado con éxito en tu historial.', 'success');
      }

    } catch (error) {
      console.error(error);
      mostrarToast('Error', error.message, 'error');
    } finally {
      btnRegistrar.disabled = false;
      btnRegistrar.textContent = textoOriginal;
    }
  });
};

const inicializarFiltroMes = (usuario) => {
  const btnAnterior = document.getElementById('btnMesAnterior');
  const btnSiguiente = document.getElementById('btnMesSiguiente');

  if (btnAnterior && btnSiguiente && btnAnterior.dataset.inicializado !== 'true') {
    btnAnterior.dataset.inicializado = 'true';
    btnSiguiente.dataset.inicializado = 'true';

    const cambiarMes = (direccion) => {
      if (!mesSeleccionadoGrafico) return;
      let [anio, mes] = mesSeleccionadoGrafico.split('-').map(Number);
      mes += direccion;
      if (mes > 12) { mes = 1; anio++; }
      if (mes < 1) { mes = 12; anio--; }
      mesSeleccionadoGrafico = `${anio}-${String(mes).padStart(2, '0')}`;
      renderizarHistorialYGrafico(usuario);
    };

    btnAnterior.addEventListener('click', () => cambiarMes(-1));
    btnSiguiente.addEventListener('click', () => cambiarMes(1));
  }
};
export const renderizarReservas = async (usuario) => {
  const contenedor = document.getElementById('contenedorReservas');
  if (!contenedor) return;
  contenedor.className = 'd-flex flex-column gap-3 mb-5';
  contenedor.replaceChildren();

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
    const card = crearElemento('div', 'user-card d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3');
    const info = crearElemento('div', 'flex-grow-1');
    const titulo = crearElemento('h4', 'text-white mb-1 fs-5', clase.titulo || 'Clase');

    let textoFechaHora = 'Fecha a confirmar';
    if (clase.fechaHora) {
      const [fecha, horaCompleta] = clase.fechaHora.split('T');
      const [anio, mes, dia] = fecha.split('-');
      const hora = horaCompleta.slice(0, 5);
      textoFechaHora = `${dia}/${mes}/${anio} · ${hora} hs`;
    }

    const pFecha = crearParrafoConIcono('text-gray mb-1 fs-14', 'bi bi-calendar-event me-2 text-green', textoFechaHora);
    const inscriptos = Array.isArray(clase.inscriptosIds) ? clase.inscriptosIds : [];
    const yaInscripto = usuarioData?.id && inscriptos.map(String).includes(String(usuarioData.id));

    info.append(titulo, pFecha);

    const acciones = crearElemento('div', 'd-flex align-items-center gap-3');
    const cupo = clase.cupo || clase.cupoMaximo || 0;
    const disponibles = clase.cuposDisponibles !== undefined ? clase.cuposDisponibles : cupo - inscriptos.length;

    if (yaInscripto) {
      acciones.append(crearElemento('span', 'text-green fs-14 fw-bold', '✓ Ya estás inscripto'));
      const btnCancelar = crearElemento('button', 'btn user-btn-outline text-danger border-danger py-2 px-4 fs-14', 'CANCELAR');
      btnCancelar.dataset.accion = 'cancelar';
      btnCancelar.dataset.id = clase.id;
      acciones.append(btnCancelar);
    } else if (disponibles > 0) {
      acciones.append(crearElemento('span', 'text-green fs-14 fw-bold', `Quedan ${disponibles} lugares`));
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
      const respuesta = await fetch(`/api/clases/${claseId}/${accion === 'reservar' ? 'inscribir' : 'desinscribir'}`, {
        method: 'POST',
        credentials: 'include',
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo procesar la solicitud.');
      }

      await renderizarReservas(usuario);
      mostrarToast('Éxito', accion === 'reservar' ? 'Reserva confirmada.' : 'Reserva cancelada.', 'success');
    } catch (error) {
      mostrarToast('Error al procesar reserva', error.message, 'error');
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}

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

  const seccionMios = crearElemento('div', 'mb-5');
  seccionMios.append(crearElemento('h3', 'text-white mb-3 fs-15', 'Mis turnos reservados'));

  if (mios.length === 0) {
    seccionMios.append(crearElemento('p', 'text-gray fs-14', 'No tenés turnos reservados actualmente.'));
  } else {
    const listaMios = crearElemento('div', 'd-flex flex-column gap-3');
    mios.forEach((turno) => {
      const card = crearElemento('div', 'user-card d-flex justify-content-between align-items-center flex-wrap gap-3');
      const info = crearElemento('div');
      info.append(
        crearElemento('h4', 'text-white mb-1 fs-5', etiquetasTipo[turno.tipo] || turno.tipo),
        crearElemento('p', 'text-gray mb-0 fs-14', `${turno.fecha} · ${turno.hora} hs · ${turno.duracionMin} min`),
      );
      const btnCancelar = crearElemento('button', 'btn user-btn-outline text-danger border-danger py-2 px-4 fs-14', 'CANCELAR');
      btnCancelar.dataset.accion = 'cancelar-turno';
      btnCancelar.dataset.id = turno.id;
      card.append(info, btnCancelar);
      listaMios.append(card);
    });
    seccionMios.append(listaMios);
  }

  const seccionDisponibles = crearElemento('div');
  seccionDisponibles.append(crearElemento('h3', 'text-white mb-3 fs-15', 'Turnos disponibles'));

  if (disponibles.length === 0) {
    seccionDisponibles.append(crearElemento('p', 'text-gray fs-14', 'No hay turnos médicos disponibles.'));
  } else {
    const listaDisponibles = crearElemento('div', 'd-flex flex-column gap-3');
    disponibles
      .slice()
      .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`))
      .forEach((turno) => {
        const card = crearElemento('div', 'user-card d-flex justify-content-between align-items-center flex-wrap gap-3');
        const info = crearElemento('div');
        info.append(
          crearElemento('h4', 'text-white mb-1 fs-5', etiquetasTipo[turno.tipo] || turno.tipo),
          crearElemento('p', 'text-gray mb-0 fs-14', `${turno.fecha} · ${turno.hora} hs · ${turno.duracionMin} min`),
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
      mostrarToast('Éxito', accion === 'reservar-turno' ? 'Turno reservado.' : 'Turno cancelado.', 'success');
    } catch (error) {
      mostrarToast('Error al procesar turno', error.message, 'error');
    } finally {
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}

export const renderizarPerfil = (usuario) => {
  const asignarValor = (id, valor) => {
    const input = document.getElementById(id);
    if (input) input.value = valor !== undefined && valor !== null ? valor : '';
  };

  asignarValor('perfil-nombre', usuario.nombre);
  asignarValor('perfil-dni', usuario.dni || usuario.id);
  asignarValor('perfil-email', usuario.email);
  asignarValor('perfil-telefono', usuario.telefono);
  asignarValor('perfil-altura', usuario.altura);
  asignarValor('perfil-edad', usuario.edad);
  asignarValor('perfil-peso-inicial', usuario.peso);
  asignarValor('perfil-peso-meta', usuario.pesoMeta);

  const selectObjetivo = document.getElementById('selectObjetivo');
  if (selectObjetivo) {
    selectObjetivo.value = usuario.objetivo || '';
  }
};

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

    const card = crearElemento('div', `user-card d-flex align-items-start gap-3 ${leida ? 'opacity-50' : 'border-start-green'}`);

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
export async function inicializarRenderizadoMiembro(usuario) {
  renderizarPerfil(usuario);
  await cargarHistorialPesos(usuario);
  renderizarHistorialYGrafico(usuario);
  inicializarFiltroMes(usuario);
  inicializarRegistroPeso(usuario);
  await renderizarReservas(usuario);
  inicializarAccionesReservas(usuario);
  await renderizarTurnos(usuario);
  inicializarAccionesTurnos(usuario);
  await renderizarNotificaciones(usuario);
}