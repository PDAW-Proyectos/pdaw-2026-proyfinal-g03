// tabla de contenidos de la API de seguimientos: verbo, URL y permiso
// todo el recurso es del miembro, con un solo permiso para todas las rutas

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorSeguimientos = require('../controllers/seguimientosController');

module.exports = function rutasSeguimientos({ servicioSeguimientos }) {
  const controlador = crearControladorSeguimientos(servicioSeguimientos);
  const router = Router();

  router.use(exigirPermiso('llevarSeguimiento'));

  router.get('/', controlador.listar);
  router.get('/:id', controlador.obtener);
  router.post('/', controlador.iniciar);
  router.post('/:id/registros', controlador.registrarProgreso);
  router.post('/:id/pausar', controlador.pausar);
  router.post('/:id/reanudar', controlador.reanudar);
  router.post('/:id/finalizar', controlador.finalizar);

  return router;
};