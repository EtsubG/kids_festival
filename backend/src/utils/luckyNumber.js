import Registration from '../models/Registration.js';

/**
 * Generate a unique random 3-digit number (100-999)
 * that hasn't been used yet
 */
export async function generateUniqueLuckyNumber() {
  // Get all used numbers
  const usedNumbers = await Registration.find({}, 'luckyNumber').lean();
  const usedSet = new Set(usedNumbers.map(r => r.luckyNumber));
  
  // If all numbers are used (max 900 registrations)
  if (usedSet.size >= 900) {
    throw new Error('All lucky numbers (100-999) have been used');
  }
  
  // Generate random number
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    const number = Math.floor(Math.random() * 900) + 100; // 100-999
    
    if (!usedSet.has(number)) {
      return number;
    }
    attempts++;
  }
  
  // Fallback: scan for first available number
  for (let num = 100; num <= 999; num++) {
    if (!usedSet.has(num)) {
      return num;
    }
  }
  
  throw new Error('No available lucky numbers found');
}