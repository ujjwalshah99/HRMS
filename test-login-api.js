const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login API...');
    
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.doe@updesco.com',
        password: 'password123'
      })
    });

    console.log('Login response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', {
        user: data.user,
        tokenExists: !!data.token
      });
      
      // Test dashboard stats API with the token
      console.log('\nTesting dashboard API with token...');
      const statsResponse = await fetch('http://localhost:3001/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      console.log('Dashboard stats response status:', statsResponse.status);
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('Dashboard stats successful:', statsData);
      } else {
        const errorData = await statsResponse.json();
        console.log('Dashboard stats failed:', errorData);
      }
      
    } else {
      const errorData = await response.json();
      console.log('Login failed:', errorData);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testLogin();
