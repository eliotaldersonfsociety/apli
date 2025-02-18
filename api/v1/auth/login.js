import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { getUserByEmail } from '../../models/user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await Promise.all([
      body('email').trim().toLowerCase().isEmail().withMessage('Invalid email address'),
      body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    ]).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      console.log('Searching for user with email:', email);  // Agrega log para depuración
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

      return res.status(200).json({ token, user: { id: user.id, name: user.name, lastname: user.lastname, email: user.email } });
    } catch (error) {
      console.error('Error during login process:', error.message);  // Log para depuración
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
