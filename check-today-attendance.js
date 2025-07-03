const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkToday() {
  try {
    // Get the employee record
    const employee = await prisma.employee.findFirst({
      where: {
        employeeId: 'EMP001'
      }
    });

    if (!employee) {
      console.log('No employee found');
      return;
    }

    // Check if today (July 3, 2025) has an attendance record
    const today = new Date('2025-07-03T00:00:00.000Z');
    const attendance = await prisma.attendance.findFirst({
      where: {
        date: today,
        employeeId: employee.id
      }
    });

    if (attendance) {
      console.log('Today\'s attendance record found:');
      console.log('Status:', attendance.status);
      console.log('Date:', attendance.date);
      console.log('Check-in:', attendance.checkInTime);
      console.log('Check-out:', attendance.checkOutTime);
      
      // If it's not present, update it to present
      if (attendance.status !== 'PRESENT') {
        console.log('Updating today\'s status to PRESENT...');
        await prisma.attendance.update({
          where: { id: attendance.id },
          data: {
            status: 'PRESENT',
            checkInTime: new Date('2025-07-03T09:00:00.000Z'),
            checkOutTime: null,
            workingHours: null
          }
        });
        console.log('Updated successfully');
      }
    } else {
      console.log('No attendance record found for today');
      
      // Create a present record for today
      console.log('Creating present record for today...');
      const newAttendance = await prisma.attendance.create({
        data: {
          employeeId: employee.id,
          date: today,
          status: 'PRESENT',
          checkInTime: new Date('2025-07-03T09:00:00.000Z'),
          checkOutTime: null,
          workingHours: null
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

checkToday();
