const ServicioClases = require('../../src/services/ServicioClases');
const { ErrorProhibido } = require('../../src/utils/errores');

describe('ServicioClases', () => {
  let servicioClases;
  let mockRepoClases;

  beforeEach(() => {
    mockRepoClases = {
      obtenerPorId: jest.fn(),
      actualizar: jest.fn(),
    };
    servicioClases = new ServicioClases({ repoClases: mockRepoClases });
  });

  test('Debe permitir al instructor dueño modificar su clase', async () => {
    const claseFalsa = { id: 1, instructorId: '20000000' };
    mockRepoClases.obtenerPorId.mockResolvedValue(claseFalsa);
    mockRepoClases.actualizar.mockResolvedValue(claseFalsa);

    const instructor = { id: '20000000' }; // mismo ID
    const datos = {
      titulo: 'Clase Modificada',
      descripcion: 'Descripción válida',
      fechaHora: new Date(Date.now() + 86400000).toISOString(), // fecha futura
      duracionMin: 60,
      cupo: 10,
    };

    await servicioClases.modificar({ claseId: 1, instructor, datos });

    expect(mockRepoClases.actualizar).toHaveBeenCalled();
  });

  test('Debe lanzar error 403 si el instructor no es el dueño', async () => {
    const claseFalsa = { id: 1, instructorId: '20000000' };
    mockRepoClases.obtenerPorId.mockResolvedValue(claseFalsa);

    const otroInstructor = { id: '99999999' }; // ID distinto
    const datos = {
      titulo: 'Intento de hackeo',
      descripcion: '...',
      fechaHora: new Date(Date.now() + 86400000).toISOString(),
      duracionMin: 60,
      cupo: 10,
    };

    await expect(
      servicioClases.modificar({ claseId: 1, instructor: otroInstructor, datos }),
    ).rejects.toThrow(new ErrorProhibido('La clase es de otro instructor'));
  });
});
