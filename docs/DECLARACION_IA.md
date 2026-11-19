# Declaración de uso de herramientas de IA

## Herramientas utilizadas

| Herramienta | Versión o plan            | Integrantes que la usaron            |
| :---------- | :------------------------ | :----------------------------------- |
| DeepSeek,   | Plan gratuito             | Todo el equipo                       |
| Claude      |                           |                                      |
| Lovable     | Plan gratuito             | Camila Corbatta                      |
| Gemini API  | API gratuita (producción) | Todo el equipo (integrada en la app) |

## Usos

| Tarea               | Qué se pidió                                                                                                                      | Qué se adoptó                                                                        | Cómo se verificó                                                              |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **Ideación y UX**   | Modelado y estructura HTML para la página.                                                                                        | Se adoptó el maquetado base con tarjetas y menú lateral.                             | Se revisó en Lovable y se adaptó a los colores y especifiaciones del dominio. |
| **Depuración**      | Corrección de diversos errores. Ejemplo de caso: "¿Por qué la función `filtrar` no está tomando el parámetro `CAMPOS_NUTRICION`?" | Se corrigió la firma de la función para que acepte el segundo parámetro.             | Se probó enviando el formulario de nutrición y verificando el 200 OK.         |
| **Pruebas**         | Generar casos de prueba para los endpoints usando Bruno.                                                                          | Se adoptaron los casos borde (reserva duplicada, cancelación por otro usuario, etc). | Se corrieron en la aplicación y se verificó que pasaran.                      |
| **Refactorización** | Ejemplo de caso:"Sugerir una mejora para el manejo de errores en el frontend"                                                     | Se adoptó el patrón de tarjetas con spinner y mensajes amigables.                    | Se probó forzando un timeout de la API de Gemini.                             |
| **Documentación**   | Redacción de documentación. Generar la estructura de la tabla de la API                                                           | Se adoptó el formato de tabla con códigos HTTP.                                      | Se comparó con los controladores reales del proyecto.                         |

## Compromiso

Todas las personas del equipo comprendemos el código del repositorio, podemos explicarlo y modificarlo sin asistencia, y las partes generadas o sugeridas fueron revisadas, probadas y adaptadas por el equipo.
