const { EventEmitter } = require('node:events');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const v = require('../utils/validaciones');
const { ErrorValidacion, ErrorConflicto, ErrorNoEncontrado } = require('../utils/errores');

class RepositorioJSON extends EventEmitter {
  #Entidad;
  #cargado = false;
  #cola = Promise.resolve();

  constructor({ Entidad, rutaArchivo } = {}) {
    super();
    if (typeof Entidad !== 'function' || typeof Entidad.fromJSON !== 'function') {
      throw new TypeError('Entidad debe ser una clase con el método estático fromJSON');
    }

    this.#Entidad = Entidad;
    this.rutaArchivo = rutaArchivo || path.join(__dirname, '..', '..', 'data', `${Entidad.name}.json`);
    this.items = [];
    this.ultimoId = 0;
  }

  #enCola(operacion) {
    this.#cola = this.#cola.then(operacion, operacion);
    return this.#cola;
  }

  async #asegurarCargado() {
    if (!this.#cargado) await this.#cargar();
  }

  async #cargar() {
    let contenido;
    try {
      contenido = await fs.readFile(this.rutaArchivo, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      this.items = [];
      this.ultimoId = 0;
      this.#cargado = true;
      this.emit('cargado', []);
      return [];
    }

    let datos;
    try {
      datos = JSON.parse(contenido);
    } catch (error) {
      throw new Error(`No se pudo interpretar el archivo del repositorio "${this.rutaArchivo}": ${error.message}`, { cause: error });
    }

    if (!datos || !Array.isArray(datos.items)) {
      throw new ErrorValidacion(`El archivo del repositorio "${this.rutaArchivo}" debe contener un arreglo "items"`);
    }

    const items = datos.items.map((item) => this.#Entidad.fromJSON(item));
    const ids = items.map((item) => v.numero(item.id, 'id', { min: 1, entero: true }));
    if (new Set(ids).size !== ids.length) {
      throw new ErrorValidacion(`El archivo del repositorio "${this.rutaArchivo}" contiene IDs duplicados`);
    }

    const ultimoId = datos.ultimoId === undefined
      ? Math.max(0, ...ids)
      : v.numero(datos.ultimoId, 'ultimoId', { min: 0, entero: true });
    if (ids.some((id) => id > ultimoId)) {
      throw new ErrorValidacion(`ultimoId no puede ser menor que un ID almacenado en "${this.rutaArchivo}"`);
    }

    this.items = items;
    this.ultimoId = ultimoId;
    this.#cargado = true;
    this.emit('cargado', [...items]);
    return [...items];
  }

  async #escribir(items, ultimoId) {
    const directorio = path.dirname(this.rutaArchivo);
    await fs.mkdir(directorio, { recursive: true });
    const temporal = `${this.rutaArchivo}.${process.pid}.${randomUUID()}.tmp`;
    const contenido = JSON.stringify({
      ultimoId,
      items: items.map((item) => (
        typeof item.toStorage === 'function' ? item.toStorage() : item.toJSON()
      )),
    }, null, 2);

    await fs.writeFile(temporal, contenido, 'utf8');
    await fs.rename(temporal, this.rutaArchivo);
  }

  #validarEntidad(entidad) {
    if (!(entidad instanceof this.#Entidad)
      || typeof entidad.toJSON !== 'function'
      || !Object.hasOwn(entidad, 'id')) {
      throw new ErrorValidacion(`La entidad debe ser una instancia de ${this.#Entidad.name} con id y toJSON()`);
    }
  }

  cargar() {
    return this.#enCola(() => this.#cargar());
  }

  listar() {
    return this.#enCola(async () => {
      await this.#asegurarCargado();
      return [...this.items];
    });
  }

  obtenerPorId(id) {
    return this.#enCola(async () => {
      await this.#asegurarCargado();
      const idValidado = v.numero(id, 'id', { min: 1, entero: true });
      const entidad = this.items.find((item) => item.id === idValidado);
      if (!entidad) throw new ErrorNoEncontrado(`${this.#Entidad.name} con ID ${idValidado} no encontrado`);
      return entidad;
    });
  }

  agregar(entidad) {
    return this.#enCola(async () => {
      await this.#asegurarCargado();
      this.#validarEntidad(entidad);

      const idAnterior = entidad.id;
      const id = idAnterior === null || idAnterior === undefined
        ? this.ultimoId + 1
        : v.numero(idAnterior, 'id', { min: 1, entero: true });
      if (this.items.some((item) => item.id === id)) {
        throw new ErrorConflicto(`${this.#Entidad.name} con ID ${id} ya existe`);
      }

      entidad.id = id;
      const items = [...this.items, entidad];
      const ultimoId = Math.max(this.ultimoId, id);
      try {
        await this.#escribir(items, ultimoId);
      } catch (error) {
        entidad.id = idAnterior;
        throw error;
      }

      this.items = items;
      this.ultimoId = ultimoId;
      this.emit('agregado', entidad);
      return entidad;
    });
  }

  actualizar(entidad) {
    return this.#enCola(async () => {
      await this.#asegurarCargado();
      this.#validarEntidad(entidad);
      const id = v.numero(entidad.id, 'id', { min: 1, entero: true });
      const indice = this.items.findIndex((item) => item.id === id);
      if (indice === -1) throw new ErrorNoEncontrado(`${this.#Entidad.name} con ID ${id} no encontrado`);

      const items = [...this.items];
      items[indice] = entidad;
      await this.#escribir(items, this.ultimoId);
      this.items = items;
      this.emit('actualizado', entidad);
      return entidad;
    });
  }

  eliminar(id) {
    return this.#enCola(async () => {
      await this.#asegurarCargado();
      const idValidado = v.numero(id, 'id', { min: 1, entero: true });
      const entidad = this.items.find((item) => item.id === idValidado);
      if (!entidad) throw new ErrorNoEncontrado(`${this.#Entidad.name} con ID ${idValidado} no encontrado`);

      const items = this.items.filter((item) => item.id !== idValidado);
      await this.#escribir(items, this.ultimoId);
      this.items = items;
      this.emit('eliminado', entidad);
      return entidad;
    });
  }

  guardar() {
    return this.#enCola(async () => {
      await this.#asegurarCargado();
      await this.#escribir(this.items, this.ultimoId);
      this.emit('guardado', [...this.items]);
      return [...this.items];
    });
  }
}

module.exports = RepositorioJSON;
