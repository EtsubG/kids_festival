export function validateAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized: No token provided' 
    });
  }
  
  const token = authHeader.split(' ')[1];
  const adminPassword = process.env.ADMIN_PASSWORD || 'festival2026';
  
  // Simple token validation (you can enhance this with JWT)
  if (token !== adminPassword) {
    return res.status(401).json({ 
      error: 'Unauthorized: Invalid token' 
    });
  }
  
  next();
}

export function validateAdminSession(req, res, next) {
  // For session-based auth (using cookies)
  // This is a placeholder - implement your session logic
  const session = req.headers['x-admin-session'];
  
  if (!session || session !== 'authenticated') {
    return res.status(401).json({ 
      error: 'Unauthorized: No admin session' 
    });
  }
  
  next();
}