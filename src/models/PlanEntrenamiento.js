const v = require('../utils/validaciones');
const { OBJETIVOS, NIVELES, ORIGENES_PLAN } = require('../utils/constantes');

class PlanEntrenamiento {
  constructor({
    id = null, nombre, objetivo, nivel, duracionSemanas,
    rutinaIds = [], origen = 'gimnasio', idExterno = null,
  }) {
    this.id = id;
    this.nombre = v.texto(nombre, 'nombre', { max: 100 });
    this.objetivo = v.opcion(objetivo, 'objetivo', OBJETIVOS);
    this.nivel = v.opcion(nivel, 'nivel', NIVELES);
    this.duracionSemanas = v.numero(duracionSemanas, 'duracionSemanas', { min: 1, max: 104, entero: true });
    // Agregación: las rutinas existen por su cuenta, el plan solo las referencia
    this.rutinaIds = [...new Set(rutinaIds.map((r) => v.numero(r, 'rutinaId', { min: 1, entero: true })))];
    this.origen = v.opcion(origen, 'origen', ORIGENES_PLAN); // 'externo' = viene de la API
    this.idExterno = idExterno === null ? null : v.texto(idExterno, 'idExterno', { max: 100 });
  }

  agregarRutina(rutinaId) {
    const id = v.numero(rutinaId, 'rutinaId', { min: 1, entero: true });
    if (!this.rutinaIds.includes(id)) this.rutinaIds.push(id);
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      objetivo: this.objetivo,
      nivel: this.nivel,
      duracionSemanas: this.duracionSemanas,
      rutinaIds: [...this.rutinaIds],
      origen: this.origen,
      idExterno: this.idExterno,
    };
  }

  static fromJSON(obj) {
    return new PlanEntrenamiento(obj);
  }
}

module.exports = PlanEntrenamiento;
