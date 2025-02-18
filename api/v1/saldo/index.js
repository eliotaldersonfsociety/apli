// api/v1/saldo/index.js
import jwt from 'jsonwebtoken';
import { getUserById } from '../../models/user';

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
  if (req.method === 'GET') {
    try {
      const decoded = authMiddleware(req);
      const user = await getUserById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ saldo: user.saldo });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
