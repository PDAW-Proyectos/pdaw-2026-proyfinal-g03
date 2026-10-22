const v = require('../utils/validaciones');
const { ErrorValidacion, ErrorConflicto, ErrorProhibido } = require('../utils/errores');

// Clase abstracta: cada tipo de turno define su propio tipo y duracion (polimorfismo, sin `switch` por tipo)
class Turno {
  #miembroId; // null = disponible

  constructor({ id = null, fecha, hora, miembroId = null }) {
    if (new.target === Turno) throw new TypeError('Turno es abstracta');
    this.id = id;
    this.fecha = v.fechaISO(fecha, 'fecha');
    this.hora = v.hora(hora, 'hora');
    this.#miembroId = v.idOpcional(miembroId, 'miembroId');
  }

  get tipo() { throw new Error('Sin implementar'); }
  get duracionMin() { throw new Error('Sin implementar'); }

  get miembroId() {
    return this.#miembroId;
  }

  // Atributo derivado (/)
  get disponible() {
    return this.#miembroId === null;
  }

  reservar(miembroId) {
    const id = v.numero(miembroId, 'miembroId', { min: 1, entero: true });
    if (!this.disponible) throw new ErrorConflicto('El turno ya fue reservado');
    this.#miembroId = id;
  }

  // Solo quien reserva puede cancelar
  cancelar(miembroId) {
    if (this.disponible) throw new ErrorConflicto('El turno no está reservado');
    if (Number(miembroId) !== this.#miembroId) throw new ErrorProhibido('Solo quien reservó puede cancelar el turno');
    this.#miembroId = null;
  }

  toJSON() {
    return {
      id: this.id,
      tipo: this.tipo,
      fecha: this.fecha,
      hora: this.hora,
      duracionMin: this.duracionMin,
      disponible: this.disponible,
      miembroId: this.#miembroId,
    };
  }

  // Fabrica: `tipo` decide la subclase (sirve para crear y para reconstruir desde el JSON)
  static fromJSON(data) {
    const Subclase = TIPOS.get(data?.tipo);
    if (!Subclase) throw new ErrorValidacion(`Tipo de turno desconocido: ${data?.tipo}`);
    return new Subclase(data);
  }
}

class TurnoChequeoMedico extends Turno {
  get tipo() { return 'chequeo_medico'; }
  get duracionMin() { return 30; }
}

class TurnoNutricionista extends Turno {
  get tipo() { return 'nutricionista'; }
  get duracionMin() { return 45; }
}

const TIPOS = new Map([
  ['chequeo_medico', TurnoChequeoMedico],
  ['nutricionista', TurnoNutricionista],
]);

module.exports = { Turno, TurnoChequeoMedico, TurnoNutricionista };
