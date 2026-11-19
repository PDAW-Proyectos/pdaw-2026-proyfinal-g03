import { verificarSesion, cerrarSesion } from '../auth.js';
import { inicializarRegistroUsuarios } from './registroUsuarios.js';
import { inicializarRenderizadoAdmin, cargarYRenderizar, renderizarMiembros, renderizarInstructores } from './renderizado.js';
import { inicializarEdicionPerfil } from '../perfil/editarPerfil.js';
import { inicializarGestionMembresias } from './gestionMembresias.js';
import { cargarGestionMembresias } from './renderizado-membresias.js';
import {
  inicializarGestionTurnos,
  inicializarGestionHorarios,
  inicializarEliminarTurnos,
  inicializarEliminarHorarios,
} from './gestion.js';
import { inicializarGestionPlanes } from './gestionPlanes.js';
import { mostrarToast } from '../componentes/toast.js'; 

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const usuario = await verificarSesion();

    if (!usuario) return;

    const nombreUsuario = document.getElementById('nombreUsuarioHeader');
    if (nombreUsuario) nombreUsuario.textContent = usuario.nombre;

    inicializarRenderizadoAdmin(usuario);

    const botonesMenu = document.querySelectorAll('.admin-nav-link');
    botonesMenu.forEach((boton) => {
      boton.addEventListener('click', () => {
        const idSeccion = boton.dataset.seccion;
        document.querySelectorAll('.seccion-contenido').forEach((seccion) => {
          seccion.classList.add('d-none');
        });

        const seccionSeleccionada = document.getElementById(idSeccion);
        if (seccionSeleccionada) {
          seccionSeleccionada.classList.remove('d-none');
        }

        botonesMenu.forEach((b) => b.classList.remove('active'));
        boton.classList.add('active');
      });
    });

    const botonCerrarSesion = document.getElementById('btnCerrarSesion');
    botonCerrarSesion?.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await cerrarSesion();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    });

    let usuarioAEliminarId = null;
    let usuarioAEliminarTipo = null;
    let botonQueAbrioModal = null;

    document.body.addEventListener('click', (e) => {
      const boton = e.target.closest('button[data-accion="eliminar-usuario"]');
      if (!boton) return;

      botonQueAbrioModal = boton;
      usuarioAEliminarId = boton.dataset.id;
      usuarioAEliminarTipo = boton.dataset.tipo;
      
      const spanNombre = document.getElementById('nombreUsuarioEliminar');
      if (spanNombre) spanNombre.textContent = boton.dataset.nombre.toUpperCase();

      const modalEl = document.getElementById('modalEliminarUsuario');
      if (modalEl) {
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      }
    });

    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    if (btnConfirmarEliminar) {
      btnConfirmarEliminar.addEventListener('click', async () => {
        if (!usuarioAEliminarId) return;

        const modalEl = document.getElementById('modalEliminarUsuario');
        const modalInstancia = bootstrap.Modal.getInstance(modalEl);
        if (modalInstancia) modalInstancia.hide();

        if (botonQueAbrioModal) {
          botonQueAbrioModal.disabled = true;
          botonQueAbrioModal.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
        }

        try {
          const url = `/api/usuarios/${usuarioAEliminarId}`; 
          
          const respuesta = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
          });

          if (!respuesta.ok) {
            const errorData = await respuesta.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al eliminar el usuario.');
          }

          mostrarToast('Usuario eliminado', 'La cuenta ha sido eliminada correctamente.', 'success');

          if (usuarioAEliminarTipo === 'miembro') {
            cargarYRenderizar('usuarios/miembros', renderizarMiembros, 'admin-miembros-lista', null);
          } else {
            cargarYRenderizar('usuarios/instructores', renderizarInstructores, 'admin-instructores-lista', null);
          }

        } catch (error) {
          console.error('Error al eliminar usuario:', error);
          mostrarToast('Error', error.message, 'error');
          
          if (botonQueAbrioModal) {
            botonQueAbrioModal.disabled = false;
            botonQueAbrioModal.innerHTML = '<i class="bi bi-trash3"></i>';
          }
        } finally {
          usuarioAEliminarId = null;
          usuarioAEliminarTipo = null;
          botonQueAbrioModal = null;
        }
      });
    }

   try {
      inicializarRegistroUsuarios();
      inicializarGestionTurnos();
      inicializarGestionHorarios();
      inicializarEliminarTurnos();
      inicializarEliminarHorarios();
      inicializarGestionPlanes();
      inicializarEdicionPerfil(usuario);
      inicializarGestionMembresias();
      await cargarGestionMembresias();
    } catch (initError) {
      console.error('Error al inicializar módulos secundarios:', initError);
    }

  } catch (error) {
    console.error('Error general al inicializar el panel:', error);
  }
});