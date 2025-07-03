const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAttendanceForCalendar() {
  try {
    console.log('🔍 Checking current attendance records for calendar visualization...\n');
    
    const records = await prisma.attendance.findMany({
      orderBy: { date: 'desc' },
      take: 10,
      include: {
        employee: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });

    console.log(`📊 Found ${records.length} recent attendance records:\n`);
    
    records.forEach(record => {
      const statusEmoji = {
        'PRESENT': '✅',
        'ABSENT': '❌', 
        'LATE': '⚠️',
        'HALF_DAY': '🔸'
      }[record.status] || '❓';
      
      console.log(`${statusEmoji} ${record.date} | ${record.employee.user.name} | ${record.status}`);
      if (record.checkInTime) console.log(`   Check-in: ${record.checkInTime}`);
      if (record.checkOutTime) console.log(`   Check-out: ${record.checkOutTime}`);
      if (record.workingHours) console.log(`   Working Hours: ${record.workingHours}`);
      console.log('');
    });
    
    console.log('📈 Status breakdown:');
    const statusCounts = records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      const emoji = {
        'PRESENT': '✅',
        'ABSENT': '❌',
        'LATE': '⚠️', 
        'HALF_DAY': '🔸'
      }[status] || '❓';
      console.log(`${emoji} ${status}: ${count} records`);
    });
    
  } catch (error) {
    console.error('❌ Error checking attendance:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAttendanceForCalendar();
