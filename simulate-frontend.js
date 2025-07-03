const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simulateFrontendAPI() {
  try {
    // Simulate the API call that the attendance page makes
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });

    // This is what the API returns
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id
      },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    console.log('API Response - Total records:', attendanceRecords.length);
    
    // Filter for current month (July 2025) like the frontend does
    const currentDate = new Date(2025, 6, 1); // July 1, 2025
    const currentMonthRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentDate.getMonth() && 
             recordDate.getFullYear() === currentDate.getFullYear();
    });

    console.log('\nFiltered for July 2025:', currentMonthRecords.length);
    
    currentMonthRecords.forEach(record => {
      const date = new Date(record.date);
      console.log(`${date.toDateString()}: ${record.status}`);
    });

    // Calculate breakdown exactly like frontend
    const breakdown = {
      present: currentMonthRecords.filter(r => r.status === 'PRESENT').length,
      absent: currentMonthRecords.filter(r => r.status === 'ABSENT').length,
      late: currentMonthRecords.filter(r => r.status === 'LATE').length,
      halfDay: currentMonthRecords.filter(r => r.status === 'HALF_DAY').length,
      leave: currentMonthRecords.filter(r => r.status === 'LEAVE').length,
    };

    console.log('\nFrontend Breakdown Calculation:');
    console.log('Present:', breakdown.present);
    console.log('Absent:', breakdown.absent);
    console.log('Late:', breakdown.late);
    console.log('Half Day:', breakdown.halfDay);
    console.log('Leave:', breakdown.leave);

    // Check if there are any records from other months that might be confusing
    console.log('\nAll records by month:');
    const monthGroups = {};
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(record);
    });

    Object.entries(monthGroups).forEach(([month, records]) => {
      const halfDayCount = records.filter(r => r.status === 'HALF_DAY').length;
      console.log(`${month}: ${records.length} records, ${halfDayCount} half days`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simulateFrontendAPI();
