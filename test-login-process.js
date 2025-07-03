// Test login process
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('=== TESTING LOGIN PROCESS ===\n');
    
    // Try to login
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.doe@updesco.com',
        password: 'password123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    
    if (!loginResponse.ok) {
      console.error('Login failed:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('Login successful!');
    console.log('User:', loginData.user);
    console.log('Token received:', loginData.token ? 'Yes' : 'No');
    
    // Now test attendance endpoint with the token
    console.log('\n=== TESTING ATTENDANCE API WITH TOKEN ===');
    const attendanceResponse = await fetch('http://localhost:3001/api/attendance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Attendance response status:', attendanceResponse.status);
    
    if (!attendanceResponse.ok) {
      console.error('Attendance API failed:', await attendanceResponse.text());
      return;
    }
    
    const attendanceData = await attendanceResponse.json();
    console.log('Attendance API successful!');
    console.log('Response keys:', Object.keys(attendanceData));
    
    if (attendanceData.attendanceRecords) {
      console.log('Records count:', attendanceData.attendanceRecords.length);
      attendanceData.attendanceRecords.forEach((record, index) => {
        console.log(`${index + 1}. ${record.date}: ${record.status}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testLogin();
