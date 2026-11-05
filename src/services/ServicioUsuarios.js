const bcrypt = require('bcryptjs');

const Miembro = require('../models/Miembro');
const Instructor = require('../models/Instructor');
const {ErrorConflicto } = require('../utils/errores');
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

        if (usuarios.some(usuario => usuario.id === dniValidado)) {
            throw new ErrorConflicto('Ya existe un usuario con ese DNI');
        }

        if (usuarios.some(usuario => usuario.email === emailValidado)) {
            throw new ErrorConflicto('Ya existe un usuario con ese email');
        }

        const passwordHashNuevo = await bcrypt.hash(dniValidado, 12);// La contraseña inicial es el DNI.

        const usuario = new Entidad({ ...datosEspecificos, dni: dniValidado, nombre, email: emailValidado, passwordHash: passwordHashNuevo });

        await this.repoUsuarios.agregar(usuario);
        return usuario;
    }

    async crearMiembro(datos) {
        return this._crearUsuario(Miembro, datos);
    }

    async crearInstructor(datos) {
        return this._crearUsuario(Instructor, datos);
    }
}

module.exports = ServicioUsuarios;