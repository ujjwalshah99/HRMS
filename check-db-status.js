// Simple database check to verify deletion
const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database for today\'s attendance...\n');

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    console.log('📅 Today:', startOfDay.toISOString().split('T')[0]);

    const todayRecords = await prisma.attendance.findMany({
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

    console.log(`📊 Found ${todayRecords.length} attendance record(s) for today.`);
    
    if (todayRecords.length === 0) {
      console.log('✅ SUCCESS: Today\'s attendance records have been successfully deleted!');
      console.log('');
      console.log('🎯 What this means:');
      console.log('- No check-in/check-out times exist for today');
      console.log('- Users can check in fresh');
      console.log('- Dashboard will show "Ready to start your day?"');
      console.log('- No console errors when trying to check in');
    } else {
      console.log('⚠️ Still found records:');
      todayRecords.forEach((record, index) => {
        console.log(`${index + 1}. ${record.employee.user.name}`);
        console.log(`   Check-in: ${record.checkInTime || 'None'}`);
        console.log(`   Check-out: ${record.checkOutTime || 'None'}`);
      });
    }

    // Also check recent records for context
    console.log('\n📈 Recent attendance records (last 5):');
    const recentRecords = await prisma.attendance.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    });

    recentRecords.forEach((record, index) => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      console.log(`${index + 1}. ${record.employee.user.name} - ${recordDate}`);
      console.log(`   Check-in: ${record.checkInTime ? new Date(record.checkInTime).toLocaleString() : 'None'}`);
      console.log(`   Check-out: ${record.checkOutTime ? new Date(record.checkOutTime).toLocaleString() : 'None'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
