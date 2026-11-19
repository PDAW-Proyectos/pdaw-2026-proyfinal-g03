import { mostrarToast } from '../componentes/toast.js';

let clasesGrupoEnEdicion = null;

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
    const btnEditarGrupo = event.target.closest('[data-accion="editar-grupo"]');
    const btnEliminarGrupo = event.target.closest('[data-accion="eliminar-grupo"]');

    if (btnEditar) {
      const claseId = btnEditar.dataset.id;
      await abrirModalEdicion(claseId, usuario);
    }

    if (btnEliminar) {
      const claseId = btnEliminar.dataset.id;
      await eliminarClase(claseId, usuario);
    }

    if (btnEditarGrupo) {
      const ids = JSON.parse(btnEditarGrupo.dataset.ids);
      await abrirModalEdicionGrupo(ids, usuario);
    }

    if (btnEliminarGrupo) {
      const ids = JSON.parse(btnEliminarGrupo.dataset.ids);
      await eliminarGrupo(ids, usuario);
    }
  });
}

async function abrirModalEdicion(claseId) {
  clasesGrupoEnEdicion = null;

  const campoFecha = document.getElementById('editarClaseFecha');
  const campoHora = document.getElementById('editarClaseHora');

  // En edición individual se muestran ambos campos.
  campoFecha.parentElement.style.display = '';
  campoHora.parentElement.style.display = '';

  campoFecha.disabled = false;
  campoHora.disabled = false;

  try {
    const respuesta = await fetch(`/api/clases/${claseId}`, {
      credentials: 'include'
    });

    if (!respuesta.ok) {
      throw new Error(
        await obtenerMensajeError(respuesta, 'No se pudo cargar la clase.')
      );
    }

    const datos = await respuesta.json();
    const clase = datos.clase ?? datos.data ?? datos;

    document.getElementById('editarClaseId').value = clase.id;
    document.getElementById('editarClaseTitulo').value = clase.titulo;
    document.getElementById('editarClaseDescripcion').value = clase.descripcion || '';

    const { fecha, hora } = obtenerFechaHoraLocal(clase.fechaHora);

    campoFecha.value = fecha;
    campoHora.value = hora;

    document.getElementById('editarClaseDuracion').value = clase.duracionMin;
    document.getElementById('editarClaseCupo').value = clase.cupo;

    bootstrap.Modal
      .getOrCreateInstance(document.getElementById('modalEditarClase'))
      .show();

  } catch (error) {
    mostrarToast('Error', error.message, 'error');
  }
}

async function abrirModalEdicionGrupo(ids, usuario) {
  try {
    const respuestas = await Promise.all(
      ids.map(id =>
        fetch(`/api/clases/${id}`, {
          credentials: 'include'
        })
      )
    );

    if (respuestas.some(respuesta => !respuesta.ok)) {
      throw new Error('No se pudieron cargar todas las clases del grupo.');
    }

    clasesGrupoEnEdicion = await Promise.all(
      respuestas.map(async (respuesta) => {
        const datos = await respuesta.json();
        return datos.clase ?? datos.data ?? datos;
      })
    );

    const clase = clasesGrupoEnEdicion[0];

    document.getElementById('editarClaseId').value = '';
    document.getElementById('editarClaseTitulo').value = clase.titulo;
    document.getElementById('editarClaseDescripcion').value = clase.descripcion ?? '';
    document.getElementById('editarClaseDuracion').value = clase.duracionMin;
    document.getElementById('editarClaseCupo').value = clase.cupo;

    const campoFecha = document.getElementById('editarClaseFecha');
    const campoHora = document.getElementById('editarClaseHora');

    // En grupo se oculta la fecha, pero se permite modificar la hora.
    campoFecha.parentElement.style.display = 'none';
    campoFecha.disabled = true;

    campoHora.parentElement.style.display = '';
    campoHora.disabled = false;

    campoHora.value = obtenerFechaHoraLocal(clase.fechaHora).hora;
    bootstrap.Modal
      .getOrCreateInstance(document.getElementById('modalEditarClase'))
      .show();
  } catch (error) {
    clasesGrupoEnEdicion = null;
    mostrarToast(error.message, 'danger');
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

async function eliminarGrupo(ids, usuario) {
  const confirmado = await confirmarEliminacionClase();

  if (!confirmado) return;

  let eliminadas = 0;
  let errores = 0;

  for (const id of ids) {
    try {
      const respuesta = await fetch(`/api/clases/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (respuesta.ok) {
        eliminadas++;
      } else {
        errores++;
      }
    } catch {
      errores++;
    }
  }

  await recargarActividades(usuario);

  if (errores === 0) {
    mostrarToast('Se eliminaron todas las clases del grupo.', 'success');
  } else {
    mostrarToast(
      `Se eliminaron ${eliminadas} clases. No se pudieron eliminar ${errores}.`,
      'warning'
    );
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

    const esEdicionGrupal = Array.isArray(clasesGrupoEnEdicion);

    if (!esEdicionGrupal && !id) {
      mostrarToast('Error', 'No se encontró el identificador de la actividad.', 'error');
      return;
    }

    if (!titulo || !duracionMin || !cupo) {
      mostrarToast('Campos incompletos', 'Completá todos los campos obligatorios.', 'error');
      return;
    }

    let fechaHora;

    // En la edición individual se valida y modifica la fecha.
    // En la grupal se conserva la fecha original de cada clase.
    if (!esEdicionGrupal) {
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
    }

    const btn = form.querySelector('button[type="submit"]');
    const textoOriginal = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
      if (esEdicionGrupal) {
        let actualizadas = 0;
        let errores = 0;

        for (const registro of clasesGrupoEnEdicion) {
          const clase = registro;

          const respuesta = await fetch(`/api/clases/${clase.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              titulo,
              descripcion,
              fechaHora: (() => {
                const { fecha } = obtenerFechaHoraLocal(clase.fechaHora);
                const fechaActualizada = new Date(`${fecha}T${hora}:00-03:00`);

                return fechaActualizada.toISOString();
              })(),
              duracionMin,
              cupo
            })
          });

          if (respuesta.ok) {
            actualizadas++;
          } else {
            errores++;
          }
        }

        if (errores > 0) {
          mostrarToast(
            'Edición parcial',
            `Se actualizaron ${actualizadas} clases. Fallaron ${errores}.`,
            'warning'
          );
        } else {
          mostrarToast('Grupo actualizado', 'Se actualizaron todas las clases del grupo.', 'success');
        }

        clasesGrupoEnEdicion = null;
      } else {
        const respuesta = await fetch(`/api/clases/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            titulo,
            descripcion,
            fechaHora,
            duracionMin,
            cupo
          })
        });

        if (!respuesta.ok) {
          throw new Error(
            await obtenerMensajeError(respuesta, 'No se pudo actualizar la clase.')
          );
        }
      }

      const modal = window.bootstrap.Modal.getInstance(
        document.getElementById('modalEditarClase')
      );

      modal?.hide();

      await recargarActividades(usuario);

    } catch (error) {
      mostrarToast('Error', error.message, 'error');
    } finally {
      btn.textContent = textoOriginal;
      btn.disabled = false;
    }
  });
}

