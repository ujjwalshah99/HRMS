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
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    let whereClause: any = {};

    // Filter by date if provided
    if (date) {
      const targetDate = new Date(date);
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
      
      whereClause.startTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Filter by status if provided
    if (status) {
      whereClause.status = status.toUpperCase();
    }

    let meetings;

    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }

      // Get meetings where employee is a participant
      meetings = await prisma.meeting.findMany({
        where: {
          ...whereClause,
          participants: {
            some: {
              employeeId: user.employee.id,
            },
          },
        },
        include: {
          createdBy: {
            include: {
              user: true,
            },
          },
          participants: {
            include: {
              employee: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      });
    } else {
      // Manager or MD can see all meetings
      meetings = await prisma.meeting.findMany({
        where: whereClause,
        include: {
          createdBy: {
            include: {
              user: true,
            },
          },
          participants: {
            include: {
              employee: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      });
    }

    return createApiResponse({ meetings });

  } catch (error) {
    console.error('Error fetching meetings:', error);
    return createErrorResponse('Failed to fetch meetings', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'MANAGER' && user.role !== 'MD')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { title, description, startTime, endTime, location, type, participantIds } = await request.json();

    // Validate required fields
    if (!title || !startTime || !endTime || !participantIds || participantIds.length === 0) {
      return createErrorResponse('Missing required fields', 400);
    }

    // Validate time
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return createErrorResponse('End time must be after start time', 400);
    }

    let createdById = null;
    if (user.role === 'MANAGER' && user.manager) {
      createdById = user.manager.id;
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        startTime: start,
        endTime: end,
        location,
        type: type?.toUpperCase() || 'TEAM',
        status: 'SCHEDULED',
        createdById,
      },
    });

    // Add participants
    const participantData = participantIds.map((employeeId: string) => ({
      meetingId: meeting.id,
      employeeId,
      status: 'INVITED',
    }));

    await prisma.meetingParticipant.createMany({
      data: participantData,
    });

    // Send notifications to participants
    const participants = await prisma.employee.findMany({
      where: {
        id: { in: participantIds },
      },
      include: {
        user: true,
      },
    });

    for (const participant of participants) {
      await createNotification({
        title: 'Meeting Invitation',
        message: `You have been invited to "${title}" scheduled for ${start.toLocaleString()}`,
        type: 'MEETING_SCHEDULED',
        receiverId: participant.user.id,
        senderId: user.id,
      });
    }

    const meetingWithParticipants = await prisma.meeting.findUnique({
      where: { id: meeting.id },
      include: {
        createdBy: {
          include: {
            user: true,
          },
        },
        participants: {
          include: {
            employee: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return createApiResponse({ 
      meeting: meetingWithParticipants,
      message: 'Meeting created successfully' 
    }, 201);

  } catch (error) {
    console.error('Error creating meeting:', error);
    return createErrorResponse('Failed to create meeting', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { meetingId, title, description, startTime, endTime, location, status, participantStatus } = await request.json();

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        participants: true,
      },
    });

    if (!meeting) {
      return createErrorResponse('Meeting not found', 404);
    }

    // Check permissions for meeting updates
    if (user.role === 'EMPLOYEE') {
      if (!user.employee) {
        return createErrorResponse('Employee profile not found', 404);
      }

      // Employee can only update their participation status
      if (participantStatus) {
        const participant = meeting.participants.find(p => p.employeeId === user.employee!.id);
        if (!participant) {
          return createErrorResponse('Not a participant of this meeting', 403);
        }

        await prisma.meetingParticipant.update({
          where: { id: participant.id },
          data: { status: participantStatus.toUpperCase() },
        });

        return createApiResponse({ 
          message: 'Participation status updated successfully' 
        });
      } else {
        return createErrorResponse('Employees can only update participation status', 403);
      }
    }

    // Manager or MD can update meeting details
    let updateData: any = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (startTime) updateData.startTime = new Date(startTime);
    if (endTime) updateData.endTime = new Date(endTime);
    if (location) updateData.location = location;
    if (status) updateData.status = status.toUpperCase();

    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: updateData,
      include: {
        createdBy: {
          include: {
            user: true,
          },
        },
        participants: {
          include: {
            employee: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return createApiResponse({ 
      meeting: updatedMeeting,
      message: 'Meeting updated successfully' 
    });

  } catch (error) {
    console.error('Error updating meeting:', error);
    return createErrorResponse('Failed to update meeting', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'MANAGER' && user.role !== 'MD')) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const meetingId = searchParams.get('meetingId');

    if (!meetingId) {
      return createErrorResponse('Meeting ID required', 400);
    }

    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        participants: {
          include: {
            employee: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!meeting) {
      return createErrorResponse('Meeting not found', 404);
    }

    // Notify participants about cancellation
    for (const participant of meeting.participants) {
      await createNotification({
        title: 'Meeting Cancelled',
        message: `The meeting "${meeting.title}" scheduled for ${meeting.startTime.toLocaleString()} has been cancelled`,
        type: 'MEETING_CANCELLED',
        receiverId: participant.employee.user.id,
        senderId: user.id,
      });
    }

    await prisma.meeting.delete({
      where: { id: meetingId },
    });

    return createApiResponse({ 
      message: 'Meeting cancelled successfully' 
    });

  } catch (error) {
    console.error('Error cancelling meeting:', error);
    return createErrorResponse('Failed to cancel meeting', 500);
  }
}
