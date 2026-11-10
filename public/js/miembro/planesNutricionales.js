// gestion de planes nutricionales con IA

const crearElemento = (etiqueta, clases, texto) => {
  const el = document.createElement(etiqueta);
  if (clases) el.className = clases;
  if (texto !== undefined) el.textContent = texto;
  return el;
};

const mostrarMensaje = (contenedor, mensaje, clase = 'text-gray') => {
  contenedor.replaceChildren(crearElemento('div', `user-card text-center py-4 ${clase}`, mensaje));
};

const renderizarPlanNutricional = (plan) => {
  const contenedor = document.getElementById('contenedorPlanNutricional');
  if (!contenedor) return;

  if (!plan || !Array.isArray(plan.comidas) || plan.comidas.length === 0) {
    mostrarMensaje(contenedor, 'El plan no tiene comidas registradas.');
    return;
  }

  contenedor.replaceChildren();

  const tarjeta = crearElemento('div', 'user-card mb-4');
  const header = crearElemento('div', 'd-flex justify-content-between align-items-start mb-3');
  const info = crearElemento('div');
  info.append(
    crearElemento('h4', 'text-white mb-1', plan.nombre),
    crearElemento('p', 'text-gray mb-0 fs-14', plan.descripcion || ''),
  );
  const badge = crearElemento(
    'span',
    'badge badge-green fs-12',
    `${plan.caloriasDiarias} kcal/día`,
  );
  header.append(info, badge);
  tarjeta.append(header);

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

  plan.comidas.forEach((comida) => {
    const item = crearElemento('div', 'user-card mb-3');
    const titulo = crearElemento('h5', 'text-white mb-2', comida.momento);
    const ejemplo = crearElemento('p', 'text-gray mb-0 fs-14', comida.ejemplo);
    item.append(titulo, ejemplo);
    contenedor.append(item);
  });
};

export async function cargarPlanNutricionalGuardado() {
  const contenedor = document.getElementById('contenedorPlanNutricional');
  if (!contenedor) return;

  try {
    const respuesta = await fetch('/api/planes-nutricionales/mios?limit=1', {
      credentials: 'include',
    });

    if (!respuesta.ok) return;

    const datos = await respuesta.json();
    const planes = Array.isArray(datos.data) ? datos.data : [];

    if (planes.length === 0) return;

    renderizarPlanNutricional(planes[0]);
  } catch {
    // si hay un error de red no se hace nada, se queda el estado vacio
  }
}

export function inicializarGeneracionPlanNutricional() {
  const form = document.getElementById('formGenerarPlanNutricional');
  const btn = document.getElementById('btnGenerarPlanNutricional');
  const mensaje = document.getElementById('mensajePlanNutricional');
  const contenedor = document.getElementById('contenedorPlanNutricional');

  if (!form || !btn || !contenedor) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensaje.textContent = '';

    const nivel = document.getElementById('nutricionNivel').value;
    const dias = Number(document.getElementById('nutricionDias').value);

    if (!nivel || !dias) {
      mensaje.textContent = 'Seleccioná un nivel y una cantidad de días.';
      return;
    }

    const textoOriginal = btn.textContent;
    btn.textContent = 'Generando plan... (puede tardar unos segundos)';
    btn.disabled = true;

    try {
      const respuesta = await fetch('/api/planes-nutricionales/generar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nivel, dias }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo generar el plan.');
      }

      renderizarPlanNutricional(datos);
    } catch (error) {
      mensaje.textContent = error.message;
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

  cargarPlanNutricionalGuardado();
}
