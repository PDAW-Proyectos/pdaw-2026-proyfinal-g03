// crea y conecta las dependencias
// aca se crean los repositorios y los servicios, las rutas no instancian nada

const config = require('./config');

// REPOSITORIOS
const RepositorioClases = require('./repositories/RepositorioClases');
const RepositorioUsuarios = require('./repositories/RepositorioUsuarios');
const RepositorioPlanesEntrenamiento = require('./repositories/RepositorioPlanesEntrenamiento');
const RepositorioPlanesNutricionales = require('./repositories/RepositorioPlanesNutricionales');
const RepositorioRutinas = require('./repositories/RepositorioRutinas');
const RepositorioSeguimientos = require('./repositories/RepositorioSeguimientos');
const RepositorioTurnos = require('./repositories/RepositorioTurnos');
const RepositorioMembresias = require('./repositories/RepositorioMembresias');
const RepositorioHorarios = require('./repositories/RepositorioHorarios');
const RepositorioSeguimientoProgreso = require('./repositories/RepositorioSeguimientoProgreso');
const RepositorioSolicitudesMembresia = require('./repositories/RepositorioSolicitudesMembresia');

// CLIENTE DE SERVICIO EXTERNO GEMINI
const ClienteGemini = require('./services/gemini/ClienteGemini');
const ClienteGeminiMock = require('./services/gemini/ClienteGeminiMock');

// SERVICIOS
const ServicioClases = require('./services/ServicioClases');
const ServicioAuth = require('./services/ServicioAuth');
const ServicioUsuarios = require('./services/ServicioUsuarios');
const ServicioRutinas = require('./services/ServicioRutinas');
const ServicioPlanes = require('./services/ServicioPlanes');
const ServicioSeguimientos = require('./services/ServicioSeguimientos');
const ServicioTurnos = require('./services/ServicioTurnos');
const ServicioMembresias = require('./services/ServicioMembresias');
const ServicioHorarios = require('./services/ServicioHorarios');
const ServicioSeguimientoProgreso = require('./services/servicioSeguimientoProgreso');
const ServicioSolicitudesMembresia = require('./services/ServicioSolicitudesMembresia');

const repos = {
  repoClases: new RepositorioClases(),
  repoUsuarios: new RepositorioUsuarios(),
  repoPlanesEntrenamiento: new RepositorioPlanesEntrenamiento(),
  repoPlanesNutricionales: new RepositorioPlanesNutricionales(),
  repoRutinas: new RepositorioRutinas(),
  repoSeguimientos: new RepositorioSeguimientos(),
  repoTurnos: new RepositorioTurnos(),
  repoMembresias: new RepositorioMembresias(),
  repoSolicitudesMembresia: new RepositorioSolicitudesMembresia(),
  repoHorarios: new RepositorioHorarios(),
  repoRegistros: new RepositorioSeguimientoProgreso(),
};

// para crear el cliente con la API real o con el mock
const usarMock = process.env.USE_GEMINI_MOCK === 'true';
const clienteGemini = usarMock ? new ClienteGeminiMock() : new ClienteGemini(config.gemini);

// Cada servicio recibe solo los repositorios que necesita
const servicios = {
  servicioClases: new ServicioClases({ repoClases: repos.repoClases }),
  servicioAuth: new ServicioAuth({ repoUsuarios: repos.repoUsuarios }),
  servicioUsuarios: new ServicioUsuarios({ repoUsuarios: repos.repoUsuarios }),
  servicioPlanes: new ServicioPlanes({
    // *se lo pasa al servicio
    clienteGemini,
    repoPlanesEntrenamiento: repos.repoPlanesEntrenamiento,
    repoPlanesNutricionales: repos.repoPlanesNutricionales,
  }),
  servicioRutinas: new ServicioRutinas({ repoRutinas: repos.repoRutinas }),
  servicioTurnos: new ServicioTurnos({ repoTurnos: repos.repoTurnos }),
  servicioMembresias: new ServicioMembresias({ repoMembresias: repos.repoMembresias }),
  servicioHorarios: new ServicioHorarios({ repoHorarios: repos.repoHorarios }),
  servicioSeguimientos: new ServicioSeguimientos({
    repoSeguimientos: repos.repoSeguimientos,
    repoPlanesEntrenamiento: repos.repoPlanesEntrenamiento,
    repoPlanesNutricionales: repos.repoPlanesNutricionales,
  }),
  servicioSeguimientoProgreso: new ServicioSeguimientoProgreso({
    repoRegistros: repos.repoRegistros,
    repoUsuarios: repos.repoUsuarios,
  }),
  servicioSolicitudesMembresia: new ServicioSolicitudesMembresia({
    repoSolicitudesMembresia: repos.repoSolicitudesMembresia,
    repoUsuarios: repos.repoUsuarios,
    repoMembresias: repos.repoMembresias,
  }),
};

module.exports = { repos, servicios };
