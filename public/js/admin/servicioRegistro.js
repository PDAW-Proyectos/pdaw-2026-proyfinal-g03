import { datosUsuario } from './estadoRegistro.js';
import { mostrarErrorRegistro } from './validacionesRegistro.js';
// Envía los datos al servidor.
export async function registrarUsuario() {
    const mensaje = document.getElementById('mensajeRegistro');
    mensaje.textContent = '';
    const url =
        datosUsuario.rol === 'miembro' ? '/api/usuarios/miembros' : '/api/usuarios/instructores';

    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(datosUsuario),
        });

        const datos = await respuesta.json();

        console.log('Datos enviados:', datosUsuario);
        console.log('Respuesta del servidor:', datos);

        if (!respuesta.ok) {
            const mensajeError =
                datos.mensaje ||
                datos.detail ||
                datos.error ||
                'No se pudo registrar el usuario';

            throw new Error(mensajeError);
        }

        alert('Usuario registrado correctamente');
        return true;
    } catch (error) {
        mostrarErrorRegistro(error.message);
        return false;
    }
}

export async function obtenerMembresias() {
    const respuesta = await fetch('/api/membresias', {
        method: 'GET',
        credentials: 'include',
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            datos.mensaje ||
            datos.detail ||
            datos.error ||
            'No se pudieron cargar las membresías'
        );
    }

    return datos.data.filter(membresia => membresia.activo);
}