// este archivo lee variables de entorno
// los valores reales viven en el archivo .env (que no se sube a Git), acá solo se leen

module.exports = {
  puerto: Number(process.env.PORT) || 3000,
  secretoSesion: process.env.SESSION_SECRET,
};


  gemini: {
    apiKey: process.env.GEMINI_API_KEY || null,
    modelo: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS) || 30000,
  },
};
