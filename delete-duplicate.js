const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteDuplicateRecord() {
  try {
    console.log('🗑️ DELETING DUPLICATE JULY 1ST RECORD\n');
    
    // Delete the specific HALF_DAY record for July 1st
    const result = await prisma.attendance.delete({
      where: {
        id: 'cmcllz3z4000zvbkojxkxdsxy' // The HALF_DAY duplicate record ID
      }
    });
    
    console.log('✅ Deleted duplicate record:', result.id);
    console.log('   Status:', result.status);
    console.log('   Date:', result.date);
    
    // Verify only one July 1st record remains
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });
    
    const july1Records = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id,
        date: new Date('2025-07-01T00:00:00.000Z')
      }
    });
    
    console.log(`\n✅ Verification: ${july1Records.length} record(s) remaining for July 1st`);
    july1Records.forEach(record => {
      console.log(`   ID: ${record.id}, Status: ${record.status}`);
    });
    
    // Check all July records
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
    
    console.log('\n📊 ALL JULY 2025 RECORDS AFTER CLEANUP:');
    julyRecords.forEach(record => {
      const date = new Date(record.date);
      console.log(`${date.toDateString()}: ${record.status}`);
    });
    
    const halfDayCount = julyRecords.filter(r => r.status === 'HALF_DAY').length;
    console.log(`\n✅ Final Half Day count: ${halfDayCount}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteDuplicateRecord();
