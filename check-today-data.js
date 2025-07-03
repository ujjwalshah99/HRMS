const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTodayData() {
  try {
    console.log('🔍 Checking today\'s data (July 3, 2025)...\n');
    
    const employee = await prisma.employee.findFirst({
      include: { user: true }
    });
    
    if (!employee) {
      console.log('❌ No employee found');
      return;
    }
    
    console.log(`👤 Employee: ${employee.user.name}\n`);
    
    // Check today's attendance
    const todayDate = new Date('2025-07-03T00:00:00.000Z');
    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: todayDate
      }
    });
    
    console.log('📅 Today\'s Attendance (July 3, 2025):');
    if (todayAttendance) {
      console.log(`✅ Found record:`);
      console.log(`   Date: ${todayAttendance.date.toISOString()}`);
      console.log(`   Status: ${todayAttendance.status}`);
      console.log(`   Check-in: ${todayAttendance.checkInTime || 'Not checked in'}`);
      console.log(`   Check-out: ${todayAttendance.checkOutTime || 'Not checked out'}`);
      console.log(`   Working Hours: ${todayAttendance.workingHours || 'N/A'}`);
    } else {
      console.log('❌ No attendance record found for today');
    }
    
    // Check yesterday's attendance for comparison
    const yesterdayDate = new Date('2025-07-02T00:00:00.000Z');
    const yesterdayAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: yesterdayDate
      }
    });
    
    console.log('\n📅 Yesterday\'s Attendance (July 2, 2025):');
    if (yesterdayAttendance) {
      console.log(`✅ Found record:`);
      console.log(`   Date: ${yesterdayAttendance.date.toISOString()}`);
      console.log(`   Status: ${yesterdayAttendance.status}`);
      console.log(`   Check-in: ${yesterdayAttendance.checkInTime || 'Not checked in'}`);
      console.log(`   Check-out: ${yesterdayAttendance.checkOutTime || 'Not checked out'}`);
      console.log(`   Working Hours: ${yesterdayAttendance.workingHours || 'N/A'}`);
    } else {
      console.log('❌ No attendance record found for yesterday');
    }
    
    // Check all recent records
    console.log('\n📊 All Recent Attendance Records:');
    const recentRecords = await prisma.attendance.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: 'desc' },
      take: 5
    });
    
    recentRecords.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      const isToday = dateStr === '2025-07-03';
      const isYesterday = dateStr === '2025-07-02';
      
      let label = '';
      if (isToday) label = ' 👈 TODAY';
      if (isYesterday) label = ' 👈 YESTERDAY';
      
      console.log(`   ${dateStr} | ${record.status} | CheckIn: ${record.checkInTime ? '✅' : '❌'}${label}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTodayData();
