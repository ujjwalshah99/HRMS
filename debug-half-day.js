const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugHalfDayIssue() {
  try {
    console.log('=== DEBUGGING HALF DAY ISSUE ===\n');

    // Get employee
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });

    if (!employee) {
      console.log('❌ Employee not found');
      return;
    }

    console.log(`✅ Employee found: ${employee.id}`);

    // Get ALL attendance records for this employee (not just July)
    const allAttendance = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id
      },
      orderBy: { date: 'asc' }
    });

    console.log(`\n📊 Total attendance records: ${allAttendance.length}`);

    // Group by month
    const monthlyGroups = {};
    allAttendance.forEach(record => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = [];
      }
      monthlyGroups[monthKey].push(record);
    });

    console.log('\n📅 Records by month:');
    Object.entries(monthlyGroups).forEach(([month, records]) => {
      console.log(`\n${month}:`);
      records.forEach(record => {
        const date = new Date(record.date);
        console.log(`  ${date.toDateString()}: ${record.status}`);
      });
      
      // Count by status for this month
      const statusCount = {};
      records.forEach(record => {
        statusCount[record.status] = (statusCount[record.status] || 0) + 1;
      });
      
      console.log('  Status counts:', statusCount);
    });

    // Focus on July 2025
    const july2025 = allAttendance.filter(record => {
      const date = new Date(record.date);
      return date.getFullYear() === 2025 && date.getMonth() === 6; // July = month 6
    });

    console.log('\n🔍 JULY 2025 DETAILED ANALYSIS:');
    console.log(`Records count: ${july2025.length}`);
    
    july2025.forEach((record, index) => {
      const date = new Date(record.date);
      console.log(`${index + 1}. ID: ${record.id}`);
      console.log(`   Date: ${date.toDateString()}`);
      console.log(`   Status: ${record.status}`);
      console.log(`   Check-in: ${record.checkInTime}`);
      console.log(`   Check-out: ${record.checkOutTime}`);
      console.log(`   Working Hours: ${record.workingHours}`);
      console.log('');
    });

    // Calculate breakdown like the frontend
    const breakdown = {
      present: july2025.filter(r => r.status === 'PRESENT').length,
      absent: july2025.filter(r => r.status === 'ABSENT').length,
      late: july2025.filter(r => r.status === 'LATE').length,
      halfDay: july2025.filter(r => r.status === 'HALF_DAY').length,
      leave: july2025.filter(r => r.status === 'LEAVE').length,
    };

    console.log('📈 CALCULATED BREAKDOWN:');
    console.log(`Present: ${breakdown.present}`);
    console.log(`Absent: ${breakdown.absent}`);
    console.log(`Late: ${breakdown.late}`);
    console.log(`Half Day: ${breakdown.halfDay}`);
    console.log(`Leave: ${breakdown.leave}`);

    // Check for any anomalies
    console.log('\n🔍 ANOMALY CHECK:');
    const halfDayRecords = july2025.filter(r => r.status === 'HALF_DAY');
    console.log(`Half day records found: ${halfDayRecords.length}`);
    halfDayRecords.forEach((record, index) => {
      const date = new Date(record.date);
      console.log(`${index + 1}. ${date.toDateString()} - ID: ${record.id}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugHalfDayIssue();
