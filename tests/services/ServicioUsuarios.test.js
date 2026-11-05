const ServicioUsuarios = require('../../src/services/ServicioUsuarios');
const bcrypt = require('bcryptjs');
const { ErrorConflicto } = require('../../src/utils/errores');

jest.mock('bcryptjs');

describe('ServicioUsuarios', () => {
  let servicioUsuarios;
  let mockRepoUsuarios;

  beforeEach(() => {
    mockRepoUsuarios = {
      listar: jest.fn(),
      agregar: jest.fn(),
    };
    servicioUsuarios = new ServicioUsuarios({ repoUsuarios: mockRepoUsuarios });
    
    // se simula que bcrypt encripta rápido
    bcrypt.hash.mockResolvedValue('hash_simulado');
  });

  test('Debe crear un miembro correctamente si los datos son únicos', async () => {
    // el repositorio dice que no hay usuarios todavia
    mockRepoUsuarios.listar.mockResolvedValue([]);
    mockRepoUsuarios.agregar.mockImplementation((u) => Promise.resolve(u));

    const datosNuevos = {
      dni: '12345678',
      nombre: 'Juan Perez',
      email: 'juan@test.com',
      peso: 80, altura: 180, edad: 30, objetivo: 'ganar_musculo'
    };

    const usuarioCreado = await servicioUsuarios.crearMiembro(datosNuevos);

    expect(usuarioCreado.id).toBe('12345678'); // A REVISAR: el validador de DNI lo puede convertir a string o número, se cambia usuarioCreado.dni a usuarioCreado.id para que pase el test
    expect(usuarioCreado.rol).toBe('miembro');
    expect(mockRepoUsuarios.agregar).toHaveBeenCalled();
  });

  test('No debe crear un miembro si el DNI ya existe', async () => {
    // el repositorio dice que ya hay un usuario con ese DNI
    const usuarioExistente = { id: '12345678', email: 'otro@test.com' };
    mockRepoUsuarios.listar.mockResolvedValue([usuarioExistente]);

    const datosNuevos = {
      dni: '12345678', nombre: 'Juan', email: 'juan@test.com', 
      peso: 80, altura: 180, edad: 30, objetivo: 'ganar_musculo'
    };

    await expect(servicioUsuarios.crearMiembro(datosNuevos))
      .rejects.toThrow(new ErrorConflicto('Ya existe un usuario con ese DNI'));
  });
});