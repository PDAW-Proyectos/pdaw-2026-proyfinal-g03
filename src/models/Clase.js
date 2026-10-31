const v = require('../utils/validaciones');
const { ErrorValidacion, ErrorConflicto, ErrorNoEncontrado } = require('../utils/errores');

class Clase {
  #inscriptos;

  constructor({ id = null, titulo, descripcion = '', instructorId, fechaHora, duracionMin, cupo, inscriptosIds = [] }) {
    this.id = id;
    this.titulo = v.texto(titulo, 'titulo', { max: 100 });
    this.descripcion = v.texto(descripcion, 'descripcion', { min: 0, max: 500 });
    this.instructorId = v.numero(instructorId, 'instructorId', { min: 1, entero: true });
    this.fechaHora = v.fechaHora(fechaHora, 'fechaHora');
    this.duracionMin = v.numero(duracionMin, 'duracionMin', { min: 15, max: 240, entero: true });
    this.cupo = v.numero(cupo, 'cupo', { min: 1, max: 200, entero: true });

    if (!Array.isArray(inscriptosIds)) throw new ErrorValidacion('inscriptosIds debe ser un arreglo');
    this.#inscriptos = new Set(inscriptosIds.map(Number));
    if (this.#inscriptos.size > this.cupo) throw new ErrorValidacion('Hay más inscriptos que cupo');
  }

  get inscriptosIds() {
    return [...this.#inscriptos];
  }

  // getters
  get cuposDisponibles() {
    return this.cupo - this.#inscriptos.size;
  }

  estaInscripto(miembroId) {
    return this.#inscriptos.has(Number(miembroId));
  }

  inscribir(miembroId) {
    const id = v.numero(miembroId, 'miembroId', { min: 1, entero: true });
    if (this.fechaHora < new Date()) throw new ErrorConflicto('La clase ya comenzó');
    if (this.estaInscripto(id)) throw new ErrorConflicto('El miembro ya está inscripto en la clase');
    if (this.cuposDisponibles === 0) throw new ErrorConflicto('La clase no tiene cupos disponibles');
    this.#inscriptos.add(id);
  }

  desinscribir(miembroId) {
    if (!this.#inscriptos.delete(Number(miembroId))) {
      throw new ErrorNoEncontrado('El miembro no está inscripto en la clase');
    }
  }

  toJSON() {
    return {
      id: this.id,
      titulo: this.titulo,
      descripcion: this.descripcion,
      instructorId: this.instructorId,
      fechaHora: this.fechaHora.toISOString(),
      duracionMin: this.duracionMin,
      cupo: this.cupo,
      cuposDisponibles: this.cuposDisponibles,
      inscriptosIds: this.inscriptosIds,
    };
  }

  static fromJSON(data) {
    return new Clase(data);
  }
}

module.exports = Clase;
