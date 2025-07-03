const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserEmployeeRelation() {
  try {
    console.log('=== CHECKING USER-EMPLOYEE RELATION ===\n');

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'john.doe@example.com' },
      include: {
        employee: true,
        manager: true,
        md: true,
      },
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    console.log('\n📋 User profile relations:');
    console.log('Employee:', user.employee ? {
      id: user.employee.id,
      employeeId: user.employee.employeeId,
      department: user.employee.department,
      position: user.employee.position,
    } : 'null');

    console.log('Manager:', user.manager ? {
      id: user.manager.id,
      department: user.manager.department,
    } : 'null');

    console.log('MD:', user.md ? {
      id: user.md.id,
    } : 'null');

    // Check if the authentication function would work
    console.log('\n🔐 Authentication check:');
    console.log('User role:', user.role);
    
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        console.log('❌ PROBLEM: User role is EMPLOYEE but employee profile is missing');
      } else {
        console.log('✅ Employee profile exists for EMPLOYEE role');
      }
    }

    console.log('\n📊 Sample attendance records for this employee:');
    if (user.employee) {
      const attendanceRecords = await prisma.attendance.findMany({
        where: { employeeId: user.employee.id },
        orderBy: { date: 'desc' },
        take: 5,
      });
      
      console.log(`Found ${attendanceRecords.length} attendance records:`);
      attendanceRecords.forEach(record => {
        console.log(`  ${record.date.toDateString()}: ${record.status}`);
      });
    } else {
      console.log('Cannot check attendance records - no employee profile');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserEmployeeRelation();
