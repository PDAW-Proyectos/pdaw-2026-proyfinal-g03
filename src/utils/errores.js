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

// Errores de servicio externo Gemini (el problema no es de quien hizo la solicitud)
class ErrorLimiteExcedido extends ErrorApp {
  constructor(mensaje) { super(mensaje, 429); }
}
class ErrorServicioExterno extends ErrorApp {
  constructor(mensaje) { super(mensaje, 502); }
}
class ErrorTiempoAgotado extends ErrorApp {
  constructor(mensaje) { super(mensaje, 504); }
}
 
module.exports = {
  ErrorApp, ErrorValidacion, ErrorProhibido, ErrorNoEncontrado, ErrorConflicto,
  ErrorLimiteExcedido, ErrorServicioExterno, ErrorTiempoAgotado,
};

