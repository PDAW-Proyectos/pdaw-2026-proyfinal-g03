// =========================================
// BASE DE DATOS SIMULADA
// =========================================
const usuariosDB = [
    { email: 'admin@irontemple.com', dni: '11111111', rol: 'admin', nombre: 'Admin Principal' },
    { email: 'carlos@pulso.com', dni: '22222222', rol: 'entrenador', nombre: 'Carlos Gómez' },
    { email: 'juan@email.com', dni: '33333333', rol: 'usuario', nombre: 'Juan Pérez' }
];

// =========================================
// LÓGICA DE LOGIN
// =========================================
function inicializarLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const dni = document.getElementById('loginPassword').value.trim();

        const user = usuariosDB.find(u => u.email === email && u.dni === dni);

        if (user) {
            localStorage.setItem('rol', user.rol);
            localStorage.setItem('nombre', user.nombre);
            localStorage.setItem('email', user.email);

            window.location.href = 'dashboard.html';
        } else {
            alert('Email o DNI incorrecto. Verificá tus datos.');
        }
    });
}

// =========================================
// LÓGICA PARA CAMBIAR DE SECCIÓN (Dashboard)
// =========================================
function cambiarSeccion(idSeccion, boton) {
    // 1. Ocultar todas las secciones
    const secciones = document.querySelectorAll('.seccion-contenido');
    secciones.forEach(sec => sec.classList.add('d-none'));

    // 2. Mostrar la sección seleccionada
    const seccionMostrar = document.getElementById(idSeccion);
    if (seccionMostrar) {
        seccionMostrar.classList.remove('d-none');
    }

    // 3. Manejar el estado "active" de los botones del menú
    // Sacar 'active' de todos los botones
    const todosLosBotones = document.querySelectorAll('.admin-nav-link');
    todosLosBotones.forEach(btn => btn.classList.remove('active'));

    // Poner 'active' al botón clickeado
    if (boton) {
        boton.classList.add('active');
    }
}

// =========================================
// LÓGICA DEL DASHBOARD (Mostrar rol correcto)
// =========================================
function inicializarDashboard() {
    const rol = localStorage.getItem('rol');
    const nombre = localStorage.getItem('nombre');

    if (!rol || !nombre) {
        window.location.href = 'login.html';
        return;
    }

    // Header
    const headerNombre = document.getElementById('nombreUsuarioHeader');
    const headerRol = document.getElementById('rolUsuarioHeader');
    if (headerNombre) headerNombre.textContent = nombre;
    if (headerRol) headerRol.textContent = rol.toUpperCase();

    // Ocultar menús y contenidos
    document.getElementById('menu-admin').classList.add('d-none');
    document.getElementById('menu-entrenador').classList.add('d-none');
    document.getElementById('menu-usuario').classList.add('d-none');
    
    document.getElementById('contenido-admin').classList.add('d-none');
    document.getElementById('contenido-entrenador').classList.add('d-none');
    document.getElementById('contenido-usuario').classList.add('d-none');

    // Mostrar lo correspondiente
    if (rol === 'admin') {
        document.getElementById('menu-admin').classList.remove('d-none');
        document.getElementById('contenido-admin').classList.remove('d-none');
        
        // Seleccionar la primera pestaña por defecto
        document.getElementById('admin-usuarios').classList.remove('d-none');
        document.getElementById('menu-admin').querySelector('.admin-nav-link').classList.add('active');

    } else if (rol === 'entrenador') {
        document.getElementById('menu-entrenador').classList.remove('d-none');
        document.getElementById('contenido-entrenador').classList.remove('d-none');

        document.getElementById('trainer-clases').classList.remove('d-none');
        document.getElementById('menu-entrenador').querySelector('.admin-nav-link').classList.add('active');

    } else if (rol === 'usuario') {
        document.getElementById('menu-usuario').classList.remove('d-none');
        document.getElementById('contenido-usuario').classList.remove('d-none');

        document.getElementById('user-historial').classList.remove('d-none');
        document.getElementById('menu-usuario').querySelector('.admin-nav-link').classList.add('active');
    }
}

// =========================================
// CERRAR SESIÓN
// =========================================
function cerrarSesion(e) {
    if (e) e.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
}

// =========================================
// LÓGICA PARA EL INDEX
// =========================================
function inicializarIndex() {
    const authContainer = document.getElementById('navbar-auth');
    if (!authContainer) return;

    const rol = localStorage.getItem('rol');
    const nombre = localStorage.getItem('nombre');

    if (rol && nombre) {
        authContainer.innerHTML = `
            <span class="text-white align-self-center d-none d-lg-inline">Hola, ${nombre}</span>
            <a href="dashboard.html" class="btn btn-green">MI PANEL ↗</a>
            <a href="#" class="btn btn-outline-custom" onclick="cerrarSesion(event)">SALIR</a>
        `;
    }
}

// =========================================
// INICIALIZADOR GENERAL
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        inicializarLogin();
    } else if (document.getElementById('mainTabs')) {
        inicializarDashboard();
    } else if (document.getElementById('navbar-auth')) {
        inicializarIndex();
    }
});