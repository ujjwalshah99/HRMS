// Script to view attendance records for a specific employee
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function viewAttendanceRecords(employeeEmail, year = null, month = null) {
  try {
    console.log(`📋 Viewing attendance records for ${employeeEmail}`);
    
    // Find the employee
    const employee = await prisma.employee.findFirst({
      where: {
        user: {
          email: employeeEmail
        }
      },
      include: {
        user: true
      }
    });
    
    if (!employee) {
      throw new Error(`Employee with email ${employeeEmail} not found`);
    }
    
    console.log(`👤 Employee: ${employee.user.name} (${employee.employeeId})\n`);
    
    // Build date filter
    let dateFilter = {};
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter = {
        gte: startDate,
        lte: endDate
      };
      console.log(`📅 Showing records for: ${startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}\n`);
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      dateFilter = {
        gte: startDate,
        lte: endDate
      };
      console.log(`📅 Showing records for: ${year}\n`);
    } else {
      console.log(`📅 Showing all records:\n`);
    }
    
    // Get attendance records
    const records = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    if (records.length === 0) {
      console.log('❌ No attendance records found for the specified criteria.');
      return;
    }
    
    console.log(`Found ${records.length} attendance record(s):\n`);
    
    records.forEach((record, index) => {
      console.log(`${index + 1}. 📅 ${record.date.toDateString()}`);
      console.log(`   📊 Status: ${record.status}`);
      if (record.checkInTime) {
        console.log(`   🕘 Check-in: ${record.checkInTime.toTimeString().split(' ')[0]}`);
      }
      if (record.checkOutTime) {
        console.log(`   🕕 Check-out: ${record.checkOutTime.toTimeString().split(' ')[0]}`);
      }
      if (record.workingHours) {
        console.log(`   ⏱️  Working hours: ${record.workingHours}`);
      }
      console.log('');
    });
    
    // Summary
    const statusCounts = records.reduce((acc, record) => {
      acc[record.status] = (acc[record.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 SUMMARY:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count} day(s)`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node view-attendance.js <employee-email> [year] [month]');
  console.log('');
  console.log('Examples:');
  console.log('  node view-attendance.js john.doe@updesco.com                    (all records)');
  console.log('  node view-attendance.js john.doe@updesco.com 2025               (year 2025)');
  console.log('  node view-attendance.js john.doe@updesco.com 2025 7             (July 2025)');
  console.log('');
  console.log('Use "node list-employees.js" to see all available employee emails.');
  process.exit(1);
}

const [employeeEmail, year, month] = args;
viewAttendanceRecords(employeeEmail, year ? parseInt(year) : null, month ? parseInt(month) : null);
