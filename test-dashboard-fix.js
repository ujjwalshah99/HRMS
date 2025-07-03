// Test script to verify dashboard fixes
const baseUrl = 'http://localhost:3001';

async function testDashboardFix() {
  try {
    console.log('🧪 Testing Dashboard Fix...\n');

    // Login as employee
    console.log('1. Logging in as employee...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'john.doe@updesco.com',
        password: 'password123'
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');

    // Test attendance GET endpoint
    console.log('\n2. Testing attendance GET endpoint...');
    const attendanceResponse = await fetch(`${baseUrl}/api/attendance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!attendanceResponse.ok) {
      throw new Error(`Attendance GET failed: ${attendanceResponse.status}`);
    }

    const attendanceData = await attendanceResponse.json();
    console.log('✅ Attendance GET successful');
    console.log('📊 Response structure:', {
      hasAttendanceRecords: 'attendanceRecords' in attendanceData,
      attendanceRecordsCount: attendanceData.attendanceRecords?.length || 0,
      sampleRecord: attendanceData.attendanceRecords?.[0] || 'No records'
    });

    // Test check-in
    console.log('\n3. Testing check-in...');
    const checkinResponse = await fetch(`${baseUrl}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: 'check-in'
      }),
    });

    if (!checkinResponse.ok) {
      const errorData = await checkinResponse.json();
      console.log('ℹ️ Check-in response:', errorData.message);
    } else {
      const checkinData = await checkinResponse.json();
      console.log('✅ Check-in successful');
      console.log('📊 Check-in response structure:', {
        hasAttendance: 'attendance' in checkinData,
        checkInTime: checkinData.attendance?.checkInTime,
        message: checkinData.message
      });
    }

    // Test dashboard stats
    console.log('\n4. Testing dashboard stats...');
    const statsResponse = await fetch(`${baseUrl}/api/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!statsResponse.ok) {
      throw new Error(`Dashboard stats failed: ${statsResponse.status}`);
    }

    const statsData = await statsResponse.json();
    console.log('✅ Dashboard stats successful');
    console.log('📊 Stats:', statsData);

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📍 Database location: d:\\HRMS\\prisma\\dev.db');
    console.log('🌐 Website URL: http://localhost:3001');
    console.log('👤 Test credentials: john.doe@updesco.com / password123');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testDashboardFix();
