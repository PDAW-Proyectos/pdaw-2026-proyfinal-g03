const Usuario = require('./Usuario');
const SeguimientoPlan = require('./SeguimientoPlan');
const v = require('../utils/validaciones');
const { OBJETIVOS } = require('../utils/constantes');

const PERMISOS = new Set([
  'inscribirseAClase',
  'solicitarTurno',
  'llevarSeguimiento',
  'generarPlan',
  'registrarPeso'
]);

class Miembro extends Usuario {
  constructor({ peso, pesoMeta, altura, edad, objetivo, planMembresiaId = null, ...base }) {
    super(base);
    this.peso = v.numero(peso, 'peso (kg)', { min: 20, max: 400 });
    this.pesoMeta = this._validarPesoMeta(pesoMeta);
    this.altura = v.numero(altura, 'altura (cm)', { min: 80, max: 250 });
    this.edad = v.numero(edad, 'edad', { min: 14, max: 110, entero: true });
    this.objetivo = v.opcion(objetivo, 'objetivo', OBJETIVOS);
    this.planMembresiaId = v.idOpcional(planMembresiaId, 'planMembresiaId');
  }

  _validarPesoMeta(pesoMeta) {
    const objetivosConPesoMeta = ['perder_peso', 'ganar_musculo'];

    if (!objetivosConPesoMeta.includes(this.objetivo)) {
      return null;
    }

    return v.numero(pesoMeta, 'peso meta (kg)', { min: 20, max: 400 });
  }

  get rol() {
    return 'miembro';
  }
  get permisos() {
    return PERMISOS;
  }

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
      pesoMeta: this.pesoMeta,
      altura: this.altura,
      edad: this.edad,
      objetivo: this.objetivo,
      planMembresiaId: this.planMembresiaId,
    };
  }
}

module.exports = Miembro;
