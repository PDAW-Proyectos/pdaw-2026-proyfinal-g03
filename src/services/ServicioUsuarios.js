const bcrypt = require('bcryptjs');

const Miembro = require('../models/Miembro');
const Instructor = require('../models/Instructor');
const { ErrorConflicto, ErrorValidacion } = require('../utils/errores');
const v = require('../utils/validaciones');

class ServicioUsuarios {
  constructor({ repoUsuarios }) {
    this.repoUsuarios = repoUsuarios;
  }

  async _crearUsuario(Entidad, datos) {
    const { dni, nombre, email, rol, passwordHash, ...datosEspecificos } = datos;

    const dniValidado = v.dni(dni);
    const emailValidado = v.email(email);

    const usuarios = await this.repoUsuarios.listar();

    if (usuarios.some((usuario) => usuario.id === dniValidado)) {
      throw new ErrorConflicto('Ya existe un usuario con ese DNI');
    }

    if (usuarios.some((usuario) => usuario.email === emailValidado)) {
      throw new ErrorConflicto('Ya existe un usuario con ese email');
    }

    const passwordHashNuevo = await bcrypt.hash(dniValidado, 12); // La contraseña inicial es el DNI.

    const usuario = new Entidad({
      ...datosEspecificos,
      dni: dniValidado,
      nombre,
      email: emailValidado,
      passwordHash: passwordHashNuevo,
    });

    await this.repoUsuarios.agregar(usuario);
    return usuario;
  }

  async crearMiembro(datos) {
    return this._crearUsuario(Miembro, datos);
  }

  async crearInstructor(datos) {
    return this._crearUsuario(Instructor, datos);
  }

  async listarMiembros() {
    return this.repoUsuarios.listarPorRol('miembro');
  }

  async listarInstructores() {
    return this.repoUsuarios.listarPorRol('instructor');
  }

  async modificarDatosPersonales(dni, datos) {
    const usuario = await this.repoUsuarios.obtenerPorId(dni);

    const permitidos = ['nombre', 'email', 'telefono'];
    const cambios = {};

    for (const campo of permitidos) {
      if (Object.hasOwn(datos, campo)) {
        cambios[campo] = datos[campo];
      }
    }

    if (Object.keys(cambios).length === 0) {
      throw new ErrorValidacion('No se recibieron datos para modificar');
    }

    if (cambios.email !== undefined) {
      const emailValidado = v.email(cambios.email);
      const usuarios = await this.repoUsuarios.listar();

      if (usuarios.some(u =>
        u.id !== usuario.id && u.email === emailValidado
      )) {
        throw new ErrorConflicto('Ya existe un usuario con ese email');
      }

      cambios.email = emailValidado;
    }

    const actualizado = new usuario.constructor({
      ...usuario,
      ...cambios
    });

    return this.repoUsuarios.actualizar(actualizado);
  }

  async modificarDatosMiembro(dni, datos) {
    const miembro = await this.repoUsuarios.obtenerPorId(dni);

    if (!(miembro instanceof Miembro)) {
      throw new ErrorValidacion('El usuario no es un miembro');
    }

    const permitidos = ['pesoMeta', 'altura', 'edad', 'objetivo'];
    const cambios = {};

    for (const campo of permitidos) {
      if (Object.hasOwn(datos, campo)) {
        cambios[campo] = datos[campo];
      }
    }

    if (Object.keys(cambios).length === 0) {
      throw new ErrorValidacion('No se recibieron datos para modificar');
    }

    const actualizado = new Miembro({
      ...miembro,
      ...cambios
    });

    return this.repoUsuarios.actualizar(actualizado);
  }

  async modificarEspecialidad(dni, especialidad) {
    const instructor = await this.repoUsuarios.obtenerPorId(dni);

    if (!(instructor instanceof Instructor)) {
      throw new ErrorValidacion('El usuario no es un instructor');
    }

    const actualizado = new Instructor({
      ...instructor,
      especialidad
    });

    return this.repoUsuarios.actualizar(actualizado);
  }

  async cambiarPassword(dni, passwordActual, passwordNueva) {
    const usuario = await this.repoUsuarios.obtenerPorId(dni);

    const coincide = await bcrypt.compare(
      passwordActual,
      usuario.passwordHash
    );

    if (!coincide) {
      throw new ErrorValidacion('La contraseña actual es incorrecta');
    }

    const nuevaValidada = v.texto(
      passwordNueva,
      'contraseña nueva',
      { min: 8, max: 72 }
    );

    const passwordHash = await bcrypt.hash(nuevaValidada, 12);

    const actualizado = new usuario.constructor({
      ...usuario,
      passwordHash
    });

    return this.repoUsuarios.actualizar(actualizado);
  }

  async eliminarCuenta(dni) {
    const usuario = await this.repoUsuarios.obtenerPorId(dni);

    if (
      !(usuario instanceof Miembro) &&
      !(usuario instanceof Instructor)
    ) {
      throw new ErrorValidacion(
        'Solo los miembros e instructores pueden eliminar su cuenta'
      );
    }

    await this.repoUsuarios.eliminar(usuario.id);

    return usuario;
  }

}

module.exports = ServicioUsuarios;
