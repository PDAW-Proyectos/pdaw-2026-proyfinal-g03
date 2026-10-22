const Usuario = require('./Usuario');
const Clase = require('./Clase');
const Rutina = require('./Rutina');
const v = require('./validaciones');

const PERMISOS = new Set(['publicarClase', 'crearRutina']);

class Instructor extends Usuario {
  constructor({ especialidad, ...base }) {
    super(base);
    this.especialidad = v.texto(especialidad, 'especialidad', { max: 80 });
  }

  get rol() { return 'instructor'; }
  get permisos() { return PERMISOS; }

  mostrarResumen() {
    return `${super.mostrarResumen()} - ${this.especialidad}`;
  }

  // Para crear la entidad ya asociada al instructor, falta persistirla con su repositorio
  publicarClase(datos) {
    return new Clase({ ...datos, instructorId: this.id });
  }

  crearRutina(datos) {
    return new Rutina({ ...datos, instructorId: this.id });
  }

  toJSON() {
    return { ...super.toJSON(), especialidad: this.especialidad };
  }
}

module.exports = Instructor;
