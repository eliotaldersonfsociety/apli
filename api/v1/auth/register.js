// api/v1/auth/register.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail } from '../../models/user';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, lastname, email, password, repassword, direction, postalcode } = req.body;

    // Validación de contraseña
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
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
