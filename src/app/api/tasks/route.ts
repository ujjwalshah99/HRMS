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
    const type = searchParams.get('type'); // 'assigned' or 'user-added'
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    let whereClause: any = {};

    // Filter based on user role
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }
      
      if (type === 'assigned') {
        whereClause.assignedToId = user.employee.id;
        whereClause.isUserAdded = false;
      } else if (type === 'user-added') {
        whereClause.createdById = user.employee.id;
        whereClause.isUserAdded = true;
      } else {
        // All tasks for the employee
        whereClause.OR = [
          { assignedToId: user.employee.id },
          { createdById: user.employee.id },
        ];
      }
    } else if (employeeId) {
      // Manager or MD viewing specific employee's tasks
      whereClause.OR = [
        { assignedToId: employeeId },
        { createdById: employeeId },
      ];
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status.toUpperCase();
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignedTo: {
          include: {
            user: true,
          },
        },
        createdBy: {
          include: {
            user: true,
          },
        },
        manager: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return createApiResponse({ tasks });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return createErrorResponse('Failed to fetch tasks', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { title, description, priority, dueDate, assignedToId, isUserAdded } = await request.json();

    // Validate required fields
    if (!title || !priority) {
      return createErrorResponse('Missing required fields', 400);
    }

    let taskData: any = {
      title,
      description,
      priority: priority.toUpperCase(),
      status: 'PENDING',
      isUserAdded: isUserAdded || false,
    };

    if (dueDate) {
      taskData.dueDate = new Date(dueDate);
    }

    // Handle task creation based on user role and type
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }

      if (isUserAdded) {
        // Employee creating their own task
        taskData.createdById = user.employee.id;
        taskData.assignedToId = user.employee.id;
      } else {
        return createErrorResponse('Employees can only create user-added tasks', 403);
      }
    } else if (user.role === 'MANAGER') {
      if (!user.manager) {
        return createErrorResponse('Manager profile not found', 404);
      }

      if (!assignedToId) {
        return createErrorResponse('Manager must assign task to an employee', 400);
      }

      // Verify the employee belongs to this manager
      const employee = await prisma.employee.findFirst({
        where: {
          id: assignedToId,
          managerId: user.manager.id,
        },
      });

      if (!employee) {
        return createErrorResponse('Employee not found or not under your management', 404);
      }

      taskData.assignedToId = assignedToId;
      taskData.createdById = assignedToId; // Employee is the creator for tracking
      taskData.managerId = user.manager.id;
      taskData.isUserAdded = false;
    }

    const task = await prisma.task.create({
      data: taskData,
      include: {
        assignedTo: {
          include: {
            user: true,
          },
        },
        createdBy: {
          include: {
            user: true,
          },
        },
      },
    });

    // Send notification if task is assigned by manager
    if (user.role === 'MANAGER' && assignedToId) {
      await createNotification({
        title: 'New Task Assigned',
        message: `You have been assigned a new task: ${title}`,
        type: 'TASK_ASSIGNED',
        receiverId: task.assignedTo!.user.id,
        senderId: user.id,
      });
    }

    return createApiResponse({ 
      task,
      message: 'Task created successfully' 
    }, 201);

  } catch (error) {
    console.error('Error creating task:', error);
    return createErrorResponse('Failed to create task', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { taskId, title, description, priority, status, dueDate, approvalStatus } = await request.json();

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: true,
        manager: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!existingTask) {
      return createErrorResponse('Task not found', 404);
    }

    // Check permissions
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }

      // Employee can only update their own tasks or assigned tasks
      if (existingTask.assignedToId !== user.employee.id && existingTask.createdById !== user.employee.id) {
        return createErrorResponse('Not authorized to update this task', 403);
      }

      // Employee cannot edit manager-assigned tasks except status
      if (!existingTask.isUserAdded && title) {
        return createErrorResponse('Cannot edit manager-assigned task details', 403);
      }
    }

    let updateData: any = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (priority) updateData.priority = priority.toUpperCase();
    if (status) updateData.status = status.toUpperCase();
    if (dueDate) updateData.dueDate = new Date(dueDate);

    // Handle approval status updates (for managers)
    if (approvalStatus && (user.role === 'MANAGER' || user.role === 'MD')) {
      updateData.approvalStatus = approvalStatus.toUpperCase();
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignedTo: {
          include: {
            user: true,
          },
        },
        createdBy: {
          include: {
            user: true,
          },
        },
      },
    });

    // Send notification for approval status updates
    if (approvalStatus && task.assignedTo) {
      await createNotification({
        title: `Task ${approvalStatus}`,
        message: `Your task "${task.title}" has been ${approvalStatus.toLowerCase()}`,
        type: approvalStatus === 'APPROVED' ? 'TASK_APPROVED' : 'TASK_REJECTED',
        receiverId: task.assignedTo.user.id,
        senderId: user.id,
      });
    }

    return createApiResponse({ 
      task,
      message: 'Task updated successfully' 
    });

  } catch (error) {
    console.error('Error updating task:', error);
    return createErrorResponse('Failed to update task', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    if (!taskId) {
      return createErrorResponse('Task ID required', 400);
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return createErrorResponse('Task not found', 404);
    }

    // Check permissions
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }

      // Employee can only delete their own user-added tasks
      if (task.createdById !== user.employee.id || !task.isUserAdded) {
        return createErrorResponse('Not authorized to delete this task', 403);
      }
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return createApiResponse({ 
      message: 'Task deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    return createErrorResponse('Failed to delete task', 500);
  }
}
