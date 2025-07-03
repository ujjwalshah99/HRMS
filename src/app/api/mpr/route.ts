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
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const employeeId = searchParams.get('employeeId');

    let whereClause: any = {};

    // If user is employee, only show their own MPR
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }
      whereClause.employeeId = user.employee.id;
    } else if (employeeId) {
      // Manager or MD can view specific employee's MPR
      whereClause.employeeId = employeeId;
    }

    // Filter by month/year if provided
    if (month) {
      whereClause.month = parseInt(month);
    }
    if (year) {
      whereClause.year = parseInt(year);
    }

    const reports = await prisma.monthlyReport.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' },
      ],
    });

    return createApiResponse({ reports });

  } catch (error) {
    console.error('Error fetching MPR reports:', error);
    return createErrorResponse('Failed to fetch MPR reports', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { month, year, employeeId } = await request.json();

    // Validate required fields
    if (!month || !year) {
      return createErrorResponse('Month and year are required', 400);
    }

    let targetEmployeeId = employeeId;

    // If employee is generating their own report
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }
      targetEmployeeId = user.employee.id;
    } else if (!employeeId) {
      return createErrorResponse('Employee ID is required', 400);
    }

    // Check if report already exists
    const existingReport = await prisma.monthlyReport.findUnique({
      where: {
        employeeId_month_year: {
          employeeId: targetEmployeeId,
          month: parseInt(month),
          year: parseInt(year),
        },
      },
    });

    if (existingReport) {
      return createErrorResponse('Monthly report already exists for this period', 409);
    }

    // Calculate task statistics for the month
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59, 999);

    const taskStats = await prisma.task.groupBy({
      by: ['status'],
      where: {
        assignedToId: targetEmployeeId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        status: true,
      },
    });

    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;

    taskStats.forEach(stat => {
      totalTasks += stat._count.status;
      if (stat.status === 'COMPLETED') {
        completedTasks = stat._count.status;
      } else {
        pendingTasks += stat._count.status;
      }
    });

    // Calculate performance score (completion rate)
    const performanceScore = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const report = await prisma.monthlyReport.create({
      data: {
        employeeId: targetEmployeeId,
        month: parseInt(month),
        year: parseInt(year),
        totalTasks,
        completedTasks,
        pendingTasks,
        performanceScore,
      },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    });

    return createApiResponse({ 
      report,
      message: 'Monthly report generated successfully' 
    }, 201);

  } catch (error) {
    console.error('Error generating MPR report:', error);
    return createErrorResponse('Failed to generate MPR report', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'MANAGER' && user.role !== 'MD')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { reportId, feedback, performanceScore } = await request.json();

    const report = await prisma.monthlyReport.update({
      where: { id: reportId },
      data: {
        feedback,
        performanceScore: performanceScore ? parseFloat(performanceScore) : undefined,
      },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    });

    return createApiResponse({ 
      report,
      message: 'Monthly report updated successfully' 
    });

  } catch (error) {
    console.error('Error updating MPR report:', error);
    return createErrorResponse('Failed to update MPR report', 500);
  }
}
