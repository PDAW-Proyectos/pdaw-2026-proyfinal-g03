// tabla de contenidos de la API de horarios: verbo, URL y permiso

const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const crearControladorHorarios = require('../controllers/horariosController');

module.exports = function rutasHorarios({ servicioHorarios }) {
  const controlador = crearControladorHorarios(servicioHorarios);
  const router = Router();

  router.get('/', controlador.listar);
  router.get('/:id', controlador.obtener);
  router.post('/', exigirPermiso('definirHorarios'), controlador.crear);
  router.put('/:id', exigirPermiso('definirHorarios'), controlador.modificar);
  router.delete('/:id', exigirPermiso('definirHorarios'), controlador.eliminar);

  return router;
};