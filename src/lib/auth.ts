import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: string;
  employee?: any;
  manager?: any;
  md?: any;
}

export async function authenticateToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        employee: true,
        manager: true,
        md: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      employee: user.employee,
      manager: user.manager,
      md: user.md,
    };
  } catch (error) {
    return null;
  }
}

export function createApiResponse(data: any, status: number = 200) {
  return Response.json(data, { status });
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json({ error: message }, { status });
}
