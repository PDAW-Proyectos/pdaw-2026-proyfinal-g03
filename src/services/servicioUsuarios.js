
const bcrypt = require('bcryptjs');

const Miembro = require('../models/Miembro');
const Instructor = require('../models/Instructor');
const {ErrorValidacion,ErrorNoEncontrado,ErrorConflicto} = require('../utils/errores');

class ServicioUsuarios {
  constructor({ repoUsuarios }) {
    this.repoUsuarios = repoUsuarios;
  }

    async crearMiembro(datos) {
        const { nombre, email, password, ...datosMiembro } = datos;

        if (typeof password !== 'string' || password.length < 8) {
            throw new ErrorValidacion('La contraseña debe tener al menos 8 caracteres');
        }

        try {
            await this.repoUsuarios.obtenerPorEmail(email);
        } catch (error) {
            if (!(error instanceof ErrorNoEncontrado)) {
                throw error;   
            }

            const passwordHash = await bcrypt.hash(password, 12);
            const miembro = new Miembro({...datosMiembro,nombre,email,passwordHash});
            
            await this.repoUsuarios.agregar(miembro);
            return miembro;
        }
        throw new ErrorConflicto('Ya existe un usuario con ese email');
    }
  
    async crearInstructor(datos) {
        const { nombre, email, password, ...datosInstructor } = datos;

        if (typeof password !== 'string' || password.length < 8) {
            throw new ErrorValidacion('La contraseña debe tener al menos 8 caracteres');
        }

        try {
            await this.repoUsuarios.obtenerPorEmail(email);
        } catch (error) {
            if (!(error instanceof ErrorNoEncontrado)) {
                throw error;
            }
            const passwordHash = await bcrypt.hash(password, 12);
            const instructor = new Instructor({...datosInstructor,nombre,email, passwordHash});

            await this.repoUsuarios.agregar(instructor);
            return instructor;
        }
        throw new ErrorConflicto('Ya existe un usuario con ese email');
    }

}

module.exports = ServicioUsuarios;
