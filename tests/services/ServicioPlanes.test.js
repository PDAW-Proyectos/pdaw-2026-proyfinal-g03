const ServicioPlanes = require('../../src/services/ServicioPlanes');
const { ErrorProhibido } = require('../../src/utils/errores');

describe('ServicioPlanes', () => {
  let servicioPlanes;
  let mockRepoEntrenamiento;

  beforeEach(() => {
    mockRepoEntrenamiento = {
      obtenerPorId: jest.fn(),
      listar: jest.fn(),
    };
    // Simulamos el cliente Gemini y los repositorios
    servicioPlanes = new ServicioPlanes({
      clienteGemini: {},
      repoPlanesEntrenamiento: mockRepoEntrenamiento,
      repoPlanesNutricionales: { listar: jest.fn() },
    });
  });

  test('Debe lanzar error 403 si un miembro intenta ver un plan de otro', async () => {
    // El plan pertenece al miembro con ID 100
    const planFalso = { id: 1, miembroId: 100 };
    mockRepoEntrenamiento.obtenerPorId.mockResolvedValue(planFalso);

    // Pero el que consulta es el miembro 200
    const miembroIntruso = { id: 200 };

    await expect(
      servicioPlanes.obtenerEntrenamiento({ planId: 1, miembro: miembroIntruso }),
    ).rejects.toThrow(new ErrorProhibido('El plan pertenece a otro miembro'));
  });

  test('Debe permitir ver el plan si es el dueño', async () => {
    const planFalso = { id: 1, miembroId: 100 };
    mockRepoEntrenamiento.obtenerPorId.mockResolvedValue(planFalso);

    const miembroDueno = { id: 100 };

    const resultado = await servicioPlanes.obtenerEntrenamiento({
      planId: 1,
      miembro: miembroDueno,
    });
    expect(resultado).toEqual(planFalso);
  });
});
