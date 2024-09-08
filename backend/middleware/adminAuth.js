import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const adminAuth = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findOne({ _id: decoded.id });

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Please authenticate as admin' });
  }
};

export default adminAuth;
