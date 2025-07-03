import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { createApiResponse, createErrorResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, department, position, joinDate } = await request.json();

    // Validate required fields
    if (!email || !password || !name || !role) {
      return createErrorResponse('Missing required fields', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return createErrorResponse('User already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role.toUpperCase(),
      },
    });

    // Create role-specific profile
    if (role.toUpperCase() === 'EMPLOYEE') {
      const employeeId = `EMP${Date.now()}`;
      await prisma.employee.create({
        data: {
          userId: user.id,
          employeeId,
          department: department || 'General',
          position: position || 'Employee',
          joinDate: joinDate ? new Date(joinDate) : new Date(),
        },
      });
    } else if (role.toUpperCase() === 'MANAGER') {
      const managerId = `MGR${Date.now()}`;
      await prisma.manager.create({
        data: {
          userId: user.id,
          managerId,
          department: department || 'General',
        },
      });
    } else if (role.toUpperCase() === 'MD') {
      const mdId = `MD${Date.now()}`;
      await prisma.mD.create({
        data: {
          userId: user.id,
          mdId,
        },
      });
    }

    // Return success (without password)
    const { password: _, ...userWithoutPassword } = user;
    return createApiResponse({
      message: 'User registered successfully',
      user: userWithoutPassword
    }, 201);

  } catch (error) {
    console.error('Registration error:', error);
    return createErrorResponse('Registration failed', 500);
  }
}
