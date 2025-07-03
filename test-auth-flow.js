const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testAuth() {
  try {
    // First, let's test if we can find a user
    const user = await prisma.user.findFirst({
      where: { email: 'employee@example.com' },
      include: {
        employee: true,
        manager: true,
        md: true,
      },
    });

    if (!user) {
      console.log('No user found');
      return;
    }

    console.log('User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // Generate a new token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Generated token:', token);

    // Test token verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verification successful:', decoded);

    // Test token expiration
    const now = Math.floor(Date.now() / 1000);
    console.log('Token expires in seconds:', decoded.exp - now);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
