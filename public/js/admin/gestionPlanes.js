// Gestión de Planes de Membresía
import { cargarYRenderizar, renderizarMembresias } from './renderizado.js';
import { mostrarToast } from '../componentes/toast.js';
import { mostrarConfirmacion } from './admin.js'; // Asegúrate de que esta ruta sea correcta

export function inicializarGestionPlanes() {
  const formNuevoPlan = document.getElementById('formNuevoPlan');
  const mensaje = document.getElementById('mensajePlan');

  if (!formNuevoPlan) return;

  // Vuelve el formulario al modo "crear" (limpia campos, estado de edición y texto del botón)
  const resetearFormulario = () => {
    formNuevoPlan.reset();
    delete formNuevoPlan.dataset.editandoId;
    formNuevoPlan.querySelector('button[type="submit"]').textContent = 'CREAR PLAN ↗';
    mensaje.textContent = '';
  };

  // ==========================================
  // 1. LÓGICA DEL FORMULARIO (CREAR / EDITAR)
  // ==========================================
  formNuevoPlan.addEventListener('submit', async (event) => {
    event.preventDefault();
    mensaje.textContent = '';

    const nombre = document.getElementById('planNombre').value.trim();
    const precioMensual = Number(document.getElementById('planPrecio').value);
    const descripcion = document.getElementById('planDescripcion').value.trim();
    const activo = document.getElementById('planActivo').checked;

    const datosPlan = { nombre, precioMensual, descripcion, activo };

    // Verificamos si estamos editando (el botón guarda el ID en el dataset)
    const editandoId = formNuevoPlan.dataset.editandoId;
    const esEdicion = !!editandoId;

    const url = esEdicion ? `/api/membresias/${editandoId}` : '/api/membresias';
    const metodo = esEdicion ? 'PUT' : 'POST';

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datosPlan),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || datos.detail || 'No se pudo guardar el plan');
      }

      // Limpiamos el formulario y el estado de edición
      resetearFormulario();

      mostrarToast('Éxito', esEdicion ? 'Plan actualizado correctamente.' : 'Plan creado correctamente.', 'success');

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

  // ==========================================
  // 2. LÓGICA DE LOS BOTONES DE ACCIÓN (LISTA)
  // ==========================================
  document.body.addEventListener('click', async (e) => {
    const boton = e.target.closest('button[data-accion]');
    if (!boton) return;

    const accion = boton.dataset.accion;
    // Solo procesamos las acciones de planes
    if (!accion.includes('plan')) return;

    const id = boton.dataset.id;
    const nombrePlan = boton.dataset.nombre;

    // --- HABILITAR / DESHABILITAR ---
    if (accion === 'toggle-plan') {
      const estaActivo = boton.dataset.activo === 'true';
      try {
        // El PUT reemplaza el plan completo: mandamos todos los datos y solo invertimos "activo"
        const res = await fetch(`/api/membresias/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            nombre: boton.dataset.nombre,
            precioMensual: Number(boton.dataset.precio),
            descripcion: boton.dataset.descripcion,
            activo: !estaActivo,
          }),
        });

        if (!res.ok) {
          const datos = await res.json().catch(() => ({}));
          throw new Error(datos.error || datos.detail || 'Error al cambiar el estado del plan');
        }
        
        // Al pausar/habilitar un plan, el formulario vuelve al modo crear
        resetearFormulario();

        mostrarToast('Éxito', `Plan ${!estaActivo ? 'habilitado' : 'deshabilitado'}.`, 'success');
        cargarYRenderizar('membresias', renderizarMembresias, 'admin-membresias-lista', 'admin-membresias-resumen');
      } catch (error) {
        mostrarToast('Error', error.message, 'error');
      }
    }

    // --- EDITAR ---
    if (accion === 'editar-plan') {
      // Llenamos el formulario con los datos del plan
      document.getElementById('planNombre').value = boton.dataset.nombre;
      document.getElementById('planPrecio').value = boton.dataset.precio;
      document.getElementById('planDescripcion').value = boton.dataset.descripcion;
      document.getElementById('planActivo').checked = boton.dataset.activo === 'true';
      
      // Guardamos el ID en el formulario para saber que estamos editando
      formNuevoPlan.dataset.editandoId = id;
      
      // Cambiamos el texto del botón para avisar
      formNuevoPlan.querySelector('button[type="submit"]').textContent = 'ACTUALIZAR PLAN ↗';
      
      formNuevoPlan.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // --- ELIMINAR ---
    if (accion === 'eliminar-plan') {
      mostrarConfirmacion(`¿Seguro que querés eliminar el plan "${nombrePlan.toUpperCase()}"?`, async () => {
        try {
          const res = await fetch(`/api/membresias/${id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          
          if (!res.ok) throw new Error('Error al eliminar el plan');
          
          // Si se estaba editando el plan eliminado, volvemos al modo crear
          if (formNuevoPlan.dataset.editandoId === id) resetearFormulario();

          mostrarToast('Eliminado', 'El plan ha sido eliminado.', 'success');
          cargarYRenderizar('membresias', renderizarMembresias, 'admin-membresias-lista', 'admin-membresias-resumen');
        } catch (error) {
          mostrarToast('Error', error.message, 'error');
        }
      });
    }
  });
}