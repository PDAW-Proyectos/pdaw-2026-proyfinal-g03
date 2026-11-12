// este archivo define las rutas de la API REST para seguimiento de progreso
// Tabla de contenidos de la API de seguimiento de progreso: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorSeguimientoProgreso = require('../controllers/seguimientoProgresoController');

module.exports = function rutasSeguimientoProgreso({ servicioSeguimientoProgreso }) {
    const controlador = crearControladorSeguimientoProgreso(servicioSeguimientoProgreso);
    const router = Router();

    router.get('/', controlador.listar);
    router.post('/', exigirPermiso('registrarPeso'), controlador.publicar);

    return router;
};
