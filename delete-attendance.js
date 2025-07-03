// Script to delete attendance record for a specific employee on a specific date
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteAttendanceRecord(employeeEmail, dateString) {
  try {
    console.log(`🗑️  Deleting attendance record for ${employeeEmail} on ${dateString}`);
    
    // Parse the date
    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD format.');
    }
    
    // Set to start of day in UTC
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    console.log(`📅 Target date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);
    
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
    
    console.log(`👤 Found employee: ${employee.user.name} (ID: ${employee.id})`);
    
    // Find existing attendance records for this date
    const existingRecords = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });
    
    if (existingRecords.length === 0) {
      console.log(`❌ No attendance records found for ${employee.user.name} on ${dateString}`);
      return;
    }
    
    console.log(`📋 Found ${existingRecords.length} record(s) to delete:`);
    existingRecords.forEach(record => {
      console.log(`   - ID: ${record.id}, Status: ${record.status}, Date: ${record.date.toDateString()}`);
    });
    
    // Delete the records
    const deleteResult = await prisma.attendance.deleteMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });
    
    console.log(`✅ Successfully deleted ${deleteResult.count} attendance record(s)`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node delete-attendance.js <employee-email> <date>');
  console.log('Example: node delete-attendance.js john.doe@updesco.com 2025-07-15');
  console.log('Date format: YYYY-MM-DD');
  process.exit(1);
}

const [employeeEmail, dateString] = args;
deleteAttendanceRecord(employeeEmail, dateString);
