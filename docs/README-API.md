## API REST

Base: `/api`. Todas las respuestas son JSON (salvo `204`, que no tiene cuerpo)

```json
{ "data": [ ], "page": 1, "limit": 10, "total": 14 }
```

- **Formato único de error.** `errores` aparece solo en los `400` de validación: (A REVISAR)

```json
{
  "error": "Datos inválidos",
  "errores": [ { "campo": "cupo", "mensaje": "Debe ser un entero entre 1 y 200" } ]
}
```

### Códigos de estado usados

| Código | Cuándo |
|---|---|
| 200 | Lectura o modificación exitosa |
| 201 | Recurso creado (con cabecera `Location` si tiene URL propia) |
| 204 | Eliminado, sin cuerpo |
| 400 | Datos con formato o valores inválidos |
| 401 / 403 | Sin autenticar / sin permiso para la acción |
| 404 | El recurso no existe |
| 409 | Viola una regla del estado actual (sin cupo, turno ya reservado, etc.) |
| 415 | Cuerpo que no es JSON |
| 429 | Límite de uso de la API de Gemini alcanzado |
| 502 / 504 | Falla o demora del servicio externo (Gemini) |

### Tabla de endpoints

Los permisos se confirmarán con la autenticación (A IMPLEMENTAR).

#### Autenticación

| Historia | Quién | Verbo y ruta | Éxito | Errores |
|---|---|---|---|---|
| Registrarse | Todos | `POST /api/auth/registro` | 201 | 400, 409 (email ya registrado), 415 |
| Iniciar sesión | Todos | `POST /api/auth/login` | 200 | 400, 401, 415 |

#### Clases

| Historia | Quién | Verbo y ruta | Éxito | Errores |
|---|---|---|---|---|
| Ver clases | Todos | `GET /api/clases?instructor=2&page=1&limit=10` | 200 `{data, page, limit, total}` | 400 (parámetros inválidos) |
| Ver una clase | Todos | `GET /api/clases/:id` | 200 | 404 |
| Publicar clase | Instructor | `POST /api/clases` | 201 + `Location` | 400, 403, 415 |
| Modificar clase | Instructor (dueño) | `PUT /api/clases/:id` | 200 | 400, 403, 404, 415 |
| Eliminar clase | Instructor (dueño) | `DELETE /api/clases/:id` | 204 | 403, 404 |
| Inscribirse | Miembro | `POST /api/clases/:id/inscribir` | 200 | 404, 409 (sin cupo, ya inscripto o clase comenzada) |
| Desinscribirse | Miembro | `POST /api/clases/:id/desinscribir` | 200 | 404 (clase inexistente o no inscripto) |

#### Rutinas

| Historia | Quién | Verbo y ruta | Éxito | Errores |
|---|---|---|---|---|
| Ver rutinas | Todos | `GET /api/rutinas?nivel=principiante&page=1&limit=10` | 200 `{data, page, limit, total}` | 400 |
| Crear rutina | Instructor | `POST /api/rutinas` | 201 + `Location` | 400, 403, 415 |
| Modificar rutina | Instructor (dueño) | `PUT /api/rutinas/:id` | 200 | 400, 403, 404, 415 |
| Eliminar rutina | Instructor (dueño) | `DELETE /api/rutinas/:id` | 204 | 403, 404 |

#### Planes (generados con Gemini)

| Historia | Quién | Verbo y ruta | Éxito | Errores |
|---|---|---|---|---|
| Generar plan de entrenamiento | Miembro | `POST /api/planes-entrenamiento/generar` | 201 + `Location` | 400, 415, 429, 502, 504 |
| Generar plan nutricional | Miembro | `POST /api/planes-nutricionales/generar` | 201 + `Location` | 400, 415, 429, 502, 504 |
| Ver un plan de entrenamiento | Todos | `GET /api/planes-entrenamiento/:id` | 200 | 404 |
| Ver un plan nutricional | Todos | `GET /api/planes-nutricionales/:id` | 200 | 404 |

#### Seguimientos

| Historia | Quién | Verbo y ruta | Éxito | Errores |
|---|---|---|---|---|
| Iniciar un plan | Miembro | `POST /api/seguimientos` | 201 + `Location` | 400 (sin plan), 404 (plan inexistente), 415 |
| Ver mis seguimientos | Miembro | `GET /api/seguimientos?page=1&limit=10` | 200 `{data, page, limit, total}` | 400 |
| Ver un seguimiento | Miembro (dueño) | `GET /api/seguimientos/:id` | 200 | 403, 404 |
| Cargar progreso | Miembro (dueño) | `POST /api/seguimientos/:id/registros` | 201 | 400, 403, 404, 409 (seguimiento pausado o finalizado), 415 |
| Ver historial | Miembro (dueño) | `GET /api/seguimientos/:id/registros` | 200 | 403, 404 |
| Pausar, reanudar o finalizar | Miembro (dueño) | `POST /api/seguimientos/:id/pausar` (o `/reanudar`, `/finalizar`) | 200 | 403, 404, 409 (transición no permitida) |

#### Turnos

| Historia | Quién | Verbo y ruta | Éxito | Errores |
|---|---|---|---|---|
| Ver turnos disponibles | Todos | `GET /api/turnos?disponibles=true&tipo=nutricionista&page=1&limit=10` | 200 `{data, page, limit, total}` | 400 |
| Publicar turno | Administrador | `POST /api/turnos` | 201 + `Location` | 400, 403, 415 |
| Quitar turno | Administrador | `DELETE /api/turnos/:id` | 204 | 403, 404, 409 (ya reservado) |
| Reservar turno | Miembro | `POST /api/turnos/:id/reservar` | 200 | 404, 409 (ya reservado) |
| Cancelar turno | Miembro (quien reservó) | `POST /api/turnos/:id/cancelar` | 200 | 403 (no es suyo), 404, 409 (no está reservado) |

#### Membresías y horarios

| Historia | Quién | Verbo y ruta | Éxito | Errores |
|---|---|---|---|---|
| Ver membresías y precios | Todos | `GET /api/membresias` | 200 | — |
| Crear membresía | Administrador | `POST /api/membresias` | 201 + `Location` | 400, 403, 415 |
| Modificar membresía | Administrador | `PUT /api/membresias/:id` | 200 | 400, 403, 404, 415 |
| Eliminar membresía | Administrador | `DELETE /api/membresias/:id` | 204 | 403, 404 |
| Ver horarios | Todos | `GET /api/horarios` | 200 | — |
| Definir horario | Administrador | `POST /api/horarios` | 201 + `Location` | 400, 403, 415 |
| Modificar horario | Administrador | `PUT /api/horarios/:id` | 200 | 400, 403, 404, 415 |
