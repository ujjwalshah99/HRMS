// Debug the date handling issue
const baseUrl = 'http://localhost:3000';

async function debugDateHandling() {
  try {
    console.log('🔍 Debugging date handling issue...\n');

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

    // Get attendance data
    console.log('\n📊 Fetching attendance data...');
    const attendanceResponse = await fetch(`${baseUrl}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!attendanceResponse.ok) {
      throw new Error(`Attendance fetch failed: ${attendanceResponse.status}`);
    }
    
    const attendanceData = await attendanceResponse.json();
    
    console.log('📋 Raw attendance data structure:');
    console.log('- Has attendanceRecords:', 'attendanceRecords' in attendanceData);
    console.log('- Records count:', attendanceData.attendanceRecords?.length || 0);
    
    if (attendanceData.attendanceRecords && attendanceData.attendanceRecords.length > 0) {
      const firstRecord = attendanceData.attendanceRecords[0];
      console.log('\n🔍 First record details:');
      console.log('- Raw date:', firstRecord.date);
      console.log('- Check-in time:', firstRecord.checkInTime);
      console.log('- Check-out time:', firstRecord.checkOutTime);
      
      // Test date comparison logic
      const today = new Date().toISOString().split('T')[0];
      const recordDate = new Date(firstRecord.date).toISOString().split('T')[0];
      
      console.log('\n📅 Date comparison:');
      console.log('- Today (local):', today);
      console.log('- Record date (from DB):', recordDate);
      console.log('- Dates match:', recordDate === today);
      
      // Alternative date comparison
      const todayLocal = new Date();
      const recordLocal = new Date(firstRecord.date);
      
      console.log('\n🕒 Alternative comparison:');
      console.log('- Today full:', todayLocal.toISOString());
      console.log('- Record full:', recordLocal.toISOString());
      console.log('- Today date only:', todayLocal.toDateString());
      console.log('- Record date only:', recordLocal.toDateString());
      console.log('- Date strings match:', todayLocal.toDateString() === recordLocal.toDateString());
    }

    // Also check dashboard stats API
    console.log('\n📈 Checking dashboard stats...');
    const statsResponse = await fetch(`${baseUrl}/api/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('📊 Dashboard stats today\'s attendance:');
      console.log('- Has today attendance:', !!statsData.stats?.todayAttendance);
      if (statsData.stats?.todayAttendance) {
        console.log('- Check-in time:', statsData.stats.todayAttendance.checkInTime);
        console.log('- Check-out time:', statsData.stats.todayAttendance.checkOutTime);
        console.log('- Date:', statsData.stats.todayAttendance.date);
      }
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugDateHandling();
