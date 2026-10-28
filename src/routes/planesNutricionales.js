const v = require('../utils/validaciones');
const { OBJETIVOS, ORIGENES_PLAN } = require('../utils/constantes');
const { ErrorValidacion } = require('../utils/errores');

class PlanNutricional {
  constructor({
    id = null, miembroId = null, nombre, objetivo, caloriasDiarias, descripcion = '',
    comidas = [], recomendaciones = [], origen = 'gimnasio', idExterno = null, creadoEn = new Date(),
  }) {
    this.id = id;
    this.origen = v.opcion(origen, 'origen', ORIGENES_PLAN);
    this.miembroId = v.idOpcional(miembroId, 'miembroId');
    if (this.origen === 'ia' && this.miembroId === null) {
      throw new ErrorValidacion('Un plan generado debe pertenecer a un miembro');
    }
    this.nombre = v.texto(nombre, 'nombre', { max: 100 });
    this.objetivo = v.opcion(objetivo, 'objetivo', OBJETIVOS);
    // los planes generados por ia tienen un rango más estricto que los cargados por el gimnasio
    const rango = this.origen === 'ia' ? { min: 1200, max: 4500 } : { min: 800, max: 6000 };
    this.caloriasDiarias = v.numero(caloriasDiarias, 'caloriasDiarias', { ...rango, entero: true });
    this.descripcion = v.texto(descripcion, 'descripcion', { min: 0, max: 1000 });
    this.comidas = v.lista(comidas, 'comidas', { min: this.origen === 'ia' ? 1 : 0, max: 8 }).map((c) => ({
      momento: v.texto(c?.momento, 'momento', { max: 60 }),
      ejemplo: v.texto(c?.ejemplo, 'ejemplo', { max: 300 }),
    }));
    this.recomendaciones = v.lista(recomendaciones, 'recomendaciones', { max: 10 })
      .map((r) => v.texto(r, 'recomendación', { max: 300 }));
    this.idExterno = idExterno === null ? null : v.texto(idExterno, 'idExterno', { max: 100 });
    this.creadoEn = v.fechaHora(creadoEn, 'creadoEn');
  }

  toJSON() {
    return {
      id: this.id,
      miembroId: this.miembroId,
      nombre: this.nombre,
      objetivo: this.objetivo,
      caloriasDiarias: this.caloriasDiarias,
      descripcion: this.descripcion,
      comidas: this.comidas.map((c) => ({ ...c })),
      recomendaciones: [...this.recomendaciones],
      origen: this.origen,
      idExterno: this.idExterno,
      creadoEn: this.creadoEn.toISOString(),
    };
  }

  static fromJSON(obj) {
    return new PlanNutricional(obj);
  }
}

module.exports = PlanNutricional;