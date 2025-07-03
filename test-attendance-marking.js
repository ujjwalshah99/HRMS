// Test the attendance marking logic
const baseUrl = 'http://localhost:3000';

async function testAttendanceMarking() {
  try {
    console.log('🧪 Testing Attendance Marking Logic...\n');

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

    // Get current attendance state
    console.log('\n1️⃣ Checking current attendance state...');
    const attendanceResponse = await fetch(`${baseUrl}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (attendanceResponse.ok) {
      const data = await attendanceResponse.json();
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = data.attendanceRecords?.find(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });
      
      console.log('📅 Today\'s record:', {
        exists: !!todayRecord,
        checkInTime: todayRecord?.checkInTime || 'Not checked in',
        checkOutTime: todayRecord?.checkOutTime || 'Not checked out',
        status: todayRecord?.status || 'No status',
        workingHours: todayRecord?.workingHours || 'Not calculated'
      });

      // Test checkout if checked in
      if (todayRecord && todayRecord.checkInTime && !todayRecord.checkOutTime) {
        console.log('\n2️⃣ Testing check-out to mark attendance...');
        const checkoutResponse = await fetch(`${baseUrl}/api/attendance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ type: 'check-out' }),
        });

        if (checkoutResponse.ok) {
          const checkoutData = await checkoutResponse.json();
          console.log('✅ Check-out successful!');
          
          const attendance = checkoutData.attendance;
          const checkInTime = new Date(attendance.checkInTime);
          const checkOutTime = new Date(attendance.checkOutTime);
          const workingHours = attendance.workingHours;
          
          console.log('📊 Final attendance details:');
          console.log('- Check-in time:', checkInTime.toLocaleTimeString());
          console.log('- Check-out time:', checkOutTime.toLocaleTimeString());
          console.log('- Working hours:', workingHours, 'hours');
          console.log('- Final status:', attendance.status);
          
          // Verify status logic
          const checkInHour = checkInTime.getHours();
          const checkInMinute = checkInTime.getMinutes();
          
          console.log('\n🔍 Status Logic Verification:');
          console.log('- Check-in hour:', checkInHour);
          console.log('- Check-in minute:', checkInMinute);
          console.log('- Was late (after 10:30 AM):', checkInHour > 10 || (checkInHour === 10 && checkInMinute > 30));
          console.log('- Working hours < 8:', workingHours < 8);
          
          let expectedStatus = 'PRESENT';
          if (checkInHour > 10 || (checkInHour === 10 && checkInMinute > 30)) {
            expectedStatus = 'LATE';
          }
          if (workingHours < 8) {
            expectedStatus = 'HALF_DAY';
          }
          
          console.log('- Expected status:', expectedStatus);
          console.log('- Actual status:', attendance.status);
          console.log('- Status correct:', expectedStatus === attendance.status ? '✅' : '❌');

        } else {
          const errorData = await checkoutResponse.json();
          console.log('❌ Check-out failed:', errorData.error);
        }
      } else if (!todayRecord || !todayRecord.checkInTime) {
        console.log('\n⚠️ No check-in found for today. Testing fresh check-in...');
        
        // Test check-in first
        const checkinResponse = await fetch(`${baseUrl}/api/attendance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ type: 'check-in' }),
        });

        if (checkinResponse.ok) {
          const checkinData = await checkinResponse.json();
          console.log('✅ Check-in successful!');
          
          const checkInTime = new Date(checkinData.attendance.checkInTime);
          const checkInHour = checkInTime.getHours();
          const checkInMinute = checkInTime.getMinutes();
          
          console.log('📊 Check-in details:');
          console.log('- Check-in time:', checkInTime.toLocaleTimeString());
          console.log('- Check-in hour:', checkInHour);
          console.log('- Initial status:', checkinData.attendance.status);
          console.log('- Is late (after 10:30 AM):', checkInHour > 10 || (checkInHour === 10 && checkInMinute > 30) ? '✅ LATE' : '❌ ON TIME');
        }
      } else {
        console.log('\n✅ Already checked out for today. Status is final.');
      }
    }

    console.log('\n3️⃣ Final verification - checking attendance page data...');
    const finalCheck = await fetch(`${baseUrl}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (finalCheck.ok) {
      const finalData = await finalCheck.json();
      const today = new Date().toISOString().split('T')[0];
      const finalRecord = finalData.attendanceRecords?.find(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });
      
      console.log('📋 Final attendance record for today:');
      if (finalRecord) {
        console.log('- Date:', new Date(finalRecord.date).toDateString());
        console.log('- Check-in:', finalRecord.checkInTime ? new Date(finalRecord.checkInTime).toLocaleTimeString() : 'Not checked in');
        console.log('- Check-out:', finalRecord.checkOutTime ? new Date(finalRecord.checkOutTime).toLocaleTimeString() : 'Not checked out');
        console.log('- Working hours:', finalRecord.workingHours || 'Not calculated');
        console.log('- Status:', finalRecord.status);
        console.log('✅ This will appear on the employee/attendance page');
      } else {
        console.log('❌ No attendance record found for today');
      }
    }

    console.log('\n🎉 Test completed!');
    console.log('🌐 Visit http://localhost:3000/employee/attendance to see the attendance calendar');
    console.log('👤 Login: john.doe@updesco.com / password123');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAttendanceMarking();
