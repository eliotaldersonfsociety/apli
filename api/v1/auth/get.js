import jwt from 'jsonwebtoken';
import { getUserById } from '../../../models/user';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verificamos el token
      const user = await getUserById(decoded.id); // Buscamos al usuario con el ID del token

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User is authenticated', user });
    } catch (err) {
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
