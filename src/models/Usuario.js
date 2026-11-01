const v = require('../utils/validaciones');
const { ErrorValidacion } = require('../utils/errores');

class Usuario {
  constructor({ id = null, dni, nombre, email, passwordHash }) {
    if (new.target === Usuario) {
      throw new TypeError('Usuario es abstracta');
    }

    this.id = id ?? v.dni(dni);

    this.nombre = v.texto(nombre, 'nombre', { max: 80 });
    this.email = v.email(email);
    this.passwordHash = v.texto(passwordHash, 'passwordHash');
  }

  // metodos abstractos (getters): cada subclase responde por si misma
  get rol() { throw new Error('Sin implementar'); }
  get permisos() { throw new Error('Sin implementar'); }

  // Acciones que puede hacer la clase Usuario - A REVISAR
  // Los permisos los define cada subclase en su propio archivo, puede() solo los consulta
  // Esto evita andar comparando roles en el router:
  // polimorfismo en lugar de "if (usuario.rol === ...)": se pregunta por la acción, no por el tipo
  puede(accion) {
    return this.permisos.has(accion);
  }

  mostrarResumen() {
    return `${this.nombre} (${this.rol})`;
  }

  // Contrato de persistencia A REVISAR
  // JSON.stringify(usuario) y res.json(usuario) llaman a toJSON(): por defecto no muestra el passwordHash
  toJSON() {
    return { id: this.id, rol: this.rol, nombre: this.nombre, email: this.email };
  }
  // pasa la version completa para el repositorio (incluye password)
  toStorage() {
    return { ...this.toJSON(), passwordHash: this.passwordHash };
  }

  // Fabrica: los datos persistidos son objetos planos, cada rol decide qué subclase reconstruir
  static fromJSON(data) {
    const roles = new Map([
      ['miembro', require('./Miembro')],            // require diferido: evita la dependencia circular Usuario <-> subclases
      ['instructor', require('./Instructor')],
      ['administrador', require('./Administrador')],
    ]);
    const Subclase = roles.get(data?.rol);
    if (!Subclase) throw new ErrorValidacion(`Rol desconocido: ${data?.rol}`);
    return new Subclase(data);
  }
}

module.exports = Usuario;
