import express from 'express';
import Registration from '../models/Registration.js';
import { generateUniqueLuckyNumber } from '../utils/luckyNumber.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { parentName, answers } = req.body;
    
    if (!parentName || parentName.trim().length === 0) {
      return res.status(400).json({ error: 'Parent name is required' });
    }
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Answers are required' });
    }
    
    const questionIds = ['q1', 'q2', 'q3', 'q4', 'q5'];
    for (const qId of questionIds) {
      if (!answers[qId] || answers[qId].trim().length === 0) {
        return res.status(400).json({ error: `Question ${qId} must be answered` });
      }
    }
    
    const luckyNumber = await generateUniqueLuckyNumber();
    
    // Store answers as a plain object
    const registration = new Registration({
      parentName: parentName.trim(),
      answers: answers, // Plain object, not a Map
      luckyNumber
    });
    
    await registration.save();
    
    res.status(201).json({
      success: true,
      luckyNumber,
      message: 'Registration successful'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

export default router;