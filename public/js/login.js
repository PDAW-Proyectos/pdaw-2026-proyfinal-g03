import { iniciarSesion } from './auth.js';

const inputEmail = document.getElementById('loginEmail');
const inputPassword = document.getElementById('loginPassword');
const loginForm = document.getElementById('loginForm');
const mensajeError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = inputEmail.value;
    const password = inputPassword.value;

    mensajeError.textContent = '';

    try {
        await iniciarSesion(email, password);
    } catch (error) {
        mensajeError.textContent = error.message;
    }
});