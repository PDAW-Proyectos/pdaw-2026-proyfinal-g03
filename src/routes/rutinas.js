// tabla de contenidos de la API de rutinas: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorRutinas = require('../controllers/rutinasController');

module.exports = function rutasRutinas({ servicioRutinas }) {
  const controlador = crearControladorRutinas(servicioRutinas);
  const router = Router();

  router.get('/', controlador.listar);
  router.get('/:id', controlador.obtener);
  router.post('/', exigirPermiso('crearRutina'), controlador.crear);
  router.put('/:id', exigirPermiso('crearRutina'), controlador.modificar);
  router.delete('/:id', exigirPermiso('crearRutina'), controlador.eliminar);

  return router;
};