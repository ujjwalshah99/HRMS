const jwt = require('jsonwebtoken');

// Test JWT token validity
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImVtcGxveWVlQGV4YW1wbGUuY29tIiwicm9sZSI6IkVNUExPWUVFIiwiaWF0IjoxNzM3NjQwNTY4LCJleHAiOjE3Mzc3MjY5Njh9.oM2zcpU7uB9QxV10gJHjGTaJGHbOJtVXQMOCCx0-KaI';

try {
  // Check if token is valid
  const decoded = jwt.verify(token, 'your-super-secret-jwt-key-change-this-in-production');
  console.log('Token is valid:', decoded);
  
  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  console.log('Current time:', now);
  console.log('Token expires:', decoded.exp);
  console.log('Token expired:', now > decoded.exp);
  
} catch (error) {
  console.error('Token validation failed:', error.message);
}
