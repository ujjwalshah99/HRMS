const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkEmployees() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: true
      }
    });

    console.log('Found employees:', employees.length);
    employees.forEach(emp => {
      console.log(`Employee ID: ${emp.employeeId}, Name: ${emp.user.name}, Internal ID: ${emp.id}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEmployees();
