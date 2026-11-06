// punto de entrada: escucha el puerto
require('dotenv').config();

const { puerto } = require('./config');
const container = require('./container');
const crearApp = require('./app');
const { createLogger } = require('./utils/logger');

const env = process.env.NODE_ENV || 'development';
const logger = createLogger({ level: process.env.LOG_LEVEL || 'info' });
const server = crearApp({ ...container, logger, env }).listen(puerto, () => {
  logger.info('servidor iniciado', { port: puerto, env });
  console.log(`API escuchando en http://localhost:${puerto}`);
});

// Último recurso: errores que escaparon a todo manejo.
process.on('unhandledRejection', (reason) => {
  logger.error('promesa rechazada sin manejar: se reinicia el proceso', { reason: String(reason) });
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  logger.error('excepción no capturada: se reinicia el proceso', { stack: err.stack });
  process.exit(1); // el estado puede ser inconsistente: la plataforma vuelve a iniciar el proceso
});
process.on('SIGTERM', () => {
  logger.info('apagado ordenado');
  server.close(() => process.exit(0));
});