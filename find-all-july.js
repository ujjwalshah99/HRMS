const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findAllJulyRecords() {
  try {
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });

    // Get ALL July 2025 records with full details
    const julyRecords = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: {
          gte: new Date('2025-07-01T00:00:00.000Z'),
          lt: new Date('2025-08-01T00:00:00.000Z')
        }
      },
      orderBy: { date: 'asc' }
    });

    console.log('All July 2025 records with IDs:');
    julyRecords.forEach((record, index) => {
      const date = new Date(record.date);
      console.log(`${index + 1}. ID: ${record.id}`);
      console.log(`   Date: ${date.toISOString()}`);
      console.log(`   Status: ${record.status}`);
      console.log(`   Created: ${record.createdAt}`);
      console.log('');
    });

    // Group by exact date to find duplicates
    const dateGroups = {};
    julyRecords.forEach(record => {
      const dateKey = new Date(record.date).toISOString().split('T')[0];
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = [];
      }
      dateGroups[dateKey].push(record);
    });

    console.log('Records grouped by date:');
    Object.entries(dateGroups).forEach(([date, records]) => {
      console.log(`${date}: ${records.length} record(s)`);
      if (records.length > 1) {
        console.log('  ⚠️  DUPLICATE DETECTED!');
        records.forEach(r => {
          console.log(`    ID: ${r.id}, Status: ${r.status}`);
        });
      } else {
        console.log(`    Status: ${records[0].status}`);
      }
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findAllJulyRecords();
