import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken, createApiResponse, createErrorResponse } from '@/lib/auth';
import { createNotification } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    let whereClause: any = {};

    // If user is employee, only show their own leave requests
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }
      whereClause.employeeId = user.employee.id;
    } else if (employeeId) {
      // Manager or MD can view specific employee's leave requests
      whereClause.employeeId = employeeId;
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const leaveRequests = await prisma.leaveRequest.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            user: true,
          },
        },
        approvedByManager: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        appliedDate: 'desc',
      },
    });

    return createApiResponse({ leaveRequests });

  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return createErrorResponse('Failed to fetch leave requests', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || user.role !== 'EMPLOYEE') {
      return createErrorResponse('Unauthorized', 401);
    }

    if (!user.employee) {
      return createErrorResponse('Employee profile not found', 404);
    }

    const { startDate, endDate, type, reason } = await request.json();

    // Validate required fields
    if (!startDate || !endDate || !type || !reason) {
      return createErrorResponse('Missing required fields', 400);
    }

    // Check for overlapping leave requests
    const overlappingLeave = await prisma.leaveRequest.findFirst({
      where: {
        employeeId: user.employee.id,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) },
          },
        ],
      },
    });

    if (overlappingLeave) {
      return createErrorResponse('You already have a leave request for this period', 400);
    }

    const leaveRequest = await prisma.leaveRequest.create({
      data: {
        employeeId: user.employee.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type: type.toUpperCase(),
        reason,
        status: 'PENDING',
      },
    });

    // Notify manager if employee has one
    if (user.employee.managerId) {
      const manager = await prisma.manager.findUnique({
        where: { id: user.employee.managerId },
        include: { user: true },
      });

      if (manager) {
        await createNotification({
          title: 'New Leave Request',
          message: `${user.name} has applied for ${type.toLowerCase()} leave from ${startDate} to ${endDate}`,
          type: 'LEAVE_APPLIED',
          receiverId: manager.user.id,
          senderId: user.id,
        });
      }
    }

    return createApiResponse({ 
      leaveRequest,
      message: 'Leave request submitted successfully' 
    }, 201);

  } catch (error) {
    console.error('Error creating leave request:', error);
    return createErrorResponse('Failed to create leave request', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'MANAGER' && user.role !== 'MD')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { leaveRequestId, status, notes } = await request.json();

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return createErrorResponse('Invalid status', 400);
    }

    const leaveRequest = await prisma.leaveRequest.update({
      where: { id: leaveRequestId },
      data: {
        status: status as any,
        notes,
        approvedBy: user.manager?.id || user.md?.id,
        approvedDate: new Date(),
      },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    });

    // Notify employee about leave status
    await createNotification({
      title: `Leave Request ${status}`,
      message: `Your leave request from ${leaveRequest.startDate.toDateString()} to ${leaveRequest.endDate.toDateString()} has been ${status.toLowerCase()}`,
      type: status === 'APPROVED' ? 'LEAVE_APPROVED' : 'LEAVE_REJECTED',
      receiverId: leaveRequest.employee.user.id,
      senderId: user.id,
    });

    return createApiResponse({ 
      leaveRequest,
      message: `Leave request ${status.toLowerCase()} successfully` 
    });

  } catch (error) {
    console.error('Error updating leave request:', error);
    return createErrorResponse('Failed to update leave request', 500);
  }
}
