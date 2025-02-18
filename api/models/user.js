// models/user.js
import { client } from '../config/db'; // Conexión a la base de datos

export async function createUser({ name, lastname, email, password, direction, postalcode }) {
  // Función para crear un nuevo usuario
}

export async function getUserByEmail(email) {
  // Función para obtener un usuario por su correo
}

export async function getUserById(id) {
  // Función para obtener un usuario por su ID
}

export async function updateUserSaldo(id, amount) {
  // Función para actualizar el saldo del usuario
}
