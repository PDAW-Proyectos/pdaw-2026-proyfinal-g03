const Usuario = require('./Usuario');
const SeguimientoPlan = require('./SeguimientoPlan');
const v = require('../utils/validaciones');
const { OBJETIVOS } = require('../utils/constantes');
const { ErrorValidacion } = require('../utils/errores');

const PERMISOS = new Set([
  'inscribirseAClase',
  'solicitarTurno',
  'llevarSeguimiento',
  'generarPlan',
  'registrarPeso',
  'modificarPerfil'
]);

class Miembro extends Usuario {
  constructor({ peso, pesoMeta, altura, edad, objetivo, planMembresiaId = null, ...base }) {
    super(base);
    this.peso = v.numero(peso, 'peso (kg)', { min: 20, max: 400 });
    this.objetivo = v.opcion(objetivo, 'objetivo', OBJETIVOS);
    this.pesoMeta = this._validarPesoMeta(pesoMeta);
    this.altura = v.numero(altura, 'altura (cm)', { min: 80, max: 250 });
    this.edad = v.numero(edad, 'edad', { min: 14, max: 110, entero: true });
    this.planMembresiaId = v.idOpcional(planMembresiaId, 'planMembresiaId');
  }

  _validarPesoMeta(pesoMeta) {
    const objetivosConPesoMeta = ['perder_peso', 'ganar_musculo'];

    if (!objetivosConPesoMeta.includes(this.objetivo)) {
      return null;
    }

    const pesoValidado = v.numero(
      pesoMeta,
      'peso meta (kg)',
      { min: 20, max: 400 }
    );

    if (this.objetivo === 'perder_peso' && pesoValidado >= this.peso) {
      throw new ErrorValidacion(
        'Para perder peso, el peso meta debe ser menor que el peso actual',
        'pesoMeta'
      );
    }

    if (this.objetivo === 'ganar_musculo' && pesoValidado <= this.peso) {
      throw new ErrorValidacion(
        'Para ganar músculo, el peso meta debe ser mayor que el peso actual',
        'pesoMeta'
      );
    }

    return pesoValidado;
  }

  get rol() {
    return 'miembro';
  }
  get permisos() {
    return PERMISOS;
  }

  inscribirseAClase(clase) {
    clase.inscribir(this.id);
  }

  solicitarTurno(turno) {
    turno.reservar(this.id);
  }

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