// Asigna un ID único a cada solicitud y loguea su inicio/fin

const { randomUUID } = require('node:crypto');

// Identificador por solicitud + registro de acceso con duración.
function requestContext(logger) {
  return (req, res, next) => {
    req.id = req.get('X-Request-Id') || randomUUID();
    res.set('X-Request-Id', req.id);
    const start = Date.now();
    res.on('finish', () =>
      logger.info('solicitud', {
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        ms: Date.now() - start,
      }),
    );
    next();
  };
}

module.exports = requestContext;
