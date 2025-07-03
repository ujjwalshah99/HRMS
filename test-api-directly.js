const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAPIDirectly() {
  try {
    console.log('=== TESTING API DIRECTLY ===\n');

    // Find the employee
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' },
      include: { user: true }
    });

    if (!employee) {
      console.error('Employee not found');
      return;
    }

    console.log('Employee found:', employee.user.name);

    // Get attendance records for July 2025 (same as API would do)
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: new Date(2025, 6, 1), // July 1, 2025
          lte: new Date(2025, 6, 31), // July 31, 2025
        },
      },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    console.log('Raw attendance records from DB:');
    attendanceRecords.forEach((record, index) => {
      console.log(`${index + 1}. Date: ${record.date.toISOString()}, Status: ${record.status}`);
    });

    // Format the response like the API does
    const formattedRecords = attendanceRecords.map(record => ({
      id: record.id,
      date: record.date.toISOString().split('T')[0],
      status: record.status,
      checkInTime: record.checkInTime,
      checkOutTime: record.checkOutTime,
      workingHours: record.workingHours,
      employee: {
        id: record.employee.id,
        employeeId: record.employee.employeeId,
        name: record.employee.user.name,
        email: record.employee.user.email,
      },
    }));

    console.log('\nFormatted records (as API would return):');
    formattedRecords.forEach((record, index) => {
      console.log(`${index + 1}. Date: ${record.date}, Status: ${record.status}`);
    });

    // Calculate breakdown like frontend does
    const breakdown = {
      present: formattedRecords.filter(r => r.status === 'PRESENT').length,
      absent: formattedRecords.filter(r => r.status === 'ABSENT').length,
      late: formattedRecords.filter(r => r.status === 'LATE').length,
      halfDay: formattedRecords.filter(r => r.status === 'HALF_DAY').length,
      leave: formattedRecords.filter(r => r.status === 'LEAVE').length,
    };

    console.log('\nBreakdown calculation:');
    console.log(`Present: ${breakdown.present}`);
    console.log(`Absent: ${breakdown.absent}`);
    console.log(`Late: ${breakdown.late}`);
    console.log(`Half Day: ${breakdown.halfDay}`);
    console.log(`Leave: ${breakdown.leave}`);

    console.log('\n=== CONCLUSION ===');
    if (breakdown.halfDay === 1) {
      console.log('✅ Database and API logic are CORRECT - showing 1 half day');
      console.log('🔥 THE ISSUE IS IN THE FRONTEND - either caching or state management');
    } else {
      console.log('❌ Database or API logic is WRONG - showing incorrect half day count');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPIDirectly();
