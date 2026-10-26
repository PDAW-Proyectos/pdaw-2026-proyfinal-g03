// arma Express: middlewares y rutas

const express = require('express');
const soloJSON = require('./middlewares/soloJSON');
const autenticacionDemo = require('./middlewares/autenticacionDemo');
const manejadorErrores = require('./middlewares/manejadorErrores');
const rutasClases = require('./routes/clases');

function crearApp({ repoClases }) {
  const app = express();

  app.use(soloJSON);
  app.use(express.json());

  // Todo lo que está debajo de esta linea exige usuario (demo)
  app.use('/api', autenticacionDemo);
  app.use('/api/clases', rutasClases({ repoClases }));

  app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use(manejadorErrores); // siempre al final

  return app;
}

module.exports = crearApp;