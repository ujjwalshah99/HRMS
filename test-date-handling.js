const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function getTodayDateString() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return today.toISOString().split('T')[0];
}

function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

async function testDateHandling() {
  try {
    console.log('🕐 Testing date handling consistency...\n');
    
    const now = new Date();
    const todayString = getTodayDateString();
    const todayDate = getTodayDate();
    
    console.log('📅 Current Date Information:');
    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Today string: ${todayString}`);
    console.log(`Today date: ${todayDate.toISOString()}`);
    console.log('');
    
    // Get employee for testing
    const employee = await prisma.employee.findFirst({
      include: { user: true }
    });
    
    if (!employee) {
      console.log('❌ No employee found');
      return;
    }
    
    console.log(`👤 Testing with employee: ${employee.user.name}\n`);
    
    // Check if there's an attendance record for today
    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: todayDate
      }
    });
    
    console.log('🔍 Today\'s Attendance Check:');
    if (todayAttendance) {
      console.log(`✅ Found attendance record for today:`);
      console.log(`   Date: ${todayAttendance.date}`);
      console.log(`   Status: ${todayAttendance.status}`);
      console.log(`   Check-in: ${todayAttendance.checkInTime || 'Not checked in'}`);
      console.log(`   Check-out: ${todayAttendance.checkOutTime || 'Not checked out'}`);
    } else {
      console.log('ℹ️  No attendance record found for today');
      console.log('   This means the dashboard should show "Ready to start your day?"');
    }
    
    console.log('\n📊 All recent attendance records:');
    const recentRecords = await prisma.attendance.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: 'desc' },
      take: 5,
      include: {
        employee: {
          include: { user: true }
        }
      }
    });
    
    recentRecords.forEach(record => {
      const recordDateString = new Date(record.date).toISOString().split('T')[0];
      const isToday = recordDateString === todayString;
      const indicator = isToday ? '👉 TODAY' : '';
      
      console.log(`   ${recordDateString} | ${record.status} ${indicator}`);
    });
    
    console.log('\n🎯 Date Comparison Test:');
    console.log(`Today (our function): ${todayString}`);
    recentRecords.forEach(record => {
      const recordDateString = new Date(record.date).toISOString().split('T')[0];
      const matches = recordDateString === todayString;
      console.log(`Record date: ${recordDateString} | Matches: ${matches ? '✅' : '❌'}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing date handling:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDateHandling();
