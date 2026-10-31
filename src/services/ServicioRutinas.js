// Reglas de negocio de las rutinas

const Rutina = require('../models/Rutina');
const paginar = require('../utils/paginar');
const { ErrorProhibido } = require('../utils/errores');

class ServicioRutinas {
  constructor({ repoRutinas }) {
    this.repoRutinas = repoRutinas;
  }

  async listar({ page, limit } = {}) {
    return paginar(await this.repoRutinas.listar(), { page, limit });
  }

  obtener(rutinaId) {
    return this.repoRutinas.obtenerPorId(rutinaId);
  }

  async crear({ instructor, datos }) {
    const rutina = instructor.crearRutina(datos); // el modelo valida y asocia al instructor
    return this.repoRutinas.agregar(rutina);      // asigna el id
  }

  // PUT: reemplaza la rutina completa, se conservan el id y el dueño
  async modificar({ rutinaId, instructor, datos }) {
    const actual = await this.#rutinaDelInstructor(rutinaId, instructor);
    const nueva = new Rutina({ ...datos, id: actual.id, instructorId: actual.instructorId });
    return this.repoRutinas.actualizar(nueva);
  }

  async eliminar({ rutinaId, instructor }) {
    const rutina = await this.#rutinaDelInstructor(rutinaId, instructor);
    await this.repoRutinas.eliminar(rutina.id);
  }

  // Regla según el rol: solo el instructor dueño modifica o borra su rutina
  async #rutinaDelInstructor(rutinaId, instructor) {
    const rutina = await this.repoRutinas.obtenerPorId(rutinaId);
    if (rutina.instructorId !== instructor.id) throw new ErrorProhibido('La rutina es de otro instructor');
    return rutina;
  }
}

module.exports = ServicioRutinas;
