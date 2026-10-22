module.exports = {
  ...require('./errores'),
  Usuario: require('../models/Usuario'),
  Miembro: require('../models/Miembro'),
  Instructor: require('../models/Instructor'),
  Administrador: require('../models/Administrador'),
  PlanMembresia: require('../models/PlanMembresia'),
  HorarioGimnasio: require('../models/HorarioGimnasio'),
  Clase: require('../models/Clase'),
  ...require('../models/Turno'), // Turno, TurnoChequeoMedico, TurnoNutricionista
  Rutina: require('../models/Rutina'),
  PlanEntrenamiento: require('../models/PlanEntrenamiento'),
  PlanNutricional: require('../models/PlanNutricional'),
  RegistroProgreso: require('../models/RegistroProgreso'),
  SeguimientoPlan: require('../models/SeguimientoPlan'),
};
