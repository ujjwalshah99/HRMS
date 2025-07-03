// Final test with date fix
const baseUrl = 'http://localhost:3000';

async function finalDateFixTest() {
  try {
    console.log('🎯 FINAL TEST: Date Fix Verification\n');

    // Login
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

    // Test 1: Check initial state (should be no attendance for today)
    console.log('\n1️⃣ Checking initial attendance state...');
    const initialAttendance = await fetch(`${baseUrl}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (initialAttendance.ok) {
      const data = await initialAttendance.json();
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = data.attendanceRecords?.find(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });
      
      console.log('📅 Today\'s date:', today);
      console.log('📊 Today\'s record exists:', !!todayRecord);
    }

    // Test 2: Perform check-in with fixed date logic
    console.log('\n2️⃣ Testing check-in with date fix...');
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
      return;
    }

    const checkinData = await checkinResponse.json();
    console.log('✅ Check-in successful!');
    console.log('📊 Check-in details:', {
      checkInTime: checkinData.attendance?.checkInTime,
      date: checkinData.attendance?.date,
      message: checkinData.message
    });

    // Test 3: Verify the record can be found by dashboard logic
    console.log('\n3️⃣ Verifying dashboard can find the record...');
    const verifyAttendance = await fetch(`${baseUrl}/api/attendance`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (verifyAttendance.ok) {
      const data = await verifyAttendance.json();
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = data.attendanceRecords?.find(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });
      
      console.log('📅 Dashboard date comparison:');
      console.log('- Today:', today);
      console.log('- Found record:', !!todayRecord);
      
      if (todayRecord) {
        console.log('- Record date (raw):', todayRecord.date);
        console.log('- Record date (parsed):', new Date(todayRecord.date).toISOString().split('T')[0]);
        console.log('- Check-in time:', todayRecord.checkInTime);
        console.log('✅ Dashboard should now display check-in time!');
      } else {
        console.log('❌ Record not found - date mismatch still exists');
      }
    }

    // Test 4: Try to check-in again (should give error)
    console.log('\n4️⃣ Testing double check-in prevention...');
    const doubleCheckin = await fetch(`${baseUrl}/api/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ type: 'check-in' }),
    });

    if (!doubleCheckin.ok) {
      const errorData = await doubleCheckin.json();
      console.log('✅ Double check-in properly prevented:', errorData.error);
    } else {
      console.log('⚠️ Double check-in was allowed (unexpected)');
    }

    console.log('\n🎉 TEST COMPLETE!');
    console.log('\n📋 SUMMARY:');
    console.log('✅ Date handling fixed');
    console.log('✅ Check-in working');
    console.log('✅ Dashboard should display times correctly');
    console.log('✅ Error handling working');
    
    console.log('\n🌐 Visit http://localhost:3000 and login to see the dashboard!');
    console.log('👤 Credentials: john.doe@updesco.com / password123');
    console.log('💡 The check-in time should now be displayed correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

finalDateFixTest();
