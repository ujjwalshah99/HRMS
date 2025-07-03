// Create test users for all roles
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAllTestUsers() {
  try {
    console.log('Creating test users for all roles...');

    // Manager test user
    const managerExists = await prisma.user.findUnique({
      where: { email: 'manager@updesco.com' }
    });

    if (!managerExists) {
      try {
        const managerPassword = await bcrypt.hash('manager123', 10);
        await prisma.user.create({
          data: {
            id: 'manager-user-1',
            email: 'manager@updesco.com',
            password: managerPassword,
            name: 'Test Manager',
            role: 'MANAGER',
            manager: {
              create: {
                id: 'mgr-test-1',
                managerId: 'TMGR001',
                department: 'Engineering'
              }
            }
          }
        });
        console.log('✅ Manager user created: manager@updesco.com / manager123');
      } catch (error) {
        console.log('Manager user creation failed:', error.message);
      }
    } else {
      console.log('Manager user already exists');
    }

    // MD test user
    const mdExists = await prisma.user.findUnique({
      where: { email: 'md@updesco.com' }
    });

    if (!mdExists) {
      try {
        const mdPassword = await bcrypt.hash('md123', 10);
        await prisma.user.create({
          data: {
            id: 'md-user-1',
            email: 'md@updesco.com',
            password: mdPassword,
            name: 'Test MD',
            role: 'MD',
            md: {
              create: {
                id: 'md-test-1',
                mdId: 'TMD001'
              }
            }
          }
        });
        console.log('✅ MD user created: md@updesco.com / md123');
      } catch (error) {
        console.log('MD user creation failed:', error.message);
      }
    } else {
      console.log('MD user already exists');
    }

    console.log('\n🎉 All test users ready!');
    console.log('👤 Employee: test@updesco.com / test123');
    console.log('👨‍💼 Manager: manager@updesco.com / manager123');  
    console.log('🏢 MD: md@updesco.com / md123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAllTestUsers();
