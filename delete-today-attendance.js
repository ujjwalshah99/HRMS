// Delete today's check-in/check-out time for the current user
const { PrismaClient } = require('@prisma/client');

async function deleteTodayAttendance() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🗑️ Deleting today\'s attendance record...\n');

    // Get today's date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    console.log('📅 Target date:', startOfDay.toISOString().split('T')[0]);

    // Find today's attendance records
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

    console.log(`📊 Found ${todayRecords.length} attendance record(s) for today:`);
    
    if (todayRecords.length === 0) {
      console.log('ℹ️ No attendance records found for today.');
      return;
    }

    // Display records found
    todayRecords.forEach((record, index) => {
      console.log(`${index + 1}. ${record.employee.user.name} (${record.employee.user.email})`);
      console.log(`   Check-in: ${record.checkInTime || 'Not checked in'}`);
      console.log(`   Check-out: ${record.checkOutTime || 'Not checked out'}`);
      console.log(`   Status: ${record.status}`);
      console.log('');
    });

    // Delete all today's attendance records
    const deleteResult = await prisma.attendance.deleteMany({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    console.log(`✅ Successfully deleted ${deleteResult.count} attendance record(s) for today.`);
    console.log('');
    console.log('🎯 Effects:');
    console.log('- Check-in/check-out times cleared for today');
    console.log('- Users can now check in again');
    console.log('- Dashboard will show "Not checked in" status');
    console.log('- Calendar will be updated');

  } catch (error) {
    console.error('❌ Error deleting attendance records:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteTodayAttendance();
