const { createClient } = require('@libsql/client');
const dotenv = require('dotenv');

dotenv.config();

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

module.exports = client;
