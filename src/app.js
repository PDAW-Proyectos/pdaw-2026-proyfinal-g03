// arma Express: middlewares y rutas

const express = require('express');
const session = require('express-session');
const soloJSON = require('./middlewares/soloJSON');
const { secretoSesion } = require('./config');
const autenticacion = require('./middlewares/autenticacion');
const manejadorErrores = require('./middlewares/manejadorErrores');
const rutasAuth = require('./routes/auth');
const rutasClases = require('./routes/clases');
const rutasUsuarios = require('./routes/usuarios');

function crearApp({ repoClases, repoUsuarios}) {
  if (!secretoSesion) {
    throw new Error('Falta configurar SESSION_SECRET en el archivo .env');
  }

  const app = express();

  app.use(soloJSON);
  app.use(express.json());

  // Todo lo que está debajo de esta linea exige usuario autenticado
  app.use(session({
    name: 'connect.sid',
    secret: secretoSesion,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    },
  }));
 
  app.use('/api/auth', rutasAuth({ repoUsuarios })); // Estas rutas se registran antes de exigir autenticación global.

  // Desde aquí, las rutas de la API requieren una sesión válida.
  app.use('/api', autenticacion({ repoUsuarios }));
  app.use('/api/usuarios', rutasUsuarios({ repoUsuarios }));
  app.use('/api/clases', rutasClases({ repoClases }));

  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use(manejadorErrores); // siempre al final

  return app;
}

module.exports = crearApp;