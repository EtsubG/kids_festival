import express from 'express';

const router = express.Router();

/**
 * POST /api/auth/login
 * Verify admin password and return auth token
 */
router.post('/login', (req, res) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'festival2026';
    
    if (password === adminPassword) {
      // In production, use JWT instead of returning plain password
      res.json({
        success: true,
        token: adminPassword, // Simple token for demo
        message: 'Authentication successful'
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid password'
      });
    }
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

/**
 * POST /api/auth/verify
 * Verify admin token
 */
router.post('/verify', (req, res) => {
  try {
    const { token } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'festival2026';
    
    if (token === adminPassword) {
      res.json({
        success: true,
        valid: true
      });
    } else {
      res.status(401).json({
        success: false,
        valid: false,
        error: 'Invalid token'
      });
    }
    
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router;