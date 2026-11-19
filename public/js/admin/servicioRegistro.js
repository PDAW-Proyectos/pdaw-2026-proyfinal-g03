import { datosUsuario } from './estadoRegistro.js';
// Envía los datos al servidor.

// Envía los datos al servidor.
export async function registrarUsuario() {
    const url = datosUsuario.rol === 'miembro' ? '/api/usuarios/miembros' : '/api/usuarios/instructores';

    const respuesta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        credentials: 'include',
        body: JSON.stringify(datosUsuario),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
        const mensajeError =
            datos.mensaje ||
            datos.detail ||
            datos.error ||
            'No se pudo registrar el usuario';

        throw new Error(mensajeError);
    }

    return datos;
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