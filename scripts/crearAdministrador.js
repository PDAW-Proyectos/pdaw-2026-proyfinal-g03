
require('dotenv').config();

const bcrypt = require('bcryptjs');
const Administrador = require('../src/models/Administrador');
const RepositorioUsuarios = require('../src/repositories/RepositorioUsuarios');

console.log('Se está ejecutando crearAdministrador.js');

async function crearAdministrador() {
    console.log('Entró en crearAdministrador');
  const nombre = process.env.ADMIN_NOMBRE;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!nombre || !email || !password) {
    throw new Error(
      'Configurá ADMIN_NOMBRE, ADMIN_EMAIL y ADMIN_PASSWORD en .env'
    );
  }

  if (password.length < 12) {
    throw new Error('La contraseña inicial debe tener al menos 12 caracteres');
  }

  const repoUsuarios = new RepositorioUsuarios();

  const administradores = await repoUsuarios.listarPorRol('administrador');

  if (administradores.length > 0) {
    console.log('Ya existe un administrador. No se creó otra cuenta.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const administrador = new Administrador({
    nombre,
    email,
    passwordHash,
  });

  await repoUsuarios.agregar(administrador);

  console.log('Administrador inicial creado correctamente.');
}

crearAdministrador().catch((error) => {
  console.error('No se pudo crear el administrador:', error.message);
  process.exitCode = 1;
});
