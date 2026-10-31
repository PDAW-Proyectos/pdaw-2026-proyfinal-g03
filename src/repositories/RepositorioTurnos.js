const { Turno } = require('../models/Turno')
const RepositorioJSON = require('./RepositorioJSON')
const v = require('../utils/validaciones')

class RepositorioTurnos extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
    super({ Entidad: Turno, rutaArchivo })
  }

  async listarDisponibles(tipo) {
    const turnos = (await this.listar()).filter((turno) => turno.disponible)
    return tipo === undefined ? turnos : turnos.filter((turno) => turno.tipo === tipo)
  }

  async listarPorMiembro(miembroId) {
    const id = v.numero(miembroId, 'miembroId', { min: 1, entero: true })
    return (await this.listar()).filter((turno) => turno.miembroId === id)
  }
}

module.exports = RepositorioTurnos
