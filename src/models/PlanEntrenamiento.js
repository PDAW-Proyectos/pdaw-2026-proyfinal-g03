const v = require('../utils/validaciones');
const Ejercicio = require('./Ejercicio');
const { OBJETIVOS, NIVELES, ORIGENES_PLAN } = require('../utils/constantes');
const { ErrorValidacion } = require('../utils/errores');

class PlanEntrenamiento {
  constructor({
    id = null, miembroId = null, nombre, descripcion = '', objetivo, nivel, duracionSemanas,
    dias = [], recomendaciones = [], origen = 'gimnasio', idExterno = null, creadoEn = new Date(),
  }) {
    this.id = id;
    this.origen = v.opcion(origen, 'origen', ORIGENES_PLAN);
    // el plan generado por IA pertenece siempre a un miembro (son datos personales)
    this.miembroId = v.idOpcional(miembroId, 'miembroId');
    if (this.origen === 'ia' && this.miembroId === null) {
      throw new ErrorValidacion('Un plan generado debe pertenecer a un miembro');
    }
    this.nombre = v.texto(nombre, 'nombre', { max: 100 });
    this.descripcion = v.texto(descripcion, 'descripcion', { min: 0, max: 1000 });
    this.objetivo = v.opcion(objetivo, 'objetivo', OBJETIVOS);
    this.nivel = v.opcion(nivel, 'nivel', NIVELES);
    this.duracionSemanas = v.numero(duracionSemanas, 'duracionSemanas', { min: 1, max: 104, entero: true });
    // composición: cada día tiene sus ejercicios, se reutiliza la clase Ejercicio
    this.dias = v.lista(dias, 'dias', { min: this.origen === 'ia' ? 1 : 0, max: 7 }).map((d) => ({
      dia: v.texto(d?.dia, 'dia', { max: 40 }),
      enfoque: v.texto(d?.enfoque, 'enfoque', { max: 100 }),
      ejercicios: v.lista(d?.ejercicios, 'ejercicios', { min: 1, max: 12 })
        .map((e) => (e instanceof Ejercicio ? e : new Ejercicio(e))),
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
      descripcion: this.descripcion,
      objetivo: this.objetivo,
      nivel: this.nivel,
      duracionSemanas: this.duracionSemanas,
      dias: this.dias.map((d) => ({
        dia: d.dia,
        enfoque: d.enfoque,
        ejercicios: d.ejercicios.map((e) => e.toJSON()),
      })),
      recomendaciones: [...this.recomendaciones],
      origen: this.origen,
      idExterno: this.idExterno,
      creadoEn: this.creadoEn.toISOString(),
    };
  }

  static fromJSON(obj) {
    return new PlanEntrenamiento(obj);
  }
}

module.exports = PlanEntrenamiento;