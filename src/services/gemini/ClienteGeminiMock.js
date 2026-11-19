// este cliente simula las respuestas de Gemini sin hacer peticiones reales
class ClienteGeminiMock {
  constructor() {
    this.apiKey = 'mock-key';
    this.modelo = 'mock-model';
  }

  // se simula el método generarJSON que usa el ServicioPlanes
  async generarJSON({ esquema, pedido }) {
    // se simula un leve retraso para que se vea el spinner en el frontend
    await new Promise((resolve) => setTimeout(resolve, 500));

    // si el pedido es de nutricion (contiene "nutricional" o "comidas"), se devuelve un plan nutricional
    if (pedido.toLowerCase().includes('nutricional') || pedido.toLowerCase().includes('comidas')) {
      return {
        nombre: 'Plan Nutricional de Prueba',
        descripcion: 'Este es un plan generado por el Mock para pruebas locales.',
        caloriasDiarias: 2000,
        comidas: [
          { momento: 'Desayuno', ejemplo: 'Avena con frutas y café' },
          { momento: 'Almuerzo', ejemplo: 'Pechuga de pollo con arroz y ensalada' },
          { momento: 'Merienda', ejemplo: 'Yogur con nueces' },
          { momento: 'Cena', ejemplo: 'Salmón al horno con verduras' },
        ],
        recomendaciones: [
          'Este plan es simulado para pruebas.',
          'Consultá a un nutricionista real.',
        ],
      };
    }

    // si no, se asume que es un plan de entrenamiento
    return {
      nombre: 'Plan de Entrenamiento de Prueba',
      descripcion: 'Este es un plan generado por el Mock para pruebas locales.',
      dias: [
        {
          dia: 'Lunes',
          enfoque: 'Fuerza - Tren Superior',
          ejercicios: [
            { nombre: 'Press de banca', series: 4, repeticiones: 10, descansoSeg: 60 },
            { nombre: 'Remo con barra', series: 3, repeticiones: 12, descansoSeg: 60 },
          ],
        },
        {
          dia: 'Miércoles',
          enfoque: 'Fuerza - Tren Inferior',
          ejercicios: [
            { nombre: 'Sentadillas', series: 4, repeticiones: 10, descansoSeg: 90 },
            { nombre: 'Peso muerto', series: 3, repeticiones: 8, descansoSeg: 90 },
          ],
        },
      ],
      recomendaciones: [
        'Este plan es simulado para pruebas.',
        'Recordá calentar antes de entrenar.',
      ],
    };
  }
}

module.exports = ClienteGeminiMock;
