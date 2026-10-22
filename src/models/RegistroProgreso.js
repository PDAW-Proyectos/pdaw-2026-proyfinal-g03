const v = require('../utils/validaciones');
const { ErrorValidacion } = require('../utils/errores');

class RegistroProgreso {
  constructor({ fecha = new Date(), pesoActual = null, completado = true, notas = '' }) {
    this.fecha = v.fechaHora(fecha, 'fecha');
    this.pesoActual = pesoActual === null ? null : v.numero(pesoActual, 'pesoActual', { min: 20, max: 400 });
    if (typeof completado !== 'boolean') throw new ErrorValidacion('completado debe ser verdadero o falso');
    this.completado = completado;
    this.notas = v.texto(notas, 'notas', { min: 0, max: 500 });
  }

  toJSON() {
    return {
      fecha: this.fecha.toISOString(),
      pesoActual: this.pesoActual,
      completado: this.completado,
      notas: this.notas,
    };
  }

  static fromJSON(obj) {
    return new RegistroProgreso(obj);
  }
}

module.exports = RegistroProgreso;
