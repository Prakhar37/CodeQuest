import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

// Admin login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ status: 'error', message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ status: 'success', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
});

export default router;
