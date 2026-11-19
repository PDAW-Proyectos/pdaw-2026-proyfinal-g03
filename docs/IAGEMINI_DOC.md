## Documentación de la API Externa (Google Gemini)

Este proyecto integra la API de **Google Gemini** (utilizando el modelo `gemini-3.5-flash-lite`) para la generación de respuestas mediante inteligencia artificial. A continuación se detallan las especificaciones técnicas de consumo:

### Recursos y parámetros

- **Rutas disponibles:** Aunque la implementación utiliza el SDK oficial, por debajo consume el endpoint RESTful de generación de contenido:
  `POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
- **Filtros y parámetros:** Se envían en el cuerpo (_body_) de la petición en formato JSON. Los principales son `contents` (el _prompt_ o historial de mensajes), `generationConfig` (parámetros opcionales como temperatura y límite de tokens) y `safetySettings` (filtros de moderación de contenido).
- **Paginación:** No aplica paginación tradicional basada en páginas o cursores. Para respuestas extensas o flujos continuos, la API soporta recepción por fragmentos (_Streaming_) mediante el método `generateContentStream`, o bien el envío secuencial del historial de conversación en el arreglo `contents`.

### Formato de respuesta

- **Estructura y campos opcionales:** La respuesta se devuelve en formato JSON. El texto principal generado se extrae de `candidates[0].content.parts[0].text`. Campos como `usageMetadata` (conteo de tokens consumidos), `safetyRatings` o `finishReason` son opcionales o pueden variar según la configuración de la consulta.
- **Representación de fechas y ausencias:** Al ser una API de procesamiento de lenguaje natural, no maneja registros tabulares con esquemas de fecha estrictos; cualquier fecha solicitada se devuelve como texto plano (_string_). Cuando un campo opcional no aplica o no tiene datos, se omite directamente en el objeto JSON o se devuelve como arreglo vacío (`[]`).

### Autenticación

- **Requisito:** Requiere autenticación obligatoria mediante una clave de API (_API Key_).
- **Envío:** A través del SDK, la clave se lee automáticamente desde la variable de entorno `GEMINI_API_KEY`. En peticiones HTTP directas, se envía como parámetro de consulta (`?key=TU_API_KEY`) o en la cabecera `x-goog-api-key`.
- **Obtención:** Se genera de manera gratuita accediendo con una cuenta de Google a **Google AI Studio** (`https://aistudio.google.com/`).

### Límites de uso (_Rate Limits_)

- **Cuotas:** En la capa gratuita (_Free Tier_), los límites se miden en solicitudes por minuto (**RPM**) y tokens por minuto (**TPM**). Para los modelos ligeros (`Flash-Lite`), el límite gratuito permite realizar pruebas de desarrollo fluidas (generalmente entre 10 y 15 RPM, sujeto a ajustes de cuota de Google).
- **Respuesta al exceder el límite:** Al superar la cuota asignada o en momentos de alta demanda del servidor, la API rechaza la petición devolviendo un código de estado HTTP **429** o **503**.

### Manejo de errores

La API utiliza códigos de estado HTTP estándar acompañados de un objeto JSON con la estructura `{ "error": { "code", "message", "status" } }`:

- **`400 Bad Request`:** Error de sintaxis en el JSON enviado, parámetros inválidos o clave de API incorrecta.
- **`429 Too Many Requests`:** Se ha excedido el límite de peticiones o tokens por minuto.
- **`503 Service Unavailable` / `504 Gateway Timeout`:** Saturación temporal o tiempo de espera agotado en los servidores de Google.

### Términos y estabilidad

- **Uso permitido:** La versión gratuita está habilitada para prototipado, desarrollo y proyectos académicos/personales, bajo las políticas de uso aceptable de Google AI (prohibido el uso para actividades ilícitas, generación de spam o suplantación).
- **Versionado:** El endpoint utiliza versionado explícito en su ruta (ej. `v1beta`). Asimismo, los modelos se identifican con versiones específicas (ej. `gemini-3.5-flash-lite`) para garantizar estabilidad y evitar cambios imprevistos en el comportamiento.
- **Historial de cambios:** Las actualizaciones de modelos, nuevas funcionalidades y avisos de obsolescencia (_deprecations_) se documentan en las notas de lanzamiento oficiales de Google AI for Developers.
