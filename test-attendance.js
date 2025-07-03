const fetch = require('node-fetch');

async function testAttendance() {
  console.log('🕐 TESTING ATTENDANCE CHECK-IN/CHECK-OUT\n');

  try {
    // First, login to get a token
    console.log('1️⃣ Logging in as employee...');
    const loginResponse = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.doe@updesco.com', password: 'password123' })
    });

    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');

    // Test check-in
    console.log('\n2️⃣ Testing check-in...');
    const checkInResponse = await fetch('http://localhost:3002/api/attendance', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type: 'check-in' })
    });

    if (checkInResponse.ok) {
      const checkInData = await checkInResponse.json();
      console.log('✅ Check-in successful');
      console.log('   Response:', JSON.stringify(checkInData, null, 2));
    } else {
      const errorData = await checkInResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.log('❌ Check-in failed');
      console.log('   Error:', errorData.error || `Status: ${checkInResponse.status}`);
    }

    // Test check-out
    console.log('\n3️⃣ Testing check-out...');
    const checkOutResponse = await fetch('http://localhost:3002/api/attendance', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ type: 'check-out' })
    });

    if (checkOutResponse.ok) {
      const checkOutData = await checkOutResponse.json();
      console.log('✅ Check-out successful');
      console.log('   Response:', JSON.stringify(checkOutData, null, 2));
    } else {
      const errorData = await checkOutResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.log('❌ Check-out failed');
      console.log('   Error:', errorData.error || `Status: ${checkOutResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAttendance();
