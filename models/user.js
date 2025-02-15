const client = require('../config/db');

async function createUserTable() {
  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        lastname TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        direction TEXT NOT NULL,
        postalcode INTEGER NOT NULL,
        saldo INTEGER NOT NULL DEFAULT 0
      )
    `,
    args: [],
  });
}

async function getUserByEmail(email) {
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email],
  });
  return result.rows[0];
}

async function createUser(user) {
  const { name, lastname, email, password, direction, postalcode } = user;
  await client.execute({
    sql: 'INSERT INTO users (name, lastname, email, password, direction, postalcode) VALUES (?, ?, ?, ?, ?, ?)',
    args: [name, lastname, email, password, direction, postalcode],
  });
}

async function getUserById(id) {
  const result = await client.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [id],
  });
  return result.rows[0];
}

async function updateUserSaldo(id, amount) {
  await client.execute({
    sql: 'UPDATE users SET saldo = saldo + ? WHERE id = ?',
    args: [amount, id],
  });
}

module.exports = {
  createUserTable,
  getUserByEmail,
  createUser,
  getUserById,
  updateUserSaldo,
};
