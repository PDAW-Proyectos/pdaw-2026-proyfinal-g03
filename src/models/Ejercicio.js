const v = require('../utils/validaciones');

class Ejercicio {
  constructor({ nombre, series, repeticiones, descansoSeg = 60 }) {
    this.nombre = v.texto(nombre, 'nombre', { max: 80 });
    this.series = v.numero(series, 'series', { min: 1, max: 20, entero: true });
    this.repeticiones = v.numero(repeticiones, 'repeticiones', { min: 1, max: 200, entero: true });
    this.descansoSeg = v.numero(descansoSeg, 'descansoSeg', { min: 0, max: 600, entero: true });
  }

  toJSON() {
    return {
      nombre: this.nombre,
      series: this.series,
      repeticiones: this.repeticiones,
      descansoSeg: this.descansoSeg,
    };
  }

  static fromJSON(obj) {
    return new Ejercicio(obj);
  }
}

module.exports = Ejercicio;
