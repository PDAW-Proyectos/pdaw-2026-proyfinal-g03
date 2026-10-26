// punto de entrada: escucha el puerto
const { puerto } = require('./config');
const container = require('./container');
const crearApp = require('./app');

crearApp(container).listen(puerto, () => {
  console.log(`API escuchando en http://localhost:${puerto}`);
});
