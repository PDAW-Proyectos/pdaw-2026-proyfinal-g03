import { mostrarToast } from '../componentes/toast.js';

// gestión de actividades del instructor: editar y eliminar
const obtenerMensajeError = async (respuesta, mensajePredeterminado) => {
  try {
    const datos = await respuesta.json();
    return datos.error || datos.detail || datos.mensaje || mensajePredeterminado;
  } catch {
    return mensajePredeterminado;
  }
};

const obtenerFechaHoraLocal = (fechaHora) => {
  const fecha = new Date(fechaHora);

  if (Number.isNaN(fecha.getTime())) {
    throw new Error('La fecha de la actividad no es válida.');
  }

  const fechaISO = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fecha);

  const horaISO = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(fecha);

  return {
    fecha: fechaISO,
    hora: horaISO,
  };
};
export function inicializarGestionActividades(usuario) {
  const contenedor = document.getElementById('instructor-actividades-lista');
  if (!contenedor) return;

  contenedor.addEventListener('click', async (event) => {
    const btnEditar = event.target.closest('[data-accion="editar-clase"]');
    const btnEliminar = event.target.closest('[data-accion="eliminar-clase"]');

    if (btnEditar) {
      const claseId = btnEditar.dataset.id;
      await abrirModalEdicion(claseId, usuario);
    }

    if (btnEliminar) {
      const claseId = btnEliminar.dataset.id;
      await eliminarClase(claseId, usuario);
    }
  });
}

async function abrirModalEdicion(claseId) {
  try {
    const respuesta = await fetch(`/api/clases/${claseId}`, { credentials: 'include' });
    if (!respuesta.ok) {
      throw new Error(
        await obtenerMensajeError(respuesta, 'No se pudo cargar la clase.')
      );
    }
    const clase = await respuesta.json();

    document.getElementById('editarClaseId').value = clase.id;
    document.getElementById('editarClaseTitulo').value = clase.titulo;
    document.getElementById('editarClaseDescripcion').value = clase.descripcion || '';

    const { fecha, hora } = obtenerFechaHoraLocal(clase.fechaHora);
    document.getElementById('editarClaseFecha').value = fecha;
    document.getElementById('editarClaseHora').value = hora;
    document.getElementById('editarClaseDuracion').value = clase.duracionMin;
    document.getElementById('editarClaseCupo').value = clase.cupo;

    const modal = new window.bootstrap.Modal(document.getElementById('modalEditarClase'));
    modal.show();
  } catch (error) {
    alert(error.message);
  }
}
function confirmarEliminacionClase() {
  return new Promise((resolve) => {
    const elementoModal = document.getElementById('modalConfirmarEliminarClase');
    const botonConfirmar = document.getElementById('btnConfirmarEliminarClase');

    const modal = window.bootstrap.Modal.getOrCreateInstance(elementoModal);

    const resolver = (resultado) => {
      botonConfirmar.removeEventListener('click', confirmar);
      elementoModal.removeEventListener('hidden.bs.modal', cancelar);
      resolve(resultado);
    };

    const confirmar = () => {
      modal.hide();
      resolver(true);
    };

    const cancelar = () => resolver(false);

    botonConfirmar.addEventListener('click', confirmar);
    elementoModal.addEventListener('hidden.bs.modal', cancelar);

    modal.show();
  });
}
// fn para eliminar una clase con confirmación
async function eliminarClase(claseId, usuario) {
  const confirmado = await confirmarEliminacionClase();

  if (!confirmado) return;

  try {
    const respuesta = await fetch(`/api/clases/${claseId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!respuesta.ok) {
      throw new Error(
        await obtenerMensajeError(respuesta, 'No se pudo eliminar la clase.')
      );
    }

    await recargarActividades(usuario);
  } catch (error) {
    alert(error.message);
  }
}

// fn auxiliar para recargar las actividades (la misma que se usa al crear)
export async function recargarActividades(usuario) {
  const contenedor = document.getElementById('instructor-actividades-lista');
  if (!contenedor) return;
  contenedor.innerHTML = '<div class="trainer-card text-gray">Cargando...</div>';
  try {
    const respuesta = await fetch(`/api/clases?instructor=${usuario.id}&limit=50`, {
      credentials: 'include',
    });
    if (!respuesta.ok) {
      throw new Error(
        await obtenerMensajeError(respuesta, 'No se pudieron cargar las actividades.')
      );
    }
    const datos = await respuesta.json();
    const lista = Array.isArray(datos.data) ? datos.data : datos;
    const { renderizarActividades } = await import('./renderizado-instructor.js');
    renderizarActividades(lista);
  } catch (error) {
    contenedor.innerHTML = `<div class="trainer-card text-danger">${error.message}</div>`;
  }
}

// fn para manejar el submit del formulario de edicion
export function inicializarFormularioEdicion(usuario) {
  const form = document.getElementById('formEditarClase');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const id = document.getElementById('editarClaseId').value;
    const titulo = document.getElementById('editarClaseTitulo').value.trim();
    const descripcion = document.getElementById('editarClaseDescripcion').value.trim();
    const fecha = document.getElementById('editarClaseFecha').value;
    const hora = document.getElementById('editarClaseHora').value;
    const duracionMin = Number(document.getElementById('editarClaseDuracion').value);
    const cupo = Number(document.getElementById('editarClaseCupo').value);

    if (!id) {
      mostrarToast('Error id', 'No se encontró el identificador de la actividad.', 'error');
      return;
    }

    if (!titulo || !fecha || !hora || !duracionMin || !cupo) {
      mostrarToast('Campos incompletos', 'Completá todos los campos obligatorios.', 'error');
      return;
    }

    let fechaHora;

    try {
      if (!fecha || !hora) {
        throw new Error('Ingresá una fecha y una hora válidas.');
      }

      const fechaLocal = new Date(`${fecha}T${hora}:00-03:00`);

      if (Number.isNaN(fechaLocal.getTime())) {
        throw new Error('La fecha o la hora ingresada no es válida.');
      }

      fechaHora = fechaLocal.toISOString();
    } catch (error) {
      mostrarToast('Fecha inválida', error.message, 'error');
      return;
    }

    const body = { titulo, descripcion, fechaHora, duracionMin, cupo };

    const btn = form.querySelector('button[type="submit"]');
    const textoOriginal = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
      const respuesta = await fetch(`/api/clases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!respuesta.ok) {
        throw new Error(
          await obtenerMensajeError(respuesta, 'No se pudo actualizar la clase.')
        );
      }

      const modal = window.bootstrap.Modal.getInstance(document.getElementById('modalEditarClase'));
      modal?.hide();

      await recargarActividades(usuario);
    } catch (error) {
      alert(error.message);
    } finally {
      btn.textContent = textoOriginal;
      btn.disabled = false;
    }
  });
}
