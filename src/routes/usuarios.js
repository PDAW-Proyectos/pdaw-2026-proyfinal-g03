const { Router } = require('express');
const { exigirPermiso } = require('../middlewares/permisos');
const paginar = require('../utils/paginar');

module.exports = function rutasUsuarios({ servicioUsuarios }) {
  const router = Router();

  router.post('/miembros', exigirPermiso('crearUsuario'), async (req, res, next) => {
    try {
      const miembro = await servicioUsuarios.crearMiembro(req.body ?? {});
      res.status(201).json({ usuario: miembro });
    } catch (error) {
      next(error);
    }
  });

  router.post('/instructores', exigirPermiso('crearUsuario'), async (req, res, next) => {
    try {
      const instructor = await servicioUsuarios.crearInstructor(req.body ?? {});
      res.status(201).json({ usuario: instructor });
    } catch (error) {
      next(error);
    }
  });

  router.get('/miembros', exigirPermiso('crearUsuario'), async (req, res, next) => {
    try {
      const miembros = await servicioUsuarios.listarMiembros();
      res.json(paginar(miembros, req.query));
    } catch (error) {
      next(error);
    }
  });

  router.get('/instructores', exigirPermiso('crearUsuario'), async (req, res, next) => {
    try {
      const instructores = await servicioUsuarios.listarInstructores();
      res.json(paginar(instructores, req.query));
    } catch (error) {
      next(error);
    }
  });

  return router;
};
