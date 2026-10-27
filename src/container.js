// crea y conecta las dependencias
// Acá se crea el repositorio y se lo pasa a crearApp({ repoClases })
// así las rutas no instancian nada y después se pueden sumar los demás repos ahí
const RepositorioClases = require('./repositories/RepositorioClases');
const RepositorioUsuarios = require('./repositories/RepositorioUsuarios');

const repoClases = new RepositorioClases();
const repoUsuarios = new RepositorioUsuarios();

module.exports = {
  repoClases,
  repoUsuarios,
};
