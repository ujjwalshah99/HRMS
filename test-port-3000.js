const fetch = require('node-fetch');

async function testAttendancePort3000() {
  console.log('🔍 TESTING ATTENDANCE ON PORT 3000\n');

  try {
    // Test login
    console.log('1️⃣ Testing login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.doe@updesco.com', password: 'password123' })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');

    // Test check-in
    console.log('\n2️⃣ Testing check-in...');
    const checkInResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({ type: 'check-in' })
    });

    console.log('Check-in response status:', checkInResponse.status);

    if (checkInResponse.ok) {
      const checkInData = await checkInResponse.json();
      console.log('✅ Check-in successful!');
      console.log('Response:', JSON.stringify(checkInData, null, 2));
    } else {
      const error = await checkInResponse.text();
      console.log('❌ Check-in failed');
      console.log('Error:', error);
    }

    // Test check-out
    console.log('\n3️⃣ Testing check-out...');
    const checkOutResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({ type: 'check-out' })
    });

    if (checkOutResponse.ok) {
      const checkOutData = await checkOutResponse.json();
      console.log('✅ Check-out successful!');
      console.log('Response:', JSON.stringify(checkOutData, null, 2));
    } else {
      const error = await checkOutResponse.text();
      console.log('❌ Check-out failed');
      console.log('Error:', error);
    }

    console.log('\n🌐 Test the website at: http://localhost:3000/employee/dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAttendancePort3000();
