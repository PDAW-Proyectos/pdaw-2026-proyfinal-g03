// crea y conecta las dependencias
// Acá se crea el repositorio y se lo pasa a crearApp({ repoClases })
// así las rutas no instancian nada y después se pueden sumar los demás repos ahí

const RepositorioClases = require('./repositories/RepositorioClases');

const repoClases = new RepositorioClases();

module.exports = { repoClases };
