const { PrismaClient } = require('@prisma/client');

async function resetTodayAttendance() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Resetting today\'s attendance for testing...');
    
    // Get today's date at start of day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Delete today's attendance records
    const result = await prisma.attendance.deleteMany({
      where: {
        date: today
      }
    });
    
    console.log(`✅ Deleted ${result.count} attendance records for today`);
    console.log('Now you can test fresh check-in/check-out');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetTodayAttendance();
