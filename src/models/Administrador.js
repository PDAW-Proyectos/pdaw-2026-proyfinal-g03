const Usuario = require('./Usuario');
const { Turno } = require('./Turno');
const PlanMembresia = require('./PlanMembresia');
const HorarioGimnasio = require('./HorarioGimnasio');

const PERMISOS = new Set(['publicarTurno', 'gestionarMembresias', 'definirHorarios','crearUsuario']);

class Administrador extends Usuario {
  get rol() { return 'administrador'; }
  get permisos() { return PERMISOS; }

  publicarTurno(datos) {
    return Turno.fromJSON(datos);
  }

  gestionarPlanMembresia(datos) {
    return new PlanMembresia(datos);
  }

  definirHorarios(datos) {
    return new HorarioGimnasio(datos);
  }
}

module.exports = Administrador;
