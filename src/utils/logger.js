// LOGGER
// Registro estructurado: una línea JSON por evento, con nivel y contexto.
// Los campos sensibles se reemplazan antes de escribir.

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 };
const SENSITIVE = new Set([
  'password',
  'passwordhash',
  'token',
  'authorization',
  'cookie',
  'secret',
]);

// Recorre el objeto y oculta los valores de claves sensibles (a cualquier profundidad).
function redact(value) {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [
        k,
        SENSITIVE.has(k.toLowerCase()) ? '[OCULTO]' : redact(v),
      ]),
    );
  }
  return value;
}

function createLogger({
  level = 'info',
  write = (line) => process.stdout.write(`${line}\n`),
} = {}) {
  const min = LEVELS[level] ?? LEVELS.info;
  const log =
    (lvl) =>
    (msg, context = {}) => {
      if (LEVELS[lvl] < min) return;
      write(
        JSON.stringify({ level: lvl, time: new Date().toISOString(), msg, ...redact(context) }),
      );
    };
  return { debug: log('debug'), info: log('info'), warn: log('warn'), error: log('error') };
}

module.exports = { createLogger, redact };
