const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBreakdown() {
  try {
    // Get employee
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });

    if (!employee) {
      console.log('No employee found');
      return;
    }

    // Get July 2025 attendance records
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

    console.log('Current Month Records (July 2025):');
    julyAttendance.forEach(record => {
      const date = new Date(record.date);
      console.log(`${date.toDateString()}: ${record.status}`);
    });

    // Calculate breakdown exactly like the frontend does
    const breakdown = {
      present: julyAttendance.filter(r => r.status === 'PRESENT').length,
      absent: julyAttendance.filter(r => r.status === 'ABSENT').length,
      late: julyAttendance.filter(r => r.status === 'LATE').length,
      halfDay: julyAttendance.filter(r => r.status === 'HALF_DAY').length,
      leave: julyAttendance.filter(r => r.status === 'LEAVE').length,
    };

    console.log('\nBreakdown should show:');
    console.log(`Present: ${breakdown.present}`);
    console.log(`Absent: ${breakdown.absent}`);
    console.log(`Late: ${breakdown.late}`);
    console.log(`Half Day: ${breakdown.halfDay}`);
    console.log(`Leave: ${breakdown.leave}`);

    // Check if maybe the issue is with the case sensitivity
    console.log('\nChecking case sensitivity:');
    julyAttendance.forEach(record => {
      console.log(`Record status: "${record.status}" (length: ${record.status.length})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBreakdown();
