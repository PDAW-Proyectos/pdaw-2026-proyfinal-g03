import { cambiarPaso } from './estadoRegistro.js';
import { mostrarDatosPersonales } from './vistasRegistro.js';

// Muestra un mensaje de error debajo de un campo.
function mostrarError(idCampo, mensaje) {
    const error = document.getElementById(`error-${idCampo}`);
    if (error) {
        error.textContent = mensaje;
    }

    const input = document.getElementById(idCampo);
    if (input) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
    }
}

// Limpia el mensaje de error de un campo.
export function limpiarError(idCampo) {
    const error = document.getElementById(`error-${idCampo}`);
    if (error) {
        error.textContent = '';
    }

    const input = document.getElementById(idCampo);
    if (input) {
        input.classList.remove('is-invalid');
    }
}

// Crea el espacio donde aparecerá el mensaje.
export function crearMensajeError(idCampo) {
    const error = document.createElement('small');
    error.id = `error-${idCampo}`;
    error.classList.add('text-danger', 'd-block', 'mt-1');
    return error;
}

export function validarDatosPersonales() {
    let valido = true;

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const rol = document.getElementById('rol').value;

    // Nombre
    if (!nombre) {
        mostrarError('nombre', 'El nombre es obligatorio.');
        valido = false;
    } else if (nombre.length < 2 || nombre.length > 80) {
        mostrarError('nombre', 'El nombre debe tener entre 2 y 80 caracteres.');
        valido = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]+$/.test(nombre)) {
        mostrarError('nombre', 'El nombre solo puede contener letras y espacios.');
        valido = false;
    }

    // Email
    if (!email) {
        mostrarError('email', 'El email es obligatorio.');
        valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarError('email', 'Ingresá un email válido.');
        valido = false;
    } else if (email.length > 254) {
        mostrarError('email', 'El email no puede superar los 254 caracteres.');
        valido = false;
    }

    // DNI
    if (!dni) {
        mostrarError('dni', 'El DNI es obligatorio.');
        valido = false;
    } else if (!/^\d{7,8}$/.test(dni)) {
        mostrarError('dni', 'El DNI debe tener entre 7 y 8 dígitos.');
        valido = false;
    }

    // Teléfono (opcional)
    if (telefono && !/^\d{8,15}$/.test(telefono)) {
        mostrarError('telefono', 'El teléfono debe contener entre 8 y 15 dígitos.');
        valido = false;
    }

    // Rol
    if (!rol) {
        mostrarError('rol', 'Seleccioná un rol.');
        valido = false;
    }

    return valido;
}

export function validarDatosMiembro() {
    let valido = true;

    const peso = Number(document.getElementById('peso').value);
    const altura = Number(document.getElementById('altura').value);
    const edad = Number(document.getElementById('edad').value);
    const objetivo = document.getElementById('objetivo').value;
    const inputPesoMeta = document.getElementById('pesoMeta');

    if (!document.getElementById('peso').value) {
        mostrarError('peso', 'Ingresá tu peso.');
        valido = false;
    } else if (!Number.isFinite(peso) || peso < 20 || peso > 400) {
        mostrarError('peso', 'El peso debe estar entre 20 y 400 kg.');
        valido = false;
    }

    if (!document.getElementById('altura').value) {
        mostrarError('altura', 'Ingresá tu altura.');
        valido = false;
    } else if (!Number.isFinite(altura) || altura < 80 || altura > 250) {
        mostrarError('altura', 'La altura debe estar entre 80 y 250 cm.');
        valido = false;
    }

    if (!document.getElementById('edad').value) {
        mostrarError('edad', 'Ingresá tu edad.');
        valido = false;
    } else if (!Number.isInteger(edad) || edad < 14 || edad > 110) {
        mostrarError('edad', 'La edad debe ser un número entero entre 14 y 110.');
        valido = false;
    }

    if (!objetivo) {
        mostrarError('objetivo', 'Seleccioná un objetivo.');
        valido = false;
    }

    if (inputPesoMeta) {
        const pesoMeta = Number(inputPesoMeta.value);

        if (!inputPesoMeta.value) {
            mostrarError('pesoMeta', 'Ingresá tu peso meta.');
            valido = false;

        } else if (!Number.isFinite(pesoMeta) || pesoMeta < 20 || pesoMeta > 400) {
            mostrarError('pesoMeta', 'El peso meta debe estar entre 20 y 400 kg.');
            valido = false;

        } else if (objetivo === 'perder_peso' && pesoMeta >= peso) {
            mostrarError('pesoMeta', 'Para perder peso, tu peso meta debe ser menor que tu peso actual.');
            valido = false;

        } else if (objetivo === 'ganar_musculo' && pesoMeta <= peso) {
            mostrarError('pesoMeta', 'Para ganar músculo, tu peso meta debe ser mayor que tu peso actual.');
            valido = false;
        }
    }

    return valido;
}

export function validarMembresia() {
    const select = document.getElementById('planMembresiaId');

    if (!select) {
        const mensaje = document.getElementById('mensajeRegistro');
        mensaje.textContent = 'No hay membresías disponibles para seleccionar.';
        return false;
    }

    if (!select.value) {
        mostrarError('planMembresiaId', 'Tenés que seleccionar una membresía.');
        return false;
    }

    return true;
}

export function validarDatosInstructor() {
    const especialidad = document.getElementById('especialidad').value.trim();

    if (!especialidad) {
        mostrarError('especialidad', 'La especialidad es obligatoria.');
        return false;
    }

    if (especialidad.length < 2 || especialidad.length > 80) {
        mostrarError('especialidad', 'La especialidad debe tener entre 2 y 80 caracteres.');
        return false;
    }

    return true;
}

export function mostrarErrorRegistro(mensaje) {
    const texto = mensaje.toLowerCase();

    const esDni = texto.includes('dni');
    const esEmail = texto.includes('email') || texto.includes('correo');

    if (esDni || esEmail) {
        cambiarPaso(1);
        mostrarDatosPersonales();

        document.getElementById('volverRegistro').hidden = true;
        document.getElementById('siguienteRegistro').textContent = 'Siguiente';

        if (esDni) mostrarError('dni', 'Este DNI ya está registrado.');
        if (esEmail) mostrarError('email', 'Este email ya está registrado.');

        return;
    }

    document.getElementById('mensajeRegistro').textContent = mensaje;
}
