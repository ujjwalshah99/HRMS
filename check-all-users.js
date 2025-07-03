const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllUsers() {
  try {
    console.log('=== CHECKING ALL USERS ===\n');

    const users = await prisma.user.findMany({
      include: {
        employee: true,
        manager: true,
        md: true,
      },
    });

    console.log(`Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Employee: ${user.employee ? 'Yes' : 'No'}`);
      console.log(`   Manager: ${user.manager ? 'Yes' : 'No'}`);
      console.log(`   MD: ${user.md ? 'Yes' : 'No'}`);
    });

    // Check employees separately
    console.log('\n=== CHECKING ALL EMPLOYEES ===');
    const employees = await prisma.employee.findMany({
      include: {
        user: true,
      },
    });

    console.log(`Found ${employees.length} employees:`);
    employees.forEach((employee, index) => {
      console.log(`\n${index + 1}. Employee:`);
      console.log(`   ID: ${employee.id}`);
      console.log(`   Employee ID: ${employee.employeeId}`);
      console.log(`   Department: ${employee.department}`);
      console.log(`   Position: ${employee.position}`);
      console.log(`   User: ${employee.user ? employee.user.email : 'No user linked'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllUsers();
