// gestion de rutinas y planes de entrenamiento con IA
const crearElemento = (etiqueta, clases, texto) => {
  const el = document.createElement(etiqueta);
  if (clases) el.className = clases;
  if (texto !== undefined) el.textContent = texto;
  return el;
};

const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
  contenedor.replaceChildren(crearElemento('div', `user-card text-center py-4 ${clase}`, mensaje));
};

const crearModalEdicion = () => {
  const modalExistente = document.getElementById('modalEditarRutina');
  if (modalExistente) modalExistente.remove();

  const modalDiv = crearElemento('div', 'modal fade');
  modalDiv.id = 'modalEditarRutina';
  modalDiv.tabIndex = -1;
  modalDiv.setAttribute('aria-hidden', 'true');
  modalDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';

  const dialog = crearElemento('div', 'modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable');

  const content = crearElemento('div', 'modal-content bg-dark text-white border border-secondary rounded-3');
  content.style.backgroundColor = '#121212';

  const header = crearElemento('div', 'modal-header border-0 pb-0');

  const headerTitleContainer = crearElemento('div', 'd-flex align-items-center gap-3');
  const iconoHeader = crearElemento('i', 'bi bi-sliders text-green fs-3');

  const headerTextContainer = crearElemento('div');
  const titulo = crearElemento('h3', 'modal-title fw-bold text-uppercase mb-0', 'Editar Rutina');
  titulo.style.fontFamily = "'Oswald', sans-serif";
  titulo.style.letterSpacing = '1px';
  const subtitulo = crearElemento('small', 'text-gray');
  subtitulo.id = 'modalSubtituloDia';

  headerTextContainer.append(titulo, subtitulo);
  headerTitleContainer.append(iconoHeader, headerTextContainer);

  const btnClose = crearElemento('button', 'btn-close btn-close-white');
  btnClose.type = 'button';
  btnClose.setAttribute('data-bs-dismiss', 'modal');
  btnClose.setAttribute('aria-label', 'Close');

  header.append(headerTitleContainer, btnClose);

  const body = crearElemento('div', 'modal-body pt-4');
  const seccionTitulo = crearElemento('div', 'd-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2');
  const tituloEjercicios = crearElemento('h4', 'fw-bold text-uppercase mb-0', 'Ejercicios');
  tituloEjercicios.style.fontFamily = "'Oswald', sans-serif";

  const btnAnadir = crearElemento('button', 'btn btn-link text-white text-decoration-none p-0 d-flex align-items-center gap-2');
  btnAnadir.id = 'btnAnadirEjercicio';
  btnAnadir.innerHTML = '<i class="bi bi-plus-circle fs-5"></i> <span class="fs-14">Añadir ejercicio</span>'; // Uso innerHTML solo para el icono

  seccionTitulo.append(tituloEjercicios, btnAnadir);

  const rowHeaders = crearElemento('div', 'row text-gray fs-13 fw-bold mb-2 px-2');
  rowHeaders.style.textTransform = 'uppercase';
  rowHeaders.append(
    crearElemento('div', 'col-5', 'Ejercicio'),
    crearElemento('div', 'col-2', 'Series'),
    crearElemento('div', 'col-2', 'Reps'),
    crearElemento('div', 'col-2', 'Descanso'),
    crearElemento('div', 'col-1')
  );

  const listaEjercicios = crearElemento('div', 'd-flex flex-column gap-2');
  listaEjercicios.id = 'listaEjerciciosModal';

  const mensajeValidacion = crearElemento('div', 'mt-3');
  mensajeValidacion.id = 'mensajeValidacionRutina';
  body.append(seccionTitulo, rowHeaders, mensajeValidacion, listaEjercicios);


  const footer = crearElemento('div', 'modal-footer border-top border-secondary pt-3');

  const btnCancelar = crearElemento('button', 'btn btn-outline-light text-white px-4 py-2 rounded-1', 'Cancelar');
  btnCancelar.type = 'button';
  btnCancelar.setAttribute('data-bs-dismiss', 'modal');
  btnCancelar.style.backgroundColor = 'transparent';

  const btnGuardar = crearElemento('button', 'btn text-dark fw-bold px-4 py-2 rounded-1');
  btnGuardar.id = 'btnGuardarCambiosModal';
  btnGuardar.style.backgroundColor = '#b5ff00';
  btnGuardar.innerHTML = '<i class="bi bi-check-lg me-1"></i> GUARDAR CAMBIOS';

  footer.append(btnCancelar, btnGuardar);

  content.append(header, body, footer);
  dialog.append(content);
  modalDiv.append(dialog);

  document.body.append(modalDiv);
};

const renderizarFilasModal = (ejercicios) => {
  const contenedor = document.getElementById('listaEjerciciosModal');
  if (!contenedor) return;

  contenedor.replaceChildren();

  ejercicios.forEach((ej, index) => {
    const fila = crearElemento('div', 'row gx-2 align-items-center');

    const colNombre = crearElemento('div', 'col-5');
    const inputNombre = crearElemento('input', 'form-control bg-transparent text-white border-secondary fs-14 py-2');
    inputNombre.type = 'text';
    inputNombre.value = ej.nombre || '';
    inputNombre.placeholder = 'Nombre del ejercicio';
    inputNombre.dataset.field = 'nombre';
    inputNombre.dataset.index = index;
    colNombre.append(inputNombre);

    const colSeries = crearElemento('div', 'col-2');
    const inputSeries = crearElemento('input', 'form-control bg-transparent text-white border-secondary fs-14 py-2 text-center');
    inputSeries.type = 'number';
    inputSeries.value = ej.series || '';
    inputSeries.placeholder = '0';
    inputSeries.dataset.field = 'series';
    inputSeries.dataset.index = index;
    colSeries.append(inputSeries);

    const colReps = crearElemento('div', 'col-2');
    const inputReps = crearElemento('input', 'form-control bg-transparent text-white border-secondary fs-14 py-2 text-center');
    inputReps.type = 'number';
    inputReps.value = ej.repeticiones || '';
    inputReps.placeholder = '0';
    inputReps.dataset.field = 'repeticiones';
    inputReps.dataset.index = index;
    colReps.append(inputReps);

    const colDescanso = crearElemento('div', 'col-2');
    const grupoDescanso = crearElemento('div', 'input-group');

    const inputDescanso = crearElemento('input', 'form-control bg-transparent text-white border-secondary fs-14 py-2 text-center');
    inputDescanso.type = 'number';
    inputDescanso.value = ej.descansoSeg ?? 60;
    inputDescanso.placeholder = '0';
    inputDescanso.dataset.field = 'descansoSeg';
    inputDescanso.dataset.index = index;

    const spanS = crearElemento('span', 'input-group-text bg-transparent text-gray border-secondary fs-14 px-2', 's');
    grupoDescanso.append(inputDescanso, spanS);
    colDescanso.append(grupoDescanso);

    const colEliminar = crearElemento('div', 'col-1 text-center');
    const btnEliminar = crearElemento('button', 'btn btn-link text-gray p-0 text-decoration-none btn-eliminar-fila');
    btnEliminar.type = 'button';
    btnEliminar.dataset.index = index;
    btnEliminar.innerHTML = '<i class="bi bi-trash fs-5"></i>';
    colEliminar.append(btnEliminar);

    fila.append(colNombre, colSeries, colReps, colDescanso, colEliminar);
    contenedor.append(fila);
  });
  contenedor.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
      const index = Number(e.target.dataset.index);
      const field = e.target.dataset.field;
      diaEnEdicion.ejercicios[index][field] = e.target.value;
    });
  });
  contenedor.querySelectorAll('.btn-eliminar-fila').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = Number(e.currentTarget.dataset.index);
      diaEnEdicion.ejercicios.splice(index, 1);
      renderizarFilasModal(diaEnEdicion.ejercicios);
    });
  });
};

let diaEnEdicion = null;
let planEnEdicion = null;
let planOriginal = null;

const validarEjercicios = (ejercicios) => {
  for (const ej of ejercicios) {
    if (!ej.nombre.trim()) {
      return 'El nombre del ejercicio es obligatorio.';
    }

    if (ej.nombre.trim().length > 80) {
      return 'El nombre no puede superar los 80 caracteres.';
    }

    if (!Number.isInteger(Number(ej.series)) || Number(ej.series) < 1 || Number(ej.series) > 20) {
      return 'Las series deben estar entre 1 y 20.';
    }

    if (!Number.isInteger(Number(ej.repeticiones)) || Number(ej.repeticiones) < 1 || Number(ej.repeticiones) > 200) {
      return 'Las repeticiones deben estar entre 1 y 200.';
    }

    if (!Number.isInteger(Number(ej.descansoSeg)) || Number(ej.descansoSeg) < 0 || Number(ej.descansoSeg) > 600) {
      return 'El descanso debe estar entre 0 y 600 segundos.';
    }

    if (planEnEdicion.dias.some(dia => dia.ejercicios.length === 0)) {
      return 'Cada día debe tener al menos un ejercicio.';
    }
  }

  return null;
};

const abrirModalEdicion = (dia, plan) => {
  const contenedor = document.getElementById('contenedorPlanEntrenamiento');
  planOriginal = plan;
  planEnEdicion = structuredClone(plan);

  const indiceDia = plan.dias.indexOf(dia);
  diaEnEdicion = planEnEdicion.dias[indiceDia];
  crearModalEdicion();

  document.getElementById('modalSubtituloDia').textContent = `${dia.dia} · ${dia.enfoque}`;
  renderizarFilasModal(dia.ejercicios);

  const modalElement = document.getElementById('modalEditarRutina');
  const modal = new bootstrap.Modal(modalElement);
  modal.show();

  document.getElementById('btnAnadirEjercicio').onclick = () => {
    diaEnEdicion.ejercicios.push({ nombre: '', series: '', repeticiones: '', descansoSeg: 60 });
    renderizarFilasModal(diaEnEdicion.ejercicios);
  };

  document.getElementById('btnGuardarCambiosModal').onclick = async () => {
    const boton = document.getElementById('btnGuardarCambiosModal');
    const textoOriginal = boton.innerHTML;

    const error = validarEjercicios(
      planEnEdicion.dias.flatMap(dia => dia.ejercicios)
    );

    const mensaje = document.getElementById('mensajeValidacionRutina');

    if (error) {
      mostrarMensaje(mensaje, error, 'text-danger');
      return;
    }

    mensaje.replaceChildren();

    boton.disabled = true;
    boton.textContent = 'Guardando...';

    try {
      const respuesta = await fetch(`/api/planes-entrenamiento/${planOriginal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          dias: planEnEdicion.dias.map(dia => ({
            ...dia,
            ejercicios: dia.ejercicios.map(ej => ({
              ...ej,
              nombre: ej.nombre.trim(),
              series: Number(ej.series),
              repeticiones: Number(ej.repeticiones),
              descansoSeg: Number(ej.descansoSeg),
            })),
          })),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudieron guardar los cambios.');
      }

      renderizarPlan(datos);
      modal.hide();

    } catch (error) {
      mostrarMensaje(contenedor, error.message, 'text-danger');
    } finally {
      boton.disabled = false;
      boton.innerHTML = textoOriginal;
    }
  };
};

const renderizarPlan = (plan) => {
  const contenedor = document.getElementById('contenedorPlanEntrenamiento');
  if (!contenedor) return;

  if (!plan || !Array.isArray(plan.dias) || plan.dias.length === 0) {
    mostrarMensaje(contenedor, 'El plan no tiene días de entrenamiento.');
    return;
  }

  contenedor.replaceChildren();
  const tarjeta = crearElemento('div', 'user-card mb-2');
  const header = crearElemento('div', 'd-flex justify-content-between align-items-start mb-3');
  const info = crearElemento('div');

  info.append(
    crearElemento('h4', 'text-white mb-1', plan.nombre),
    crearElemento('p', 'text-gray mb-0 fs-14', plan.descripcion || ''),
  );

  const badge = crearElemento('span', 'badge badge-green fs-12', `${plan.duracionSemanas} semanas`);
  header.append(info, badge);
  tarjeta.append(header);

  // Recomendaciones (si las hay)
  if (Array.isArray(plan.recomendaciones) && plan.recomendaciones.length > 0) {
    const recs = crearElemento(
      'div',
      'alert bg-pulso-darker border border-secondary text-white mb-0',
    );
    const lista = crearElemento('ul', 'mb-0 ps-3');
    plan.recomendaciones.forEach((r) => {
      lista.append(crearElemento('li', 'fs-14 mb-1', r));
    });
    recs.append(crearElemento('strong', 'd-block mb-2 fs-14', 'Recomendaciones:'), lista);
    tarjeta.append(recs);
  }

  contenedor.append(tarjeta);
  const contenedorDias = crearElemento('div', 'd-flex flex-column gap-2');

  plan.dias.forEach((dia, index) => {
    const item = crearElemento('div', 'user-card');

    const headerDia = crearElemento('div', 'd-flex justify-content-between align-items-center w-100');

    const infoDia = crearElemento('div');
    infoDia.innerHTML = `
      <h5 class="text-white mb-0">${dia.dia}</h5>
      <small class="text-green fs-13">${dia.enfoque}</small>
    `;

    const grupoBotones = crearElemento('div', 'd-flex align-items-center gap-2');

    const btnEditar = crearElemento('button', 'btn btn-link text-gray p-1 text-decoration-none');
    btnEditar.type = 'button';
    btnEditar.innerHTML = '<i class="bi bi-pencil fs-6"></i>';
    btnEditar.title = 'Editar día';

    btnEditar.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModalEdicion(dia, plan);
    });
    const botonDia = crearElemento('button', 'btn btn-link text-gray p-1 text-decoration-none');
    botonDia.type = 'button';
    botonDia.setAttribute('data-bs-toggle', 'collapse');
    botonDia.setAttribute('data-bs-target', `#planDia${index}`);
    botonDia.innerHTML = '<i class="bi bi-chevron-down fs-5"></i>';

    grupoBotones.append(btnEditar, botonDia);
    headerDia.append(infoDia, grupoBotones);
    const collapse = crearElemento('div', 'collapse');
    collapse.id = `planDia${index}`;
    const cuerpo = crearElemento('div', 'pt-3 mt-3 border-top border-secondary');

    const listaEjercicios = crearElemento('ul', 'list-unstyled mb-0');
    dia.ejercicios.forEach((ej) => {
      const li = crearElemento('li', 'd-flex justify-content-between align-items-center py-2 border-bottom border-secondary');
      const nombre = crearElemento('span', 'text-white fs-14', ej.nombre);
      const detalle = crearElemento('span', 'text-gray fs-13', `${ej.series} series × ${ej.repeticiones} reps · ${ej.descansoSeg}s descanso`);
      li.append(nombre, detalle);
      listaEjercicios.append(li);
    });

    cuerpo.append(listaEjercicios);
    collapse.append(cuerpo);
    item.append(headerDia, collapse);
    contenedorDias.append(item);
  });
  contenedor.append(contenedorDias);
};

// fn que maneja la generacion del plan
export function inicializarGeneracionPlan() {
  const form = document.getElementById('formGenerarPlan');
  const btn = document.getElementById('btnGenerarPlan');
  const mensaje = document.getElementById('mensajePlanIA');
  const contenedor = document.getElementById('contenedorPlanEntrenamiento');

  if (!form || !btn || !contenedor) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensaje.textContent = '';

    const nivel = document.getElementById('planNivel').value;
    const dias = Number(document.getElementById('planDias').value);

    if (!nivel || !dias) {
      mensaje.textContent = 'Seleccioná un nivel y una cantidad de días.';
      return;
    }

    // estado de carga en el btn
    const textoOriginal = btn.textContent;
    btn.textContent = 'Generando plan... (puede tardar unos segundos)';
    btn.disabled = true;

    try {
      const respuesta = await fetch('/api/planes-entrenamiento/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nivel, dias }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo generar el plan.');
      }

      // el backend devuelve el plan con todos sus días y ejercicios
      renderizarPlan(datos);
    } catch (error) {
      mensaje.textContent = error.message;
      // si falla se muetra el estado vacío de nuevo
      mostrarMensaje(
        contenedor,
        'No se pudo generar el plan. Intentá de nuevo en unos minutos.',
        'text-danger',
      );
    } finally {
      btn.textContent = textoOriginal;
      btn.disabled = false;
    }
  });
  cargarPlanGuardado();
}

// fn para cargar el plan guardado del miembro (si existe) y renderizar
export async function cargarPlanGuardado() {
  const contenedor = document.getElementById('contenedorPlanEntrenamiento');
  if (!contenedor) return;

  try {
    const respuesta = await fetch('/api/planes-entrenamiento/mios?limit=1', {
      credentials: 'include',
    });

    if (!respuesta.ok) return;

    const datos = await respuesta.json();
    const planes = Array.isArray(datos.data) ? datos.data : [];

    if (planes.length === 0) return;

    // toma el plan más reciente (el primero, porque el backend los devuelve en orden)
    renderizarPlan(planes[0]);
  } catch {
    // si hay un error de red no se hace nada, se queda el estado vacio
  }
}
