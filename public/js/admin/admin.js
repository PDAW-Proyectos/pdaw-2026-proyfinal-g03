import { verificarSesion, cerrarSesion } from '../auth.js';
import { inicializarRegistroUsuarios } from './registroUsuarios.js';
import { inicializarRenderizadoAdmin } from './renderizado.js';
import {
  inicializarGestionTurnos,
  inicializarGestionHorarios,
  inicializarEliminarTurnos,
  inicializarEliminarHorarios,
} from './gestion.js';
import { inicializarGestionPlanes } from './gestionPlanes.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const usuario = await verificarSesion();

    if (!usuario) return;

    const nombreUsuario = document.getElementById('nombreUsuarioHeader');

    if (nombreUsuario) {
      nombreUsuario.textContent = usuario.nombre;
    }

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

    inicializarRegistroUsuarios();
    inicializarGestionTurnos();
    inicializarGestionHorarios();
    inicializarEliminarTurnos();
    inicializarEliminarHorarios();
    inicializarGestionPlanes();
  } catch (error) {
    console.error('Error al inicializar el panel:', error);
  }
});

