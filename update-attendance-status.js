// Update today's attendance record with correct status
const { PrismaClient } = require('@prisma/client');

function determineAttendanceStatus(checkInTime, workingHours) {
  const checkInHour = checkInTime.getHours();
  const checkInMinute = checkInTime.getMinutes();
  
  // Half day takes priority if working hours less than 8
  if (workingHours && workingHours < 8) {
    return 'HALF_DAY';
  }
  
  // Late if check-in is after 10:30 AM
  if (checkInHour > 10 || (checkInHour === 10 && checkInMinute > 30)) {
    return 'LATE';
  }
  
  return 'PRESENT';
}

async function updateAttendanceStatus() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔄 Updating attendance status with correct logic...\n');

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const todayRecord = await prisma.attendance.findFirst({
      where: {
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (todayRecord && todayRecord.checkInTime && todayRecord.workingHours) {
      const correctStatus = determineAttendanceStatus(todayRecord.checkInTime, todayRecord.workingHours);
      
      console.log('📊 Status Update:');
      console.log('- Current status:', todayRecord.status);
      console.log('- Working hours:', todayRecord.workingHours);
      console.log('- Check-in time:', todayRecord.checkInTime);
      console.log('- Correct status:', correctStatus);
      
      if (todayRecord.status !== correctStatus) {
        await prisma.attendance.update({
          where: { id: todayRecord.id },
          data: { status: correctStatus },
        });
        
        console.log('✅ Status updated from', todayRecord.status, 'to', correctStatus);
      } else {
        console.log('✅ Status is already correct');
      }
    } else {
      console.log('❌ No complete attendance record found for today');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateAttendanceStatus();
