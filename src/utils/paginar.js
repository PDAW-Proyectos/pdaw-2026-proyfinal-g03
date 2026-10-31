const v = require('./validaciones');

// Devuelve { data, page, limit, total } como pide el contrato
function paginar(items, { page = 1, limit = 10 } = {}) {
  const p = v.numero(page, 'page', { min: 1, entero: true });
  const l = v.numero(limit, 'limit', { min: 1, max: 50, entero: true });
  const desde = (p - 1) * l;
  return { data: items.slice(desde, desde + l), page: p, limit: l, total: items.length };
}

module.exports = paginar;
