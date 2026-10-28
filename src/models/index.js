module.exports = {
  ...require('../utils/errores'),
  Usuario: require('./Usuario'),
  Miembro: require('./Miembro'),
  Instructor: require('./Instructor'),
  Administrador: require('./Administrador'),
  PlanMembresia: require('./PlanMembresia'),
  HorarioGimnasio: require('./HorarioGimnasio'),
  Clase: require('./Clase'),
  ...require('./Turno'), // Turno, TurnoChequeoMedico, TurnoNutricionista
  Rutina: require('./Rutina'),
  PlanEntrenamiento: require('./PlanEntrenamiento'),
  PlanNutricional: require('./PlanNutricional'),
  RegistroProgreso: require('./RegistroProgreso'),
  SeguimientoPlan: require('./SeguimientoPlan'),
};
