const PANEL_POR_ROL = {
    administrador: 'admin.html',
    instructor: 'instructor.html',
    miembro: 'miembro.html'
};

// =========================================
// INICIAR SESIÓN
// =========================================
export async function iniciarSesion(email, password) {
    const respuesta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });
    const datos = await respuesta.json();
    if (!respuesta.ok) {
        throw new Error(datos.mensaje || datos.error || 'Error al iniciar sesión');
    }
    const panel = PANEL_POR_ROL[datos.usuario.rol];
    if (!panel) {
        throw new Error('Rol de usuario desconocido');
    }
    window.location.href = panel;
}

// =========================================
// OBTENER USUARIO ACTUAL
// =========================================
export async function obtenerUsuarioActual() {
    const respuesta = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
    });
    if (!respuesta.ok) {
        return null;
    }
    const datos = await respuesta.json();
    return datos.usuario;
}

// =========================================
// VERIFICAR SESIÓN
// =========================================
export async function verificarSesion() {
    const usuario = await obtenerUsuarioActual();
    if (!usuario) {
        window.location.href = 'index.html';
        return null;
    }
    const rolEsperado = document.body.dataset.rol;

    if (usuario.rol !== rolEsperado) {
        const panelCorrecto = PANEL_POR_ROL[usuario.rol];
        window.location.href = panelCorrecto || 'index.html';
        return null;
    }

    return usuario;
}

// =========================================
// CERRAR SESIÓN
// =========================================
export async function cerrarSesion() {
    const respuesta = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
    });

    if (!respuesta.ok) {
        throw new Error('No se pudo cerrar la sesión');
    }

    window.location.href = 'index.html';
}
