// db.js
const { Client } = require('turso');  // Usamos el cliente de Turso
require('dotenv').config();

const client = new Client({
  url: process.env.TURSO_CONNECTION_URL,   // Usamos la URL proporcionada
  authToken: process.env.TURSO_AUTH_TOKEN // Usamos el token para autenticar la conexión
});

module.exports = client;
