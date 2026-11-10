// gestion de rutinas y planes de entrenamiento con IA

const formatoFecha = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeZone: 'America/Argentina/Buenos_Aires',
});

const crearElemento = (etiqueta, clases, texto) => {
  const el = document.createElement(etiqueta);
  if (clases) el.className = clases;
  if (texto !== undefined) el.textContent = texto;
  return el;
};

const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
  contenedor.replaceChildren(crearElemento('div', `user-card text-center py-4 ${clase}`, mensaje));
};

const renderizarPlan = (plan) => {
  const contenedor = document.getElementById('contenedorPlanEntrenamiento');
  if (!contenedor) return;

  // si el plan viene nulo o no tiene días, se muestra un mensaje.
  if (!plan || !Array.isArray(plan.dias) || plan.dias.length === 0) {
    mostrarMensaje(contenedor, 'El plan no tiene días de entrenamiento.');
    return;
  }

  contenedor.replaceChildren();

  // tarjeta principal donde se ve la información del plan
  const tarjeta = crearElemento('div', 'user-card mb-4');
  const header = crearElemento('div', 'd-flex justify-content-between align-items-start mb-3');
  const info = crearElemento('div');
  info.append(
    crearElemento('h4', 'text-white mb-1', plan.nombre),
    crearElemento('p', 'text-gray mb-0 fs-14', plan.descripcion || ''),
  );
  const badge = crearElemento('span', 'badge badge-green fs-12', `${plan.duracionSemanas} semanas`);
  header.append(info, badge);
  tarjeta.append(header);

  // seccion de recomendaciones, si las hay
  if (Array.isArray(plan.recomendaciones) && plan.recomendaciones.length > 0) {
    const recs = crearElemento(
      'div',
      'alert bg-pulso-darker border border-secondary text-white mb-4',
    );
    const lista = crearElemento('ul', 'mb-0 ps-3');
    plan.recomendaciones.forEach((r) => {
      lista.append(crearElemento('li', 'fs-14 mb-1', r));
    });
    recs.append(crearElemento('strong', 'd-block mb-2 fs-14', 'Recomendaciones:'), lista);
    tarjeta.append(recs);
  }

  contenedor.append(tarjeta);

  plan.dias.forEach((dia, index) => {
    const item = crearElemento('div', 'user-card mb-3');

    const botonDia = crearElemento(
      'button',
      'btn btn-link text-start text-decoration-none w-100 p-0 d-flex justify-content-between align-items-center',
    );
    botonDia.type = 'button';
    botonDia.setAttribute('data-bs-toggle', 'collapse');
    botonDia.setAttribute('data-bs-target', `#planDia${index}`);
    botonDia.innerHTML = `
      <div>
        <h5 class="text-white mb-0">${dia.dia}</h5>
        <small class="text-green fs-13">${dia.enfoque}</small>
      </div>
      <i class="bi bi-chevron-down text-gray"></i>
    `;

    const collapse = crearElemento('div', 'collapse');
    collapse.id = `planDia${index}`;
    const cuerpo = crearElemento('div', 'pt-3 mt-3 border-top border-secondary');

    // lista con ejercicios del día
    const listaEjercicios = crearElemento('ul', 'list-unstyled mb-0');
    dia.ejercicios.forEach((ej) => {
      const li = crearElemento(
        'li',
        'd-flex justify-content-between align-items-center py-2 border-bottom border-secondary',
      );
      const nombre = crearElemento('span', 'text-white fs-14', ej.nombre);
      const detalle = crearElemento(
        'span',
        'text-gray fs-13',
        `${ej.series} series × ${ej.repeticiones} reps · ${ej.descansoSeg}s descanso`,
      );
      li.append(nombre, detalle);
      listaEjercicios.append(li);
    });

    cuerpo.append(listaEjercicios);
    collapse.append(cuerpo);
    item.append(botonDia, collapse);
    contenedor.append(item);
  });
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
