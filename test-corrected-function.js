const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function getCorrectTodayDate() {
  const now = new Date();
  const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return new Date(todayString + 'T00:00:00.000Z');
}

async function testCorrectedFunction() {
  try {
    console.log('✅ Testing corrected date function...\n');
    
    const employee = await prisma.employee.findFirst();
    
    const now = new Date();
    console.log(`Current time: ${now.toISOString()}`);
    console.log(`Current date is July ${now.getDate()}, ${now.getFullYear()}`);
    
    const correctedTodayDate = getCorrectTodayDate();
    console.log(`Corrected function result: ${correctedTodayDate.toISOString()}`);
    
    // Test query with corrected function
    const result = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: correctedTodayDate
      }
    });
    
    console.log(`\nQuery with corrected function: ${result ? '✅ Found' : '❌ Not found'}`);
    
    if (result) {
      console.log(`Found record: ${result.date.toISOString()}, Status: ${result.status}`);
    }
    
    // Since today is actually July 3, let me also check for July 3 record
    const july3String = '2025-07-03';
    const july3Date = new Date(july3String + 'T00:00:00.000Z');
    console.log(`\nTesting July 3 date: ${july3Date.toISOString()}`);
    
    const july3Result = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: july3Date
      }
    });
    
    console.log(`Query for July 3: ${july3Result ? '✅ Found' : '❌ Not found'}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCorrectedFunction();
