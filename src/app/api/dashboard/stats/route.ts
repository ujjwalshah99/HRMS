import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authenticateToken, createApiResponse, createErrorResponse } from '@/lib/auth';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const today = new Date();
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);
    const startThisMonth = startOfMonth(today);
    const endThisMonth = endOfMonth(today);

    let stats: any = {};

    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }

      // Employee dashboard stats
      const [
        todayAttendance,
        monthlyAttendance,
        pendingTasks,
        completedTasksThisMonth,
        pendingLeaveRequests,
        todaysMeetings,
        monthlyReport
      ] = await Promise.all([
        // Today's attendance
        prisma.attendance.findFirst({
          where: {
            employeeId: user.employee.id,
            date: {
              gte: startToday,
              lte: endToday,
            },
          },
        }),
        
        // Monthly attendance count
        prisma.attendance.count({
          where: {
            employeeId: user.employee.id,
            date: {
              gte: startThisMonth,
              lte: endThisMonth,
            },
            status: 'PRESENT',
          },
        }),
        
        // Pending tasks
        prisma.task.count({
          where: {
            assignedToId: user.employee.id,
            status: { in: ['PENDING', 'IN_PROGRESS'] },
          },
        }),
        
        // Completed tasks this month
        prisma.task.count({
          where: {
            assignedToId: user.employee.id,
            status: 'COMPLETED',
            createdAt: {
              gte: startThisMonth,
              lte: endThisMonth,
            },
          },
        }),
        
        // Pending leave requests
        prisma.leaveRequest.count({
          where: {
            employeeId: user.employee.id,
            status: 'PENDING',
          },
        }),
        
        // Today's meetings
        prisma.meeting.count({
          where: {
            startTime: {
              gte: startToday,
              lte: endToday,
            },
            participants: {
              some: {
                employeeId: user.employee.id,
              },
            },
          },
        }),
        
        // Current month's report
        prisma.monthlyReport.findFirst({
          where: {
            employeeId: user.employee.id,
            month: today.getMonth() + 1,
            year: today.getFullYear(),
          },
        }),
      ]);

      stats = {
        todayAttendance,
        monthlyAttendanceCount: monthlyAttendance,
        pendingTasks,
        completedTasksThisMonth,
        pendingLeaveRequests,
        todaysMeetings,
        monthlyReport,
        workingDays: {
          total: new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(),
          attended: monthlyAttendance,
        },
      };

    } else if (user.role === 'MANAGER') {
      if (!user.manager) {
        return createErrorResponse('Manager profile not found', 404);
      }

      // Manager dashboard stats
      const [
        totalEmployees,
        presentToday,
        absentToday,
        lateToday,
        pendingLeaveRequests,
        pendingTasks,
        todaysMeetings,
        teamPerformance
      ] = await Promise.all([
        // Total employees under management
        prisma.employee.count({
          where: {
            managerId: user.manager.id,
          },
        }),
        
        // Present today
        prisma.attendance.count({
          where: {
            date: {
              gte: startToday,
              lte: endToday,
            },
            status: 'PRESENT',
            employee: {
              managerId: user.manager.id,
            },
          },
        }),
        
        // Absent today
        prisma.attendance.count({
          where: {
            date: {
              gte: startToday,
              lte: endToday,
            },
            status: 'ABSENT',
            employee: {
              managerId: user.manager.id,
            },
          },
        }),
        
        // Late today
        prisma.attendance.count({
          where: {
            date: {
              gte: startToday,
              lte: endToday,
            },
            status: 'LATE',
            employee: {
              managerId: user.manager.id,
            },
          },
        }),
        
        // Pending leave requests
        prisma.leaveRequest.count({
          where: {
            status: 'PENDING',
            employee: {
              managerId: user.manager.id,
            },
          },
        }),
        
        // Pending tasks assigned by manager
        prisma.task.count({
          where: {
            managerId: user.manager.id,
            status: { in: ['PENDING', 'IN_PROGRESS'] },
          },
        }),
        
        // Today's meetings
        prisma.meeting.count({
          where: {
            createdById: user.manager.id,
            startTime: {
              gte: startToday,
              lte: endToday,
            },
          },
        }),
        
        // Team performance this month
        prisma.task.groupBy({
          by: ['status'],
          where: {
            managerId: user.manager.id,
            createdAt: {
              gte: startThisMonth,
              lte: endThisMonth,
            },
          },
          _count: {
            status: true,
          },
        }),
      ]);

      stats = {
        totalEmployees,
        presentToday,
        absentToday,
        lateToday,
        pendingLeaveRequests,
        pendingTasks,
        todaysMeetings,
        teamPerformance,
      };

    } else if (user.role === 'MD') {
      // MD dashboard stats (company-wide)
      const [
        totalEmployees,
        totalManagers,
        presentToday,
        absentToday,
        lateToday,
        pendingLeaveRequests,
        totalTasks,
        todaysMeetings,
        companyPerformance
      ] = await Promise.all([
        // Total employees
        prisma.employee.count(),
        
        // Total managers
        prisma.manager.count(),
        
        // Present today
        prisma.attendance.count({
          where: {
            date: {
              gte: startToday,
              lte: endToday,
            },
            status: 'PRESENT',
          },
        }),
        
        // Absent today
        prisma.attendance.count({
          where: {
            date: {
              gte: startToday,
              lte: endToday,
            },
            status: 'ABSENT',
          },
        }),
        
        // Late today
        prisma.attendance.count({
          where: {
            date: {
              gte: startToday,
              lte: endToday,
            },
            status: 'LATE',
          },
        }),
        
        // All pending leave requests
        prisma.leaveRequest.count({
          where: {
            status: 'PENDING',
          },
        }),
        
        // Total tasks this month
        prisma.task.count({
          where: {
            createdAt: {
              gte: startThisMonth,
              lte: endThisMonth,
            },
          },
        }),
        
        // Today's meetings
        prisma.meeting.count({
          where: {
            startTime: {
              gte: startToday,
              lte: endToday,
            },
          },
        }),
        
        // Company performance this month
        prisma.task.groupBy({
          by: ['status'],
          where: {
            createdAt: {
              gte: startThisMonth,
              lte: endThisMonth,
            },
          },
          _count: {
            status: true,
          },
        }),
      ]);

      stats = {
        totalEmployees,
        totalManagers,
        presentToday,
        absentToday,
        lateToday,
        pendingLeaveRequests,
        totalTasks,
        todaysMeetings,
        companyPerformance,
      };
    }

    return createApiResponse({ stats });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return createErrorResponse('Failed to fetch dashboard statistics', 500);
  }
}
