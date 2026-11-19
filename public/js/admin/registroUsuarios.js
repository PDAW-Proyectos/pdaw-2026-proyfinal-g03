import { pasoActual, cambiarPaso, datosUsuario, guardarDatosPaso, reiniciarRegistro } from './estadoRegistro.js';
import { formularioRegistroUsuario, mostrarDatosPersonales, mostrarDatosMiembro, mostrarDatosInstructor, mostrarMembresias } from './vistasRegistro.js';
import { validarDatosPersonales, validarDatosMiembro, validarDatosInstructor, validarMembresia, mostrarErrorRegistro } from './validacionesRegistro.js';
import { registrarUsuario } from './servicioRegistro.js';
import { mostrarToast } from '../componentes/toast.js';
import { cargarYRenderizar, renderizarMiembros, renderizarInstructores } from './renderizado.js';

// Inicializa el registro de usuarios.
export function inicializarRegistroUsuarios() {
  const nuevoUsuarioBtn = document.getElementById('nuevoUsuario');
  const modalElemento = document.getElementById('modalRegistroUsuario');

  formularioRegistroUsuario(modalElemento);
  mostrarDatosPersonales();

  const modal = new window.bootstrap.Modal(modalElemento);

  const siguiente = document.getElementById('siguienteRegistro');
  const volver = document.getElementById('volverRegistro');
  const formulario = document.getElementById('formRegistroUsuario');
  const mensaje = document.getElementById('mensajeRegistro');

  nuevoUsuarioBtn.addEventListener('click', () => {
    modal.show();
  });

  // Limpiamos los mensajes generales al modificar el formulario.
  formulario.addEventListener('input', () => {
    mensaje.textContent = '';
  });

  formulario.addEventListener('change', () => {
    mensaje.textContent = '';
  });

  siguiente.addEventListener('click', siguientePaso);
  volver.addEventListener('click', pasoAnterior);

  modalElemento.addEventListener('hidden.bs.modal', () => {
    reiniciarRegistro();

    mensaje.textContent = '';
    mostrarDatosPersonales();

    volver.hidden = true;
    siguiente.textContent = 'Siguiente';
  });

  // Avanza al siguiente paso o registra al usuario.
  async function siguientePaso(event) {
    event.preventDefault();

    let valido = true;

    if (pasoActual === 1) {
      valido = validarDatosPersonales();
    } else if (pasoActual === 2 && datosUsuario.rol === 'miembro') {
      valido = validarDatosMiembro();
    } else if (pasoActual === 2 && datosUsuario.rol === 'instructor') {
      valido = validarDatosInstructor();
    } else if (pasoActual === 3 && datosUsuario.rol === 'miembro') {
      valido = validarMembresia();
    }

    if (!valido) return;

    const guardadoOk = guardarDatosPaso();
    if (!guardadoOk) return;

    // Paso 1: datos personales.
    if (pasoActual === 1) {
      cambiarPaso(2);

      if (datosUsuario.rol === 'miembro') {
        mostrarDatosMiembro();
        siguiente.textContent = 'Siguiente';
      } else if (datosUsuario.rol === 'instructor') {
        mostrarDatosInstructor();
        siguiente.textContent = 'Registrar';
      }

      volver.hidden = false;
      return;
    }

    // Paso 2: selección de membresía para miembros.
    if (pasoActual === 2 && datosUsuario.rol === 'miembro') {
      cambiarPaso(3);
      await mostrarMembresias();

      siguiente.textContent = 'Registrar';
      return;
    }

    // Registro de instructor o miembro.
    if (
      (pasoActual === 2 && datosUsuario.rol === 'instructor') ||
      (pasoActual === 3 && datosUsuario.rol === 'miembro')
    ) {
      siguiente.disabled = true;
      siguiente.textContent = 'Registrando...';

      try {
        await registrarUsuario();

        mostrarToast('Registro exitoso', 'El usuario se registró correctamente.', 'success');
        
        if (datosUsuario.rol === 'instructor') {
          cargarYRenderizar('usuarios/instructores', renderizarInstructores, 'admin-instructores-lista', null);
        } else {
          cargarYRenderizar('usuarios/miembros', renderizarMiembros, 'admin-miembros-lista', null);
        }
        modal.hide();

      } catch (error) {
        mostrarToast('Error al registrar', error.message, 'error');
        mostrarErrorRegistro(error.message);
      } finally {
        siguiente.disabled = false;

        siguiente.textContent =
          pasoActual === 1 ? 'Siguiente' : 'Registrar';
      }
    }
  }

  function pasoAnterior() {
    guardarDatosPaso();
    if (pasoActual === 3) {
      cambiarPaso(2);
      mostrarDatosMiembro();
    } else if (pasoActual === 2) {
      cambiarPaso(1);
      mostrarDatosPersonales();
    }

    siguiente.textContent = 'Siguiente';

    if (pasoActual === 1) {
      volver.hidden = true;
    }
  }
}