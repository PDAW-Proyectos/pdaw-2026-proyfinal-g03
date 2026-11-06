// Un solo lugar traduce errores del dominio a respuestas HTTP (cada error ya trae su status)

/*
const { ErrorValidacion } = require('../utils/errores');

function manejadorErrores(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON mal formado' });
  }
  if (err instanceof ErrorValidacion && err.campo) {
    return res.status(400).json({
      error: err.message,
      errores: [{ campo: err.campo, mensaje: err.message }],
    });
  }
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

module.exports = manejadorErrores;
*/
const { ErrorApp, ErrorNoEncontrado, ErrorValidacion } = require('../utils/errores');

const notFound = (req, res, next) =>
  next(new ErrorNoEncontrado(`La ruta ${req.method} ${req.path}`));

// Errores de librerías traducidos a errores propios.
function normalize(err) {
  if (err instanceof ErrorApp) return err;
  if (err.type === 'entity.parse.failed')
    return new ErrorValidacion('El cuerpo no es JSON válido', 'body');
  return null; // error de programación: no se conoce
}

// Manejo CENTRALIZADO: Express lo reconoce por sus cuatro parámetros.
function manejadorErrores(logger, { exposeStack = false } = {}) {
  return (err, req, res, next) => {
    if (res.headersSent) return next(err);
    const known = normalize(err);
    const status = known?.status ?? 500;
    if (status >= 500)
      logger.error(err.message, { requestId: req.id, stack: err.stack, cause: err.cause?.message });
    else logger.warn(known.message, { requestId: req.id, status });

    res
      .status(status)
      .type('application/problem+json')
      .json({
        type: 'about:blank',
        title: known?.title ?? 'Error interno',
        status,
        detail:
          known?.message ??
          'Ocurrió un error inesperado. Si persiste, informe el código de solicitud.',
        instance: req.originalUrl,
        requestId: req.id,
        ...(known?.details && { errores: known.details }),
        ...(exposeStack && !known && { stack: err.stack }), // solo en desarrollo
      });
  };
}

module.exports = { notFound, manejadorErrores };
