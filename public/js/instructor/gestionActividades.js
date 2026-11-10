// gestión de actividades del instructor: editar y eliminar

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

async function abrirModalEdicion(claseId, usuario) {
  try {
    const respuesta = await fetch(`/api/clases/${claseId}`, { credentials: 'include' });
    const clase = await respuesta.json();
    if (!respuesta.ok) throw new Error(clase.error || 'No se pudo cargar la clase.');

    document.getElementById('editarClaseId').value = clase.id;
    document.getElementById('editarClaseTitulo').value = clase.titulo;
    document.getElementById('editarClaseDescripcion').value = clase.descripcion || '';

    const fechaObj = new Date(clase.fechaHora);
    const fecha = fechaObj.toISOString().slice(0, 10);
    const hora = fechaObj.toTimeString().slice(0, 5);
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

// fn para eliminar una clase con confirmación
async function eliminarClase(claseId, usuario) {
  if (
    !confirm(
      '¿Estás seguro de que querés eliminar esta actividad? Esta acción no se puede deshacer.',
    )
  ) {
    return;
  }

  try {
    const respuesta = await fetch(`/api/clases/${claseId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!respuesta.ok) {
      const datos = await respuesta.json();
      throw new Error(datos.error || datos.detail || 'No se pudo eliminar la clase.');
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
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.error || 'No se pudieron cargar las actividades.');
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

    const fechaHora = new Date(`${fecha}T${hora}:00`).toISOString();

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

      const datos = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo actualizar la clase.');
      }

      const modal = window.bootstrap.Modal.getInstance(document.getElementById('modalEditarClase'));
      modal.hide();

      await recargarActividades(usuario);
    } catch (error) {
      alert(error.message);
    } finally {
      btn.textContent = textoOriginal;
      btn.disabled = false;
    }
  });
}
