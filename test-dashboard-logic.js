const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simulate the exact logic from dashboard
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function testDashboardLogic() {
  try {
    console.log('🔍 Testing dashboard logic with corrected date handling...\n');
    
    // Get employee
    const employee = await prisma.employee.findFirst({
      include: { user: true }
    });
    
    if (!employee) {
      console.log('❌ No employee found');
      return;
    }
    
    // Simulate getting attendance records (like the dashboard does)
    const attendanceRecords = await prisma.attendance.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: 'desc' }
    });
    
    console.log(`📊 Total attendance records found: ${attendanceRecords.length}`);
    
    // Apply the same logic as dashboard
    const today = getTodayDateString();
    console.log(`📅 Today's date string: ${today}`);
    
    const attendanceArray = Array.isArray(attendanceRecords) ? attendanceRecords : [];
    
    const todayRecord = attendanceArray.find((record) => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      console.log(`   Comparing: ${recordDate} === ${today} = ${recordDate === today}`);
      return recordDate === today;
    });
    
    console.log(`\n🎯 Dashboard Logic Result:`);
    if (todayRecord) {
      console.log(`✅ Found today's record:`);
      console.log(`   Date: ${todayRecord.date.toISOString()}`);
      console.log(`   Status: ${todayRecord.status}`);
      console.log(`   Check-in: ${todayRecord.checkInTime || 'Not checked in'}`);
      console.log(`   Check-out: ${todayRecord.checkOutTime || 'Not checked out'}`);
      console.log(`\n📱 Dashboard should show:`);
      console.log(`   - Check-in time: ${todayRecord.checkInTime ? new Date(todayRecord.checkInTime).toLocaleTimeString() : '--:--'}`);
      console.log(`   - Check-out time: ${todayRecord.checkOutTime ? new Date(todayRecord.checkOutTime).toLocaleTimeString() : '--:--'}`);
      console.log(`   - Button: ${todayRecord.checkInTime && !todayRecord.checkOutTime ? 'Check Out' : 'Already completed'}`);
    } else {
      console.log(`❌ No record found for today`);
      console.log(`📱 Dashboard should show: "Ready to start your day?" with Check In button`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboardLogic();
