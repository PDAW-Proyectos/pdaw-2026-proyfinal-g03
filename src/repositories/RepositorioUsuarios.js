const Usuario = require('../models/Usuario')
const RepositorioJSON = require('./RepositorioJSON')
const v = require('../utils/validaciones')
const { ErrorNoEncontrado } = require('../utils/errores')

class RepositorioUsuarios extends RepositorioJSON {
  constructor({ rutaArchivo } = {}) {
        super({Entidad: Usuario,rutaArchivo,validarId: v.dni, generarId: null});
    }

  async obtenerPorEmail(email) {
    const emailValidado = v.email(email)
    const usuario = (await this.listar()).find((item) => item.email === emailValidado)
    if (!usuario) throw new ErrorNoEncontrado(`Usuario con email ${emailValidado} no encontrado`)
    return usuario
  }

  async listarPorRol(rol) {
    return (await this.listar()).filter((usuario) => usuario.rol === rol)
  }
}

module.exports = RepositorioUsuarios
