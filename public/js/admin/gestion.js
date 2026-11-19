// gestion de Turnos y Horarios

import { cargarYRenderizar, renderizarTurnos, renderizarHorarios } from './renderizado.js';
import { mostrarToast } from '../componentes/toast.js';
import { mostrarConfirmacion } from './admin.js';

export function inicializarGestionTurnos() {
  const btnNuevoTurno = document.getElementById('btnNuevoTurno');
  const formTurno = document.getElementById('formTurno');
  const modalElemento = document.getElementById('modalTurno');
  const mensaje = document.getElementById('mensajeTurno');

  if (!btnNuevoTurno || !formTurno) return;

  const modal = new window.bootstrap.Modal(modalElemento);

  btnNuevoTurno.addEventListener('click', () => {
    formTurno.reset();
    mensaje.textContent = '';
    modal.show();
  });

  formTurno.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensaje.textContent = '';

    const tipo = document.getElementById('turnoTipo').value;
    const medico = document.getElementById('turnoMedico').value;
    const fecha = document.getElementById('turnoFecha').value;
    const hora = document.getElementById('turnoHora').value;

    try {
      const respuesta = await fetch('/api/turnos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tipo, medico, fecha, hora }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo publicar el turno');
      }

      modal.hide();

      mostrarToast('Turno publicado', 'El turno se agendó correctamente.', 'success');

      await cargarYRenderizar(
        'turnos',
        renderizarTurnos,
        'admin-turnos-chequeos',
        'admin-turnos-resumen',
      );
    } catch (error) {
      mostrarToast('Error', error.message, 'error');
    }
  });
}

export function inicializarGestionHorarios() {
  const btnNuevoHorario = document.getElementById('btnNuevoHorario');
  const formHorario = document.getElementById('formHorario');
  const modalElemento = document.getElementById('modalHorario');
  const mensaje = document.getElementById('mensajeHorario');

  if (!btnNuevoHorario || !formHorario) return;

  const modal = new window.bootstrap.Modal(modalElemento);

  btnNuevoHorario.addEventListener('click', () => {
    formHorario.reset();
    if (mensaje) mensaje.textContent = '';
    modal.show();
  });

  formHorario.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensaje.textContent = '';

    const dia = document.getElementById('horarioDia').value;
    const apertura = document.getElementById('horarioApertura').value;
    const cierre = document.getElementById('horarioCierre').value;

    try {
      const respuesta = await fetch('/api/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dia, apertura, cierre }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo crear el horario');
      }

      modal.hide();

      mostrarToast('Horario creado', 'El horario se guardó correctamente.', 'success');

      await cargarYRenderizar(
        'horarios',
        renderizarHorarios,
        'admin-horarios-lista',
        'admin-horarios-resumen',
      );
    } catch (error) {
      mostrarToast('Error', error.message, 'error');
    }
  });
}

export function inicializarEliminarTurnos() {
  const contenedorChequeos = document.getElementById('admin-turnos-chequeos');
  const contenedorNutricion = document.getElementById('admin-turnos-nutricion');

  if (!contenedorChequeos || !contenedorNutricion) return;

  const manejarEliminarTurno = (event) => {
    const botonEliminar = event.target.closest('[data-accion="eliminar-turno"]');
    if (!botonEliminar) return;

    const turnoId = botonEliminar.dataset.id;

    mostrarConfirmacion('¿Estás seguro que querés eliminar este turno?', async () => {

      try {
        const respuesta = await fetch(`/api/turnos/${turnoId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!respuesta.ok) {
          const datos = await respuesta.json();
          throw new Error(datos.error || datos.detail || 'No se pudo eliminar el turno');
        }

        mostrarToast('Turno eliminado', 'El turno se eliminó correctamente.', 'success');

        await cargarYRenderizar(
          'turnos',
          renderizarTurnos,
          'admin-turnos-chequeos',
          'admin-turnos-resumen',
        );
      } catch (error) {
        mostrarToast('Error', error.message, 'error');
      }
    });
  };

  contenedorChequeos.addEventListener('click', manejarEliminarTurno);
  contenedorNutricion.addEventListener('click', manejarEliminarTurno);
}

export function inicializarEliminarHorarios() {
  const contenedor = document.getElementById('admin-horarios-lista');
  if (!contenedor) return;

  contenedor.addEventListener('click', (event) => {
    const botonEliminar = event.target.closest('[data-accion="eliminar-horario"]');
    if (!botonEliminar) return;

    const horarioId = botonEliminar.dataset.id;

    mostrarConfirmacion('¿Estás seguro que querés eliminar este horario?', async () => {

      try {
        const respuesta = await fetch(`/api/horarios/${horarioId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!respuesta.ok) {
          const datos = await respuesta.json();
          throw new Error(datos.error || datos.detail || 'No se pudo eliminar el horario');
        }

        mostrarToast('Horario eliminado', 'El horario se eliminó correctamente.', 'success');

        await cargarYRenderizar(
          'horarios',
          renderizarHorarios,
          'admin-horarios-lista',
          'admin-horarios-resumen',
        );
      } catch (error) {
        mostrarToast('Error', error.message, 'error');
      }
    });
  });
}