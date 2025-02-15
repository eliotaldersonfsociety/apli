const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { createUser, getUserByEmail } = require('../models/user');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().toLowerCase().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('lastname').trim().toLowerCase().isLength({ min: 3 }).withMessage('Lastname must be at least 3 characters long'),
    body('email').trim().toLowerCase().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('repassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('direction').trim().toLowerCase().isLength({ min: 3 }).withMessage('Direction must be at least 3 characters long').optional(),
    body('postalcode').trim().toLowerCase().isLength({ min: 3 }).withMessage('Postal code must be at least 3 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, lastname, email, password, repassword, direction, postalcode } = req.body;

    if (password !== repassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser({ name, lastname, email, password: hashedPassword, direction, postalcode });

    const payload = { email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  }
);

router.post(
  '/login',
  [
    body('email').trim().toLowerCase().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user.id, name: user.name, lastname: user.lastname, email: user.email } });
  }
);

module.exports = router;
