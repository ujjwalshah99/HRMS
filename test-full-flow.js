// Complete test of the authentication and attendance flow
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');

async function testCompleteFlow() {
  try {
    console.log('=== COMPLETE FLOW TEST ===\n');
    
    // Test 1: Login
    console.log('1. Testing login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.doe@updesco.com',
        password: 'password123'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('❌ Login failed:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login successful!');
    console.log('   User:', loginData.user.name, `(${loginData.user.email})`);
    console.log('   Role:', loginData.user.role);
    console.log('   Token received:', loginData.token ? 'Yes' : 'No');
    
    // Test 2: Decode token to see what's inside
    console.log('\n2. Testing token decoding...');
    try {
      const decoded = jwt.verify(loginData.token, 'your-super-secret-jwt-key-change-this-in-production');
      console.log('✅ Token decoded successfully');
      console.log('   Token content:', decoded);
    } catch (error) {
      console.error('❌ Token decode failed:', error.message);
    }
    
    // Test 3: Dashboard stats API (this should work)
    console.log('\n3. Testing dashboard stats API...');
    const statsResponse = await fetch('http://localhost:3000/api/dashboard/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });
    
    if (statsResponse.ok) {
      console.log('✅ Dashboard stats API works');
    } else {
      console.error('❌ Dashboard stats API failed:', await statsResponse.text());
    }
    
    // Test 4: Attendance API (this is the problematic one)
    console.log('\n4. Testing attendance API...');
    const attendanceResponse = await fetch('http://localhost:3000/api/attendance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('   Response status:', attendanceResponse.status);
    
    if (attendanceResponse.ok) {
      const attendanceData = await attendanceResponse.json();
      console.log('✅ Attendance API works!');
      console.log('   Response keys:', Object.keys(attendanceData));
      
      if (attendanceData.attendanceRecords) {
        console.log('   Records count:', attendanceData.attendanceRecords.length);
        attendanceData.attendanceRecords.forEach((record, index) => {
          console.log(`   ${index + 1}. ${record.date}: ${record.status}`);
        });
      }
    } else {
      const errorText = await attendanceResponse.text();
      console.error('❌ Attendance API failed:', errorText);
    }
    
    console.log('\n=== TEST COMPLETE ===');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCompleteFlow();
