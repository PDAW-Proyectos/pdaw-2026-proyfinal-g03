const v = require('../utils/validaciones');

class PlanMembresia {
  constructor({ id = null, nombre, precioMensual, descripcion = '', activo = true }) {
    this.id = id;
    this.nombre = v.texto(nombre, 'nombre', { max: 60 });
    this.precioMensual = v.numero(precioMensual, 'precioMensual', { min: 0 });
    this.descripcion = v.texto(descripcion, 'descripcion', { min: 0, max: 300 });
    this.activo = Boolean(activo);
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      precioMensual: this.precioMensual,
      descripcion: this.descripcion,
      activo: this.activo,
    };
  }

  static fromJSON(obj) {
    return new PlanMembresia(obj);
  }
}

module.exports = PlanMembresia;
