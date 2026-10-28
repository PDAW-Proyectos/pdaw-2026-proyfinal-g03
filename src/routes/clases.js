// este archivo define las rutas de la API REST para clases
// Tabla de contenidos de la API de clases: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorClases = require('../controllers/clasesController');

module.exports = function rutasClases({ servicioClases }) {
  const controlador = crearControladorClases(servicioClases);
  const router = Router();

  router.get('/', controlador.listar);
  router.get('/:id', controlador.obtener);
  router.post('/', exigirPermiso('publicarClase'), controlador.publicar);
  router.put('/:id', exigirPermiso('publicarClase'), controlador.modificar);
  router.delete('/:id', exigirPermiso('publicarClase'), controlador.eliminar);
  router.post('/:id/inscribir', exigirPermiso('inscribirseAClase'), controlador.inscribir);
  router.post('/:id/desinscribir', exigirPermiso('inscribirseAClase'), controlador.desinscribir);

  return router;
};
