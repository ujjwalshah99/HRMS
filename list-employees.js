// Script to list all employees with their emails for reference
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listAllEmployees() {
  try {
    console.log('📋 ALL EMPLOYEES IN SYSTEM:\n');
    
    const employees = await prisma.employee.findMany({
      include: {
        user: true
      },
      orderBy: {
        employeeId: 'asc'
      }
    });
    
    if (employees.length === 0) {
      console.log('❌ No employees found in the system.');
      return;
    }
    
    console.log(`Found ${employees.length} employee(s):\n`);
    
    employees.forEach((employee, index) => {
      console.log(`${index + 1}. 👤 ${employee.user.name}`);
      console.log(`   📧 Email: ${employee.user.email}`);
      console.log(`   🆔 Employee ID: ${employee.employeeId}`);
      console.log(`   🏢 Department: ${employee.department}`);
      console.log(`   💼 Position: ${employee.position}`);
      console.log('');
    });
    
    console.log('💡 Usage Examples:');
    console.log(`   Delete attendance: node delete-attendance.js ${employees[0].user.email} 2025-07-15`);
    console.log(`   Mark attendance: node mark-attendance.js ${employees[0].user.email} 2025-07-15 PRESENT`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listAllEmployees();
