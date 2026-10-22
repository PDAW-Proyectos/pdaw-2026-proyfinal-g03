const Usuario = require('./Usuario');
const SeguimientoPlan = require('./SeguimientoPlan');
const v = require('./validaciones');
const { OBJETIVOS } = require('./constantes');

const PERMISOS = new Set(['inscribirseAClase', 'solicitarTurno', 'llevarSeguimiento']);

class Miembro extends Usuario {
  constructor({ peso, altura, edad, objetivo, planMembresiaId = null, ...base }) {
    super(base);
    this.peso = v.numero(peso, 'peso (kg)', { min: 20, max: 400 });
    this.altura = v.numero(altura, 'altura (cm)', { min: 80, max: 250 });
    this.edad = v.numero(edad, 'edad', { min: 14, max: 110, entero: true });
    this.objetivo = v.opcion(objetivo, 'objetivo', OBJETIVOS);
    this.planMembresiaId = v.idOpcional(planMembresiaId, 'planMembresiaId');
  }

  get rol() { return 'miembro'; }
  get permisos() { return PERMISOS; }

  // Las reglas viven en Clase/Turno, el miembro solo delega
  inscribirseAClase(clase) {
    clase.inscribir(this.id);
  }

  solicitarTurno(turno) {
    turno.reservar(this.id);
  }

  // Para devolver el seguimiento. Hay que persistirlo con el repositorio
  iniciarSeguimiento({ planEntrenamientoId = null, planNutricionalId = null }) {
    return new SeguimientoPlan({ miembroId: this.id, planEntrenamientoId, planNutricionalId });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      peso: this.peso,
      altura: this.altura,
      edad: this.edad,
      objetivo: this.objetivo,
      planMembresiaId: this.planMembresiaId,
    };
  }
}

module.exports = Miembro;
