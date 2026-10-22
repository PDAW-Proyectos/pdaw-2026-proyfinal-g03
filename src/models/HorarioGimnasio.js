const v = require('../utils/validaciones');
const { ErrorValidacion } = require('../utils/errores');
const { DIAS } = require('../utils/constantes');

class HorarioGimnasio {
  constructor({ id = null, dia, apertura, cierre }) {
    this.id = id;
    this.dia = v.opcion(dia, 'dia', DIAS);
    this.apertura = v.hora(apertura, 'apertura');
    this.cierre = v.hora(cierre, 'cierre');
    // "HH:MM" se puede comparar como texto
    if (this.apertura >= this.cierre) {
      throw new ErrorValidacion('La apertura debe ser anterior al cierre');
    }
  }

  toJSON() {
    return { id: this.id, dia: this.dia, apertura: this.apertura, cierre: this.cierre };
  }

  static fromJSON(obj) {
    return new HorarioGimnasio(obj);
  }
}

module.exports = HorarioGimnasio;
