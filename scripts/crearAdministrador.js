require('dotenv').config();

const bcrypt = require('bcryptjs');
const Administrador = require('../src/models/Administrador');
const RepositorioUsuarios = require('../src/repositories/RepositorioUsuarios');

async function crearAdministrador() {
  const nombre = process.env.ADMIN_NOMBRE;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const dni = process.env.ADMIN_DNI;

  if (!nombre || !email || !password || !dni) {
    throw new Error('Configurá ADMIN_NOMBRE, ADMIN_EMAIL, ADMIN_PASSWORD y ADMIN_DNI en .env');
  }

  if (password.length < 8) {
    throw new Error('La contraseña inicial debe tener al menos 8 caracteres');
  }

  const repoUsuarios = new RepositorioUsuarios();

  const administradores = await repoUsuarios.listarPorRol('administrador');

  if (administradores.length > 0) {
    console.log('Ya existe un administrador. No se creó otra cuenta.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const administrador = new Administrador({
    dni,
    nombre,
    email,
    passwordHash,
  });

  await repoUsuarios.agregar(administrador);
}

crearAdministrador().catch((error) => {
  console.error('No se pudo crear el administrador:', error.message);
  process.exitCode = 1;
});
