const express = require('express');
const jwt = require('jsonwebtoken');
const { getUserById } = require('../models/user');

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

router.get('/saldo', authMiddleware, async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ saldo: user.saldo });
});

module.exports = router;
