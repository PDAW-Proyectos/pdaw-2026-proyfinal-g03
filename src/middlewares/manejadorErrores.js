// Un solo lugar traduce errores del dominio a respuestas HTTP (cada error ya trae su status)
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
