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

  // Modificar datos personales
  router.put('/perfil', exigirPermiso('modificarPerfil'), async (req, res, next) => {
    try {
      const usuario = await servicioUsuarios.modificarDatosPersonales(
        req.usuario.id,
        req.body ?? {}
      );

      res.json({ usuario });
    } catch (error) {
      next(error);
    }
  });

  // Modificar datos físicos del miembro
  router.put('/perfil/miembro', exigirPermiso('modificarPerfil'), async (req, res, next) => {
    try {
      const usuario = await servicioUsuarios.modificarDatosMiembro(
        req.usuario.id,
        req.body ?? {}
      );

      res.json({ usuario });
    } catch (error) {
      next(error);
    }
  });

  // Modificar especialidad del instructor
  router.put('/perfil/instructor', exigirPermiso('modificarPerfil'), async (req, res, next) => {
    try {
      const usuario = await servicioUsuarios.modificarEspecialidad(
        req.usuario.id,
        req.body?.especialidad
      );

      res.json({ usuario });
    } catch (error) {
      next(error);
    }
  });

  // Cambiar contraseña
  router.put('/perfil/password', exigirPermiso('modificarPerfil'), async (req, res, next) => {
    try {
      await servicioUsuarios.cambiarPassword(
        req.usuario.id,
        req.body?.passwordActual,
        req.body?.passwordNueva
      );

      res.json({ mensaje: 'Contraseña modificada correctamente' });
    } catch (error) {
      next(error);
    }
  });

  // Eliminar cuenta propia
  router.delete(
    '/perfil',
    exigirPermiso('eliminarCuenta'),
    async (req, res, next) => {
      try {
        await servicioUsuarios.eliminarCuenta(req.usuario.id);

        res.json({
          mensaje: 'Cuenta eliminada correctamente'
        });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
};
