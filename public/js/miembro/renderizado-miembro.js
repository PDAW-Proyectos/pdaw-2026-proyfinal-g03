import { mostrarToast } from '../componentes/toast.js';
// Crea un elemento HTML de forma segura.
const crearElemento = (etiqueta, clases, texto) => {
  const el = document.createElement(etiqueta);
  if (clases) el.className = clases;
  if (texto !== undefined) el.textContent = texto;
  return el;
};
// Variable global para mantener el estado del filtro
let filtroTextoNombre = '';
let filtroFecha = '';

// Función auxiliar para formatear la fecha (para no repetir código)
const formatearFechaHora = (fechaHoraISO) => {
  if (!fechaHoraISO) return 'Fecha a confirmar';
  const [fecha, horaCompleta] = fechaHoraISO.split('T');
  const [anio, mes, dia] = fecha.split('-');
  const hora = horaCompleta.slice(0, 5);
  return `${dia}/${mes}/${anio} · ${hora} hs`;
};

// Crea un párrafo (<p>) que contiene un ícono de Bootstrap Icons seguido de un texto.
const crearParrafoConIcono = (clases, iconoClases, texto) => {
  const p = crearElemento('p', clases);
  const i = crearElemento('i', iconoClases);
  p.append(i, document.createTextNode(` ${texto}`));
  return p;
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
const dibujarGrafico = (listaDePesajes, pesoInicialDelPerfil) => {
  const contenedorGrafico = document.getElementById('contenedor-grafico');
  if (!contenedorGrafico) return;
  if (!Array.isArray(listaDePesajes) || listaDePesajes.length === 0) {
    contenedorGrafico.replaceChildren(
      crearElemento('div', 'text-gray text-center w-100 py-5', 'No hay pesajes guardados en este mes.'),
    );
    contenedorGrafico.style.height = 'auto';
    contenedorGrafico.style.minHeight = '150px';
    return;
  }
  const datosParaGrafico = [...listaDePesajes];
  if (pesoInicialDelPerfil > 0) {
    const primerPesaje = datosParaGrafico[0];
    if (Number(primerPesaje.peso) !== Number(pesoInicialDelPerfil)) {
      const fechaDelPrimerPesaje = new Date(primerPesaje.fecha);
      fechaDelPrimerPesaje.setDate(fechaDelPrimerPesaje.getDate() - 1);

      datosParaGrafico.unshift({
        fecha: fechaDelPrimerPesaje.toISOString(),
        peso: pesoInicialDelPerfil
      });
    }
  }
  if (datosParaGrafico.length < 2) {
    contenedorGrafico.replaceChildren(
      crearElemento('div', 'text-gray text-center w-100 py-5', 'Registrá al menos un pesaje para ver tu gráfico de evolución.'),
    );
    contenedorGrafico.style.height = 'auto';
    contenedorGrafico.style.minHeight = '150px';
    return;
  }
  contenedorGrafico.replaceChildren();
  contenedorGrafico.style.borderStyle = 'solid';
  contenedorGrafico.style.backgroundColor = '#1e1e1e';
  contenedorGrafico.style.height = 'auto';
  contenedorGrafico.style.minHeight = '200px';

  const valoresDePeso = datosParaGrafico.map((registro) => Number(registro.peso || registro.pesoActual));
  const etiquetasDeFechas = datosParaGrafico.map((registro) => {
    const fecha = new Date(registro.fecha);
    return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const ancho = 700, alto = 280, margenIzquierdo = 50, margenInferior = 40, margenSuperior = 30, margenDerecho = 30;
  const anchoDelArea = ancho - margenIzquierdo - margenDerecho;
  const altoDelArea = alto - margenSuperior - margenInferior;
  const pesoMaximo = Math.max(...valoresDePeso) + 2;
  const pesoMinimo = Math.min(...valoresDePeso) - 2;
  const rangoDePeso = pesoMaximo - pesoMinimo || 1;

  const elementoLienzo = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  elementoLienzo.setAttribute('viewBox', `0 0 ${ancho} ${alto}`);
  elementoLienzo.setAttribute('width', '100%');
  elementoLienzo.setAttribute('height', '100%');
  elementoLienzo.style.display = 'block';

  for (let indice = 0; indice <= 4; indice++) {
    const coordenadaY = margenSuperior + indice * (altoDelArea / 4);
    const valorDelEjeY = pesoMaximo - indice * (rangoDePeso / 4);

    const lineaDeCuadricula = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineaDeCuadricula.setAttribute('x1', margenIzquierdo);
    lineaDeCuadricula.setAttribute('y1', coordenadaY);
    lineaDeCuadricula.setAttribute('x2', ancho - margenDerecho);
    lineaDeCuadricula.setAttribute('y2', coordenadaY);
    lineaDeCuadricula.setAttribute('stroke', '#333');
    elementoLienzo.appendChild(lineaDeCuadricula);

    const textoDelEjeY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textoDelEjeY.setAttribute('x', margenIzquierdo - 10);
    textoDelEjeY.setAttribute('y', coordenadaY + 4);
    textoDelEjeY.setAttribute('fill', '#888');
    textoDelEjeY.setAttribute('font-size', '12');
    textoDelEjeY.setAttribute('text-anchor', 'end');
    textoDelEjeY.textContent = valorDelEjeY.toFixed(1);
    elementoLienzo.appendChild(textoDelEjeY);
  }

  const puntosDelGrafico = valoresDePeso.map((peso, indice) => {
    const coordenadaX = margenIzquierdo + indice * (anchoDelArea / (valoresDePeso.length - 1));
    const coordenadaY = alto - margenInferior - ((peso - pesoMinimo) / rangoDePeso) * altoDelArea;
    return { x: coordenadaX, y: coordenadaY, peso: peso, etiqueta: etiquetasDeFechas[indice] };
  });

  const lineaDelGrafico = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  lineaDelGrafico.setAttribute('points', puntosDelGrafico.map((punto) => `${punto.x},${punto.y}`).join(' '));
  lineaDelGrafico.setAttribute('fill', 'none');
  lineaDelGrafico.setAttribute('stroke', '#3b82f6');
  lineaDelGrafico.setAttribute('stroke-width', '3');
  elementoLienzo.appendChild(lineaDelGrafico);

  puntosDelGrafico.forEach((punto) => {
    const circuloDelPunto = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circuloDelPunto.setAttribute('cx', punto.x);
    circuloDelPunto.setAttribute('cy', punto.y);
    circuloDelPunto.setAttribute('r', '5');
    circuloDelPunto.setAttribute('fill', '#1e1e1e');
    circuloDelPunto.setAttribute('stroke', '#3b82f6');
    circuloDelPunto.setAttribute('stroke-width', '2');
    elementoLienzo.appendChild(circuloDelPunto);

    const textoDelPeso = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textoDelPeso.setAttribute('x', punto.x);
    textoDelPeso.setAttribute('y', punto.y - 12);
    textoDelPeso.setAttribute('fill', '#3b82f6');
    textoDelPeso.setAttribute('font-size', '12');
    textoDelPeso.setAttribute('font-weight', 'bold');
    textoDelPeso.setAttribute('text-anchor', 'middle');
    textoDelPeso.textContent = `${punto.peso} kg`;
    elementoLienzo.appendChild(textoDelPeso);

    const textoDeLaFecha = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textoDeLaFecha.setAttribute('x', punto.x);
    textoDeLaFecha.setAttribute('y', alto - margenInferior + 20);
    textoDeLaFecha.setAttribute('fill', '#ccc');
    textoDeLaFecha.setAttribute('font-size', '12');
    textoDeLaFecha.setAttribute('text-anchor', 'middle');
    textoDeLaFecha.textContent = punto.etiqueta;
    elementoLienzo.appendChild(textoDeLaFecha);
  });

  contenedorGrafico.appendChild(elementoLienzo);
};
let mesSeleccionadoGrafico = null;

export const renderizarHistorialYGrafico = (usuario) => {
  const seccionHistorial = document.getElementById('user-historial');
  if (!seccionHistorial) return;

  const listaDePesajes = Array.isArray(usuario.historialPesos) ? [...usuario.historialPesos] : [];
  listaDePesajes.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const mesesUnicos = new Set();
  listaDePesajes.forEach((registro) => {
    const fecha = new Date(registro.fecha);
    mesesUnicos.add(`${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`);
  });

  const textoDelMes = document.getElementById('mesActualGrafico');
  const botonMesAnterior = document.getElementById('btnMesAnterior');
  const botonMesSiguiente = document.getElementById('btnMesSiguiente');
  const nombresDeLosMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  if (textoDelMes && botonMesAnterior && botonMesSiguiente) {
    if (mesSeleccionadoGrafico === null) {
      const fechaDeHoy = new Date();
      mesSeleccionadoGrafico = `${fechaDeHoy.getFullYear()}-${String(fechaDeHoy.getMonth() + 1).padStart(2, '0')}`;
    }

    if (mesSeleccionadoGrafico) {
      const [anio, mes] = mesSeleccionadoGrafico.split('-');
      textoDelMes.textContent = `${nombresDeLosMeses[parseInt(mes) - 1]} ${anio}`;

      const fechaDeHoy = new Date();
      const mesActualFormateado = `${fechaDeHoy.getFullYear()}-${String(fechaDeHoy.getMonth() + 1).padStart(2, '0')}`;

      botonMesSiguiente.disabled = (mesSeleccionadoGrafico >= mesActualFormateado);
      botonMesAnterior.disabled = false;
    }
  }
  let pesajesFiltrados = listaDePesajes;
  if (mesSeleccionadoGrafico) {
    pesajesFiltrados = listaDePesajes.filter((registro) => {
      const fecha = new Date(registro.fecha);
      const mesDelRegistro = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      return mesDelRegistro === mesSeleccionadoGrafico;
    });
  }
  const ultimoPesoRegistrado = listaDePesajes.length > 0
    ? Number(listaDePesajes[listaDePesajes.length - 1].peso)
    : Number(usuario.peso || 0);
  const pesoInicialDelPerfil = Number(usuario.peso || 0);

  const metaDePeso = usuario.pesoMeta !== null && usuario.pesoMeta !== undefined ? Number(usuario.pesoMeta) : 0;

  let calculoIMC = '-', textoDiferenciaTotal = '-', textoPesoActual = '-', textoPesoInicial = '-';
  const claseDeDiferencia = 'text-white';

  if (ultimoPesoRegistrado > 0) {
    textoPesoActual = `${ultimoPesoRegistrado} kg`;
    textoPesoInicial = `${pesoInicialDelPerfil} kg`;
    const diferenciaNumerica = ultimoPesoRegistrado - pesoInicialDelPerfil;
    textoDiferenciaTotal = `${diferenciaNumerica > 0 ? '+' : ''}${diferenciaNumerica.toFixed(1)} kg`;

    if (usuario.altura) {
      const alturaEnMetros = usuario.altura / 100;
      calculoIMC = (ultimoPesoRegistrado / (alturaEnMetros * alturaEnMetros)).toFixed(1);
    }
  }

  const cuerpoDeTabla = document.querySelector('#user-progreso tbody');
  if (cuerpoDeTabla) {
    cuerpoDeTabla.replaceChildren();
    const pesajesParaLaTabla = pesajesFiltrados;

    if (pesajesParaLaTabla.length === 0) {
      const filaVacia = crearElemento('tr');
      filaVacia.append(
        crearElemento('td', 'py-3 px-4 text-white', '-'),
        crearElemento('td', 'py-3 px-4 text-white', '-'),
        crearElemento('td', 'py-3 px-4 text-end text-gray', '-'),
      );
      cuerpoDeTabla.append(filaVacia);
    } else {
      const ultimosPesajesDeLaTabla = [...pesajesParaLaTabla].reverse().slice(0, 10);

      ultimosPesajesDeLaTabla.forEach((registro, indice) => {
        const filaDeTabla = crearElemento('tr');
        const fechaDelRegistro = new Date(registro.fecha);
        const registroAnterior = ultimosPesajesDeLaTabla[indice + 1];

        const pesoDeEstaFila = Number(registro.peso);
        const pesoDeLaFilaAnterior = registroAnterior ? Number(registroAnterior.peso) : null;

        let textoDeLaDiferencia = '-';
        if (pesoDeLaFilaAnterior !== null) {
          const calculoDeDiferencia = pesoDeEstaFila - pesoDeLaFilaAnterior;
          if (calculoDeDiferencia !== 0) {
            const signo = calculoDeDiferencia > 0 ? '+' : '';
            textoDeLaDiferencia = `${signo}${calculoDeDiferencia.toFixed(1)} kg`;
          }
        }

        filaDeTabla.append(
          crearElemento('td', 'py-3 px-4 text-white', fechaDelRegistro.toLocaleDateString('es-AR')),
          crearElemento('td', 'py-3 px-4 text-white', `${pesoDeEstaFila} kg`),
          crearElemento('td', `py-3 px-4 text-end text-white`, textoDeLaDiferencia),
        );
        cuerpoDeTabla.append(filaDeTabla);
      });
    }
  }

  dibujarGrafico(pesajesFiltrados, pesoInicialDelPerfil);
  const tarjetasDeHistorial = seccionHistorial.querySelectorAll('.user-card h3');
  if (tarjetasDeHistorial.length >= 3) {
    tarjetasDeHistorial[0].textContent = calculoIMC !== '-' ? calculoIMC : '-';
    tarjetasDeHistorial[1].textContent = metaDePeso > 0 ? `${metaDePeso} kg` : '-';
    tarjetasDeHistorial[2].textContent = textoPesoActual;
  }

  const subtitulosDeHistorial = seccionHistorial.querySelectorAll('.user-card h4');
  if (subtitulosDeHistorial.length >= 2) {
    subtitulosDeHistorial[0].textContent = textoPesoInicial;
    subtitulosDeHistorial[1].textContent = textoDiferenciaTotal;
    subtitulosDeHistorial[1].className = claseDeDiferencia;
  }
  const tarjetaProgresoPesoInicial = document.getElementById('progresoPesoInicial');
  const tarjetaProgresoPesoActual = document.getElementById('progresoPesoActual');

  if (tarjetaProgresoPesoInicial) {
    tarjetaProgresoPesoInicial.textContent = pesoInicialDelPerfil > 0 ? `${pesoInicialDelPerfil} kg` : '-';
  }

  if (tarjetaProgresoPesoActual) {
    tarjetaProgresoPesoActual.textContent = ultimoPesoRegistrado > 0 ? `${ultimoPesoRegistrado} kg` : '-';
  }
};
const cargarHistorialPesos = async (usuario) => {
  try {
    const respuestaDelServidor = await fetch('/api/seguimientoProgreso', { credentials: 'include' });
    if (respuestaDelServidor.ok) {
      const datosDelServidor = await respuestaDelServidor.json();
      if (datosDelServidor.pesajes && Array.isArray(datosDelServidor.pesajes)) {
        usuario.historialPesos = datosDelServidor.pesajes.map((pesaje) => ({
          fecha: pesaje.fecha,
          peso: pesaje.peso
        }));
      }
    }
  } catch (error) {
    console.warn('No se pudo cargar el historial de pesos:', error);
  }
};

const inicializarRegistroPeso = (usuario) => {
  const botonRegistrar = document.getElementById('btnRegistrarPeso');
  const inputDelPeso = document.getElementById('inputPesoActual');

  if (!botonRegistrar || !inputDelPeso) return;

  inputDelPeso.disabled = false;
  botonRegistrar.disabled = false;

  if (botonRegistrar.dataset.registroInicializado === 'true') return;
  botonRegistrar.dataset.registroInicializado = 'true';

  botonRegistrar.addEventListener('click', async () => {
    const pesoIngresado = parseFloat(inputDelPeso.value);

    if (isNaN(pesoIngresado) || pesoIngresado <= 0) {
      mostrarToast('Error', 'Por favor, ingresa un peso válido.', 'error');
      return;
    }

    if (pesoIngresado < 20 || pesoIngresado > 400) {
      mostrarToast('Error', 'El peso debe estar entre 20 kg y 400 kg.', 'error');
      return;
    }

    const fechaDeHoyFormateada = new Date().toISOString().split('T')[0];
    const listaDePesajesDelUsuario = usuario.historialPesos || [];

    const indiceDelPesajeDeHoy = listaDePesajesDelUsuario.findIndex((registro) => {
      const fechaDelRegistro = new Date(registro.fecha);
      return fechaDelRegistro.toISOString().split('T')[0] === fechaDeHoyFormateada;
    });

    const esUnaActualizacion = indiceDelPesajeDeHoy !== -1;

    botonRegistrar.disabled = true;
    const textoOriginalDelBoton = botonRegistrar.textContent;
    botonRegistrar.textContent = 'GUARDANDO...';

    try {
      const respuestaDelServidor = await fetch('/api/seguimientoProgreso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ peso: pesoIngresado }),
      });

      if (!respuestaDelServidor.ok) {
        const datosDelError = await respuestaDelServidor.json().catch(() => ({}));
        if (respuestaDelServidor.status === 403) {
          throw new Error('No tenés permisos para registrar el peso.');
        }
        throw new Error(datosDelError.detail || datosDelError.error || 'Error al registrar el peso.');
      }

      if (!Array.isArray(usuario.historialPesos)) usuario.historialPesos = [];

      if (esUnaActualizacion) {
        usuario.historialPesos[indiceDelPesajeDeHoy].peso = pesoIngresado;
      } else {
        usuario.historialPesos.push({
          fecha: new Date().toISOString(),
          peso: pesoIngresado
        });
      }

      inputDelPeso.value = '';

      const fechaDeHoy = new Date();
      mesSeleccionadoGrafico = `${fechaDeHoy.getFullYear()}-${String(fechaDeHoy.getMonth() + 1).padStart(2, '0')}`;

      renderizarHistorialYGrafico(usuario);

      if (esUnaActualizacion) {
        mostrarToast('Peso actualizado', 'El peso de hoy se guardó correctamente. Tu progreso ya está al día.', 'success');
      } else {
        mostrarToast('Peso registrado', 'Tu nuevo peso se ha guardado con éxito en tu historial.', 'success');
      }

    } catch (error) {
      console.error(error);
      mostrarToast('Error', error.message, 'error');
    } finally {
      botonRegistrar.disabled = false;
      botonRegistrar.textContent = textoOriginalDelBoton;
    }
  });
};

const inicializarFiltroMes = (usuario) => {
  const botonMesAnterior = document.getElementById('btnMesAnterior');
  const botonMesSiguiente = document.getElementById('btnMesSiguiente');

  if (botonMesAnterior && botonMesSiguiente && botonMesAnterior.dataset.inicializado !== 'true') {
    botonMesAnterior.dataset.inicializado = 'true';
    botonMesSiguiente.dataset.inicializado = 'true';

    const cambiarDeMes = (direccion) => {
      if (!mesSeleccionadoGrafico) return;
      let [anio, mes] = mesSeleccionadoGrafico.split('-').map(Number);
      mes += direccion;
      if (mes > 12) { mes = 1; anio++; }
      if (mes < 1) { mes = 12; anio--; }
      mesSeleccionadoGrafico = `${anio}-${String(mes).padStart(2, '0')}`;
      renderizarHistorialYGrafico(usuario);
    };

    botonMesAnterior.addEventListener('click', () => cambiarDeMes(-1));
    botonMesSiguiente.addEventListener('click', () => cambiarDeMes(1));
  }
};
const normalizarTextoBusqueda = (texto) => {
  if (!texto) return '';
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-AR')
    .trim();
};

const agruparClasesPorGrupo = (clases) => {
  const grupos = new Map();

  clases.forEach(clase => {
    // Las clases sin grupo se mantienen individuales.
    const clave = clase.grupoId || `clase-${clase.id}`;

    if (!grupos.has(clave)) {
      grupos.set(clave, []);
    }

    grupos.get(clave).push(clase);
  });

  return Array.from(grupos.values()).map(grupo => {
    grupo.sort((a, b) =>
      new Date(a.fechaHora) - new Date(b.fechaHora)
    );

    return grupo;
  });
};

const crearDesplegable = (titulo, contenido) => {
  const details = crearElemento('details', 'mt-2');
  const summary = crearElemento(
    'summary',
    'text-green fw-bold fs-14',
    titulo
  );

  summary.style.cursor = 'pointer';

  details.append(summary, contenido);

  return details;
};

export const renderizarReservas = async (usuario) => {
  const contenedorDeReservas = document.getElementById('contenedorReservas');
  if (!contenedorDeReservas) return;

  contenedorDeReservas.className = 'd-flex flex-column gap-4 mb-5';
  contenedorDeReservas.replaceChildren();

  const [listaDeClases, usuarioActual] = await Promise.all([
    obtenerTodasLasClases(),
    fetchSeguro('/api/auth/me'),
  ]);

  const listaFinalDeClases = Array.isArray(listaDeClases) ? listaDeClases : [];
  const datosDelUsuario = usuarioActual?.usuario || usuarioActual || usuario;
  const fechaActual = new Date();

  const clasesVigentes = listaFinalDeClases.filter(clase => {
    if (!clase.fechaHora) return false;
    return new Date(clase.fechaHora) > fechaActual;
  });

  const misClasesReservadas = [];
  const clasesDisponibles = [];

  clasesVigentes.forEach(clase => {
    const listaDeInscriptos = Array.isArray(clase.inscriptosIds) ? clase.inscriptosIds : [];
    const yaEstaInscripto = datosDelUsuario?.id && listaDeInscriptos.map(String).includes(String(datosDelUsuario.id));

    if (yaEstaInscripto) {
      misClasesReservadas.push(clase);
    } else {
      clasesDisponibles.push(clase);
    }
  });

  misClasesReservadas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
  clasesDisponibles.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));

  const seccionMisReservas = crearElemento('div', 'mb-4');
  seccionMisReservas.append(crearElemento('h3', 'text-white mb-3 fs-15', 'MIS CLASES RESERVADAS'));

  if (misClasesReservadas.length === 0) {
    seccionMisReservas.append(crearElemento('p', 'text-gray fs-14', 'No tenés clases reservadas actualmente.'));
  } else {
    const listaMisReservas = crearElemento('div', 'd-flex flex-column gap-3');
    const gruposReservados = agruparClasesPorGrupo(misClasesReservadas);

    gruposReservados.forEach(grupo => {
      const primeraClase = grupo[0];

      const tarjeta = crearElemento(
        'div',
        'user-card d-flex flex-column gap-3'
      );

      const informacion = crearElemento('div');

      informacion.append(
        crearElemento('h4', 'text-white mb-1 fs-5', primeraClase.titulo || 'Clase'),
        crearElemento(
          'p',
          'text-gray mb-0 fs-14',
          `${grupo.length} clases reservadas`
        )
      );

      const listaFechas = crearElemento('div', 'd-flex flex-column gap-2');

      grupo.forEach(clase => {
        const fila = crearElemento(
          'div',
          'd-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 p-2 rounded border border-secondary'
        );

        const fecha = crearElemento(
          'span',
          'text-white fs-14',
          formatearFechaHora(clase.fechaHora)
        );

        const botonCancelar = crearElemento(
          'button',
          'btn user-btn-outline text-danger border-danger py-2 px-4 fs-14',
          'CANCELAR'
        );

        botonCancelar.dataset.accion = 'cancelar';
        botonCancelar.dataset.id = clase.id;

        fila.append(fecha, botonCancelar);
        listaFechas.append(fila);
      });

      const desplegable = crearDesplegable(
        `VER MIS FECHAS (${grupo.length})`,
        listaFechas
      );

      tarjeta.append(informacion, desplegable);
      listaMisReservas.append(tarjeta);
    });
    seccionMisReservas.append(listaMisReservas);
  }
  contenedorDeReservas.append(seccionMisReservas);

  const seccionDisponibles = crearElemento('div', 'mt-2');

  seccionDisponibles.append(crearElemento('h3', 'text-white mb-3 fs-15', 'ACTIVIDADES DISPONIBLES'));

  const barraFiltros = crearElemento('div', 'd-flex flex-column flex-md-row align-items-md-center gap-3 p-3 mb-4 rounded border border-secondary');
  barraFiltros.style.backgroundColor = 'transparent';

  const wrapperNombre = crearElemento('div', 'position-relative flex-grow-1');

  const iconoBusqueda = crearElemento('i', 'bi bi-search position-absolute text-gray');
  iconoBusqueda.style.left = '15px';
  iconoBusqueda.style.top = '50%';
  iconoBusqueda.style.transform = 'translateY(-50%)';
  iconoBusqueda.style.fontSize = '16px';
  iconoBusqueda.style.pointerEvents = 'none';

  const inputNombre = crearElemento('input', 'form-control bg-transparent text-white border-secondary');
  inputNombre.type = 'text';
  inputNombre.placeholder = 'Buscar por nombre...';
  inputNombre.value = filtroTextoNombre;
  inputNombre.style.paddingLeft = '45px';

  inputNombre.addEventListener('focus', () => inputNombre.style.borderColor = '#a3e635');
  inputNombre.addEventListener('blur', () => inputNombre.style.borderColor = '#6c757d');

  wrapperNombre.append(iconoBusqueda, inputNombre);

  const wrapperFecha = crearElemento('div', 'position-relative');
  wrapperFecha.style.minWidth = '220px';

  const iconoCalendario = crearElemento('i', 'bi bi-calendar-event position-absolute text-gray');
  iconoCalendario.style.left = '15px';
  iconoCalendario.style.top = '50%';
  iconoCalendario.style.transform = 'translateY(-50%)';
  iconoCalendario.style.fontSize = '16px';
  iconoCalendario.style.pointerEvents = 'none';

  const inputFecha = crearElemento('input', 'form-control bg-transparent text-white border-secondary');
  inputFecha.type = 'date';
  inputFecha.value = filtroFecha;
  inputFecha.style.paddingLeft = '45px';
  inputFecha.style.colorScheme = 'dark';

  inputFecha.addEventListener('focus', () => inputFecha.style.borderColor = '#a3e635');
  inputFecha.addEventListener('blur', () => inputFecha.style.borderColor = '#6c757d');

  wrapperFecha.append(iconoCalendario, inputFecha);

  inputNombre.addEventListener('input', (e) => {
    filtroTextoNombre = e.target.value;
    renderizarReservas(usuario);
  });

  inputFecha.addEventListener('change', (e) => {
    filtroFecha = e.target.value;
    renderizarReservas(usuario);
  });

  barraFiltros.append(wrapperNombre, wrapperFecha);
  seccionDisponibles.append(barraFiltros);

  let clasesFiltradas = clasesDisponibles;

  if (filtroTextoNombre && filtroTextoNombre.trim() !== '') {
    const busquedaNormalizada = normalizarTextoBusqueda(filtroTextoNombre);
    clasesFiltradas = clasesFiltradas.filter(c =>
      normalizarTextoBusqueda(c.titulo || '').includes(busquedaNormalizada)
    );
  }

  if (filtroFecha) {
    clasesFiltradas = clasesFiltradas.filter(c => {
      const fechaClase = c.fechaHora.split('T')[0];
      return fechaClase === filtroFecha;
    });
  }
  if (clasesFiltradas.length === 0) {
    const hayFiltrosAplicados = (filtroTextoNombre && filtroTextoNombre.trim() !== '') || filtroFecha;

    const sinResultados = crearElemento('div', 'text-center py-5 rounded border border-secondary border-dashed');
    sinResultados.style.backgroundColor = 'rgba(30, 30, 30, 0.5)';

    sinResultados.append(
      crearElemento('h5', 'text-white mb-2', 'SIN RESULTADOS'),
      crearElemento('p', 'text-gray mb-0', hayFiltrosAplicados
        ? 'No encontramos actividades con ese nombre o fecha.'
        : 'No hay actividades disponibles en este momento.')
    );

    seccionDisponibles.append(sinResultados);
  } else {
    const listaDisponibles = crearElemento('div', 'd-flex flex-column gap-3');

    const gruposDeClases = agruparClasesPorGrupo(clasesFiltradas);

    gruposDeClases.forEach(grupo => {
      const primeraClase = grupo[0];
      const claveGrupo = primeraClase.grupoId || `clase-${primeraClase.id}`;

      // Todas las clases futuras disponibles de este grupo,
      // aunque el filtro de fecha muestre solamente algunas.
      const clasesDelGrupo = clasesDisponibles.filter(clase => {
        const clave = clase.grupoId || `clase-${clase.id}`;
        return clave === claveGrupo;
      });

      const tarjeta = crearElemento(
        'div',
        'user-card d-flex flex-column gap-3'
      );

      const informacion = crearElemento('div');

      informacion.append(
        crearElemento('h4', 'text-white mb-2 fs-5', primeraClase.titulo || 'Clase')
      );

      // Obtener los días de la semana.
      const dias = [...new Set(grupo.map(clase => {
        return new Intl.DateTimeFormat('es-AR', {
          weekday: 'long',
          timeZone: 'America/Argentina/Buenos_Aires'
        }).format(new Date(clase.fechaHora));
      }))];

      const horarios = [...new Set(grupo.map(clase => {
        return new Intl.DateTimeFormat('es-AR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'America/Argentina/Buenos_Aires'
        }).format(new Date(clase.fechaHora));
      }))];

      const fechaHasta = new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'short',
        timeZone: 'America/Argentina/Buenos_Aires'
      }).format(new Date(grupo[grupo.length - 1].fechaHora));

      informacion.append(
        crearParrafoConIcono(
          'text-gray mb-1 fs-14',
          'bi bi-calendar-week me-2 text-green',
          `Días: ${dias.join(', ')}`
        ),
        crearParrafoConIcono(
          'text-gray mb-1 fs-14',
          'bi bi-clock me-2 text-green',
          `Horario: ${horarios.join(', ')} hs`
        ),
        crearParrafoConIcono(
          'text-gray mb-0 fs-14',
          'bi bi-calendar-check me-2 text-green',
          `Última clase programada: ${fechaHasta}`
        )
      );

      tarjeta.append(informacion);

      // Fechas individuales y disponibilidad de cada clase.
      const listaFechas = crearElemento('div', 'd-flex flex-column gap-2');

      grupo.forEach(clase => {
        const fila = crearElemento(
          'div',
          'd-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 p-2 rounded border border-secondary'
        );

        const fecha = crearElemento(
          'span',
          'text-white fs-14',
          formatearFechaHora(clase.fechaHora)
        );

        const cupoMaximo = clase.cupo || clase.cupoMaximo || 0;
        const inscriptos = Array.isArray(clase.inscriptosIds)
          ? clase.inscriptosIds.length
          : 0;

        const lugares = clase.cuposDisponibles !== undefined
          ? clase.cuposDisponibles
          : cupoMaximo - inscriptos;

        const disponibilidad = crearElemento(
          'span',
          lugares > 0
            ? 'text-green fs-14 fw-bold'
            : 'text-danger fs-14 fw-bold',
          lugares > 0 ? `${lugares} lugares disponibles` : 'Sin cupo'
        );

        fila.append(fecha, disponibilidad);
        listaFechas.append(fila);
      });

      const desplegableFechas = crearDesplegable(`VER FECHAS (${grupo.length})`, listaFechas);

      tarjeta.append(desplegableFechas);

      // Un botón para inscribirse a todas las clases futuras disponibles.
      const botonReservar = crearElemento(
        'button',
        'btn btn-green py-2 px-4 fs-14 align-self-start',
        'INSCRIBIRME A LA CLASES'
      );

      botonReservar.dataset.accion = 'reservar-grupo';
      botonReservar.dataset.ids = JSON.stringify(
        clasesDelGrupo.map(clase => clase.id)
      );

      tarjeta.append(botonReservar);
      listaDisponibles.append(tarjeta);
    });

    seccionDisponibles.append(listaDisponibles);
  }

  contenedorDeReservas.append(seccionDisponibles);
};

export function inicializarAccionesReservas(usuario) {
  const contenedorDeReservas = document.getElementById('user-reservar');
  if (!contenedorDeReservas) return;

  if (contenedorDeReservas.dataset.accionesInicializadas === 'true') return;
  contenedorDeReservas.dataset.accionesInicializadas = 'true';

  contenedorDeReservas.addEventListener('click', async evento => {
    const boton = evento.target.closest('[data-accion]');
    if (!boton) return;

    const accion = boton.dataset.accion;
    const esGrupo = accion === 'reservar-grupo';

    const ids = esGrupo
      ? JSON.parse(boton.dataset.ids || '[]')
      : [boton.dataset.id];

    if (ids.length === 0 || ids.some(id => !id)) return;

    boton.disabled = true;
    const textoOriginal = boton.textContent;

    boton.textContent = esGrupo
      ? 'INSCRIBIENDO...'
      : accion === 'reservar'
        ? 'RESERVANDO...'
        : 'CANCELANDO...';

    try {
      let exitosas = 0;
      const fallidas = [];

      for (const id of ids) {
        try {
          const respuesta = await fetch(
            `/api/clases/${id}/${accion === 'cancelar' ? 'desinscribir' : 'inscribir'}`,
            {
              method: 'POST',
              credentials: 'include'
            }
          );

          const datos = await respuesta.json();

          if (!respuesta.ok) {
            throw new Error(
              datos.error || datos.detail || 'No se pudo procesar la inscripción.'
            );
          }

          exitosas++;
        } catch (error) {
          fallidas.push({ id, mensaje: error.message });
        }

        if (!esGrupo) break;
      }

      await renderizarReservas(usuario);

      if (fallidas.length === 0) {
        mostrarToast(
          'Éxito',
          esGrupo
            ? `Te inscribiste en ${exitosas} clases.`
            : accion === 'reservar'
              ? 'Reserva confirmada.'
              : 'Reserva cancelada.',
          'success'
        );
      } else {
        mostrarToast(
          'Inscripción parcial',
          `Se confirmaron ${exitosas} inscripciones. No se pudieron completar ${fallidas.length}.`,
          'warning'
        );
      }

    } catch (error) {
      mostrarToast('Error al procesar reserva', error.message, 'error');
      boton.disabled = false;
      boton.textContent = textoOriginal;
    }
  });
}

const obtenerTodasLasClases = async () => {
  const primeraPagina = await fetchSeguro('/api/clases');

  if (Array.isArray(primeraPagina)) return primeraPagina;

  const clases = [...(primeraPagina.data || [])];
  const total = primeraPagina.total || clases.length;
  const limite = primeraPagina.limit || 10;

  const totalPaginas = Math.ceil(total / limite);

  for (let pagina = 2; pagina <= totalPaginas; pagina++) {
    const resultado = await fetchSeguro(`/api/clases?page=${pagina}`);

    const clasesPagina = Array.isArray(resultado)
      ? resultado
      : resultado.data || [];

    clases.push(...clasesPagina);
  }

  return clases;
};

let filtroTextoNombreTurnos = '';
let filtroFechaTurnos = '';

export const renderizarTurnos = async (usuario) => {
  const contenedorDeTurnos = document.getElementById('contenedorTurnos');
  if (!contenedorDeTurnos) return;

  contenedorDeTurnos.replaceChildren();

  const [listaDeTurnosDisponibles, listaDeTurnosMios] = await Promise.all([
    fetchSeguro('/api/turnos'),
    fetchSeguro('/api/turnos/mios'),
  ]);

  const turnosDisponibles = Array.isArray(listaDeTurnosDisponibles) ? listaDeTurnosDisponibles : [];
  const turnosReservados = Array.isArray(listaDeTurnosMios) ? listaDeTurnosMios : [];
  const fechaActual = new Date();

  const nombresDeTipos = {
    chequeo_medico: 'Chequeo Médico',
    nutricionista: 'Nutrición',
  };

  const obtenerNombreTurno = (turno) => nombresDeTipos[turno.tipo] || turno.tipo;

  const obtenerFechaHoraTurno = (turno) => new Date(`${turno.fecha}T${turno.hora}`);

  const turnosVigentes = turnosDisponibles.filter(turno => obtenerFechaHoraTurno(turno) > fechaActual);
  const misTurnosVigentes = turnosReservados.filter(turno => obtenerFechaHoraTurno(turno) > fechaActual);

  const seccionDeMisTurnos = crearElemento('div', 'mb-5');
  seccionDeMisTurnos.append(crearElemento('h3', 'text-white mb-3 fs-15', 'MIS TURNOS RESERVADOS'));

  if (misTurnosVigentes.length === 0) {
    seccionDeMisTurnos.append(crearElemento('p', 'text-gray fs-14', 'No tenés turnos reservados actualmente.'));
  } else {
    const listaFinalDeMisTurnos = crearElemento('div', 'd-flex flex-column gap-3');
    misTurnosVigentes.forEach((turno) => {
      const tarjetaDeTurno = crearElemento('div', 'user-card d-flex justify-content-between align-items-center flex-wrap gap-3');
      const informacionDelTurno = crearElemento('div');
      informacionDelTurno.append(
        crearElemento('h4', 'text-white mb-1 fs-5', obtenerNombreTurno(turno)),
        crearElemento('p', 'text-gray mb-0 fs-14', `${turno.medico || 'Médico no asignado'} · ${turno.fecha} · ${turno.hora} hs · ${turno.duracionMin} min`),
      );
      const botonCancelarTurno = crearElemento('button', 'btn user-btn-outline text-danger border-danger py-2 px-4 fs-14', 'CANCELAR');
      botonCancelarTurno.dataset.accion = 'cancelar-turno';
      botonCancelarTurno.dataset.id = turno.id;
      tarjetaDeTurno.append(informacionDelTurno, botonCancelarTurno);
      listaFinalDeMisTurnos.append(tarjetaDeTurno);
    });
    seccionDeMisTurnos.append(listaFinalDeMisTurnos);
  }

  const seccionDeTurnosDisponibles = crearElemento('div');
  seccionDeTurnosDisponibles.append(crearElemento('h3', 'text-white mb-3 fs-15', 'TURNOS DISPONIBLES'));

  const barraFiltros = crearElemento('div', 'd-flex flex-column flex-md-row align-items-md-center gap-3 p-3 mb-4 rounded border border-secondary');
  barraFiltros.style.backgroundColor = 'transparent';

  const wrapperNombre = crearElemento('div', 'position-relative flex-grow-1');
  const iconoBusqueda = crearElemento('i', 'bi bi-search position-absolute text-gray');
  iconoBusqueda.style.left = '15px';
  iconoBusqueda.style.top = '50%';
  iconoBusqueda.style.transform = 'translateY(-50%)';
  iconoBusqueda.style.fontSize = '16px';
  iconoBusqueda.style.pointerEvents = 'none';

  const inputNombre = crearElemento('input', 'form-control bg-transparent text-white border-secondary');
  inputNombre.type = 'text';
  inputNombre.placeholder = 'Buscar por especialidad...';
  inputNombre.value = filtroTextoNombreTurnos;
  inputNombre.style.paddingLeft = '45px';

  inputNombre.addEventListener('focus', () => inputNombre.style.borderColor = '#a3e635');
  inputNombre.addEventListener('blur', () => inputNombre.style.borderColor = '#6c757d');
  inputNombre.addEventListener('input', (e) => {
    filtroTextoNombreTurnos = e.target.value;
    renderizarTurnos(usuario);
  });

  wrapperNombre.append(iconoBusqueda, inputNombre);

  const wrapperFecha = crearElemento('div', 'position-relative');
  wrapperFecha.style.minWidth = '220px';

  const iconoCalendario = crearElemento('i', 'bi bi-calendar-event position-absolute text-gray');
  iconoCalendario.style.left = '15px';
  iconoCalendario.style.top = '50%';
  iconoCalendario.style.transform = 'translateY(-50%)';
  iconoCalendario.style.fontSize = '16px';
  iconoCalendario.style.pointerEvents = 'none';

  const inputFecha = crearElemento('input', 'form-control bg-transparent text-white border-secondary');
  inputFecha.type = 'date';
  inputFecha.value = filtroFechaTurnos;
  inputFecha.style.paddingLeft = '45px';
  inputFecha.style.colorScheme = 'dark';

  inputFecha.addEventListener('focus', () => inputFecha.style.borderColor = '#a3e635');
  inputFecha.addEventListener('blur', () => inputFecha.style.borderColor = '#6c757d');
  inputFecha.addEventListener('change', (e) => {
    filtroFechaTurnos = e.target.value;
    renderizarTurnos(usuario);
  });

  wrapperFecha.append(iconoCalendario, inputFecha);
  barraFiltros.append(wrapperNombre, wrapperFecha);
  seccionDeTurnosDisponibles.append(barraFiltros);

  let turnosFiltrados = turnosVigentes;

  if (filtroTextoNombreTurnos && filtroTextoNombreTurnos.trim() !== '') {
    const busquedaNormalizada = normalizarTextoBusqueda(filtroTextoNombreTurnos);
    turnosFiltrados = turnosFiltrados.filter(t =>
      normalizarTextoBusqueda(obtenerNombreTurno(t)).includes(busquedaNormalizada)
    );
  }

  if (filtroFechaTurnos) {
    turnosFiltrados = turnosFiltrados.filter(t => t.fecha === filtroFechaTurnos);
  }
  if (turnosFiltrados.length === 0) {
    const hayFiltrosAplicados = (filtroTextoNombreTurnos && filtroTextoNombreTurnos.trim() !== '') || filtroFechaTurnos;
    const sinResultados = crearElemento('div', 'text-center py-5 rounded border border-secondary border-dashed');
    sinResultados.style.backgroundColor = 'rgba(30, 30, 30, 0.5)';
    sinResultados.append(
      crearElemento('h5', 'text-white mb-2', 'SIN RESULTADOS'),
      crearElemento('p', 'text-gray mb-0', hayFiltrosAplicados
        ? 'No encontramos turnos con esa especialidad o fecha.'
        : 'No hay turnos médicos disponibles en este momento.')
    );
    seccionDeTurnosDisponibles.append(sinResultados);
  } else {
    const listaFinalDeTurnosDisponibles = crearElemento('div', 'd-flex flex-column gap-3');
    turnosFiltrados
      .slice()
      .sort((a, b) => obtenerFechaHoraTurno(a) - obtenerFechaHoraTurno(b))
      .forEach((turno) => {
        const tarjetaDeTurno = crearElemento('div', 'user-card d-flex justify-content-between align-items-center flex-wrap gap-3');
        const informacionDelTurno = crearElemento('div');
        informacionDelTurno.append(
          crearElemento('h4', 'text-white mb-1 fs-5', obtenerNombreTurno(turno)),
           crearElemento('p', 'text-gray mb-0 fs-14', `${turno.medico || 'Médico no asignado'} · ${turno.fecha} · ${turno.hora} hs · ${turno.duracionMin} min`),
        );
        const botonReservarTurno = crearElemento('button', 'btn btn-green py-2 px-4 fs-14', 'RESERVAR');
        botonReservarTurno.dataset.accion = 'reservar-turno';
        botonReservarTurno.dataset.id = turno.id;
        tarjetaDeTurno.append(informacionDelTurno, botonReservarTurno);
        listaFinalDeTurnosDisponibles.append(tarjetaDeTurno);
      });
    seccionDeTurnosDisponibles.append(listaFinalDeTurnosDisponibles);
  }

  contenedorDeTurnos.append(seccionDeMisTurnos, seccionDeTurnosDisponibles);
};

export function inicializarAccionesTurnos(usuario) {
  const contenedorDeTurnos = document.getElementById('user-turnos');
  if (!contenedorDeTurnos) return;

  contenedorDeTurnos.addEventListener('click', async (evento) => {
    const botonPresionado = evento.target.closest('[data-accion]');
    if (!botonPresionado) return;

    const accionDelBoton = botonPresionado.dataset.accion;
    const idDelTurno = botonPresionado.dataset.id;
    if (!idDelTurno) return;

    const endpointDeLaAccion = accionDelBoton === 'reservar-turno' ? 'reservar' : 'cancelar';

    botonPresionado.disabled = true;
    const textoOriginalDelBoton = botonPresionado.textContent;
    botonPresionado.textContent = 'Procesando...';

    try {
      const respuestaDelServidor = await fetch(`/api/turnos/${idDelTurno}/${endpointDeLaAccion}`, {
        method: 'POST',
        credentials: 'include',
      });

      const datosDeLaRespuesta = await respuestaDelServidor.json();

      if (!respuestaDelServidor.ok) {
        throw new Error(datosDeLaRespuesta.error || datosDeLaRespuesta.detail || 'No se pudo procesar la solicitud.');
      }

      await renderizarTurnos(usuario);
      mostrarToast('Éxito', accionDelBoton === 'reservar-turno' ? 'Turno reservado.' : 'Turno cancelado.', 'success');
    } catch (error) {
      mostrarToast('Error al procesar turno', error.message, 'error');
    } finally {
      botonPresionado.disabled = false;
      botonPresionado.textContent = textoOriginalDelBoton;
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
  await renderizarMembresia(usuario);
}

export async function renderizarMembresia(usuario) {
  const nombrePlan = document.getElementById('perfil-plan-nombre');
  const vencimiento = document.getElementById('perfil-fecha-vencimiento');
  const estado = document.getElementById('perfil-estado-membresia');

  if (!nombrePlan || !vencimiento || !estado) return;

  if (!usuario.planMembresiaId) {
    nombrePlan.textContent = 'Sin membresía';
    vencimiento.textContent = '-';
    estado.textContent = 'Inactiva';
    return;
  }

  try {
    const respuesta = await fetch('/api/membresias', {
      credentials: 'include'
    });

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los planes.');
    }

    const datos = await respuesta.json();
    const planes = datos.data ?? [];

    const plan = planes.find(
      p => String(p.id) === String(usuario.planMembresiaId)
    );

    nombrePlan.textContent = plan?.nombre ?? 'Plan no encontrado';

    if (usuario.fechaVencimiento) {
      vencimiento.textContent = new Date(
        usuario.fechaVencimiento
      ).toLocaleDateString('es-AR');
    } else {
      vencimiento.textContent = '-';
    }

    const fechaVencimiento = usuario.fechaVencimiento
      ? new Date(usuario.fechaVencimiento)
      : null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const vencida = !fechaVencimiento ||
      new Date(fechaVencimiento.getFullYear(),
        fechaVencimiento.getMonth(),
        fechaVencimiento.getDate()) < hoy;

    estado.textContent = usuario.bajaMembresiaPendiente
      ? 'Baja programada'
      : vencida
        ? 'Inactiva'
        : 'Activa';

  } catch (error) {
    console.error('Error al renderizar membresía:', error);
    nombrePlan.textContent = 'No disponible';
    vencimiento.textContent = '-';
    estado.textContent = 'No disponible';
  }
}