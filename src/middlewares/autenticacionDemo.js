// SOLO PARA LA DEMO: simula al usuario autenticado con dos cabeceras (reemplazar con lo de la clase 8)
// pero el resto del código no cambia: sigue leyendo req.usuario

const Instructor = require('../models/Instructor');
const Miembro = require('../models/Miembro');
const Administrador = require('../models/Administrador');
const { ErrorApp } = require('../utils/errores');

const base = (id) => ({ id, nombre: `Demo ${id}`, email: `demo${id}@gym.com`, passwordHash: 'x' });

function autenticacionDemo(req, res, next) {
  const id = Number(req.get('x-demo-id'));
  const rol = req.get('x-demo-rol');
  if (!id || !rol) throw new ErrorApp('No autenticado: enviá x-demo-id y x-demo-rol', 401);

  if (rol === 'instructor') {
    req.usuario = new Instructor({ ...base(id), especialidad: 'Demo' });
  } else if (rol === 'miembro') {
    req.usuario = new Miembro({ ...base(id), peso: 70, altura: 170, edad: 30, objetivo: 'mantener' });
  } else if (rol === 'administrador') {
    req.usuario = new Administrador(base(id));
  } else {
    throw new ErrorApp('Rol desconocido', 401);
  }
  next();
}

module.exports = autenticacionDemo;
