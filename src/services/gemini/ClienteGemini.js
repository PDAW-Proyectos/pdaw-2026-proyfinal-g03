// Cliente de la API de Gemini
// solo sabe hablar con Gemini: no conoce planes, miembros ni Express
// recibe su configuración y su `fetch` desde afuera, así se pueden haacer pruebas sin necesitan red ni clave

const {
  ErrorServicioExterno,
  ErrorTiempoAgotado,
  ErrorLimiteExcedido,
} = require('../../utils/errores');

const URL_BASE = 'https://generativelanguage.googleapis.com/v1beta';

class ClienteGemini {
  constructor({ apiKey, modelo, timeoutMs = 30000, fetchFn = globalThis.fetch, logger = console }) {
    this.apiKey = apiKey;
    this.modelo = modelo;
    this.timeoutMs = timeoutMs;
    this.fetchFn = fetchFn;
    this.logger = logger;
  }

  // se envía una instrucción fija y un pedido, se devuelve la respuesta ya convertida en objeto
  async generarJSON({ instruccion, pedido, esquema }) {
    if (!this.apiKey || !this.modelo) {
      // la falla se muestra al usarlo, no al arrancar, así el resto de la API sigue funcionando
      throw new ErrorServicioExterno('La integración con Gemini no está configurada');
    }

    const respuesta = await this.#enviar({
      systemInstruction: { parts: [{ text: instruccion }] },
      contents: [{ role: 'user', parts: [{ text: pedido }] }],
      generationConfig: { responseMimeType: 'application/json', responseSchema: esquema },
    });
    await this.#verificarEstado(respuesta);
    return this.#extraerJSON(respuesta);
  }

  async #enviar(cuerpo) {
    const url = `${URL_BASE}/models/${encodeURIComponent(this.modelo)}:generateContent`;
    try {
      return await this.fetchFn(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify(cuerpo),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (err) {
      if (err.name === 'TimeoutError') throw new ErrorTiempoAgotado('Gemini tardó demasiado en responder');
      throw new ErrorServicioExterno('No se pudo conectar con Gemini');
    }
  }

  // como fetch NO lanza error tipo 4xx o 5xx, hay que revisar el estado a mano
  async #verificarEstado(respuesta) {
    if (respuesta.ok) return;
    if (respuesta.status === 429) {
      throw new ErrorLimiteExcedido('Se alcanzó el límite de uso de la API. Intentar de nuevo en unos minutos');
    }
    if (respuesta.status === 503) {
      throw new ErrorServicioExterno('El modelo de IA está saturado en este momento. Intentar de nuevo en unos minutos');
    }
    // el detalle del error va a la consola del servidor, el cliente veo solo un mensaje genérico
    this.logger.error('Gemini respondió', respuesta.status, await respuesta.text());
    throw new ErrorServicioExterno('Gemini devolvió un error');
  }

  async #extraerJSON(respuesta) {
    let datos;
    try {
      datos = await respuesta.json();
    } catch {
      throw new ErrorServicioExterno('Gemini devolvió una respuesta ilegible');
    }
    const partes = datos.candidates?.[0]?.content?.parts ?? [];
    const texto = partes.filter((p) => !p.thought).map((p) => p.text ?? '').join('');
    try {
      const resultado = JSON.parse(texto);
      if (resultado === null || typeof resultado !== 'object') throw new Error('no es un objeto');
      return resultado;
    } catch {
      throw new ErrorServicioExterno('Gemini devolvió una respuesta que no es JSON válido');
    }
  }
}

module.exports = ClienteGemini;