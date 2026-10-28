// Reglas de negocio de las clases
// no conoce req, res ni Express: recibe datos simples

const Clase = require('../models/Clase');
const paginar = require('../utils/paginar');
const { ErrorProhibido } = require('../utils/errores');

class ServicioClases {
  constructor({ repoClases }) {
    this.repoClases = repoClases;
  }

  async listar({ instructor, page, limit } = {}) {
    const clases = instructor === undefined
      ? await this.repoClases.listar()
      : await this.repoClases.listarPorInstructor(instructor);
    return paginar(clases, { page, limit });
  }

  obtener(claseId) {
    return this.repoClases.obtenerPorId(claseId);
  }

  async publicar({ instructor, datos }) {
    const clase = instructor.publicarClase(datos); // el modelo valida
    return this.repoClases.agregar(clase);         // asigna el id
  }

  // PUT: reemplaza la clase completa. Se conservan el id, el dueño y los inscriptos.
  async modificar({ claseId, instructor, datos }) {
    const actual = await this.#claseDelInstructor(claseId, instructor);
    const nueva = new Clase({
      ...datos,
      id: actual.id,
      instructorId: actual.instructorId,
      inscriptosIds: actual.inscriptosIds, // si el nuevo cupo es menor, el modelo lo rechaza
    });
    return this.repoClases.actualizar(nueva);
  }

  async eliminar({ claseId, instructor }) {
    const clase = await this.#claseDelInstructor(claseId, instructor);
    await this.repoClases.eliminar(clase.id);
  }

  async inscribir({ claseId, miembro }) {
    const clase = await this.repoClases.obtenerPorId(claseId);
    miembro.inscribirseAClase(clase); // las reglas (cupo, duplicado, clase comenzada) viven en Clase
    return this.repoClases.actualizar(clase);
  }

  async desinscribir({ claseId, miembro }) {
    const clase = await this.repoClases.obtenerPorId(claseId);
    clase.desinscribir(miembro.id);
    return this.repoClases.actualizar(clase);
  }

  // Regla segun rol: solo el instructor dueño modifica o borra su clase
  async #claseDelInstructor(claseId, instructor) {
    const clase = await this.repoClases.obtenerPorId(claseId);
    if (clase.instructorId !== instructor.id) throw new ErrorProhibido('La clase es de otro instructor');
    return clase;
  }
}

module.exports = ServicioClases;