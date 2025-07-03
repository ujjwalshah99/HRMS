// Get all dummy login credentials
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getAllCredentials() {
  try {
    console.log('=== DUMMY LOGIN CREDENTIALS ===\n');
    
    // Get all users with their profiles
    const users = await prisma.user.findMany({
      include: {
        employee: true,
        manager: true,
        md: true,
      },
      orderBy: {
        role: 'asc'
      }
    });

    console.log(`Found ${users.length} users in the system:\n`);

    // Group by role
    const roles = ['MD', 'MANAGER', 'EMPLOYEE'];
    
    roles.forEach(role => {
      const roleUsers = users.filter(user => user.role === role);
      if (roleUsers.length > 0) {
        console.log(`📋 ${role} ACCOUNTS (${roleUsers.length}):`);
        console.log('─'.repeat(50));
        
        roleUsers.forEach((user, index) => {
          console.log(`${index + 1}. 👤 ${user.name}`);
          console.log(`   📧 Email: ${user.email}`);
          console.log(`   🔐 Password: password123`);
          
          if (user.employee) {
            console.log(`   🏢 Employee ID: ${user.employee.employeeId}`);
            console.log(`   📁 Department: ${user.employee.department}`);
            console.log(`   💼 Position: ${user.employee.position}`);
          }
          
          if (user.manager) {
            console.log(`   🏢 Manager Department: ${user.manager.department}`);
          }
          
          if (user.md) {
            console.log(`   👑 Managing Director`);
          }
          
          console.log('');
        });
        
        console.log('');
      }
    });

    console.log('🔐 STANDARD PASSWORD FOR ALL ACCOUNTS: password123\n');

    console.log('🌐 LOGIN URLS:');
    console.log('   Development: http://localhost:3000/login');
    console.log('   Alternative: http://localhost:3001/login (if port 3000 is busy)\n');

    console.log('📱 DASHBOARD URLS AFTER LOGIN:');
    console.log('   Employee: /employee/dashboard');
    console.log('   Manager: /manager/dashboard');
    console.log('   MD: /md/dashboard\n');

    console.log('💡 RECOMMENDED TEST ACCOUNTS:');
    console.log('   👨‍💻 Employee: john.doe@updesco.com (Has attendance data)');
    console.log('   👩‍💼 Manager: sarah.manager@updesco.com');
    console.log('   👑 MD: md@updesco.com\n');

    console.log('🎯 FEATURES TO TEST:');
    console.log('   ✅ Check-in/Check-out (Employee dashboard)');
    console.log('   ✅ Attendance calendar (Employee attendance page)');
    console.log('   ✅ Monthly statistics (Employee dashboard)');
    console.log('   ✅ Employee management (Manager/MD dashboards)');
    console.log('   ✅ Attendance reports (Manager/MD dashboards)');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getAllCredentials();
