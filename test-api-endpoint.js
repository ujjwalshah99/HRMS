// Test the actual API endpoint
const fetch = require('node-fetch');

async function testAPIEndpoint() {
  try {
    console.log('=== TESTING ACTUAL API ENDPOINT ===\n');
    
    // First login to get token
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.doe@example.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('Login failed:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('Login successful, token received');
    
    // Now test attendance endpoint
    const attendanceResponse = await fetch('http://localhost:3001/api/attendance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (!attendanceResponse.ok) {
      console.error('Attendance API failed:', await attendanceResponse.text());
      return;
    }
    
    const attendanceData = await attendanceResponse.json();
    console.log('API Response received');
    console.log('Response structure:', Object.keys(attendanceData));
    
    if (attendanceData.attendanceRecords) {
      console.log('Attendance records:', attendanceData.attendanceRecords.length);
      attendanceData.attendanceRecords.forEach((record, index) => {
        console.log(`${index + 1}. Date: ${record.date}, Status: ${record.status}`);
      });
    } else {
      console.log('No attendanceRecords field in response');
      console.log('Full response:', JSON.stringify(attendanceData, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAPIEndpoint();
