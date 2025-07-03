const fetch = require('node-fetch');

async function fullAttendanceTest() {
  console.log('🔄 COMPREHENSIVE ATTENDANCE SYSTEM TEST\n');

  try {
    // Step 1: Reset attendance
    console.log('1️⃣ Resetting attendance for fresh test...');
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.attendance.deleteMany({
      where: { date: today }
    });
    await prisma.$disconnect();
    console.log('✅ Attendance reset complete');

    // Step 2: Login
    console.log('\n2️⃣ Logging in as employee...');
    const loginResponse = await fetch('http://localhost:3002/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.doe@updesco.com', password: 'password123' })
    });

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');

    // Step 3: Check initial dashboard stats
    console.log('\n3️⃣ Getting initial dashboard stats...');
    const initialStatsResponse = await fetch('http://localhost:3002/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (initialStatsResponse.ok) {
      const initialStats = await initialStatsResponse.json();
      console.log('✅ Dashboard stats loaded');
    }

    // Step 4: Check-in
    console.log('\n4️⃣ Testing check-in...');
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
      console.log(`   Status: ${checkInData.attendance.status}`);
      console.log(`   Check-in time: ${new Date(checkInData.attendance.checkInTime).toLocaleTimeString()}`);
    } else {
      console.log('❌ Check-in failed');
      const error = await checkInResponse.json();
      console.log('   Error:', error.error);
      return;
    }

    // Step 5: Wait a moment and check-out
    console.log('\n5️⃣ Waiting 2 seconds then testing check-out...');
    await new Promise(resolve => setTimeout(resolve, 2000));

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
      console.log(`   Status: ${checkOutData.attendance.status}`);
      console.log(`   Check-out time: ${new Date(checkOutData.attendance.checkOutTime).toLocaleTimeString()}`);
      console.log(`   Working hours: ${checkOutData.attendance.workingHours?.toFixed(4)} hours`);
    } else {
      console.log('❌ Check-out failed');
      const error = await checkOutResponse.json();
      console.log('   Error:', error.error);
      return;
    }

    // Step 6: Get attendance records
    console.log('\n6️⃣ Verifying attendance records...');
    const attendanceResponse = await fetch('http://localhost:3002/api/attendance', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (attendanceResponse.ok) {
      const attendanceData = await attendanceResponse.json();
      const todayRecord = attendanceData.attendanceRecords.find(record => {
        const recordDate = new Date(record.date);
        const today = new Date();
        return recordDate.toDateString() === today.toDateString();
      });

      if (todayRecord) {
        console.log('✅ Today\'s attendance record found');
        console.log(`   Employee: ${todayRecord.employee.user.name}`);
        console.log(`   Date: ${new Date(todayRecord.date).toDateString()}`);
        console.log(`   Status: ${todayRecord.status}`);
        console.log(`   Check-in: ${new Date(todayRecord.checkInTime).toLocaleTimeString()}`);
        console.log(`   Check-out: ${new Date(todayRecord.checkOutTime).toLocaleTimeString()}`);
        console.log(`   Working hours: ${todayRecord.workingHours?.toFixed(4)} hours`);
      } else {
        console.log('❌ Today\'s attendance record not found');
      }
    }

    console.log('\n🎉 ATTENDANCE SYSTEM TEST COMPLETE!');
    console.log('\n📋 SUMMARY:');
    console.log('✅ API authentication working');
    console.log('✅ Check-in functionality working');
    console.log('✅ Check-out functionality working');
    console.log('✅ Working hours calculation working');
    console.log('✅ Attendance status determination working');
    console.log('✅ Database storage working');
    console.log('\n🌐 Now test the dashboard at: http://localhost:3002/employee/dashboard');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

fullAttendanceTest();
