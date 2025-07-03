// Quick test to verify database and create a simple user
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@updesco.com' }
    });

    if (existingUser) {
      console.log('Test user already exists');
      console.log('📧 Email: test@updesco.com');
      console.log('🔑 Password: test123');
      return;
    }

    // Clean up any existing data first
    await prisma.employee.deleteMany({
      where: { employeeId: 'TEST001' }
    });

    // Create a simple test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    
    const user = await prisma.user.create({
      data: {
        id: 'test-user-1',
        email: 'test@updesco.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'EMPLOYEE',
        employee: {
          create: {
            id: 'emp-test-1',
            employeeId: 'TEST001',
            department: 'IT',
            position: 'Developer',
            joinDate: new Date()
          }
        }
      }
    });

    console.log('✅ Test user created successfully:', user.email);
    console.log('📧 Email: test@updesco.com');
    console.log('🔑 Password: test123');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
