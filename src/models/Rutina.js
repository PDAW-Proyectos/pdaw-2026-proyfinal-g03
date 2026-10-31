const v = require('../utils/validaciones');
const Ejercicio = require('./Ejercicio');
const { NIVELES } = require('../utils/constantes');

class Rutina {
  constructor({ id = null, nombre, nivel, instructorId, ejercicios = [] }) {
    this.id = id;
    this.nombre = v.texto(nombre, 'nombre', { max: 100 });
    this.nivel = v.opcion(nivel, 'nivel', NIVELES);
    this.instructorId = v.numero(instructorId, 'instructorId', { min: 1, entero: true });
    // Composicion: los ejercicios pertenecen a la rutina
    this.ejercicios = v.lista(ejercicios, 'ejercicios', { max: 50 }).map((e) => (e instanceof Ejercicio ? e : new Ejercicio(e)));
  }

  agregarEjercicio(datos) {
    const ejercicio = datos instanceof Ejercicio ? datos : new Ejercicio(datos);
    this.ejercicios.push(ejercicio);
    return ejercicio;
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      nivel: this.nivel,
      instructorId: this.instructorId,
      ejercicios: this.ejercicios.map((e) => e.toJSON()),
    };
  }

  static fromJSON(obj) {
    return new Rutina(obj);
  }
}

module.exports = Rutina;
