// models/user.js
import { client } from '../config/db';  // Conexión a la base de datos Turso

// Crear un nuevo usuario
export async function createUser({ name, lastname, email, password, direction, postalcode }) {
  const query = `
    INSERT INTO users (name, lastname, email, password, direction, postalcode) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  const values = [name, lastname, email, password, direction, postalcode];

  try {
    await client.query(query, values);  // Ejecuta la consulta de inserción
  } catch (error) {
    throw new Error('Error creando el usuario: ' + error.message);
  }
}

// Obtener un usuario por su correo
export async function getUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = ? LIMIT 1';  // Busca un usuario por su correo electrónico
  try {
    const result = await client.query(query, [email]);
    return result.rows[0];  // Devuelve el primer usuario encontrado
  } catch (error) {
    throw new Error('Error obteniendo el usuario: ' + error.message);
  }
}

// Obtener un usuario por su ID
export async function getUserById(id) {
  const query = 'SELECT * FROM users WHERE id = ? LIMIT 1';  // Busca un usuario por su ID
  try {
    const result = await client.query(query, [id]);
    return result.rows[0];  // Devuelve el primer usuario encontrado
  } catch (error) {
    throw new Error('Error obteniendo el usuario: ' + error.message);
  }
}

// Actualizar el saldo del usuario
export async function updateUserSaldo(id, amount) {
  const query = 'UPDATE users SET saldo = saldo + ? WHERE id = ?';  // Actualiza el saldo del usuario
  try {
    await client.query(query, [amount, id]);  // Ejecuta la consulta de actualización
  } catch (error) {
    throw new Error('Error actualizando el saldo: ' + error.message);
  }
}
