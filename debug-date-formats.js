const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugDateFormats() {
  try {
    console.log('=== DEBUGGING DATE FORMATS ===\n');

    // Get employee
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' },
    });

    // Get attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: 'asc' },
    });

    console.log('Raw database dates:');
    attendanceRecords.forEach((record, index) => {
      console.log(`${index + 1}. Raw date: ${record.date}`);
      console.log(`   ISO String: ${record.date.toISOString()}`);
      console.log(`   ISO Split: ${record.date.toISOString().split('T')[0]}`);
      console.log(`   Status: ${record.status}`);
      console.log('');
    });

    // Test the exact logic from getAttendanceForDate
    const currentDate = new Date(2025, 6, 1); // July 2025
    console.log('Testing getAttendanceForDate logic for July 2025:');
    
    for (let day = 1; day <= 3; day++) {
      const targetDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      console.log(`\nDay ${day}:`);
      console.log(`  Target date: ${targetDate}`);
      
      const found = attendanceRecords.find(record => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        console.log(`  Comparing with: ${recordDate}`);
        return recordDate === targetDate;
      });
      
      console.log(`  Found: ${found ? `${found.status} (ID: ${found.id})` : 'No record'}`);
    }

    // Test the exact logic from currentMonthRecords filter
    console.log('\n=== Testing currentMonthRecords filter ===');
    const formattedRecords = attendanceRecords.map(record => ({
      id: record.id,
      date: record.date.toISOString().split('T')[0],
      status: record.status,
    }));

    console.log('Formatted records:');
    formattedRecords.forEach(record => {
      console.log(`  ${record.date}: ${record.status}`);
    });

    const currentMonthRecords = formattedRecords.filter(record => {
      const recordDate = new Date(record.date);
      const matches = recordDate.getMonth() === currentDate.getMonth() && 
                     recordDate.getFullYear() === currentDate.getFullYear();
      console.log(`  ${record.date}: month=${recordDate.getMonth()}, year=${recordDate.getFullYear()}, matches=${matches}`);
      return matches;
    });

    console.log('\nFiltered current month records:');
    currentMonthRecords.forEach(record => {
      console.log(`  ${record.date}: ${record.status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDateFormats();
