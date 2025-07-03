// Test the dashboard with debug output
const baseUrl = 'http://localhost:3000';

async function testDashboardDebug() {
  try {
    console.log('🧪 Testing dashboard with debug output...\n');

    // Login as employee
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

    // Test getting attendance data
    console.log('\n📊 Testing attendance fetch...');
    const attendanceResponse = await fetch(`${baseUrl}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!attendanceResponse.ok) {
      throw new Error(`Attendance fetch failed: ${attendanceResponse.status}`);
    }
    
    const attendanceData = await attendanceResponse.json();
    console.log('✅ Attendance data fetched');
    console.log('📋 Records count:', attendanceData.attendanceRecords?.length || 0);

    // Now test a fresh check-in to see if it works without errors
    console.log('\n🔄 Testing fresh check-in...');
    const checkinResponse = await fetch(`${baseUrl}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type: 'check-in' }),
    });

    if (!checkinResponse.ok) {
      const errorData = await checkinResponse.json();
      console.log('❌ Check-in failed:', errorData.error);
    } else {
      const checkinData = await checkinResponse.json();
      console.log('✅ Check-in successful!');
      console.log('📊 Response:', {
        checkInTime: checkinData.attendance?.checkInTime,
        message: checkinData.message
      });

      // Now test getting attendance again to see if it's detected
      console.log('\n🔍 Testing attendance detection after check-in...');
      const newAttendanceResponse = await fetch(`${baseUrl}/api/attendance`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (newAttendanceResponse.ok) {
        const newAttendanceData = await newAttendanceResponse.json();
        console.log('📋 New records count:', newAttendanceData.attendanceRecords?.length || 0);
        
        if (newAttendanceData.attendanceRecords && newAttendanceData.attendanceRecords.length > 0) {
          const latestRecord = newAttendanceData.attendanceRecords[0];
          console.log('📅 Latest record:', {
            date: latestRecord.date,
            checkInTime: latestRecord.checkInTime,
            checkOutTime: latestRecord.checkOutTime
          });
        }
      }
    }

    console.log('\n🎯 Visit http://localhost:3000 and login to see the dashboard!');
    console.log('👤 Credentials: john.doe@updesco.com / password123');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDashboardDebug();
