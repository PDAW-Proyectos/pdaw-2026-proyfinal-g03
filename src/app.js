// arma Express: middlewares y rutas
// aca NO se crean servicios: llegan ya armados desde container.js
// cada recurso suma solo dos líneas: su require y su app.use

const path = require('path');
const express = require('express');
const session = require('express-session');
const soloJSON = require('./middlewares/soloJSON');
const { secretoSesion } = require('./config');
const autenticacion = require('./middlewares/autenticacion');
const requestContext = require('./middlewares/requestId');
const { notFound, manejadorErrores } = require('./middlewares/manejadorErrores');
const { createLogger } = require('./utils/logger');
const rutasAuth = require('./routes/auth');
const rutasClases = require('./routes/clases');
const rutasUsuarios = require('./routes/usuarios');
const rutasRutinas = require('./routes/rutinas');
const rutasPlanesEntrenamiento = require('./routes/planesEntrenamiento');
const rutasPlanesNutricionales = require('./routes/planesNutricionales');
const rutasSeguimientos = require('./routes/seguimientos');
const rutasTurnos = require('./routes/turnos');
const rutasMembresias = require('./routes/membresias');
const rutasHorarios = require('./routes/horarios');
const rutasCatalogoPublico = require('./routes/catalogoPublico');

function crearApp({
  repos,
  servicios,
  logger = createLogger(),
  env = process.env.NODE_ENV || 'development',
}) {
  const app = express();

  if (!secretoSesion) {
    throw new Error('Falta configurar SESSION_SECRET en el archivo .env');
  }

  app.use(requestContext(logger));

  // Para servir el frontend con sus archivos estáticos (HTML, CSS, JS) desde la carpeta public
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(soloJSON);
  app.use(express.json({ limit: '100kb' })); // límite de tamaño del cuerpo, clase 13

  // Todo lo que está debajo de esta línea exige usuario autenticado
  app.use(
    session({
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
    }),
  );

  // Rutas públicas de autenticación
  app.use(
    '/api/auth',
    rutasAuth({ servicioAuth: servicios.servicioAuth, repoUsuarios: repos.repoUsuarios }),
  );
  app.use('/api/publico', rutasCatalogoPublico(servicios));

  // Desde aquí, las rutas de la API requieren una sesión válida.
  app.use('/api', autenticacion({ repoUsuarios: repos.repoUsuarios }));
  app.use('/api/usuarios', rutasUsuarios({ servicioUsuarios: servicios.servicioUsuarios }));
  app.use('/api/clases', rutasClases(servicios));
  app.use('/api/rutinas', rutasRutinas(servicios));
  app.use('/api/planes-entrenamiento', rutasPlanesEntrenamiento(servicios));
  app.use('/api/planes-nutricionales', rutasPlanesNutricionales(servicios));
  app.use('/api/seguimientos', rutasSeguimientos(servicios));
  app.use('/api/turnos', rutasTurnos(servicios));
  app.use('/api/membresias', rutasMembresias(servicios));
  app.use('/api/horarios', rutasHorarios(servicios));

  app.use(notFound);
  app.use(manejadorErrores(logger, { exposeStack: env === 'development' }));

  return app;
}

module.exports = crearApp;
