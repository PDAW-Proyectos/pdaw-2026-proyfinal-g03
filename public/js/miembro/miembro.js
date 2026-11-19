import { verificarSesion, cerrarSesion } from '../auth.js';
import { inicializarSolicitudBaja, inicializarCambioPlan } from './membresia.js';
import { inicializarRenderizadoMiembro } from './renderizado-miembro.js';
import { inicializarGeneracionPlan } from './rutinas.js';
import { inicializarGeneracionPlanNutricional } from './planesNutricionales.js';
import { inicializarPerfilMiembro } from '../perfil/perfil.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    //  Verificamos la sesión
    const usuario = await verificarSesion();
    if (!usuario) return;

    //  Mostramos el nombre en el header
    const nombreUsuario = document.getElementById('nombreUsuarioHeader');
    if (nombreUsuario) nombreUsuario.textContent = usuario.nombre;

    // Lógica de las pestañas (Sidebar)
    const botonesMenu = document.querySelectorAll('.admin-nav-link');
    botonesMenu.forEach((boton) => {
      boton.addEventListener('click', () => {
        const idSeccion = boton.dataset.seccion;

        document
          .querySelectorAll('.seccion-contenido')
          .forEach((seccion) => seccion.classList.add('d-none'));
        const seccionSeleccionada = document.getElementById(idSeccion);
        if (seccionSeleccionada) seccionSeleccionada.classList.remove('d-none');

        botonesMenu.forEach((b) => b.classList.remove('active'));
        boton.classList.add('active');

        // Cerrar menú en mobile
        const offcanvas = document.getElementById('menuLateral');
        if (offcanvas && window.innerWidth < 992) {
          bootstrap.Offcanvas.getInstance(offcanvas)?.hide();
        }
      });
    });

    //Cerrar Sesión
    const botonCerrarSesion = document.getElementById('btnCerrarSesion');
    botonCerrarSesion?.addEventListener('click', async (event) => {
      event.preventDefault();
      try {
        await cerrarSesion();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    });

    //Renderizado inicial
    await inicializarRenderizadoMiembro(usuario)
    const respuestaSolicitudes = await fetch(
      '/api/solicitudesMembresia/mis-solicitudes',
      { credentials: 'include' }
    );

    const datosSolicitudes = await respuestaSolicitudes.json();

    if (!respuestaSolicitudes.ok) {
      throw new Error(
        datosSolicitudes.detail ||
        datosSolicitudes.error ||
        'No se pudieron cargar las solicitudes.'
      );
    }

    const solicitudCambio = datosSolicitudes.solicitudes?.[0] ?? null;

    inicializarSolicitudBaja(usuario);
    inicializarCambioPlan(usuario, solicitudCambio);
    inicializarPerfilMiembro(usuario);
    inicializarGeneracionPlan();
    inicializarGeneracionPlanNutricional();
  } catch (error) {
    console.error('Error al inicializar el panel de miembro:', error);
  }
});
