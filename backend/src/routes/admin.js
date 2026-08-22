import express from 'express';
import Registration from '../models/Registration.js';
import { validateAdminToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/admin/registrations
 * Get all registrations (admin only)
 */
router.get('/registrations', validateAdminToken, async (req, res) => {
  try {
    const registrations = await Registration.find()
      .sort({ createdAt: -1 })
      .lean();
    
    // Transform answers - handle both Map and plain object
    const transformed = registrations.map(reg => {
      let answersObj = {};
      
      if (reg.answers) {
        // Check if it's a Map
        if (reg.answers instanceof Map) {
          answersObj = Object.fromEntries(reg.answers);
        } 
        // Check if it's a plain object
        else if (typeof reg.answers === 'object' && !Array.isArray(reg.answers)) {
          answersObj = reg.answers;
        }
        // If it's something else (like a string), try to parse it
        else if (typeof reg.answers === 'string') {
          try {
            answersObj = JSON.parse(reg.answers);
          } catch {
            answersObj = {};
          }
        }
      }
      
      return {
        id: reg._id.toString(),
        parentName: reg.parentName,
        answers: answersObj,
        luckyNumber: reg.luckyNumber,
        createdAt: reg.createdAt
      };
    });
    
    res.json({
      success: true,
      count: transformed.length,
      registrations: transformed
    });
    
  } catch (error) {
    console.error('Get registrations error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * DELETE /api/admin/reset
 * Clear all registrations (admin only)
 */
router.delete('/reset', validateAdminToken, async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'DELETE') {
      return res.status(400).json({ 
        error: 'Confirmation required. Send confirm: "DELETE"' 
      });
    }
    
    const result = await Registration.deleteMany({});
    
    res.json({
      success: true,
      message: 'All registrations cleared',
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

/**
 * GET /api/admin/stats
 * Get registration statistics
 */
router.get('/stats', validateAdminToken, async (req, res) => {
  try {
    const total = await Registration.countDocuments();
    const latest = await Registration.findOne()
      .sort({ createdAt: -1 })
      .lean();
    
    let latestAnswers = {};
    if (latest?.answers) {
      if (latest.answers instanceof Map) {
        latestAnswers = Object.fromEntries(latest.answers);
      } else if (typeof latest.answers === 'object') {
        latestAnswers = latest.answers;
      }
    }
    
    res.json({
      success: true,
      stats: {
        total,
        latestLuckyNumber: latest?.luckyNumber || null,
        latestRegistration: latest ? {
          id: latest._id.toString(),
          parentName: latest.parentName,
          answers: latestAnswers,
          luckyNumber: latest.luckyNumber,
          createdAt: latest.createdAt
        } : null
      }
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

export default router;