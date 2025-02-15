const express = require('express');
const jwt = require('jsonwebtoken');
const { createPurchase, getPurchasesByUserId } = require('../models/purchase');

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

router.get('/', authMiddleware, async (req, res) => {
  const purchases = await getPurchasesByUserId(req.user.id);
  res.status(200).json({ purchases });
});

router.post('/', authMiddleware, async (req, res) => {
  const { items, payment_method, total_amount } = req.body;
  if (!items || !payment_method || !total_amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  await createPurchase({ items, payment_method, userId: req.user.id, total_amount });
  res.status(201).json({ message: 'Purchase created successfully' });
});

module.exports = router;
