export let pasoActual = 1;
export const datosUsuario = {};

export function cambiarPaso(paso) {
    pasoActual = paso;
}

export function guardarDatosPaso() {
    if (pasoActual === 1) {
        datosUsuario.nombre = document.getElementById('nombre').value;
        datosUsuario.email = document.getElementById('email').value;
        datosUsuario.dni = document.getElementById('dni').value;
        datosUsuario.rol = document.getElementById('rol').value;
        datosUsuario.telefono = document.getElementById('telefono').value;
    }

    if (pasoActual === 2 && datosUsuario.rol === 'miembro') {
        datosUsuario.peso = document.getElementById('peso').value;
        datosUsuario.altura = document.getElementById('altura').value;
        datosUsuario.edad = document.getElementById('edad').value;
        datosUsuario.objetivo = document.getElementById('objetivo').value;
        const inputPesoMeta = document.getElementById('pesoMeta');
        datosUsuario.pesoMeta = inputPesoMeta ? (inputPesoMeta.value) : null;
    }

    if (pasoActual === 2 && datosUsuario.rol === 'instructor') {
        datosUsuario.especialidad = document.getElementById('especialidad').value;
    }

    if (pasoActual === 3) {
        const select = document.getElementById('planMembresiaId');
        if (!select) {
            const mensaje = document.getElementById('mensajeRegistro');
            mensaje.textContent = 'No hay una membresía disponible para seleccionar.';
            return false;
        }
        datosUsuario.planMembresiaId = select.value;
    }

    return true;
}

export function reiniciarRegistro() {
    cambiarPaso(1);

    Object.keys(datosUsuario).forEach((clave) => {
        delete datosUsuario[clave];
    });
}