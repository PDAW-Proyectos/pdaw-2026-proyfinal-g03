const { ErrorValidacion } = require('../utils/errores');

module.exports = function crearAuthController({ servicioAuth }) {
  async function login(req, res, next) {
    try {
        const { email, password } = req.body ?? {};
        if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
            throw new ErrorValidacion('Email y contraseña son obligatorios');
        }

        const usuario = await servicioAuth.iniciarSesion(email, password);
        await new Promise((resolve, reject) => {
            req.session.regenerate((error) => {
            if (error) reject(error);
            else resolve();
            });
        });

        req.session.usuarioId = usuario.id;

        await new Promise((resolve, reject) => {
            req.session.save((error) => {
            if (error) reject(error);
            else resolve();
            });
        });

        res.json({ usuario });
        } catch (error) {
        next(error);
        }
}

  function logout(req, res, next) {
    if (!req.session) {
      return res.status(204).end();
    }

    req.session.destroy((error) => {
      if (error) return next(error);

      res.clearCookie('connect.sid', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });

      res.status(204).end();
    })
  }

  function me(req, res) {
    res.json({ usuario: req.usuario });
  }

  return { login, logout, me };
};
