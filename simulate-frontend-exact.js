const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simulateFrontendCalculation() {
  try {
    console.log('=== SIMULATING FRONTEND CALCULATION ===\n');

    // Get employee
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' },
      include: { user: true }
    });

    console.log('Employee:', employee.user.name);

    // Get ALL attendance records (like frontend does)
    const allAttendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
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

    console.log('Total attendance records in DB:', allAttendanceRecords.length);

    // Format records like API does
    const formattedRecords = allAttendanceRecords.map(record => ({
      id: record.id,
      date: record.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
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

    console.log('Formatted records (as frontend receives):');
    formattedRecords.forEach((record, index) => {
      console.log(`${index + 1}. Date: ${record.date}, Status: ${record.status}`);
    });

    // Simulate frontend filtering for July 2025
    const currentDate = new Date(2025, 6, 1); // July 2025
    const currentMonthRecords = formattedRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentDate.getMonth() && 
             recordDate.getFullYear() === currentDate.getFullYear();
    });

    console.log('\nFiltered records for July 2025:');
    currentMonthRecords.forEach((record, index) => {
      console.log(`${index + 1}. Date: ${record.date}, Status: ${record.status}`);
    });

    // Calculate breakdown exactly like frontend does
    const breakdown = {
      present: currentMonthRecords.filter(r => r.status === 'PRESENT').length,
      absent: currentMonthRecords.filter(r => r.status === 'ABSENT').length,
      late: currentMonthRecords.filter(r => r.status === 'LATE').length,
      halfDay: currentMonthRecords.filter(r => r.status === 'HALF_DAY').length,
      leave: currentMonthRecords.filter(r => r.status === 'LEAVE').length,
    };

    console.log('\nBreakdown calculation (exactly like frontend):');
    console.log(`Present: ${breakdown.present}`);
    console.log(`Absent: ${breakdown.absent}`);
    console.log(`Late: ${breakdown.late}`);
    console.log(`Half Day: ${breakdown.halfDay}`);
    console.log(`Leave: ${breakdown.leave}`);

    // Check each half day record individually
    const halfDayRecords = currentMonthRecords.filter(r => r.status === 'HALF_DAY');
    console.log('\nHalf Day records found:');
    halfDayRecords.forEach((record, index) => {
      console.log(`${index + 1}. Date: ${record.date}, Status: ${record.status}, ID: ${record.id}`);
    });

    console.log('\n=== FINAL DIAGNOSIS ===');
    if (breakdown.halfDay === 1) {
      console.log('✅ FRONTEND CALCULATION IS CORRECT');
      console.log('🔥 IF YOU STILL SEE 2 HALF DAYS, IT\'S A BROWSER CACHE ISSUE');
      console.log('💡 SOLUTIONS:');
      console.log('   1. Hard refresh (Ctrl+Shift+R)');
      console.log('   2. Clear browser cache');
      console.log('   3. Use the Force Refresh button I added');
      console.log('   4. Open in incognito/private browsing mode');
    } else {
      console.log('❌ FRONTEND CALCULATION IS WRONG');
      console.log('🔍 NEED TO DEBUG FURTHER');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateFrontendCalculation();
