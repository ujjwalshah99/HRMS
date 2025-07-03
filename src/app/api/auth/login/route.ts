import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return createErrorResponse('Missing email or password', 400);
    }

    // Find user with role-specific data
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        employee: true,
        manager: true,
        md: true,
      },
    });

    if (!user) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return createErrorResponse('Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Prepare user data without password
    const { password: _, ...userWithoutPassword } = user;

    return createApiResponse({
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Login error:', error);
    return createErrorResponse('Login failed', 500);
  }
}
