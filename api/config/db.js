import { Client } from 'turso';  // Usamos el cliente de Turso
import dotenv from 'dotenv';  // Cargar variables de entorno
dotenv.config();

const client = new Client({
  url: process.env.TURSO_CONNECTION_URL,  // URL de conexión de Turso
  authToken: process.env.TURSO_AUTH_TOKEN  // Token de autenticación de Turso
});

export { client };  // Exportar el cliente para usarlo en otros archivos
