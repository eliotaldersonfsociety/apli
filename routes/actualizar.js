const express = require('express');
const jwt = require('jsonwebtoken');
const { updateUserSaldo } = require('../models/user');

const router = express.Router();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

router.post('/', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  if (typeof amount !== 'number') {
    return res.status(400).json({ message: 'Amount must be a number' });
  }

  const user = await getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const nuevoSaldo = user.saldo + amount;
  if (nuevoSaldo < 0) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  await updateUserSaldo(req.user.id, amount);
  res.status(200).json({ message: 'Balance updated successfully', saldo: nuevoSaldo });
});

module.exports = router;
