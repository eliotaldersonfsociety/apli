// api/v1/purchase/index.js
import jwt from 'jsonwebtoken';
import { createPurchase, getPurchasesByUserId } from '../../models/purchase';

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
      const purchases = await getPurchasesByUserId(decoded.id);
      res.status(200).json({ purchases });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const decoded = authMiddleware(req);
      const { items, payment_method, total_amount } = req.body;

      if (!items || !payment_method || !total_amount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      await createPurchase({ items, payment_method, userId: decoded.id, total_amount });
      res.status(201).json({ message: 'Purchase created successfully' });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
