const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTodayAttendance() {
  try {
    console.log('📅 Creating attendance record for today (July 3, 2025)...\n');
    
    const employee = await prisma.employee.findFirst({
      include: { user: true }
    });
    
    if (!employee) {
      console.log('❌ No employee found');
      return;
    }
    
    console.log(`👤 Employee: ${employee.user.name}\n`);
    
    // Create today's date properly
    const todayString = '2025-07-03';
    const todayDate = new Date(todayString + 'T00:00:00.000Z');
    
    console.log(`Creating record for: ${todayDate.toISOString()}`);
    
    // Delete any existing record for today
    await prisma.attendance.deleteMany({
      where: {
        employeeId: employee.id,
        date: todayDate
      }
    });
    
    // Create check-in record for today
    const now = new Date();
    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date: todayDate,
        checkInTime: now,
        status: 'PRESENT'
      }
    });
    
    console.log('✅ Created attendance record:');
    console.log(`   Date: ${attendance.date.toISOString()}`);
    console.log(`   Check-in: ${attendance.checkInTime}`);
    console.log(`   Status: ${attendance.status}`);
    console.log('\n🎉 Dashboard should now show today\'s check-in time!');
    console.log('🔄 Refresh the browser to see the changes.');
    
  } catch (error) {
    console.error('❌ Error creating attendance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTodayAttendance();
