const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

async function testMyFunction() {
  try {
    console.log('🧪 Testing my getTodayDate function...\n');
    
    const employee = await prisma.employee.findFirst();
    
    const now = new Date();
    console.log(`Current time: ${now.toISOString()}`);
    
    const myTodayDate = getTodayDate();
    console.log(`My function result: ${myTodayDate.toISOString()}`);
    
    const directDate = new Date('2025-07-02');
    console.log(`Direct new Date('2025-07-02'): ${directDate.toISOString()}`);
    
    // Test query with my function
    const myResult = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: myTodayDate
      }
    });
    
    console.log(`\nQuery with my function: ${myResult ? 'Found' : 'Not found'}`);
    
    // Test query with direct date
    const directResult = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: directDate
      }
    });
    
    console.log(`Query with direct date: ${directResult ? 'Found' : 'Not found'}`);
    
    // The current date is July 3, 2025, so let me check July 3
    const july3Date = new Date(2025, 6, 3); // Month is 0-indexed, so 6 = July
    console.log(`\nJuly 3, 2025 date: ${july3Date.toISOString()}`);
    
    const july3Result = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: july3Date
      }
    });
    
    console.log(`Query for July 3: ${july3Result ? 'Found' : 'Not found'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testMyFunction();
