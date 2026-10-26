const Clase = require('../models/Clase')
const RepositorioJSON = require('./RepositorioJSON')
const v = require('../utils/validaciones')

class RepositorioClases extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
    super({ Entidad: Clase, rutaArchivo })
  }

  async listarPorInstructor(instructorId) {
    const id = v.numero(instructorId, 'instructorId', { min: 1, entero: true })
    return (await this.listar()).filter((clase) => clase.instructorId === id)
  }

  async listarPorFecha(fecha) {
    const fechaValidada = v.fechaISO(fecha, 'fecha')
    return (await this.listar()).filter(
      (clase) => clase.fechaHora.toISOString().slice(0, 10) === fechaValidada,
    )
  }
}

module.exports = RepositorioClases
