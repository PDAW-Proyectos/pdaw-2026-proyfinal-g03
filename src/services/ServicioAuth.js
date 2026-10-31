
const bcrypt = require('bcryptjs');
const { ErrorApp } = require('../utils/errores');

class ServicioAuth {
  constructor({ repoUsuarios }) {
    this.repoUsuarios = repoUsuarios;
  }

  async iniciarSesion(email, password) {
    let usuario;

    try {
      usuario = await this.repoUsuarios.obtenerPorEmail(email);
    } catch (error) {
      // No revelar si el email existe.
      if (error.status === 404) {
        throw new ErrorApp('Email o contraseña incorrectos', 401);
      }

      throw error;
    }

    const coincide = await bcrypt.compare(
      String(password ?? ''),
      usuario.passwordHash
    );

    if (!coincide) {
      throw new ErrorApp('Email o contraseña incorrectos', 401);
    }

    return usuario;
  }
}

module.exports = ServicioAuth;
