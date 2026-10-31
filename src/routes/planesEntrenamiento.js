// tabla de contenidos de la API de planes de entrenamiento: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorPlanes = require('../controllers/planesController');

module.exports = function rutasPlanesEntrenamiento({ servicioPlanes }) {
  const controlador = crearControladorPlanes(servicioPlanes);
  const router = Router();

  router.post('/generar', exigirPermiso('generarPlan'), controlador.generarEntrenamiento);
  router.get('/:id', controlador.obtenerEntrenamiento);

  return router;
};