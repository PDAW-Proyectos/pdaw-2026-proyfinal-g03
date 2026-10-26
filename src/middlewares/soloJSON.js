const { ErrorApp } = require('../utils/errores');

// El contrato pide 415 si POST/PUT traen cuerpo que no es JSON
function soloJSON(req, res, next) {
  const tieneCuerpo = Number(req.get('content-length')) > 0 || req.get('transfer-encoding');
  if (['POST', 'PUT'].includes(req.method) && tieneCuerpo && !req.is('application/json')) {
    throw new ErrorApp('El cuerpo debe ser application/json', 415);
  }
  next();
}

module.exports = soloJSON;
