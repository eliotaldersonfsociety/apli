const client = require('../config/db');

async function createPurchasesTable() {
  await client.execute({
    sql: `
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        items TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        userId INTEGER NOT NULL,
        createdAt TEXT DEFAULT (datetime('now','localtime')),
        updateAt TEXT DEFAULT (datetime('now','localtime')),
        total_amount INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `,
    args: [],
  });
}

async function createPurchase(purchase) {
  const { items, payment_method, userId, total_amount } = purchase;
  await client.execute({
    sql: 'INSERT INTO purchases (items, payment_method, userId, total_amount) VALUES (?, ?, ?, ?)',
    args: [items, payment_method, userId, total_amount],
  });
}

async function getPurchasesByUserId(userId) {
  const result = await client.execute({
    sql: 'SELECT * FROM purchases WHERE userId = ?',
    args: [userId],
  });
  return result.rows;
}

module.exports = {
  createPurchasesTable,
  createPurchase,
  getPurchasesByUserId,
};
