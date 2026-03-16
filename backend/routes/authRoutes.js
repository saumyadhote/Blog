const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Simple unified login for admin since it's just a single user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Hardcoded admin credentials for simplicity 
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign(
      { username: adminUser, role: 'admin' }, 
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;
