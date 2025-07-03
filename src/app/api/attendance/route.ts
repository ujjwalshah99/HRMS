import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken, createApiResponse, createErrorResponse } from '@/lib/auth';
import { startOfDay, endOfDay, calculateWorkingHours, determineAttendanceStatus, getTodayDate } from '@/lib/utils';

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

    // If user is employee, only show their own attendance
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }
      whereClause.employeeId = user.employee.id;
    } else if (employeeId) {
      // Manager or MD can view specific employee's attendance
      whereClause.employeeId = employeeId;
    }

    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const attendanceRecords = await prisma.attendance.findMany({
      where: whereClause,
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return createApiResponse({ attendanceRecords });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    return createErrorResponse('Failed to fetch attendance records', 500);
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

    const body = await request.json();
    const { type } = body;
    
    // Validate that type is provided
    if (!type || (type !== 'check-in' && type !== 'check-out')) {
      return createErrorResponse('Invalid attendance type. Must be "check-in" or "check-out"', 400);
    }
    
    const now = new Date();
    // Use consistent date handling
    const today = getTodayDate();

    // Check if attendance record exists for today
    let attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: user.employee.id,
        date: today,
      },
    });

    if (type === 'check-in') {
      if (attendance && attendance.checkInTime) {
        return createErrorResponse('Already checked in for today', 400);
      }

      if (!attendance) {
        // Create new attendance record
        attendance = await prisma.attendance.create({
          data: {
            employeeId: user.employee.id,
            date: today,
            checkInTime: now,
            status: determineAttendanceStatus(now) as any,
          },
        });
      } else {
        // Update existing record with check-in time
        attendance = await prisma.attendance.update({
          where: { id: attendance.id },
          data: {
            checkInTime: now,
            status: determineAttendanceStatus(now) as any,
          },
        });
      }
    } else if (type === 'check-out') {
      if (!attendance || !attendance.checkInTime) {
        return createErrorResponse('Must check in before checking out', 400);
      }

      if (attendance.checkOutTime) {
        return createErrorResponse('Already checked out for today', 400);
      }

      const workingHours = calculateWorkingHours(attendance.checkInTime, now);
      const status = determineAttendanceStatus(attendance.checkInTime, workingHours);

      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          checkOutTime: now,
          workingHours,
          status: status as any,
        },
      });
    }

    return createApiResponse({ 
      attendance,
      message: `Successfully ${type.replace('-', ' ')}ed` 
    });

  } catch (error) {
    console.error('Error updating attendance:', error);
    return createErrorResponse('Failed to update attendance', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'MANAGER' && user.role !== 'MD')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { attendanceId, status, notes } = await request.json();

    const attendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        status: status as any,
        notes,
      },
    });

    return createApiResponse({ 
      attendance,
      message: 'Attendance updated successfully' 
    });

  } catch (error) {
    console.error('Error updating attendance:', error);
    return createErrorResponse('Failed to update attendance', 500);
  }
}
