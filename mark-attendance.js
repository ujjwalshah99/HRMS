// Script to mark attendance for a specific employee on a specific date
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function markAttendance(employeeEmail, dateString, status, checkInTime = null, checkOutTime = null) {
  try {
    console.log(`✅ Marking attendance for ${employeeEmail} on ${dateString} as ${status}`);
    
    // Parse the date
    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD format.');
    }
    
    // Set to start of day in UTC
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    
    console.log(`📅 Target date: ${startOfDay.toDateString()}`);
    
    // Validate status
    const validStatuses = ['PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY', 'LATE'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Valid statuses: ${validStatuses.join(', ')}`);
    }
    
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
    
    // Check if attendance record already exists
    const existingRecord = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: {
          gte: startOfDay,
          lt: endOfDay
        }
      }
    });
    
    if (existingRecord) {
      console.log(`⚠️  Attendance record already exists for this date. Updating...`);
      console.log(`   Old status: ${existingRecord.status}`);
      console.log(`   New status: ${status}`);
    }
    
    // Prepare attendance data
    const attendanceData = {
      employeeId: employee.id,
      date: startOfDay,
      status: status,
      checkInTime: null,
      checkOutTime: null,
      workingHours: null
    };
    
    // Set times based on status
    if (status === 'PRESENT' || status === 'LATE' || status === 'HALF_DAY') {
      if (checkInTime) {
        const [hours, minutes] = checkInTime.split(':').map(Number);
        attendanceData.checkInTime = new Date(startOfDay.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
      } else {
        // Default check-in times
        const defaultCheckIn = status === 'LATE' ? 
          new Date(startOfDay.getTime() + 9 * 60 * 60 * 1000 + 30 * 60 * 1000) : // 9:30 AM for late
          new Date(startOfDay.getTime() + 9 * 60 * 60 * 1000); // 9:00 AM for others
        attendanceData.checkInTime = defaultCheckIn;
      }
      
      if (checkOutTime) {
        const [hours, minutes] = checkOutTime.split(':').map(Number);
        attendanceData.checkOutTime = new Date(startOfDay.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);
      } else {
        // Default check-out times
        const defaultCheckOut = status === 'HALF_DAY' ?
          new Date(startOfDay.getTime() + 13 * 60 * 60 * 1000) : // 1:00 PM for half day
          new Date(startOfDay.getTime() + 18 * 60 * 60 * 1000); // 6:00 PM for others
        attendanceData.checkOutTime = defaultCheckOut;
      }
      
      // Calculate working hours
      if (attendanceData.checkInTime && attendanceData.checkOutTime) {
        const diffMs = attendanceData.checkOutTime.getTime() - attendanceData.checkInTime.getTime();
        attendanceData.workingHours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
      }
    }
    
    // Create or update attendance record
    const result = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: startOfDay
        }
      },
      update: attendanceData,
      create: attendanceData
    });
    
    console.log(`✅ Successfully ${existingRecord ? 'updated' : 'created'} attendance record:`);
    console.log(`   Employee: ${employee.user.name}`);
    console.log(`   Date: ${result.date.toDateString()}`);
    console.log(`   Status: ${result.status}`);
    if (result.checkInTime) {
      console.log(`   Check-in: ${result.checkInTime.toTimeString()}`);
    }
    if (result.checkOutTime) {
      console.log(`   Check-out: ${result.checkOutTime.toTimeString()}`);
    }
    if (result.workingHours) {
      console.log(`   Working hours: ${result.workingHours}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log('Usage: node mark-attendance.js <employee-email> <date> <status> [check-in-time] [check-out-time]');
  console.log('');
  console.log('Examples:');
  console.log('  node mark-attendance.js john.doe@updesco.com 2025-07-15 PRESENT');
  console.log('  node mark-attendance.js john.doe@updesco.com 2025-07-15 LATE 09:30 18:00');
  console.log('  node mark-attendance.js john.doe@updesco.com 2025-07-15 HALF_DAY 09:00 13:00');
  console.log('  node mark-attendance.js john.doe@updesco.com 2025-07-15 ABSENT');
  console.log('  node mark-attendance.js john.doe@updesco.com 2025-07-15 LEAVE');
  console.log('');
  console.log('Date format: YYYY-MM-DD');
  console.log('Time format: HH:MM (24-hour format)');
  console.log('Valid statuses: PRESENT, ABSENT, LEAVE, HALF_DAY, LATE');
  process.exit(1);
}

const [employeeEmail, dateString, status, checkInTime, checkOutTime] = args;
markAttendance(employeeEmail, dateString, status, checkInTime, checkOutTime);
