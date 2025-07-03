const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugDateIssue() {
  try {
    console.log('🔍 Debugging date issue...\n');
    
    // Get employee
    const employee = await prisma.employee.findFirst({
      include: { user: true }
    });
    
    if (!employee) {
      console.log('❌ No employee found');
      return;
    }
    
    console.log(`👤 Employee: ${employee.user.name}\n`);
    
    // Get all attendance records for this employee
    const allRecords = await prisma.attendance.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: 'desc' }
    });
    
    console.log('📊 All attendance records (raw dates):');
    allRecords.forEach(record => {
      console.log(`ID: ${record.id}`);
      console.log(`Raw date: ${record.date}`);
      console.log(`ISO string: ${record.date.toISOString()}`);
      console.log(`Date only: ${record.date.toISOString().split('T')[0]}`);
      console.log(`Status: ${record.status}`);
      console.log('---');
    });
    
    // Test different ways to query today
    const now = new Date();
    const todayString = '2025-07-02';
    
    console.log(`\n🎯 Testing different query methods for ${todayString}:`);
    
    // Method 1: Direct string date
    const method1 = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: new Date(todayString)
      }
    });
    console.log(`Method 1 (new Date('${todayString}')): ${method1 ? 'Found' : 'Not found'}`);
    
    // Method 2: UTC date
    const method2 = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: new Date(todayString + 'T00:00:00.000Z')
      }
    });
    console.log(`Method 2 (UTC): ${method2 ? 'Found' : 'Not found'}`);
    
    // Method 3: Local midnight
    const method3 = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: new Date(2025, 6, 2) // July 2, 2025 (month is 0-indexed)
      }
    });
    console.log(`Method 3 (Local midnight): ${method3 ? 'Found' : 'Not found'}`);
    
    // Method 4: Date range
    const startOfDay = new Date(todayString + 'T00:00:00');
    const endOfDay = new Date(todayString + 'T23:59:59.999');
    
    const method4 = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });
    console.log(`Method 4 (Date range): ${method4 ? 'Found' : 'Not found'}`);
    
    if (method4) {
      console.log(`Found record: ${method4.date.toISOString()}, Status: ${method4.status}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDateIssue();
