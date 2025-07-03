const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkJuly1() {
  try {
    // First, get the employee record
    const employee = await prisma.employee.findFirst({
      where: {
        employeeId: 'EMP001'
      }
    });

    if (!employee) {
      console.log('No employee found with ID EMP-001');
      return;
    }

    console.log('Employee found:', employee.id);

    // Check if July 1, 2025 exists in the database
    const attendance = await prisma.attendance.findFirst({
      where: {
        date: new Date('2025-07-01T00:00:00.000Z'),
        employeeId: employee.id // Use the employee's internal ID
      }
    });

    if (attendance) {
      console.log('July 1, 2025 attendance record found:');
      console.log('Status:', attendance.status);
      console.log('Date:', attendance.date);
      console.log('Check-in:', attendance.checkInTime);
      console.log('Check-out:', attendance.checkOutTime);
    } else {
      console.log('No attendance record found for July 1, 2025');
      
      // Create the absent record
      console.log('Creating absent record for July 1, 2025...');
      const newAttendance = await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date: new Date('2025-07-01T00:00:00.000Z'),
          status: 'ABSENT',
          checkInTime: null,
          checkOutTime: null,
          workingHours: 0
        }
      });
      
      console.log('Created attendance record:', newAttendance);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkJuly1();
