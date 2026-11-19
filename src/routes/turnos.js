// tabla de contenidos de la API de turnos: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const exigirMembresiaActiva = require('../middlewares/membresiaActiva');
const crearControladorTurnos = require('../controllers/turnosController');

module.exports = function rutasTurnos({ servicioTurnos }) {
  const controlador = crearControladorTurnos(servicioTurnos);
  const router = Router();

  router.get('/', controlador.listar);
  router.get('/mios', exigirPermiso('solicitarTurno'), exigirMembresiaActiva, controlador.listarMios); // antes de /:id, si no "mios" se toma como id
  router.get('/:id', controlador.obtener);
  router.post('/', exigirPermiso('publicarTurno'), controlador.publicar);
  router.post('/:id/reservar', exigirPermiso('solicitarTurno'), exigirMembresiaActiva, controlador.reservar);
  router.post('/:id/cancelar', exigirPermiso('solicitarTurno'), exigirMembresiaActiva, controlador.cancelar);
  router.delete('/:id', exigirPermiso('publicarTurno'), controlador.eliminar);

  return router;
};
