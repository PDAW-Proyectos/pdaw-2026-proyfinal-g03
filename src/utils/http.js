// ayudas chicas para la capa HTTP - controladores

// Solo deja pasar los campos permitidos: el resto del cuerpo se ignora
const filtrar = (body = {}, campos) =>
  Object.fromEntries(campos.filter((c) => c in body).map((c) => [c, body[c]]));

// Arreglo de versiones de Express
// Express 4 NO manda al manejador de errores las promesas rechazadas de un handler async, express 5 sí
// con esto funciona igual en las dos versiones: cualquier error va a next(error)
const conNext = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// aplica conNext a todos los handlers de un controlador
const conNextTodos = (handlers) =>
  Object.fromEntries(Object.entries(handlers).map(([nombre, fn]) => [nombre, conNext(fn)]));

module.exports = { filtrar, conNext, conNextTodos };