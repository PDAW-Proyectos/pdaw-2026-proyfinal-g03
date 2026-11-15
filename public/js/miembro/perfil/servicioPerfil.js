async function enviarModificacion(url, datos) {
    const respuesta = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            resultado.mensaje ||
            resultado.detail ||
            resultado.error ||
            'No se pudieron guardar los cambios'
        );
    }

    return resultado.usuario;
}

export function modificarDatosPersonales(datos) {
    return enviarModificacion('/api/usuarios/perfil', datos);
}

export function modificarDatosMiembro(datos) {
    return enviarModificacion('/api/usuarios/perfil/miembro', datos);
}

export async function cambiarPassword(datos) {
    return enviarModificacion('/api/usuarios/perfil/password', datos);
}