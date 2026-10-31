// aca se define la forma del JSON que se le exige a Gemini

// este esquema garantiza la FORMA de la respuesta, no que los valores tengan sentido:
// eso lo verifican los constructores del dominio

const ESQUEMA_ENTRENAMIENTO = {
  type: 'OBJECT',
  properties: {
    nombre: { type: 'STRING' },
    descripcion: { type: 'STRING' },
    dias: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          dia: { type: 'STRING' },
          enfoque: { type: 'STRING' },
          ejercicios: {
            type: 'ARRAY',
            items: {
              type: 'OBJECT',
              properties: {
                nombre: { type: 'STRING' },
                series: { type: 'INTEGER' },
                repeticiones: { type: 'INTEGER' },
                descansoSeg: { type: 'INTEGER' },
              },
              required: ['nombre', 'series', 'repeticiones', 'descansoSeg'],
            },
          },
        },
        required: ['dia', 'enfoque', 'ejercicios'],
      },
    },
    recomendaciones: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['nombre', 'descripcion', 'dias', 'recomendaciones'],
};

const ESQUEMA_NUTRICION = {
  type: 'OBJECT',
  properties: {
    nombre: { type: 'STRING' },
    descripcion: { type: 'STRING' },
    caloriasDiarias: { type: 'INTEGER' },
    comidas: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: { momento: { type: 'STRING' }, ejemplo: { type: 'STRING' } },
        required: ['momento', 'ejemplo'],
      },
    },
    recomendaciones: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['nombre', 'descripcion', 'caloriasDiarias', 'comidas', 'recomendaciones'],
};

module.exports = { ESQUEMA_ENTRENAMIENTO, ESQUEMA_NUTRICION };