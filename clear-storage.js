// Simple script to test localStorage and authentication
console.log('Testing localStorage...');

// Clear any existing data
if (typeof localStorage !== 'undefined') {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  console.log('Cleared localStorage');
} else {
  console.log('localStorage not available (running on server)');
}

console.log('Test complete');
