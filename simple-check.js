const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function simpleCheck() {
  try {
    // Get employee
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });

    console.log('Employee ID:', employee.id);

    // Get July 2025 records
    const records = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: new Date('2025-07-01T00:00:00.000Z'),
          lt: new Date('2025-08-01T00:00:00.000Z')
        }
      }
    });

    console.log('July 2025 records:');
    records.forEach(r => {
      console.log(`${new Date(r.date).toDateString()}: ${r.status}`);
    });

    console.log('\nHalf day count:', records.filter(r => r.status === 'HALF_DAY').length);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

simpleCheck();
