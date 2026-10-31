// tabla de contenidos de la API de planes nutricionales: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorPlanes = require('../controllers/planesController');

module.exports = function rutasPlanesNutricionales({ servicioPlanes }) {
  const controlador = crearControladorPlanes(servicioPlanes);
  const router = Router();

  router.post('/generar', exigirPermiso('generarPlan'), controlador.generarNutricional);
  router.get('/:id', controlador.obtenerNutricional);

  return router;
};