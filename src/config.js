// lee variables de entorno
module.exports = {
  puerto: Number(process.env.PORT) || 3000,
  secretoSesion: process.env.SESSION_SECRET,
};

