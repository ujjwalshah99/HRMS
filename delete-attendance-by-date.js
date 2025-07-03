const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAttendanceByDate() {
  try {
    // Get the date from command line argument or use a default
    const dateArg = process.argv[2];
    
    if (!dateArg) {
      console.log('❌ Please provide a date in YYYY-MM-DD format');
      console.log('📝 Usage: node delete-attendance-by-date.js 2025-07-03');
      console.log('📝 Usage: node delete-attendance-by-date.js today');
      return;
    }
    
    let targetDate;
    if (dateArg.toLowerCase() === 'today') {
      targetDate = new Date().toISOString().split('T')[0];
    } else {
      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) {
        console.log('❌ Invalid date format. Please use YYYY-MM-DD format');
        return;
      }
      targetDate = dateArg;
    }
    
    console.log(`🗑️  Deleting attendance records for date: ${targetDate}\n`);
    
    // First, show what records will be deleted
    const recordsToDelete = await prisma.attendance.findMany({
      where: {
        date: new Date(targetDate)
      },
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
    
    if (recordsToDelete.length === 0) {
      console.log('ℹ️  No attendance records found for this date');
      return;
    }
    
    console.log(`📋 Found ${recordsToDelete.length} record(s) to delete:`);
    recordsToDelete.forEach(record => {
      const statusEmoji = {
        'PRESENT': '✅',
        'ABSENT': '❌',
        'LATE': '⚠️',
        'HALF_DAY': '🔸'
      }[record.status] || '❓';
      
      console.log(`${statusEmoji} ${record.employee.user.name} - ${record.status}`);
    });
    
    console.log('\n🔄 Deleting records...');
    
    // Delete the records
    const deleteResult = await prisma.attendance.deleteMany({
      where: {
        date: new Date(targetDate)
      }
    });
    
    console.log(`✅ Successfully deleted ${deleteResult.count} attendance record(s) for ${targetDate}`);
    
  } catch (error) {
    console.error('❌ Error deleting attendance records:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAttendanceByDate();
