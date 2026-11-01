const { Router } = require('express');
const autenticacion = require('../middlewares/autenticacion');
const crearAuthController = require('../controllers/authController');

module.exports = function rutasAuth({ servicioAuth, repoUsuarios }) {
  const router = Router();

  const controller = crearAuthController({ servicioAuth });

  // POST /api/auth/login
  //Verifica las credenciales y crea una sesión nueva.
  router.post('/login', controller.login);

  // POST /api/auth/logout
  // Destruye la sesión actual.
  router.post('/logout', controller.logout);

  // GET /api/auth/me
  // Devuelve los datos públicos del usuario autenticado.
  router.get('/me',autenticacion({ repoUsuarios }),controller.me);

  return router;
};
