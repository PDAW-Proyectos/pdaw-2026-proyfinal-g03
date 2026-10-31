// Reglas de validacion reutilizables. Cada funcion convierte, valida y devuelve el valor limpio

const { ErrorValidacion } = require('./errores');

function texto(valor, campo, { min = 1, max = 200 } = {}) {
  const limpio = String(valor ?? '').trim();
  if (limpio.length < min || limpio.length > max) {
    throw new ErrorValidacion(`${campo} debe tener entre ${min} y ${max} caracteres`);
  }
  return limpio;
}

function numero(valor, campo, { min = -Infinity, max = Infinity, entero = false } = {}) {
  if (valor === null || valor === undefined || valor === '') {
    throw new ErrorValidacion(`${campo} es obligatorio`);
  }
  const n = Number(valor);
  if (!Number.isFinite(n) || n < min || n > max || (entero && !Number.isInteger(n))) {
    throw new ErrorValidacion(`${campo} debe ser un número${entero ? ' entero' : ''} entre ${min} y ${max}`);
  }
  return n;
}

function idOpcional(valor, campo) {
  if (valor === null || valor === undefined) return null;
  return numero(valor, campo, { min: 1, entero: true });
}

function opcion(valor, campo, permitidas) {
  if (!permitidas.includes(valor)) {
    throw new ErrorValidacion(`${campo} debe ser uno de: ${permitidas.join(', ')}`);
  }
  return valor;
}

function lista(valor, campo, { min = 0, max = 100 } = {}) {
  if (!Array.isArray(valor) || valor.length < min || valor.length > max) {
    throw new ErrorValidacion(`${campo} debe ser una lista de entre ${min} y ${max} elementos`);
  }
  return valor;
}

function email(valor) {
  const limpio = texto(valor, 'email', { max: 120 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) {
    throw new ErrorValidacion('email no tiene un formato válido');
  }
  return limpio;
}

function hora(valor, campo) {
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(String(valor))) {
    throw new ErrorValidacion(`${campo} debe tener formato HH:MM`);
  }
  return String(valor);
}

function fechaISO(valor, campo) {
  const s = String(valor);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(new Date(s).getTime())) {
    throw new ErrorValidacion(`${campo} debe tener formato AAAA-MM-DD`);
  }
  return s;
}

function fechaHora(valor, campo) {
  const d = valor instanceof Date ? valor : new Date(valor);
  if (Number.isNaN(d.getTime())) throw new ErrorValidacion(`${campo} no es una fecha válida`);
  return d;
}

module.exports = { texto, numero, idOpcional, opcion, lista, email, hora, fechaISO, fechaHora };