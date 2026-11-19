// tabla de contenidos de la API de seguimientos: verbo, URL y permiso
// todo el recurso es del miembro, con un solo permiso para todas las rutas
//creo que no es util este
const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const exigirMembresiaActiva = require('../middlewares/membresiaActiva');
const crearControladorSeguimientos = require('../controllers/seguimientosController');

module.exports = function rutasSeguimientos({ servicioSeguimientos }) {
  const controlador = crearControladorSeguimientos(servicioSeguimientos);
  const router = Router();

  router.use(exigirPermiso('llevarSeguimiento'));

  router.get('/', controlador.listar);
  router.get('/:id', controlador.obtener);
  router.post('/', controlador.iniciar);
  router.post('/:id/registros', exigirMembresiaActiva, controlador.registrarProgreso);
  router.post('/:id/pausar', exigirMembresiaActiva, controlador.pausar);
  router.post('/:id/reanudar', exigirMembresiaActiva, controlador.reanudar);
  router.post('/:id/finalizar', exigirMembresiaActiva, controlador.finalizar);

  return router;
};
