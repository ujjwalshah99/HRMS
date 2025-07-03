// Quick test to check if test user exists
const { PrismaClient } = require('@prisma/client');

async function checkTestUser() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking test user...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'john.doe@company.com' },
      include: { employee: true }
    });
    
    if (user) {
      console.log('✅ Test user found:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        hasEmployee: !!user.employee
      });
    } else {
      console.log('❌ Test user not found');
      
      // Check what users exist
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true }
      });
      console.log('📋 Available users:', allUsers);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTestUser();
