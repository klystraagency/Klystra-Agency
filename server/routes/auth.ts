import express from 'express';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect username or password' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Incorrect username or password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: {
      id: req.user!.id,
      username: req.user!.username,
      isAdmin: req.user!.isAdmin
    }
  });
});

// Logout route
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

export default router;
