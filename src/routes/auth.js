
const { Router } = require('express');
const ServicioAuth = require('../services/ServicioAuth');
const autenticacion = require('../middlewares/autenticacion');
const { ErrorValidacion } = require('../utils/errores');

module.exports = function rutasAuth({ repoUsuarios }) {
  const router = Router();
  const servicioAuth = new ServicioAuth({ repoUsuarios });

  // POST /api/auth/login
  //Verifica las credenciales y crea una sesión nueva.
  router.post('/login', async (req, res, next) => {
    try {
      const { email, password } = req.body ?? {};
      if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
        throw new ErrorValidacion('Email y contraseña son obligatorios');
      }

      const usuario = await servicioAuth.iniciarSesion(email, password);
      await new Promise((resolve, reject) => {
        req.session.regenerate((error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      req.session.usuarioId = usuario.id;

      await new Promise((resolve, reject) => {
        req.session.save((error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      res.json({ usuario });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/auth/logout
  // Destruye la sesión actual.
  router.post('/logout', (req, res, next) => {
    if (!req.session) {
      return res.status(204).end();
    }

    req.session.destroy((error) => {
      if (error) return next(error);

      res.clearCookie('connect.sid', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      res.status(204).end();
    });
  });

  // GET /api/auth/me
  // Devuelve los datos públicos del usuario autenticado.
  router.get('/me', autenticacion({ repoUsuarios }), (req, res) => {
    res.json({ usuario: req.usuario });
  });

  return router;
};
