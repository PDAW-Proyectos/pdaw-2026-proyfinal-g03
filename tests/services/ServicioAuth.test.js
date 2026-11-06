const ServicioAuth = require('../../src/services/ServicioAuth');
const bcrypt = require('bcryptjs');
const { ErrorApp } = require('../../src/utils/errores');

// se le pide a Jest que simule (mock) el módulo completo de bcryptjs
jest.mock('bcryptjs');

describe('ServicioAuth', () => {
  let servicioAuth;
  let mockRepoUsuarios;

  beforeEach(() => {
    // se crea un repositorio falso (mock) con las funciones que usa el servicio
    mockRepoUsuarios = {
      obtenerPorEmail: jest.fn(),
    };
    servicioAuth = new ServicioAuth({ repoUsuarios: mockRepoUsuarios });
  });

  test('Debe iniciar sesión correctamente con credenciales válidas', async () => {
    const usuarioFalso = { id: 1, email: 'test@gym.com', passwordHash: 'hash_falso' };

    // se configura el mock para que devuelva el usuario falso
    mockRepoUsuarios.obtenerPorEmail.mockResolvedValue(usuarioFalso);

    // se configura bcrypt simulado para que diga que la contraseña COINCIDE (true)
    bcrypt.compare.mockResolvedValue(true);

    const resultado = await servicioAuth.iniciarSesion('test@gym.com', '12345678');

    expect(resultado).toEqual(usuarioFalso);
    expect(mockRepoUsuarios.obtenerPorEmail).toHaveBeenCalledWith('test@gym.com');
  });

  test('Debe lanzar error 401 si la contraseña es incorrecta', async () => {
    const usuarioFalso = { id: 1, email: 'test@gym.com', passwordHash: 'hash_falso' };
    mockRepoUsuarios.obtenerPorEmail.mockResolvedValue(usuarioFalso);

    // se configura bcrypt para que diga que NO coinciden (false)
    bcrypt.compare.mockResolvedValue(false);

    await expect(servicioAuth.iniciarSesion('test@gym.com', 'mal_pass')).rejects.toThrow(
      new ErrorApp('Email o contraseña incorrectos', 401),
    );
  });

  test('Debe lanzar error 401 si el email no existe', async () => {
    // el repositorio simula que no encontró al usuario (error 404)
    const error404 = new Error('No encontrado');
    error404.status = 404;
    mockRepoUsuarios.obtenerPorEmail.mockRejectedValue(error404);

    // el servicio debe transformar ese 404 en un 401 por seguridad
    await expect(servicioAuth.iniciarSesion('noexiste@gym.com', '12345678')).rejects.toThrow(
      new ErrorApp('Email o contraseña incorrectos', 401),
    );
  });
});
