import { iniciarSesion } from './auth.js';

const inputEmail = document.getElementById('loginEmail');
const inputPassword = document.getElementById('loginPassword');
const loginForm = document.getElementById('loginForm');
const mensajeError = document.getElementById('loginError');
const estado = document.getElementById('loginEstado');
const botonIngresar = document.getElementById('loginSubmit');
const botonCancelar = document.getElementById('cancelarLogin');

const textoOriginal = botonIngresar.innerHTML;

let controlador = null;

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (controlador)
    return; // Evitar múltiples envíos simultáneos

  const email = inputEmail.value;
  const password = inputPassword.value;

  mensajeError.textContent = '';
  estado.textContent = '';

  controlador = new AbortController();

  botonIngresar.disabled = true;

  // Entre 100 ms y 1 segundo: cambio visual.
  const temporizador100ms = setTimeout(() => {
    botonIngresar.textContent = 'Validando...';
  }, 100);

  // Más de 1 segundo: spinner.
  const temporizador1s = setTimeout(() => {
    botonIngresar.innerHTML = `
      <span class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"></span>
      Ingresando...
    `;
  }, 1000);

  // Más de 10 segundos: informar y permitir cancelar.
  const temporizador10s = setTimeout(() => {
    estado.textContent = 'La solicitud está tardando más de lo habitual.';
    botonCancelar.classList.remove('d-none');
  }, 10000);

  let loginExitoso = false;

  try {
    await iniciarSesion(email, password, controlador.signal);
    loginExitoso = true;
  } catch (error) {
    if (error.name === 'AbortError') {
      mensajeError.textContent = 'Se canceló el intento de inicio de sesión.';
    } else {
      mensajeError.textContent = error.message;
    }

  } finally {
    clearTimeout(temporizador100ms);
    clearTimeout(temporizador1s);
    clearTimeout(temporizador10s);

    controlador = null;

    if (!loginExitoso) {
      botonIngresar.disabled = false;
      botonIngresar.innerHTML = textoOriginal;

      botonCancelar.classList.add('d-none');
      estado.textContent = '';
    }
  }
});

// Cancelar el intento.
botonCancelar.addEventListener('click', () => {
  if (controlador) {
    controlador.abort();
  }
});

inputEmail.addEventListener('input', () => {
  mensajeError.textContent = '';
});

inputPassword.addEventListener('input', () => {
  mensajeError.textContent = '';
});
