import { modificarDatosPersonales, modificarDatosMiembro, cambiarPassword } from './servicioPerfil.js';
import { mostrarToast } from '../renderizado-miembro.js';

const camposPersonales = {
    nombre: 'perfil-nombre',
    email: 'perfil-email',
    telefono: 'perfil-telefono'
};

const camposFisicos = {
    altura: 'perfil-altura',
    edad: 'perfil-edad',
    pesoMeta: 'perfil-peso-meta',
    objetivo: 'selectObjetivo'
};

const obtenerValores = (campos) => {
    return Object.fromEntries(
        Object.entries(campos).map(([campo, id]) => {
            const input = document.getElementById(id);
            return [campo, input?.value ?? ''];
        })
    );
};

const hayCambios = (actuales, originales) => {
    return Object.keys(actuales).some(
        campo => actuales[campo] !== originales[campo]
    );
};

const prepararDatos = (actuales, originales) => {
    const datos = {};

    for (const campo of Object.keys(actuales)) {
        if (actuales[campo] !== originales[campo]) {
            datos[campo] = actuales[campo];
        }
    }

    // Convertir los valores numéricos.
    for (const campo of ['altura', 'edad', 'pesoMeta']) {
        if (datos[campo] !== undefined) {
            datos[campo] = datos[campo] === ''
                ? null
                : Number(datos[campo]);
        }
    }

    return datos;
};

function configurarEdicion({ campos, botonId, modificar, usuario }) {
    const boton = document.getElementById(botonId);

    if (!boton) return;

    let originales = obtenerValores(campos);

    const actualizarBoton = () => {
        const actuales = obtenerValores(campos);

        boton.classList.toggle(
            'd-none',
            !hayCambios(actuales, originales)
        );
    };

    Object.values(campos).forEach(id => {
        const input = document.getElementById(id);

        if (input) {
            input.addEventListener('input', actualizarBoton);
            input.addEventListener('change', actualizarBoton);
        }
    });

    boton.addEventListener('click', async () => {
        const actuales = obtenerValores(campos);
        const datos = prepararDatos(actuales, originales);

        if (Object.keys(datos).length === 0) return;

        boton.disabled = true;
        boton.innerHTML = 'Guardando...';

        try {
            const actualizado = await modificar(datos);

            // Actualizar los datos del usuario en memoria.
            Object.assign(usuario, actualizado);

            // Actualizar los valores originales.
            originales = obtenerValores(campos);

            boton.classList.add('d-none');

            mostrarToast("Cambios guardados correctamente.", "", "success");

        } catch (error) {
            console.error('Error al modificar perfil:', error);
            mostrarToast("Error al guardar los cambios.", " Por favor, intentá nuevamente.", "error");
        } finally {
            boton.disabled = false;
            boton.innerHTML =
                '<i class="bi bi-check-lg"></i> Guardar cambios';

            actualizarBoton();
        }
    });
}

function configurarCambioPassword() {
    const formulario = document.getElementById('formCambiarPassword');
    const modalElemento = document.getElementById('modalCambiarPassword');

    if (!formulario || !modalElemento) return;

    const passwordActual = document.getElementById('passwordActual');
    const passwordNueva = document.getElementById('passwordNueva');
    const passwordConfirmacion = document.getElementById('passwordConfirmacion');
    const boton = document.getElementById('btnGuardarPassword');

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();

        const actual = passwordActual.value;
        const nueva = passwordNueva.value;
        const confirmacion = passwordConfirmacion.value;

        if (nueva !== confirmacion) {
            mostrarToast('Las contraseñas no coinciden.', 'Verificá la confirmación.', 'error');
            return;
        }

        if (nueva.length < 8) {
            mostrarToast('Contraseña demasiado corta.', 'Debe tener al menos 8 caracteres.', 'error');
            return;
        }

        boton.disabled = true;
        boton.textContent = 'Guardando...';
        try {
            await cambiarPassword({
                passwordActual: actual,
                passwordNueva: nueva
            });
            mostrarToast('Contraseña actualizada.', 'Tu contraseña se cambió correctamente.', 'success');

            formulario.reset();
            bootstrap.Modal.getOrCreateInstance(modalElemento).hide();
        } catch (error) {
            console.error('Error al cambiar contraseña:', error);
            mostrarToast('No se pudo cambiar la contraseña.', error.message, 'error');
        } finally {
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-check-lg me-1"></i> Guardar contraseña';
        }
    });
}

export function inicializarEdicionPerfil(usuario) {
    configurarEdicion({
        campos: camposPersonales,
        botonId: 'guardar-datos-personales',
        modificar: modificarDatosPersonales,
        usuario
    });

    configurarEdicion({
        campos: camposFisicos,
        botonId: 'guardar-datos-fisicos',
        modificar: modificarDatosMiembro,
        usuario
    });

    configurarCambioPassword();
}
