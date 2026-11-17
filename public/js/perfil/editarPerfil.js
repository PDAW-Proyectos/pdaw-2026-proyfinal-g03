import { modificarDatosPersonales, modificarDatosMiembro, cambiarPassword } from './servicioPerfil.js';
import { mostrarToast } from '../componentes/toast.js';
import{renderizarHistorialYGrafico} from '../miembro/renderizado-miembro.js'

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

// Obtiene los valores actuales de los inputs.
const obtenerValores = (campos) => {
    return Object.fromEntries(
        Object.entries(campos).map(([campo, id]) => {
            const input = document.getElementById(id);
            return [campo, input?.value ?? ''];
        })
    );
};

// Comprueba si hay diferencias.
const hayCambios = (actuales, originales) => {
    return Object.keys(actuales).some(
        campo => actuales[campo] !== originales[campo]
    );
};

// Prepara únicamente los campos modificados.
const prepararDatos = (actuales, originales) => {
    const datos = {};

    for (const campo of Object.keys(actuales)) {
        if (actuales[campo] !== originales[campo]) {
            datos[campo] = actuales[campo];
        }
    }

    // Convertir valores numéricos.
    for (const campo of ['altura', 'edad', 'pesoMeta']) {
        if (datos[campo] !== undefined) {
            datos[campo] = datos[campo] === ''
                ? null
                : Number(datos[campo]);
        }
    }

    return datos;
};

// Configura uno o varios grupos de campos con un único botón.
function configurarEdicionUnica({ grupos, botonId, usuario }) {
    const boton = document.getElementById(botonId);

    if (!boton) return;

    const originales = grupos.map(grupo =>
        obtenerValores(grupo.campos)
    );

    const actualizarBoton = () => {
        const hayAlgunaModificacion = grupos.some((grupo, indice) => {
            const actuales = obtenerValores(grupo.campos);

            return hayCambios(actuales, originales[indice]);
        });

        boton.classList.toggle('d-none', !hayAlgunaModificacion);
    };

    // Escuchar cambios en todos los grupos.
    grupos.forEach(grupo => {
        Object.values(grupo.campos).forEach(id => {
            const input = document.getElementById(id);

            if (input) {
                input.addEventListener('input', actualizarBoton);
                input.addEventListener('change', actualizarBoton);
            }
        });
    });

    boton.addEventListener('click', async () => {
        const modificaciones = grupos.map((grupo, indice) => ({
            modificar: grupo.modificar,
            indice,
            datos: prepararDatos(
                obtenerValores(grupo.campos),
                originales[indice]
            )
        })).filter(item => Object.keys(item.datos).length > 0);

        if (modificaciones.length === 0) return;

        boton.disabled = true;
        boton.textContent = 'Guardando...';

        try {
            // Guardar cada grupo mediante su propio endpoint.
            for (const item of modificaciones) {
                const actualizado = await item.modificar(item.datos);
                if (actualizado) {
                    Object.assign(usuario, actualizado);
                }
                originales[item.indice] = obtenerValores(
                    grupos[item.indice].campos
                );
            }
            renderizarHistorialYGrafico(usuario)
            mostrarToast('Cambios guardados correctamente.', '', 'success');
        } catch (error) {
            console.error('Error al modificar perfil:', error);
            mostrarToast('Error al guardar los cambios.', error.message || 'Por favor, intentá nuevamente.', 'error');
        } finally {
            boton.disabled = false;
            boton.innerHTML = '<i class="bi bi-check-lg"></i> Guardar cambios';
            actualizarBoton();
        }
    });
}

// Configuración del cambio de contraseña.
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
            mostrarToast(
                'Las contraseñas no coinciden.',
                'Verificá la confirmación.',
                'error'
            );
            return;
        }

        if (nueva.length < 8) {
            mostrarToast(
                'Contraseña demasiado corta.',
                'Debe tener al menos 8 caracteres.',
                'error'
            );
            return;
        }

        boton.disabled = true;
        boton.textContent = 'Guardando...';

        try {
            await cambiarPassword({
                passwordActual: actual,
                passwordNueva: nueva
            });

            mostrarToast(
                'Contraseña actualizada.',
                'Tu contraseña se cambió correctamente.',
                'success'
            );

            formulario.reset();
            bootstrap.Modal.getOrCreateInstance(modalElemento).hide();

        } catch (error) {
            console.error('Error al cambiar contraseña:', error);

            mostrarToast(
                'No se pudo cambiar la contraseña.',
                error.message,
                'error'
            );

        } finally {
            boton.disabled = false;
            boton.innerHTML =
                '<i class="bi bi-check-lg me-1"></i> Guardar contraseña';
        }
    });
}

// Inicialización general del perfil.
export function inicializarEdicionPerfil(usuario, opciones = {}) {
    const {
        campos = camposPersonales,
        botonId = 'guardar-datos-personales',
        modificar = modificarDatosPersonales,
        camposAdicionales = null,
        botonAdicionalId = null,
        modificarAdicional = null
    } = opciones;

    const grupos = [
        { campos, modificar }
    ];

    if (camposAdicionales && modificarAdicional) {
        grupos.push({
            campos: camposAdicionales,
            modificar: modificarAdicional
        });
    }

    // Si hay un segundo botón, cada grupo se configura por separado.
    if (botonAdicionalId && grupos.length > 1) {
        configurarEdicionUnica({
            grupos: [grupos[0]],
            botonId,
            usuario
        });

        configurarEdicionUnica({
            grupos: [grupos[1]],
            botonId: botonAdicionalId,
            usuario
        });
    } else {
        // Si no hay segundo botón, todos los grupos comparten uno.
        configurarEdicionUnica({
            grupos,
            botonId,
            usuario
        });
    }

    configurarCambioPassword();
}

// Configuración específica del perfil de miembro.
export const configuracionMiembro = {
    campos: camposPersonales,
    camposAdicionales: camposFisicos,
    botonAdicionalId: 'guardar-datos-fisicos',
    modificarAdicional: modificarDatosMiembro
};
