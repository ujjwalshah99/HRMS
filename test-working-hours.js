// Test today's attendance working hours calculation
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');

const prisma = new PrismaClient();

async function testWorkingHoursCalculation() {
  try {
    console.log('=== TESTING WORKING HOURS CALCULATION ===\n');
    
    // 1. Check current attendance for today
    console.log('1. CHECKING TODAY\'S ATTENDANCE IN DATABASE:');
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        employee: {
          user: {
            email: 'john.doe@updesco.com'
          }
        },
        date: {
          gte: new Date(todayString + 'T00:00:00.000Z'),
          lt: new Date(new Date(todayString + 'T00:00:00.000Z').getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: {
        employee: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (todayAttendance) {
      console.log('   ✅ Today\'s attendance found:');
      console.log(`   - Date: ${todayAttendance.date.toDateString()}`);
      console.log(`   - Status: ${todayAttendance.status}`);
      console.log(`   - Check-in: ${todayAttendance.checkInTime ? todayAttendance.checkInTime.toLocaleTimeString() : 'Not checked in'}`);
      console.log(`   - Check-out: ${todayAttendance.checkOutTime ? todayAttendance.checkOutTime.toLocaleTimeString() : 'Not checked out'}`);
      console.log(`   - Working Hours: ${todayAttendance.workingHours || 'Not calculated'}`);
      
      if (todayAttendance.checkInTime && todayAttendance.checkOutTime) {
        const diffMs = todayAttendance.checkOutTime.getTime() - todayAttendance.checkInTime.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        const hours = Math.floor(diffHours);
        const minutes = Math.floor((diffHours - hours) * 60);
        console.log(`   - Calculated Hours: ${hours}h ${minutes}m (${diffHours.toFixed(2)} hours)`);
      }
    } else {
      console.log('   ❌ No attendance record found for today');
    }
    
    // 2. Test API response
    console.log('\n2. TESTING API RESPONSE:');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.doe@updesco.com',
        password: 'password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      
      const attendanceResponse = await fetch('http://localhost:3000/api/attendance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json();
        const todayApiRecord = attendanceData.attendanceRecords.find(record => {
          const recordDate = new Date(record.date).toDateString();
          return recordDate === today.toDateString();
        });
        
        if (todayApiRecord) {
          console.log('   ✅ Today\'s attendance in API response:');
          console.log(`   - Date: ${todayApiRecord.date}`);
          console.log(`   - Status: ${todayApiRecord.status}`);
          console.log(`   - Check-in: ${todayApiRecord.checkInTime || 'Not checked in'}`);
          console.log(`   - Check-out: ${todayApiRecord.checkOutTime || 'Not checked out'}`);
          console.log(`   - Working Hours: ${todayApiRecord.workingHours || 'Not calculated'}`);
        } else {
          console.log('   ❌ Today\'s attendance not found in API response');
        }
      } else {
        console.log('   ❌ Attendance API failed');
      }
    } else {
      console.log('   ❌ Login failed');
    }
    
    // 3. Recommendations
    console.log('\n3. TROUBLESHOOTING STEPS:');
    console.log('   🔄 If working hours show as "--:--" after check-out:');
    console.log('   1. Hard refresh the browser (Ctrl+Shift+R)');
    console.log('   2. Check out again if the record shows you\'re still checked in');
    console.log('   3. Make sure both check-in and check-out times are recorded');
    console.log('   4. The working hours should calculate automatically on check-out');
    
    console.log('\n=== WORKING HOURS STATUS ===');
    if (todayAttendance && todayAttendance.checkInTime && todayAttendance.checkOutTime) {
      console.log('✅ Check-in and check-out recorded');
      if (todayAttendance.workingHours && todayAttendance.workingHours > 0) {
        console.log('✅ Working hours calculated and stored');
      } else {
        console.log('⚠️  Working hours not calculated - may need backend fix');
      }
    } else if (todayAttendance && todayAttendance.checkInTime && !todayAttendance.checkOutTime) {
      console.log('⏳ Checked in but not checked out yet');
    } else if (!todayAttendance) {
      console.log('⏳ No attendance record for today');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testWorkingHoursCalculation();
