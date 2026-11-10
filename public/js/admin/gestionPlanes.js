// Gestión de Planes de Membresía
import { cargarYRenderizar, renderizarMembresias } from './renderizado.js';

export function inicializarGestionPlanes() {
  const formNuevoPlan = document.getElementById('formNuevoPlan');
  const mensaje = document.getElementById('mensajePlan');

  if (!formNuevoPlan) return;

  formNuevoPlan.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensaje.textContent = '';

    const nombre = document.getElementById('planNombre').value.trim();
    const precioMensual = Number(document.getElementById('planPrecio').value);
    const descripcion = document.getElementById('planDescripcion').value.trim();
    const activo = document.getElementById('planActivo').checked;

    const datosPlan = {
      nombre,
      precioMensual,
      descripcion,
      activo,
    };

    try {
      const respuesta = await fetch('/api/membresias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datosPlan),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo crear el plan');
      }

      formNuevoPlan.reset();

      await cargarYRenderizar(
        'membresias',
        renderizarMembresias,
        'admin-membresias-lista',
        'admin-membresias-resumen',
      );
    } catch (error) {
      mensaje.textContent = error.message;
    }
  });
}
