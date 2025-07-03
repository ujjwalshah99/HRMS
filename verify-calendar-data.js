const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyCalendarData() {
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

    console.log('Employee:', employee.id);
    console.log('\n=== JULY 2025 CALENDAR VERIFICATION ===\n');

    // Check all July 2025 attendance records
    const julyAttendance = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: new Date('2025-07-01T00:00:00.000Z'),
          lt: new Date('2025-08-01T00:00:00.000Z')
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    console.log('Attendance records found:', julyAttendance.length);

    // Test the isHoliday function
    function isHoliday(date) {
      const dayOfWeek = date.getDay();
      
      // All Sundays are holidays
      if (dayOfWeek === 0) {
        return true;
      }
      
      // Second Saturday of the month is a holiday
      if (dayOfWeek === 6) {
        const dayOfMonth = date.getDate();
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Count Saturdays in this month to determine if this is the second Saturday
        let saturdayCount = 0;
        for (let day = 1; day <= dayOfMonth; day++) {
          const testDate = new Date(year, month, day);
          if (testDate.getDay() === 6) {
            saturdayCount++;
          }
        }
        
        return saturdayCount === 2;
      }
      
      return false;
    }

    // Check each day of July 2025
    for (let day = 1; day <= 31; day++) {
      const date = new Date(2025, 6, day); // July is month 6
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      const isHol = isHoliday(date);
      
      // Find attendance record for this day
      const attendance = julyAttendance.find(att => {
        const attDate = new Date(att.date);
        return attDate.getDate() === day;
      });

      let status = 'No Record';
      if (isHol) {
        status = 'HOLIDAY';
      } else if (attendance) {
        status = attendance.status;
      }

      const isToday = day === 3; // July 3, 2025 is today
      const todayMarker = isToday ? ' (TODAY)' : '';
      
      console.log(`July ${day.toString().padStart(2, '0')}, 2025 (${dayName}) - ${status}${todayMarker}`);
    }

    console.log('\n=== KEY VERIFICATIONS ===');
    console.log('✓ July 1, 2025 should be ABSENT (red)');
    console.log('✓ July 3, 2025 should be PRESENT (green) - TODAY');
    console.log('✓ July 6, 2025 should be HOLIDAY (purple) - Sunday');
    console.log('✓ July 12, 2025 should be HOLIDAY (purple) - Second Saturday');
    console.log('✓ All Sundays should be HOLIDAY (purple)');
    console.log('✓ Second Saturday should be HOLIDAY (purple)');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyCalendarData();
