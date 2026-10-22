const v = require('../utils/validaciones');
const { OBJETIVOS, ORIGENES_PLAN } = require('../utils/constantes');

class PlanNutricional {
  constructor({ id = null, nombre, objetivo, caloriasDiarias, descripcion = '', origen = 'gimnasio', idExterno = null }) {
    this.id = id;
    this.nombre = v.texto(nombre, 'nombre', { max: 100 });
    this.objetivo = v.opcion(objetivo, 'objetivo', OBJETIVOS);
    this.caloriasDiarias = v.numero(caloriasDiarias, 'caloriasDiarias', { min: 800, max: 6000, entero: true });
    this.descripcion = v.texto(descripcion, 'descripcion', { min: 0, max: 1000 });
    this.origen = v.opcion(origen, 'origen', ORIGENES_PLAN);
    this.idExterno = idExterno === null ? null : v.texto(idExterno, 'idExterno', { max: 100 });
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      objetivo: this.objetivo,
      caloriasDiarias: this.caloriasDiarias,
      descripcion: this.descripcion,
      origen: this.origen,
      idExterno: this.idExterno,
    };
  }

  static fromJSON(obj) {
    return new PlanNutricional(obj);
  }
}

module.exports = PlanNutricional;
