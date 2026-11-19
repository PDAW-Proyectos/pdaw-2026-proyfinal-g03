// tabla de contenidos de la API de planes de entrenamiento: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const exigirMembresiaActiva = require('../middlewares/membresiaActiva');
const crearControladorPlanes = require('../controllers/planesController');

module.exports = function rutasPlanesEntrenamiento({ servicioPlanes }) {
  const controlador = crearControladorPlanes(servicioPlanes);
  const router = Router();

  router.post('/generar', exigirPermiso('generarPlan'), exigirMembresiaActiva, controlador.generarEntrenamiento);
  router.get('/mios', exigirPermiso('generarPlan'), exigirMembresiaActiva, controlador.listarEntrenamientos);
  router.get('/:id', controlador.obtenerEntrenamiento);
  router.put('/:id', exigirPermiso('generarPlan'), exigirMembresiaActiva, controlador.modificarEntrenamiento);

  return router;
};
