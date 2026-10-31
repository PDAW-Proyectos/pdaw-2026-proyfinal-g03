// Reglas de negocio de los planes generados con IA (no conoce req, res ni Express)

const PlanEntrenamiento = require('../models/PlanEntrenamiento');
const PlanNutricional = require('../models/PlanNutricional');
const v = require('../utils/validaciones');
const { NIVELES } = require('../utils/constantes');
const { ErrorServicioExterno, ErrorProhibido } = require('../utils/errores');
const { INSTRUCCION_SISTEMA, pedidoEntrenamiento, pedidoNutricion } = require('./gemini/prompts');
const { ESQUEMA_ENTRENAMIENTO, ESQUEMA_NUTRICION } = require('./gemini/esquemas');

const DURACION_PLAN_SEMANAS = 4;

class ServicioPlanes {
  constructor({ clienteGemini, repoPlanesEntrenamiento, repoPlanesNutricionales, logger = console }) {
    this.clienteGemini = clienteGemini;
    this.repoPlanesEntrenamiento = repoPlanesEntrenamiento;
    this.repoPlanesNutricionales = repoPlanesNutricionales;
    this.logger = logger;
  }

  async generarEntrenamiento({ miembro, nivel, dias }) {
    const opciones = this.#validarOpciones({ nivel, dias }); // antes de gastar la cuota
    const datos = await this.clienteGemini.generarJSON({
      instruccion: INSTRUCCION_SISTEMA,
      pedido: pedidoEntrenamiento(miembro, { ...opciones, semanas: DURACION_PLAN_SEMANAS }),
      esquema: ESQUEMA_ENTRENAMIENTO,
    });
    // estos datos se copian campo por campo, lo que Gemini agregue de más (como id, miembroId u origen) se ignora
    const plan = this.#construirDesdeIA(() => new PlanEntrenamiento({
      miembroId: miembro.id,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      objetivo: miembro.objetivo,
      nivel: opciones.nivel,
      duracionSemanas: DURACION_PLAN_SEMANAS,
      dias: datos.dias,
      recomendaciones: datos.recomendaciones,
      origen: 'ia',
    }));
    return this.repoPlanesEntrenamiento.agregar(plan);
  }

  async generarNutricional({ miembro, nivel, dias }) {
    const opciones = this.#validarOpciones({ nivel, dias });
    const datos = await this.clienteGemini.generarJSON({
      instruccion: INSTRUCCION_SISTEMA,
      pedido: pedidoNutricion(miembro, opciones),
      esquema: ESQUEMA_NUTRICION,
    });
    const plan = this.#construirDesdeIA(() => new PlanNutricional({
      miembroId: miembro.id,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      objetivo: miembro.objetivo,
      caloriasDiarias: datos.caloriasDiarias,
      comidas: datos.comidas,
      recomendaciones: datos.recomendaciones,
      origen: 'ia',
    }));
    return this.repoPlanesNutricionales.agregar(plan);
  }

  async obtenerEntrenamiento({ planId, miembro }) {
    const plan = await this.repoPlanesEntrenamiento.obtenerPorId(planId);
    this.#verificarDueno(plan, miembro);
    return plan;
  }

  async obtenerNutricional({ planId, miembro }) {
    const plan = await this.repoPlanesNutricionales.obtenerPorId(planId);
    this.#verificarDueno(plan, miembro);
    return plan;
  }

  // datos que envía el cliente: si son inválidos es culpa del cliente (400) y ni se llama a Gemini
  #validarOpciones({ nivel, dias }) {
    return {
      nivel: v.opcion(nivel, 'nivel', NIVELES),
      dias: v.numero(dias, 'dias', { min: 1, max: 7, entero: true }),
    };
  }

  // si Gemini devuelve un plan que el dominio rechaza, el culpable NO es el cliente:
  // se responde 502 (falla del servicio externo) y el detalle va a la consola
  #construirDesdeIA(construir) {
    try {
      return construir();
    } catch (err) {
      this.logger.error('Gemini devolvió un plan que el dominio rechazó:', err.message);
      throw new ErrorServicioExterno('Gemini devolvió un plan inválido');
    }
  }

  // regla de propiedad segun rol: un plan de un miembro solo lo lee su dueño (los planes del gimnasio son públicos)
  #verificarDueno(plan, miembro) {
    if (plan.miembroId !== null && plan.miembroId !== miembro.id) {
      throw new ErrorProhibido('El plan pertenece a otro miembro');
    }
  }
}

module.exports = ServicioPlanes;