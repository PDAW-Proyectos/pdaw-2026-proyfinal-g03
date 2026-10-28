// arma Express: middlewares y rutas
// aca NO se crean servicios: llegan ya armados desde container.js
// cada recurso suma solo dos líneas: su require y su app.use

const express = require('express');
const soloJSON = require('./middlewares/soloJSON');
const autenticacionDemo = require('./middlewares/autenticacionDemo');
const manejadorErrores = require('./middlewares/manejadorErrores');

const rutasClases = require('./routes/clases');
// const rutasAuth = require('./routes/auth');
// const rutasRutinas = require('./routes/rutinas');
// const rutasPlanesEntrenamiento = require('./routes/planesEntrenamiento');
// const rutasPlanesNutricionales = require('./routes/planesNutricionales');
// const rutasSeguimientos = require('./routes/seguimientos');
// const rutasTurnos = require('./routes/turnos');
// const rutasMembresias = require('./routes/membresias');
// const rutasHorarios = require('./routes/horarios');

function crearApp({ servicios }) {
  const app = express();

  app.use(soloJSON);
  app.use(express.json());
  // Acá va a ir el express-session cuando se implemente el inicio de sesión (clase 08)

  // Rutas publicas: no exigen usuario, por eso van ANTES del middleware de autenticación
  // app.use('/api/auth', rutasAuth(servicios));

  // Todo lo que está debajo de esta línea exige usuario (demo; después, sesion)
  app.use('/api', autenticacionDemo);

  app.use('/api/clases', rutasClases(servicios));
  // app.use('/api/rutinas', rutasRutinas(servicios));
  // app.use('/api/planes-entrenamiento', rutasPlanesEntrenamiento(servicios));
  // app.use('/api/planes-nutricionales', rutasPlanesNutricionales(servicios));
  // app.use('/api/seguimientos', rutasSeguimientos(servicios));
  // app.use('/api/turnos', rutasTurnos(servicios));
  // app.use('/api/membresias', rutasMembresias(servicios));
  // app.use('/api/horarios', rutasHorarios(servicios));

  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use(manejadorErrores); // el manejador siempre al final

  return app;
}

module.exports = crearApp;