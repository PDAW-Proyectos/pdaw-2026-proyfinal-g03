// crea y conecta las dependencias
// aca se crean los repositorios y los servicios, las rutas no instancian nada 

// REPOSITORIOS
const RepositorioClases = require('./repositories/RepositorioClases');
// const RepositorioUsuarios = require('./repositories/RepositorioUsuarios');
// const RepositorioRutinas = require('./repositories/RepositorioRutinas');
// const RepositorioSeguimientos = require('./repositories/RepositorioSeguimientos');
// const RepositorioTurnos = require('./repositories/RepositorioTurnos');
// const RepositorioMembresias = require('./repositories/RepositorioMembresias');
// const RepositorioHorarios = require('./repositories/RepositorioHorarios');
// (faltan por crear: RepositorioPlanesEntrenamiento y RepositorioPlanesNutricionales)
 
// SERVICIOS
const ServicioClases = require('./services/ServicioClases');
// const ServicioAuth = require('./services/ServicioAuth');
// const ServicioRutinas = require('./services/ServicioRutinas');
// const ServicioPlanes = require('./services/ServicioPlanes');
// const ServicioSeguimientos = require('./services/ServicioSeguimientos');
// const ServicioTurnos = require('./services/ServicioTurnos');
// const ServicioMembresias = require('./services/ServicioMembresias');
// const ServicioHorarios = require('./services/ServicioHorarios');
 
const repos = {
  repoClases: new RepositorioClases(),
  // repoUsuarios: new RepositorioUsuarios(),
  // repoRutinas: new RepositorioRutinas(),
  // repoSeguimientos: new RepositorioSeguimientos(),
  // repoTurnos: new RepositorioTurnos(),
  // repoMembresias: new RepositorioMembresias(),
  // repoHorarios: new RepositorioHorarios(),
};
 
// Cada servicio recibe solo los repositorios que necesita
const servicios = {
  servicioClases: new ServicioClases({ repoClases: repos.repoClases }),
  // servicioAuth: new ServicioAuth({ repoUsuarios: repos.repoUsuarios }),
  // servicioRutinas: new ServicioRutinas({ repoRutinas: repos.repoRutinas }),
  // servicioTurnos: new ServicioTurnos({ repoTurnos: repos.repoTurnos }),
  // servicioMembresias: new ServicioMembresias({ repoMembresias: repos.repoMembresias }),
  // servicioHorarios: new ServicioHorarios({ repoHorarios: repos.repoHorarios }),
  // servicioSeguimientos: new ServicioSeguimientos({ repoSeguimientos: repos.repoSeguimientos /* + repos de planes */ }),
  // servicioPlanes: new ServicioPlanes({ /* repos de planes + cliente de Gemini */ }),
};
 
module.exports = { repos, servicios };
