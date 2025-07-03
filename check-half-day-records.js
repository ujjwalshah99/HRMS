const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkHalfDayRecords() {
  try {
    // Get employee
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });

    if (!employee) {
      console.log('No employee found');
      return;
    }

    // Check all July 2025 attendance records
    const julyAttendance = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: new Date('2025-07-01T00:00:00.000Z'),
          lt: new Date('2025-08-01T00:00:00.000Z')
        }
      },
      orderBy: { date: 'asc' }
    });

    console.log('All July 2025 attendance records:');
    julyAttendance.forEach(record => {
      const date = new Date(record.date);
      console.log(`${date.toDateString()}: ${record.status}`);
    });

    // Count by status
    const statusCounts = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      HALF_DAY: 0,
      LEAVE: 0
    };

    julyAttendance.forEach(record => {
      if (statusCounts[record.status] !== undefined) {
        statusCounts[record.status]++;
      }
    });

    console.log('\nStatus counts:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`${status}: ${count}`);
    });

    // Check if there are any duplicate entries
    const dates = julyAttendance.map(r => new Date(r.date).toDateString());
    const duplicates = dates.filter((date, index) => dates.indexOf(date) !== index);
    
    if (duplicates.length > 0) {
      console.log('\nDuplicate entries found for dates:', duplicates);
    } else {
      console.log('\nNo duplicate entries found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHalfDayRecords();
