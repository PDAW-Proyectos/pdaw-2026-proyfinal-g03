import { verificarSesion, cerrarSesion } from '../auth.js';
import { inicializarRenderizadoMiembro } from './renderizado-miembro.js';
import { inicializarGeneracionPlan } from './rutinas.js';
import { inicializarGeneracionPlanNutricional } from './planesNutricionales.js';

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

    /* A MODIFICAR
    //Registrar Peso
    const btnRegistrarPeso = document.getElementById('btnRegistrarPeso');
    const inputPeso = document.getElementById('inputPesoActual');

    btnRegistrarPeso?.addEventListener('click', async () => {
      const peso = Number(inputPeso.value);

      if (!peso || peso <= 0) {
        alert('Por favor, ingresá un peso válido.');
        return;
      }

      const btnOriginal = btnRegistrarPeso.textContent;
      btnRegistrarPeso.textContent = 'Guardando...';
      btnRegistrarPeso.disabled = true;

      try {
        const res = await fetch('/api/seguimientos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ peso: peso }),
        });

        if (!res.ok) throw new Error('No se pudo guardar el peso');

        inputPeso.value = '';

        // Volvemos a pedir los datos actualizados y renderizamos
        const usuarioActualizado = await verificarSesion();
        await inicializarRenderizadoMiembro(usuarioActualizado || usuario);
      } catch (error) {
        alert('Error al guardar: ' + error.message);
      } finally {
        btnRegistrarPeso.textContent = btnOriginal;
        btnRegistrarPeso.disabled = false;
      }
    });
    */

    //Renderizado inicial
    await inicializarRenderizadoMiembro(usuario);
    inicializarGeneracionPlan();
    inicializarGeneracionPlanNutricional();
  } catch (error) {
    console.error('Error al inicializar el panel de miembro:', error);
  }
});
