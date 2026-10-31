// tabla de contenidos de la API de membresías: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorMembresias = require('../controllers/membresiasController');

module.exports = function rutasMembresias({ servicioMembresias }) {
  const controlador = crearControladorMembresias(servicioMembresias);
  const router = Router();

  router.get('/', controlador.listar);
  router.get('/:id', controlador.obtener);
  router.post('/', exigirPermiso('gestionarMembresias'), controlador.crear);
  router.put('/:id', exigirPermiso('gestionarMembresias'), controlador.modificar);
  router.delete('/:id', exigirPermiso('gestionarMembresias'), controlador.eliminar);

  return router;
};