const { ErrorApp } = require('../utils/errores');

function autenticacion({ repoUsuarios }) {
  return async function (req, res, next) {
    try {
      const usuarioId = req.session?.usuarioId;

      if (!usuarioId) {
        throw new ErrorApp('Debés iniciar sesión', 401);
      }

      req.usuario = await repoUsuarios.obtenerPorId(usuarioId);

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = autenticacion;
