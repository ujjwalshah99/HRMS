const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAttendanceData() {
  try {
    console.log('🔧 Fixing attendance data...\n');
    
    const employee = await prisma.employee.findFirst({
      include: { user: true }
    });
    
    if (!employee) {
      console.log('❌ No employee found');
      return;
    }
    
    console.log(`👤 Employee: ${employee.user.name}\n`);
    
    // Create ABSENT record for July 1, 2025
    const july1Date = new Date('2025-07-01T00:00:00.000Z');
    
    // Delete existing record if any
    await prisma.attendance.deleteMany({
      where: {
        employeeId: employee.id,
        date: july1Date
      }
    });
    
    // Create new ABSENT record
    const july1Record = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date: july1Date,
        checkInTime: null,
        checkOutTime: null,
        workingHours: 0,
        status: 'ABSENT'
      }
    });
    
    console.log('✅ Created ABSENT record for July 1, 2025');
    console.log(`   Date: ${july1Record.date.toISOString()}`);
    console.log(`   Status: ${july1Record.status}`);
    
    console.log('\n🎉 Attendance data updated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAttendanceData();
