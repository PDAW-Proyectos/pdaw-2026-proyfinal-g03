// punto de entrada: escucha el puerto
require('dotenv').config();

const { puerto } = require('./config');
const container = require('./container');
const crearApp = require('./app');

crearApp(container).listen(puerto, () => {
  console.log(`API escuchando en http://localhost:${puerto}`);
});