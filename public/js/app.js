// =========================================
// BASE DE DATOS SIMULADA (Usuarios)
// =========================================
const usuariosDB = [
    { email: 'admin@irontemple.com', dni: '11111111', rol: 'admin', nombre: 'Admin Principal' },
    { email: 'carlos@pulso.com', dni: '22222222', rol: 'entrenador', nombre: 'Carlos Gómez' },
    { email: 'juan@email.com', dni: '33333333', rol: 'usuario', nombre: 'Juan Pérez' }
];

// =========================================
// BASE DE DATOS DE DIETAS
// =========================================
const dietasDB = {
    'deficit': {
        titulo: "Plan Déficit Calórico",
        descripcion: "Diseñado para bajar grasa corporal manteniendo la masa muscular.",
        caloriasTotales: "1800 - 2000 kcal / día",
        dias: [
            { 
                dia: "Lunes", 
                calorias: "1850 kcal", 
                comidas: [
                    { nombre: "Desayuno: Avena con frutas", calorias: 350, prot: 15, carb: 50, grasa: 8, ingredientes: ["40g de avena", "200ml de leche", "1/2 banana"], preparacion: ["Calentar leche", "Agregar avena", "Servir con frutas"] },
                    { nombre: "Almuerzo: Pollo con ensalada", calorias: 500, prot: 40, carb: 20, grasa: 15, ingredientes: ["150g de pollo", "Lechuga", "Tomate"], preparacion: ["Cocinar pollo", "Cortar verduras", "Mezclar"] },
                    { nombre: "Merienda: Yogur griego", calorias: 200, prot: 12, carb: 10, grasa: 8, ingredientes: ["1 yogur griego", "Nueces"], preparacion: ["Mezclar"] },
                    { nombre: "Cena: Salmón al horno", calorias: 600, prot: 35, carb: 15, grasa: 25, ingredientes: ["150g salmón", "Brócoli"], preparacion: ["Hornear", "Servir"] }
                ]
            },
            { 
                dia: "Martes", 
                calorias: "1900 kcal", 
                comidas: [
                    { nombre: "Desayuno: Huevos revueltos", calorias: 400, prot: 20, carb: 30, grasa: 15, ingredientes: ["2 huevos", "Pan integral"], preparacion: ["Cocinar", "Servir"] },
                    { nombre: "Almuerzo: Carne con puré", calorias: 600, prot: 40, carb: 40, grasa: 20, ingredientes: ["Carne", "Papa"], preparacion: ["Cocinar", "Hacer puré"] },
                    { nombre: "Merienda: Frutos secos", calorias: 200, prot: 5, carb: 10, grasa: 15, ingredientes: ["Almendras"], preparacion: ["Comer"] },
                    { nombre: "Cena: Ensalada de atún", calorias: 500, prot: 30, carb: 15, grasa: 20, ingredientes: ["Atún", "Lechuga"], preparacion: ["Mezclar"] }
                ]
            },
            { 
                dia: "Miércoles", 
                calorias: "1800 kcal", 
                comidas: [
                    { nombre: "Desayuno: Licuado proteico", calorias: 350, prot: 25, carb: 30, grasa: 5, ingredientes: ["Proteína", "Banana", "Agua"], preparacion: ["Licuar"] },
                    { nombre: "Almuerzo: Wrap de pollo", calorias: 550, prot: 35, carb: 40, grasa: 15, ingredientes: ["Pollo", "Tortilla"], preparacion: ["Armar", "Enrollar"] },
                    { nombre: "Merienda: Manzana", calorias: 100, prot: 0, carb: 25, grasa: 0, ingredientes: ["Manzana"], preparacion: ["Comer"] },
                    { nombre: "Cena: Tortilla de espinaca", calorias: 450, prot: 20, carb: 10, grasa: 30, ingredientes: ["Huevo", "Espinaca"], preparacion: ["Cocinar"] }
                ]
            },
            { 
                dia: "Jueves", 
                calorias: "1950 kcal", 
                comidas: [
                    { nombre: "Desayuno: Tostadas con palta", calorias: 400, prot: 10, carb: 30, grasa: 20, ingredientes: ["Pan", "Palta"], preparacion: ["Tostar", "Untar"] },
                    { nombre: "Almuerzo: Bife con ensalada", calorias: 650, prot: 45, carb: 15, grasa: 30, ingredientes: ["Bife", "Verduras"], preparacion: ["Cocinar", "Servir"] },
                    { nombre: "Merienda: Queso cottage", calorias: 200, prot: 15, carb: 5, grasa: 10, ingredientes: ["Queso", "Frutillas"], preparacion: ["Mezclar"] },
                    { nombre: "Cena: Merluza al horno", calorias: 500, prot: 35, carb: 20, grasa: 15, ingredientes: ["Merluza", "Papas"], preparacion: ["Hornear"] }
                ]
            },
            { 
                dia: "Viernes", 
                calorias: "1900 kcal", 
                comidas: [
                    { nombre: "Desayuno: Smoothie bowl", calorias: 350, prot: 10, carb: 50, grasa: 5, ingredientes: ["Frutas", "Yogur"], preparacion: ["Licuar", "Servir"] },
                    { nombre: "Almuerzo: Arroz con pollo", calorias: 600, prot: 35, carb: 50, grasa: 15, ingredientes: ["Arroz", "Pollo"], preparacion: ["Cocinar", "Mezclar"] },
                    { nombre: "Merienda: Gelatina", calorias: 50, prot: 0, carb: 10, grasa: 0, ingredientes: ["Gelatina"], preparacion: ["Preparar"] },
                    { nombre: "Cena: Revuelto de claras", calorias: 450, prot: 30, carb: 5, grasa: 20, ingredientes: ["Claras", "Champiñones"], preparacion: ["Cocinar"] }
                ]
            },
            { 
                dia: "Sábado", 
                calorias: "2000 kcal", 
                comidas: [
                    { nombre: "Desayuno: Panqueques avena", calorias: 450, prot: 15, carb: 60, grasa: 10, ingredientes: ["Avena", "Huevo"], preparacion: ["Cocinar"] },
                    { nombre: "Almuerzo: Pescado con quinoa", calorias: 700, prot: 40, carb: 50, grasa: 20, ingredientes: ["Pescado", "Quinoa"], preparacion: ["Cocinar"] },
                    { nombre: "Merienda: Yogur granola", calorias: 250, prot: 10, carb: 30, grasa: 8, ingredientes: ["Yogur", "Granola"], preparacion: ["Mezclar"] },
                    { nombre: "Cena: Brochetas de pollo", calorias: 600, prot: 35, carb: 20, grasa: 15, ingredientes: ["Pollo", "Verduras"], preparacion: ["Asar"] }
                ]
            },
            { 
                dia: "Domingo", 
                calorias: "1950 kcal", 
                comidas: [
                    { nombre: "Desayuno: Omelette", calorias: 400, prot: 20, carb: 5, grasa: 30, ingredientes: ["Huevos", "Queso"], preparacion: ["Cocinar"] },
                    { nombre: "Almuerzo: Asado magro", calorias: 700, prot: 45, carb: 10, grasa: 35, ingredientes: ["Carne", "Ensalada"], preparacion: ["Asar"] },
                    { nombre: "Merienda: Batido proteína", calorias: 200, prot: 25, carb: 5, grasa: 2, ingredientes: ["Proteína", "Agua"], preparacion: ["Licuar"] },
                    { nombre: "Cena: Sopa de verduras", calorias: 400, prot: 15, carb: 30, grasa: 10, ingredientes: ["Verduras", "Caldo"], preparacion: ["Hervir"] }
                ]
            }
        ]
    },
    'volumen': { titulo: "Plan de Volumen", descripcion: "Para ganar masa muscular.", caloriasTotales: "2800 - 3000 kcal / día", dias: [] },
    'mantenimiento': { titulo: "Plan de Mantenimiento", descripcion: "Para mantener peso.", caloriasTotales: "2200 - 2400 kcal / día", dias: [] },
    'resistencia': { titulo: "Plan de Resistencia", descripcion: "Para mejorar aguante.", caloriasTotales: "2500 - 2700 kcal / día", dias: [] }
};

// =========================================
// BASE DE DATOS DE RECETAS
// =========================================
const recetasDB = [
    { id: 1, nombre: "Ensalada de Pollo", calorias: 450, badge: "Alto en proteínas", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop", ingredientes: ["Pollo", "Lechuga", "Tomate"] },
    { id: 2, nombre: "Bowl de Quinoa", calorias: 320, badge: "Vegano", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop", ingredientes: ["Quinoa", "Palta", "Garbanzos"] }
];

let vistaRecetasActual = 'todas';


// =========================================
// LÓGICA DE LOGIN (Email + DNI)
// =========================================
function inicializarLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const dni = document.getElementById('loginPassword').value.trim();
        const errorBox = document.getElementById('loginError');
        const errorText = document.getElementById('loginErrorText');

        const user = usuariosDB.find(u => u.email === email && u.dni === dni);

        if (user) {
            localStorage.setItem('rol', user.rol);
            localStorage.setItem('nombre', user.nombre);
            localStorage.setItem('email', user.email);
            window.location.href = 'dashboard.html';
        } else {
            errorBox.classList.remove('d-none');
            errorText.textContent = 'Email o DNI incorrectos. Revisá tus datos.';
        }
    });
}

// =========================================
// LÓGICA DEL DASHBOARD
// =========================================
function inicializarDashboard() {
    const rol = localStorage.getItem('rol');
    const nombre = localStorage.getItem('nombre');

    if (!rol || !nombre) {
        window.location.href = 'login.html';
        return;
    }

    const headerNombre = document.getElementById('nombreUsuarioHeader');
    if (headerNombre) headerNombre.textContent = nombre;

    document.getElementById('menu-admin').classList.add('d-none');
    document.getElementById('menu-entrenador').classList.add('d-none');
    document.getElementById('menu-usuario').classList.add('d-none');
    
    document.getElementById('contenido-admin').classList.add('d-none');
    document.getElementById('contenido-entrenador').classList.add('d-none');
    document.getElementById('contenido-usuario').classList.add('d-none');

    if (rol === 'admin') {
        document.getElementById('menu-admin').classList.remove('d-none');
        document.getElementById('contenido-admin').classList.remove('d-none');
        document.getElementById('admin-usuarios').classList.remove('d-none');
        const primerBtnAdmin = document.getElementById('menu-admin').querySelector('.admin-nav-link');
        if (primerBtnAdmin) primerBtnAdmin.classList.add('active');

    } else if (rol === 'entrenador') {
        document.getElementById('menu-entrenador').classList.remove('d-none');
        document.getElementById('contenido-entrenador').classList.remove('d-none');
        document.getElementById('trainer-clases').classList.remove('d-none');
        const primerBtnTrainer = document.getElementById('menu-entrenador').querySelector('.admin-nav-link');
        if (primerBtnTrainer) primerBtnTrainer.classList.add('active');

    } else if (rol === 'usuario') {
        document.getElementById('menu-usuario').classList.remove('d-none');
        document.getElementById('contenido-usuario').classList.remove('d-none');
        document.getElementById('user-historial').classList.remove('d-none');
        const primerBtnUser = document.getElementById('menu-usuario').querySelector('.admin-nav-link');
        if (primerBtnUser) primerBtnUser.classList.add('active');

        cargarDietaEnNutricion();
        buscarRecetas();
        
        const selectObj = document.getElementById('selectObjetivo');
        if (selectObj) {
            const objetivoGuardado = localStorage.getItem('objetivoUsuario') || 'deficit';
            selectObj.value = objetivoGuardado;
        }
    }
}

function cambiarSeccion(id, btn) {
    document.querySelectorAll('.seccion-contenido').forEach(el => el.classList.add('d-none'));
    document.getElementById(id).classList.remove('d-none');
    
    document.querySelectorAll('.admin-nav-link').forEach(el => el.classList.remove('active'));
    if(btn) btn.classList.add('active');

    if (id === 'user-nutricion') {
        cargarDietaEnNutricion();
        buscarRecetas();
    }
}

// =========================================
// LÓGICA DE CAMBIO DE DNI (Contraseña)
// =========================================
function cambiarPassword(e) {
    e.preventDefault();
    const dniActual = document.getElementById('dniActual').value.trim();
    const dniNuevo = document.getElementById('dniNuevo').value.trim();
    const dniConfirmar = document.getElementById('dniConfirmar').value.trim();
    const errorBox = document.getElementById('errorPassword');
    const email = localStorage.getItem('email');

    errorBox.classList.add('d-none');
    const user = usuariosDB.find(u => u.email === email);

    if (!user || user.dni !== dniActual) {
        errorBox.textContent = "DNI actual incorrecto.";
        errorBox.classList.remove('d-none');
        return;
    }
    if (dniNuevo !== dniConfirmar) {
        errorBox.textContent = "Los nuevos DNI no coinciden.";
        errorBox.classList.remove('d-none');
        return;
    }
    if (!/^\d{8}$/.test(dniNuevo)) {
        errorBox.textContent = "El DNI debe tener 8 números.";
        errorBox.classList.remove('d-none');
        return;
    }

    user.dni = dniNuevo;
    alert("¡DNI actualizado! Usá el nuevo para entrar.");
    bootstrap.Modal.getInstance(document.getElementById('modalCambiarPassword')).hide();
    document.getElementById('formCambiarPassword').reset();
}

// =========================================
// LÓGICA DE DIETAS Y RECETAS
// =========================================
function cargarDietaEnNutricion() {
    const contenedor = document.getElementById('contenedorDieta');
    if (!contenedor) return;

    const objetivo = localStorage.getItem('objetivoUsuario') || 'deficit';
    const dieta = dietasDB[objetivo] || dietasDB['deficit'];

    if (!dieta.dias || dieta.dias.length === 0) {
        contenedor.innerHTML = `<div class="user-card"><h4 class="text-white">${dieta.titulo}</h4><p class="text-gray">${dieta.descripcion}</p></div>`;
        return;
    }

    let html = '';
    dieta.dias.forEach((dia, i) => {
        let comidas = '';
        dia.comidas.forEach((c, j) => {
            comidas += `<li class="mb-2 pb-2 border-bottom border-secondary d-flex justify-content-between">
                <span class="text-gray"><i class="bi bi-check2-circle text-green me-2"></i> ${c.nombre}</span>
                <button class="btn btn-sm btn-outline-custom py-1 px-2 fs-12" onclick="abrirModalReceta('${objetivo}', ${i}, ${j})">Ver receta</button>
            </li>`;
        });
        html += `<div class="accordion-item bg-pulso-card border border-secondary mb-2 rounded">
            <h2 class="accordion-header"><button class="accordion-button ${i===0?'':'collapsed'} bg-pulso-darker text-white fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDia${i}">
                <div class="d-flex justify-content-between w-100 pe-3"><span>${dia.dia}</span><span class="badge badge-green">${dia.calorias}</span></div>
            </button></h2>
            <div id="collapseDia${i}" class="accordion-collapse collapse ${i===0?'show':''}" data-bs-parent="#acordeonDieta">
                <div class="accordion-body text-gray p-3"><ul class="list-unstyled mb-0">${comidas}</ul></div>
            </div>
        </div>`;
    });

    contenedor.innerHTML = `<div class="user-card mb-4" style="border-color: var(--pulso-green);">
        <h4 class="text-white">${dieta.titulo}</h4>
        <p class="text-gray fs-14">${dieta.descripcion}</p>
        <div class="alert bg-pulso-darker border border-secondary text-white mb-4 d-flex align-items-center">
            <i class="bi bi-fire text-green fs-4 me-3"></i>
            <div><span class="d-block fs-12 text-gray">Consumo diario</span><strong class="fs-15">${dieta.caloriasTotales}</strong></div>
        </div>
        <h5 class="text-white mb-3 fs-14">Plan Semanal</h5>
        <div class="accordion" id="acordeonDieta">${html}</div>
    </div>`;
}

function abrirModalReceta(obj, dia, comida) {
    const c = dietasDB[obj].dias[dia].comidas[comida];
    document.getElementById('modalRecetaLabel').textContent = c.nombre;
    document.getElementById('modalImagen').src = c.imagen || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop';
    document.getElementById('modalCalorias').textContent = c.calorias;
    document.getElementById('modalProteinas').textContent = c.prot;
    document.getElementById('modalCarbos').textContent = c.carb;
    document.getElementById('modalGrasas').textContent = c.grasa;
    document.getElementById('modalIngredientes').innerHTML = c.ingredientes.map(i => `<li><i class="bi bi-dot text-green"></i> ${i}</li>`).join('');
    document.getElementById('modalPreparacion').innerHTML = c.preparacion.map(p => `<li class="mb-2">${p}</li>`).join('');
    new bootstrap.Modal(document.getElementById('modalReceta')).show();
}

function buscarRecetas() {
    const cont = document.getElementById('contenedorRecetas');
    if (!cont) return;
    const term = document.getElementById('inputBuscarIngrediente')?.value.toLowerCase() || '';
    const destacadas = JSON.parse(localStorage.getItem('recetasDestacadas')) || [];

    const filtradas = recetasDB.filter(r => {
        const textMatch = r.nombre.toLowerCase().includes(term) || r.ingredientes.some(i => i.toLowerCase().includes(term));
        const viewMatch = (vistaRecetasActual === 'todas') || destacadas.includes(r.id);
        return textMatch && viewMatch;
    });

    if (filtradas.length === 0) {
        cont.innerHTML = `<div class="col-12 text-center py-5"><p class="text-gray">No hay recetas para mostrar.</p></div>`;
        return;
    }

    cont.innerHTML = filtradas.map(r => {
        const isDest = destacadas.includes(r.id);
        return `<div class="col-md-4">
            <div class="user-card p-0 overflow-hidden h-100 d-flex flex-column">
                <div class="position-relative">
                    <img src="${r.img}" class="w-100" style="height: 180px; object-fit: cover;">
                    
                    <!-- BOTÓN ESTRELLA CENTRADO -->
                    <button class="btn position-absolute top-0 end-0 m-2 rounded-circle d-flex align-items-center justify-content-center p-0" 
                            style="width: 35px; height: 35px; background: rgba(0,0,0,0.7);" 
                            onclick="toggleDestacada(${r.id})">
                        <i class="bi ${isDest ? 'bi-star-fill text-warning' : 'bi-star text-white'}" style="line-height: 0;"></i>
                    </button>
                </div>
                <div class="p-4 d-flex flex-column flex-grow-1">
                    <h4 class="fs-5 text-white">${r.nombre}</h4>
                    <p class="text-gray fs-13"><i class="bi bi-fire text-green"></i> ${r.calorias} kcal</p>
                    <span class="badge bg-dark border border-secondary text-gray mb-3 align-self-start">${r.badge}</span>
                    <button class="btn btn-green w-100 mt-auto py-2 fs-14">VER RECETA</button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function toggleDestacada(id) {
    let dest = JSON.parse(localStorage.getItem('recetasDestacadas')) || [];
    dest = dest.includes(id) ? dest.filter(i => i !== id) : [...dest, id];
    localStorage.setItem('recetasDestacadas', JSON.stringify(dest));
    buscarRecetas();
}

function cambiarVistaRecetas(v) {
    vistaRecetasActual = v;
    document.getElementById('btn-todas-recetas').className = v === 'todas' ? 'btn btn-green py-2 px-4 fs-14' : 'user-btn-outline py-2 px-4 fs-14';
    document.getElementById('btn-mis-recetas').className = v === 'destacadas' ? 'btn btn-green py-2 px-4 fs-14' : 'user-btn-outline py-2 px-4 fs-14';
    buscarRecetas();
}

function guardarObjetivo() {
    const obj = document.getElementById('selectObjetivo').value;
    localStorage.setItem('objetivoUsuario', obj);
    alert('¡Objetivo actualizado!');
    cargarDietaEnNutricion();
}

function cerrarSesion(e) {
    if (e) e.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
}

// Inicializador
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) inicializarLogin();
    else if (document.getElementById('mainTabs')) inicializarDashboard();
});