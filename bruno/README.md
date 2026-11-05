# Gimnasio API — colección de Bruno

Pruebas y documentación de la API, en archivos de texto versionables con Git. Cada carpeta es un recurso y cada request explica en su pestaña **Docs** qué hace, qué permiso pide y qué campos acepta.

## Cómo abrirla

1. Instalá [Bruno](https://www.usebruno.com/) (no pide cuenta).
2. **Open Collection** y elegí esta carpeta (`bruno/`).
3. Arriba a la derecha, seleccioná el entorno **local** (**Configure** para editarlo). Solo tiene lo que depende de cada máquina:
   - `baseUrl`: por defecto `http://localhost:3000` (el `PORT` de tu `.env`).
   - `adminEmail`: el email del administrador que tengas cargado.
   - `adminPassword`: variable **secreta**, completala vos (no se guarda en el repo). Es la contraseña de ese administrador, que por defecto es su DNI.

Los usuarios de prueba (instructores y miembros) con sus emails y DNI están definidos en la propia colección (`collection.bru`, *Collection Settings → Vars*), no hace falta cargarlos en el entorno.

## Antes de correr

- Servidor levantado (`npm start`) con `SESSION_SECRET` en el `.env`. Si cambiás el código, reiniciá el servidor: Node no recarga solo.
- Un **administrador** ya cargado en `data/Usuario.json`: la API no puede crear el primero. Su `id` es su DNI (texto de 7 u 8 dígitos) y su contraseña es el hash de bcrypt del DNI.
- Las carpetas **08 planes IA** y **09 seguimientos** necesitan `GEMINI_API_KEY` en el `.env` (los planes se generan con Gemini; puede tardar hasta 30 s).

## Usuarios: DNI como id y contraseña

El **DNI** (7 u 8 dígitos) es el id de cada usuario y también su **contraseña inicial**. Al crear un instructor o un miembro se manda `dni`, `nombre` y `email` (más los datos propios del rol), **sin `password`**. Para iniciar sesión se usa el email y el DNI como contraseña. Como los ids de usuario son texto, los campos como `instructorId` o `miembroId` también son texto (por ejemplo `"30000001"`).

## Formato de errores

Todo error es un JSON con `error` (mensaje legible). Los `400` de validación de un campo suman `errores` con el campo inválido:

```json
{
  "error": "duracionMin debe ser un número entero entre 15 y 240",
  "errores": [ { "campo": "duracionMin", "mensaje": "duracionMin debe ser un número entero entre 15 y 240" } ]
}
```

`errores` trae el **primer** campo inválido que se encontró. Los errores de regla que involucran varios campos (por ejemplo, apertura posterior al cierre), el JSON mal formado y los demás códigos (401, 403, 404, 409, ...) traen solo `error`. La colección verifica ambos casos.

## Orden recomendado

1. **01 auth**: comprobá que el login y `me` funcionan.
2. **02 usuarios**: crea los usuarios de prueba. Se puede correr las veces que quieras: responde 201 la primera vez y 409 después, y ambos están aceptados.
3. El resto de las carpetas, en cualquier orden, salvo que **09 seguimientos** usa los planes que crea **08 planes IA**.

## Sesiones y roles

La API usa cookie de sesión y Bruno la guarda y envía sola. Hay **una sesión por vez**: iniciar sesión con otro usuario reemplaza la anterior. Por eso cada carpeta empieza con su propio `Login como ...` y vuelve a loguearse cuando cambia de rol. Podés correr cada carpeta por separado.

Los ids que se necesitan entre requests (`horarioId`, `claseId`, `turnoId`, etc.) se guardan solos con un script *Post Response*.

## Correr todo desde la terminal

```bash
npm i -g @usebruno/cli
cd bruno
bru run -r --env local --env-var adminPassword=TU_CLAVE
```

- `-r` incluye las subcarpetas. Para una sola: `bru run 03-horarios --env local --env-var adminPassword=TU_CLAVE`.
- Si cambiaste `baseUrl`, agregá `--env-var baseUrl=http://localhost:PUERTO`.
- Con el servidor funcionando y el administrador cargado, la colección completa tiene 124 requests y 176 verificaciones.

Los datos se guardan en archivos JSON, así que algunas pruebas dejan registros (planes, seguimientos, usuarios de prueba). Para empezar de cero, vaciá `data/` y volvé a crear el administrador.

## Mapa de la API

Todo (salvo el login) exige sesión. Los listados devuelven `{ data, total, page, limit }`. Todas las rutas cuelgan de `/api/<recurso>`.

| Recurso | Endpoints | Permiso (rol) |
|---|---|---|
| auth | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | público / sesión |
| usuarios | `POST /api/usuarios/miembros`, `POST /api/usuarios/instructores` (body: `dni`, `nombre`, `email` + datos del rol) | `crearUsuario` (administrador) |
| horarios | `GET /`, `GET /:id` · `POST /`, `PUT /:id`, `DELETE /:id` | lectura: todos · escritura: `definirHorarios` (administrador) |
| membresias | `GET /`, `GET /:id` · `POST /`, `PUT /:id`, `DELETE /:id` | lectura: todos · escritura: `gestionarMembresias` (administrador) |
| rutinas | `GET /`, `GET /:id` · `POST /`, `PUT /:id`, `DELETE /:id` | lectura: todos · escritura: `crearRutina` (instructor dueño) |
| clases | `GET /`, `GET /:id` · `POST /`, `PUT /:id`, `DELETE /:id` · `POST /:id/inscribir`, `POST /:id/desinscribir` | escritura: `publicarClase` (instructor dueño) · inscripción: `inscribirseAClase` (miembro) |
| turnos | `GET /`, `GET /mios`, `GET /:id` · `POST /`, `DELETE /:id` · `POST /:id/reservar`, `POST /:id/cancelar` | `publicarTurno` (administrador) · `solicitarTurno` (miembro) |
| planes-entrenamiento / planes-nutricionales | `POST /generar`, `GET /:id` | `generarPlan` (miembro); cada plan solo lo lee su dueño |
| seguimientos | `GET /`, `GET /:id`, `POST /`, `POST /:id/registros`, `POST /:id/pausar`, `/reanudar`, `/finalizar` | `llevarSeguimiento` (miembro dueño) |
