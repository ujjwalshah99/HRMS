const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCurrentData() {
  try {
    console.log('🔍 Checking current attendance data...\n');
    
    const employee = await prisma.employee.findFirst({
      include: { user: true }
    });
    
    if (!employee) {
      console.log('❌ No employee found');
      return;
    }
    
    console.log(`👤 Employee: ${employee.user.name}\n`);
    
    // Check July 2025 records
    const july2025Records = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: new Date('2025-07-01T00:00:00.000Z'),
          lte: new Date('2025-07-31T23:59:59.999Z')
        }
      },
      orderBy: { date: 'asc' }
    });
    
    console.log(`📅 July 2025 Attendance Records (${july2025Records.length} found):`);
    
    july2025Records.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      const statusEmoji = {
        'PRESENT': '✅',
        'ABSENT': '❌',
        'LATE': '⚠️',
        'HALF_DAY': '🔸'
      }[record.status] || '❓';
      
      console.log(`${statusEmoji} ${dateStr} | ${record.status}`);
    });
    
    // Check for July 1, 2025 specifically
    const july1Record = july2025Records.find(r => 
      r.date.toISOString().split('T')[0] === '2025-07-01'
    );
    
    console.log(`\n📋 July 1, 2025 Status: ${july1Record ? july1Record.status : 'No record found'}`);
    console.log(`📋 July 3, 2025 Status: ${july2025Records.find(r => r.date.toISOString().split('T')[0] === '2025-07-03')?.status || 'No record found'}`);
    
    // Calculate Sundays and second Saturdays for July 2025
    console.log('\n🗓️ Expected Holidays for July 2025:');
    
    const sundays = [];
    const saturdays = [];
    
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2025, 6, day); // July 2025
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0) { // Sunday
        sundays.push(day);
      } else if (dayOfWeek === 6) { // Saturday
        saturdays.push(day);
      }
    }
    
    console.log(`Sundays: ${sundays.join(', ')}`);
    console.log(`Second Saturday: ${saturdays[1] || 'N/A'} (all Saturdays: ${saturdays.join(', ')})`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentData();
