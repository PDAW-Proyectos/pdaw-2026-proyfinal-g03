import { verificarSesion, cerrarSesion } from '../auth.js';
import {
  inicializarFiltrosActividades,
  inicializarRenderizadoInstructor,
  inicializarCreacionClase
} from './renderizado-instructor.js'
import { inicializarEdicionPerfil } from '../perfil/editarPerfil.js';
import { modificarEspecialidad } from '../perfil/servicioPerfil.js';
import {
  inicializarGestionActividades,
  inicializarFormularioEdicion,
} from './gestionActividades.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const usuario = await verificarSesion();

    if (!usuario) return;

    const nombreUsuario = document.getElementById('nombreUsuarioHeader');

    if (nombreUsuario) {
      nombreUsuario.textContent = usuario.nombre;
    }

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
    inicializarFiltrosActividades()
    inicializarRenderizadoInstructor(usuario);
    inicializarGestionActividades(usuario);
    inicializarFormularioEdicion(usuario);
    inicializarCreacionClase(usuario);
    inicializarEdicionPerfil(usuario, {
      campos: {
        nombre: 'perfil-nombre',
        email: 'perfil-email',
        telefono: 'perfil-telefono'
      },
      camposAdicionales: {
        especialidad: 'perfil-especialidad'
      },
      modificarAdicional: modificarEspecialidad
    });
  } catch (error) {
    console.error('Error al inicializar el panel:', error);
  }
});
