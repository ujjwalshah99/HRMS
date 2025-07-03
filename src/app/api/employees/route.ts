import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken, createApiResponse, createErrorResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const employeeId = searchParams.get('employeeId');

    let whereClause: any = {};

    // Filter by department if provided
    if (department) {
      whereClause.department = department;
    }

    // If specific employee ID is requested
    if (employeeId) {
      whereClause.id = employeeId;
    }

    // Role-based filtering
    if (user.role === 'EMPLOYEE') {
      // Employees can only view their own profile
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }
      whereClause.id = user.employee.id;
    } else if (user.role === 'MANAGER') {
      // Managers can view employees under their management
      if (!user.manager) {
        return createErrorResponse('Manager profile not found', 404);
      }
      whereClause.managerId = user.manager.id;
    }
    // MD can view all employees (no additional filtering)

    const employees = await prisma.employee.findMany({
      where: whereClause,
      include: {
        user: true,
        manager: {
          include: {
            user: true,
          },
        },
        attendances: {
          take: 5,
          orderBy: {
            date: 'desc',
          },
        },
        leaveRequests: {
          where: {
            status: 'PENDING',
          },
        },
        assignedTasks: {
          where: {
            status: { in: ['PENDING', 'IN_PROGRESS'] },
          },
        },
      },
      orderBy: {
        joinDate: 'desc',
      },
    });

    return createApiResponse({ employees });

  } catch (error) {
    console.error('Error fetching employees:', error);
    return createErrorResponse('Failed to fetch employees', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { employeeId, name, department, position, managerId, profilePicture } = await request.json();

    if (!employeeId) {
      return createErrorResponse('Employee ID is required', 400);
    }

    // Check permissions
    if (user.role === 'EMPLOYEE') {
      if (!user.employee || user.employee.id !== employeeId) {
        return createErrorResponse('Can only update your own profile', 403);
      }
    }

    // Find the employee
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true },
    });

    if (!employee) {
      return createErrorResponse('Employee not found', 404);
    }

    // Update user data
    if (name) {
      await prisma.user.update({
        where: { id: employee.userId },
        data: { name },
      });
    }

    // Update employee data
    let updateData: any = {};
    if (department) updateData.department = department;
    if (position) updateData.position = position;
    if (profilePicture) updateData.profilePicture = profilePicture;
    
    // Only managers and MD can assign managers
    if (managerId && (user.role === 'MANAGER' || user.role === 'MD')) {
      updateData.managerId = managerId;
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: employeeId },
      data: updateData,
      include: {
        user: true,
        manager: {
          include: {
            user: true,
          },
        },
      },
    });

    return createApiResponse({ 
      employee: updatedEmployee,
      message: 'Employee updated successfully' 
    });

  } catch (error) {
    console.error('Error updating employee:', error);
    return createErrorResponse('Failed to update employee', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || user.role !== 'MD') {
      return createErrorResponse('Unauthorized - Only MD can delete employees', 401);
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');

    if (!employeeId) {
      return createErrorResponse('Employee ID is required', 400);
    }

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: { user: true },
    });

    if (!employee) {
      return createErrorResponse('Employee not found', 404);
    }

    // Delete the user (cascade will delete employee record)
    await prisma.user.delete({
      where: { id: employee.userId },
    });

    return createApiResponse({ 
      message: 'Employee deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting employee:', error);
    return createErrorResponse('Failed to delete employee', 500);
  }
}
