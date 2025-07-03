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
    const isRead = searchParams.get('isRead');
    const type = searchParams.get('type');

    let whereClause: any = {
      receiverId: user.id,
    };

    // Filter by read status if provided
    if (isRead !== null) {
      whereClause.isRead = isRead === 'true';
    }

    // Filter by type if provided
    if (type) {
      whereClause.type = type.toUpperCase();
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to latest 50 notifications
    });

    return createApiResponse({ notifications });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return createErrorResponse('Failed to fetch notifications', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { notificationIds, isRead } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return createErrorResponse('Notification IDs array is required', 400);
    }

    // Update notifications (only user's own notifications)
    const updatedNotifications = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        receiverId: user.id,
      },
      data: {
        isRead: isRead !== false, // Default to true if not specified
      },
    });

    return createApiResponse({ 
      updatedCount: updatedNotifications.count,
      message: 'Notifications updated successfully' 
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    return createErrorResponse('Failed to update notifications', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');

    if (!notificationId) {
      return createErrorResponse('Notification ID is required', 400);
    }

    // Verify ownership and delete
    const deletedNotification = await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        receiverId: user.id,
      },
    });

    if (deletedNotification.count === 0) {
      return createErrorResponse('Notification not found or unauthorized', 404);
    }

    return createApiResponse({ 
      message: 'Notification deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    return createErrorResponse('Failed to delete notification', 500);
  }
}
