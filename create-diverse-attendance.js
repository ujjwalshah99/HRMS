const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDiverseAttendanceData() {
  try {
    console.log('🎨 Creating diverse attendance data for calendar testing...\n');
    
    // Get an employee to work with
    const employee = await prisma.employee.findFirst({
      include: { user: true }
    });
    
    if (!employee) {
      console.log('❌ No employee found');
      return;
    }
    
    console.log(`📝 Using employee: ${employee.user.name} (${employee.employeeId})\n`);
    
    // Create different types of attendance for various days
    const attendanceData = [
      {
        employeeId: employee.id,
        date: new Date('2025-01-15'), // LATE status
        checkInTime: new Date('2025-01-15T10:45:00'),
        checkOutTime: new Date('2025-01-15T18:45:00'),
        workingHours: 8,
        status: 'LATE'
      },
      {
        employeeId: employee.id,
        date: new Date('2025-01-16'), // ABSENT status
        checkInTime: null,
        checkOutTime: null,
        workingHours: 0,
        status: 'ABSENT'
      },
      {
        employeeId: employee.id,
        date: new Date('2025-01-17'), // PRESENT status
        checkInTime: new Date('2025-01-17T09:15:00'),
        checkOutTime: new Date('2025-01-17T18:30:00'),
        workingHours: 9.25,
        status: 'PRESENT'
      },
      {
        employeeId: employee.id,
        date: new Date('2025-01-20'), // Another LATE
        checkInTime: new Date('2025-01-20T11:15:00'),
        checkOutTime: new Date('2025-01-20T19:15:00'),
        workingHours: 8,
        status: 'LATE'
      },
      {
        employeeId: employee.id,
        date: new Date('2025-01-21'), // HALF_DAY
        checkInTime: new Date('2025-01-21T09:00:00'),
        checkOutTime: new Date('2025-01-21T15:30:00'),
        workingHours: 6.5,
        status: 'HALF_DAY'
      }
    ];
    
    // Delete existing records for these dates to avoid conflicts
    for (const data of attendanceData) {
      await prisma.attendance.deleteMany({
        where: {
          employeeId: employee.id,
          date: data.date
        }
      });
    }
    
    // Create the new attendance records
    for (const data of attendanceData) {
      const record = await prisma.attendance.create({
        data
      });
      
      const statusEmoji = {
        'PRESENT': '✅',
        'ABSENT': '❌',
        'LATE': '⚠️',
        'HALF_DAY': '🔸'
      }[record.status] || '❓';
      
      console.log(`${statusEmoji} Created ${record.status} record for ${record.date.toDateString()}`);
    }
    
    console.log('\n🎉 Diverse attendance data created successfully!');
    console.log('📅 Now you can see different colored cells in the calendar');
    
  } catch (error) {
    console.error('❌ Error creating attendance data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDiverseAttendanceData();
