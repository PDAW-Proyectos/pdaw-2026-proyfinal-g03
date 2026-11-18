// tabla de contenidos de la API de planes nutricionales: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const exigirMembresiaActiva = require('../middlewares/membresiaActiva');
const crearControladorPlanes = require('../controllers/planesController');

module.exports = function rutasPlanesNutricionales({ servicioPlanes }) {
  const controlador = crearControladorPlanes(servicioPlanes);
  const router = Router();

  router.post('/generar', exigirPermiso('generarPlan'), exigirMembresiaActiva, controlador.generarNutricional);
  router.get('/mios', exigirPermiso('generarPlan'), exigirMembresiaActiva, controlador.listarNutricionales);
  router.get('/:id', controlador.obtenerNutricional);

  return router;
};
