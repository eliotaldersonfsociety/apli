// api/v1/update-saldo/index.js
import jwt from 'jsonwebtoken';
import { updateUserSaldo, getUserById } from '../../models/user';

const authMiddleware = (req) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    throw new Error('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Token is not valid');
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const decoded = authMiddleware(req);
      const { amount } = req.body;

      if (typeof amount !== 'number') {
        return res.status(400).json({ message: 'Amount must be a number' });
      }

      const user = await getUserById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const nuevoSaldo = user.saldo + amount;
      if (nuevoSaldo < 0) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }

      await updateUserSaldo(decoded.id, amount);
      res.status(200).json({ message: 'Balance updated successfully', saldo: nuevoSaldo });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
