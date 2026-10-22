// Jerarquia de errores del dominio (segun clase 05): cada error lleva el codigo HTTP que le corresponde

class ErrorApp extends Error {
  constructor(mensaje, status = 500) {
    super(mensaje);
    this.name = this.constructor.name;
    this.status = status;
  }
}
class ErrorValidacion extends ErrorApp {
  constructor(mensaje) { super(mensaje, 400); }
}
class ErrorProhibido extends ErrorApp {
  constructor(mensaje) { super(mensaje, 403); }
}
class ErrorNoEncontrado extends ErrorApp {
  constructor(mensaje) { super(mensaje, 404); }
}
class ErrorConflicto extends ErrorApp {
  constructor(mensaje) { super(mensaje, 409); }
}

module.exports = { ErrorApp, ErrorValidacion, ErrorProhibido, ErrorNoEncontrado, ErrorConflicto };
