// Verify that today's attendance has been cleared
const baseUrl = 'http://localhost:3000';

async function verifyAttendanceCleared() {
  try {
    console.log('🔍 Verifying attendance has been cleared...\n');

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

    // Check attendance records
    console.log('\n📊 Checking current attendance status...');
    const attendanceResponse = await fetch(`${baseUrl}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!attendanceResponse.ok) {
      throw new Error(`Attendance fetch failed: ${attendanceResponse.status}`);
    }
    
    const attendanceData = await attendanceResponse.json();
    
    // Check today's record
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = attendanceData.attendanceRecords?.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === today;
    });
    
    console.log('📅 Today\'s attendance status:', {
      hasRecord: !!todayRecord,
      date: today,
      totalRecords: attendanceData.attendanceRecords?.length || 0
    });

    if (!todayRecord) {
      console.log('✅ SUCCESS: No attendance record found for today');
      console.log('👍 User can now check in fresh');
    } else {
      console.log('⚠️ Unexpected: Still found a record for today:', {
        checkInTime: todayRecord.checkInTime,
        checkOutTime: todayRecord.checkOutTime,
        status: todayRecord.status
      });
    }

    // Check dashboard stats
    console.log('\n📈 Checking dashboard stats...');
    const statsResponse = await fetch(`${baseUrl}/api/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('📊 Today\'s attendance from stats:', {
        hasToday: !!statsData.stats?.todayAttendance,
        checkInTime: statsData.stats?.todayAttendance?.checkInTime || 'Not checked in',
        checkOutTime: statsData.stats?.todayAttendance?.checkOutTime || 'Not checked out'
      });
    }

    console.log('\n🎉 Verification complete!');
    console.log('🌐 You can now refresh the website and see that check-in is available again.');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyAttendanceCleared();
