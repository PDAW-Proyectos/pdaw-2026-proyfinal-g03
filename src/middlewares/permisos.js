const { ErrorProhibido } = require('../utils/errores');

// Pregunta por la accion, no por el rol (usa Usuario.puede)
const exigirPermiso = (accion) => (req, res, next) => {
  if (!req.usuario.puede(accion)) throw new ErrorProhibido('No tenés permiso para esta acción');
  next();
};

module.exports = { exigirPermiso };
