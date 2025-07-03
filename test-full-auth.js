// Test authentication flow for all roles
const fetch = require('node-fetch');

const baseUrl = 'http://localhost:3001';

const testUsers = [
  { role: 'Employee', email: 'john.doe@updesco.com', password: 'password123' },
  { role: 'Manager', email: 'manager@updesco.com', password: 'manager123' },
  { role: 'MD', email: 'md@updesco.com', password: 'password123' }
];

async function testAuthFlow() {
  console.log('🧪 Testing Authentication Flow...\n');

  for (const user of testUsers) {
    console.log(`Testing ${user.role} login...`);
    
    try {
      // Test login
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log(`✅ ${user.role} login successful`);
        console.log(`   User: ${loginData.user.name} (${loginData.user.role})`);
        
        // Test dashboard access with token
        const dashboardUrl = user.role === 'Employee' ? '/api/dashboard/stats' :
                            user.role === 'Manager' ? '/manager/dashboard' :
                            '/md/dashboard';
        
        const dashboardResponse = await fetch(`${baseUrl}${dashboardUrl}`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        if (dashboardResponse.ok) {
          console.log(`✅ ${user.role} dashboard access successful`);
        } else {
          console.log(`❌ ${user.role} dashboard access failed: ${dashboardResponse.status}`);
        }
        
      } else {
        const errorData = await loginResponse.json();
        console.log(`❌ ${user.role} login failed: ${errorData.error || loginResponse.status}`);
      }
      
    } catch (error) {
      console.log(`❌ ${user.role} test failed: ${error.message}`);
    }
    
    console.log('');
  }
}

testAuthFlow();
