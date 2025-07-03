const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findDuplicates() {
  try {
    console.log('🔍 THOROUGH DUPLICATE SEARCH\n');
    
    const employee = await prisma.employee.findFirst({
      where: { employeeId: 'EMP001' }
    });

    // Get ALL attendance records for this employee
    const allRecords = await prisma.attendance.findMany({
      where: {
        employeeId: employee.id
      },
      orderBy: [
        { date: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    console.log(`Total records for employee: ${allRecords.length}\n`);

    // Group by exact date and find duplicates
    const dateMap = new Map();
    
    allRecords.forEach(record => {
      const dateKey = new Date(record.date).toISOString().split('T')[0];
      
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey).push(record);
    });

    console.log('📅 Records by date:\n');
    
    let hasDuplicates = false;
    
    for (const [date, records] of dateMap.entries()) {
      if (records.length > 1) {
        hasDuplicates = true;
        console.log(`🚨 DUPLICATE FOUND: ${date} has ${records.length} records:`);
        records.forEach((record, index) => {
          console.log(`  ${index + 1}. ID: ${record.id}`);
          console.log(`     Status: ${record.status}`);
          console.log(`     Created: ${record.createdAt}`);
          console.log(`     Updated: ${record.updatedAt}`);
          console.log('');
        });
        
        // Delete all but the first record
        if (records.length > 1) {
          console.log(`🗑️  Deleting ${records.length - 1} duplicate records...`);
          for (let i = 1; i < records.length; i++) {
            console.log(`   Deleting: ${records[i].id} (${records[i].status})`);
            await prisma.attendance.delete({
              where: { id: records[i].id }
            });
          }
          console.log(`✅ Kept only: ${records[0].id} (${records[0].status})\n`);
        }
        
      } else {
        console.log(`✅ ${date}: 1 record - ${records[0].status}`);
      }
    }

    if (!hasDuplicates) {
      console.log('\n✅ No duplicates found');
    } else {
      console.log('\n🔄 Re-checking after cleanup...');
      
      // Re-check July 2025 specifically
      const julyRecordsAfter = await prisma.attendance.findMany({
        where: {
          employeeId: employee.id,
          date: {
            gte: new Date('2025-07-01T00:00:00.000Z'),
            lt: new Date('2025-08-01T00:00:00.000Z')
          }
        },
        orderBy: { date: 'asc' }
      });

      console.log('\n📊 FINAL JULY 2025 RECORDS:');
      julyRecordsAfter.forEach(record => {
        const date = new Date(record.date);
        console.log(`${date.toDateString()}: ${record.status}`);
      });

      const halfDayCount = julyRecordsAfter.filter(r => r.status === 'HALF_DAY').length;
      console.log(`\n✅ Half Day count: ${halfDayCount}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findDuplicates();
