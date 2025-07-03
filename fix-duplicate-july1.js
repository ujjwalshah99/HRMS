const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixDuplicateJuly1() {
  try {
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });

    // Find all records for July 1, 2025
    const july1Records = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: new Date('2025-07-01T00:00:00.000Z')
      }
    });

    console.log('July 1, 2025 records found:', july1Records.length);
    july1Records.forEach((record, index) => {
      console.log(`${index + 1}. ID: ${record.id}, Status: ${record.status}, Created: ${record.createdAt}`);
    });

    if (july1Records.length > 1) {
      console.log('\nDuplicate found! Fixing...');
      
      // Keep the ABSENT record (as per original requirement) and delete others
      const absentRecord = july1Records.find(r => r.status === 'ABSENT');
      const recordsToDelete = july1Records.filter(r => r.id !== absentRecord.id);
      
      console.log(`Keeping ABSENT record: ${absentRecord.id}`);
      console.log(`Deleting ${recordsToDelete.length} duplicate records:`);
      
      for (const record of recordsToDelete) {
        console.log(`Deleting: ${record.id} (${record.status})`);
        await prisma.attendance.delete({
          where: { id: record.id }
        });
      }
      
      console.log('\n✅ Duplicates removed!');
      
      // Verify the fix
      const verifyRecords = await prisma.attendance.findMany({
        where: {
          employeeId: employee.id,
          date: new Date('2025-07-01T00:00:00.000Z')
        }
      });
      
      console.log(`\nVerification: ${verifyRecords.length} record(s) remaining for July 1, 2025`);
      verifyRecords.forEach(record => {
        console.log(`ID: ${record.id}, Status: ${record.status}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicateJuly1();
