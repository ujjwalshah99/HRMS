const fetch = require('node-fetch');

async function debugAttendanceIssue() {
  console.log('🔍 DEBUGGING ATTENDANCE ISSUE\n');

  try {
    // Test current server port
    console.log('1️⃣ Testing server ports...');
    
    const ports = [3000, 3001, 3002, 3003];
    for (const port of ports) {
      try {
        const response = await fetch(`http://localhost:${port}`, { timeout: 1000 });
        if (response.ok) {
          console.log(`✅ Server responding on port ${port}`);
        }
      } catch (error) {
        console.log(`❌ No server on port ${port}`);
      }
    }

    // Test login and get detailed error
    console.log('\n2️⃣ Testing attendance API with detailed debugging...');
    
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
    console.log('✅ Login successful');

    // Reset attendance first
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.attendance.deleteMany({
      where: { date: today }
    });
    await prisma.$disconnect();
    console.log('✅ Attendance reset');

    // Test check-in with detailed debugging
    console.log('\n3️⃣ Testing check-in with detailed request...');
    
    const requestBody = { type: 'check-in' };
    console.log('Request body:', JSON.stringify(requestBody));
    
    const checkInResponse = await fetch('http://localhost:3002/api/attendance', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', checkInResponse.status);
    console.log('Response headers:', Object.fromEntries(checkInResponse.headers.entries()));

    if (checkInResponse.ok) {
      const result = await checkInResponse.json();
      console.log('✅ Success response:', JSON.stringify(result, null, 2));
    } else {
      const error = await checkInResponse.text();
      console.log('❌ Error response:', error);
      
      try {
        const errorJson = JSON.parse(error);
        console.log('❌ Parsed error:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log('❌ Could not parse error as JSON');
      }
    }

  } catch (error) {
    console.error('❌ Debug test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugAttendanceIssue();
