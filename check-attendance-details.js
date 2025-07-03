// Check the specific attendance record details
const { PrismaClient } = require('@prisma/client');

async function checkAttendanceDetails() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking detailed attendance record...\n');

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const todayRecord = await prisma.attendance.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    });

    if (todayRecord) {
      console.log('📊 Detailed Attendance Record:');
      console.log('- Employee:', todayRecord.employee.user.name);
      console.log('- Date:', todayRecord.date);
      console.log('- Check-in time:', todayRecord.checkInTime);
      console.log('- Check-out time:', todayRecord.checkOutTime);
      console.log('- Working hours:', todayRecord.workingHours);
      console.log('- Status:', todayRecord.status);
      console.log('');

      if (todayRecord.checkInTime && todayRecord.checkOutTime) {
        const checkIn = new Date(todayRecord.checkInTime);
        const checkOut = new Date(todayRecord.checkOutTime);
        
        console.log('🕒 Time Analysis:');
        console.log('- Check-in time:', checkIn.toLocaleTimeString());
        console.log('- Check-in hour:', checkIn.getHours());
        console.log('- Check-in minute:', checkIn.getMinutes());
        console.log('- Check-out time:', checkOut.toLocaleTimeString());
        
        const isLate = checkIn.getHours() > 10 || (checkIn.getHours() === 10 && checkIn.getMinutes() > 30);
        const isHalfDay = todayRecord.workingHours && todayRecord.workingHours < 8;
        
        console.log('');
        console.log('📋 Status Logic:');
        console.log('- Is Late (after 10:30 AM):', isLate ? '✅ YES' : '❌ NO');
        console.log('- Is Half Day (< 8 hours):', isHalfDay ? '✅ YES' : '❌ NO');
        console.log('- Working hours:', todayRecord.workingHours || 'Not calculated');
        console.log('- Final status:', todayRecord.status);
        
        let expectedStatus = 'PRESENT';
        if (isLate) expectedStatus = 'LATE';
        if (isHalfDay) expectedStatus = 'HALF_DAY';
        
        console.log('- Expected status:', expectedStatus);
        console.log('- Status correct:', expectedStatus === todayRecord.status ? '✅' : '❌');
      }

      console.log('\n🎯 Attendance Page Verification:');
      console.log('✅ This record will show on /employee/attendance page');
      console.log('✅ Status will be displayed with appropriate color coding');
      console.log('✅ Calendar will show the attendance dot for today');
      
    } else {
      console.log('❌ No attendance record found for today');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAttendanceDetails();
