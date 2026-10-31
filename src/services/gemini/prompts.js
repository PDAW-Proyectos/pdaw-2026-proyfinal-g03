// Aca se redacta lo que se le pide a Gemini
// Parte FIJA: INSTRUCCION_SISTEMA (rol y reglas) - Parte VARIABLE: los datos del miembro

// Los datos variables salen de objetos ya validados (números y opciones fijas), nunca texto libre del usuario,
// así nadie puede meter instrucciones dentro del prompt

const ETIQUETAS_OBJETIVO = {
  perder_peso: 'perder peso',
  ganar_musculo: 'ganar masa muscular',
  mantener: 'mantener su condición actual',
  resistencia: 'mejorar su resistencia',
};

const INSTRUCCION_SISTEMA = `Eres un asistente de un gimnasio que prepara planes GENERALES y SENCILLOS.
Reglas:
- Responde en español neutro.
- No des consejos médicos ni prometas resultados.
- No propongas dietas extremas ni entrenamientos de riesgo.
- Si la persona es menor de 18 años, mantén todo moderado y adecuado a su edad.
- Incluye entre las recomendaciones una que sugiera consultar con el médico o el nutricionista del gimnasio antes de empezar.
- Responde únicamente con el JSON pedido.`;

function describirMiembro(miembro, { nivel, dias }) {
  return [
    'Datos del miembro:',
    `- Edad: ${miembro.edad} años`,
    `- Peso: ${miembro.peso} kg`,
    `- Altura: ${miembro.altura} cm`,
    `- Objetivo: ${ETIQUETAS_OBJETIVO[miembro.objetivo]}`,
    `- Nivel de experiencia: ${nivel}`,
    `- Días disponibles para entrenar por semana: ${dias}`,
  ].join('\n');
}

function pedidoEntrenamiento(miembro, { nivel, dias, semanas }) {
  return `${describirMiembro(miembro, { nivel, dias })}

Arma un plan de entrenamiento semanal con exactamente ${dias} días de entrenamiento y de 4 a 6 ejercicios por día. La misma semana se repite durante ${semanas} semanas.`;
}

function pedidoNutricion(miembro, { nivel, dias }) {
  return `${describirMiembro(miembro, { nivel, dias })}

Arma un plan nutricional diario sencillo, con calorías diarias aproximadas y de 4 a 5 comidas con ejemplos simples.`;
}

module.exports = { INSTRUCCION_SISTEMA, pedidoEntrenamiento, pedidoNutricion };