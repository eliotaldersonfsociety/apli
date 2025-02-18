import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { createUser, getUserByEmail } from '../../../models/user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await Promise.all([
      body('name').trim().toLowerCase().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
      body('lastname').trim().toLowerCase().isLength({ min: 3 }).withMessage('Lastname must be at least 3 characters long'),
      body('email').trim().toLowerCase().isEmail().withMessage('Invalid email address'),
      body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
      body('repassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
      body('direction').trim().toLowerCase().isLength({ min: 3 }).withMessage('Direction must be at least 3 characters long').optional(),
      body('postalcode').trim().toLowerCase().isLength({ min: 3 }).withMessage('Postal code must be at least 3 characters long'),
    ]).run(req);

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

    return res.status(201).json({ token });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
