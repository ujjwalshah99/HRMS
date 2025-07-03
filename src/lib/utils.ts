import { prisma } from '@/lib/prisma';

export interface NotificationData {
  title: string;
  message: string;
  type: string;
  receiverId: string;
  senderId?: string;
}

export async function createNotification(data: NotificationData) {
  try {
    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type as any,
        receiverId: data.receiverId,
        senderId: data.senderId,
      },
    });

    // Here you would emit socket event for real-time notifications
    // if (global.io) {
    //   global.io.to(data.receiverId).emit('newNotification', notification);
    // }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export function calculateWorkingHours(checkIn: Date, checkOut: Date): number {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return diffMs / (1000 * 60 * 60); // Convert to hours
}

export function determineAttendanceStatus(checkInTime: Date, workingHours?: number): string {
  const checkInHour = checkInTime.getHours();
  const checkInMinute = checkInTime.getMinutes();
  
  // Half day takes priority if working hours less than 8
  if (workingHours && workingHours < 8) {
    return 'HALF_DAY';
  }
  
  // Late if check-in is after 10:30 AM
  if (checkInHour > 10 || (checkInHour === 10 && checkInMinute > 30)) {
    return 'LATE';
  }
  
  return 'PRESENT';
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function startOfDay(date: Date): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function endOfDay(date: Date): Date {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Get today's date string in YYYY-MM-DD format consistently across the app
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as a Date object at midnight UTC (for database queries)
 */
export function getTodayDate(): Date {
  const now = new Date();
  const todayString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  return new Date(todayString + 'T00:00:00.000Z');
}

/**
 * Check if a given date is a holiday (Sunday or second Saturday of the month)
 */
export function isHoliday(date: Date): boolean {
  const dayOfWeek = date.getDay();
  
  // All Sundays are holidays
  if (dayOfWeek === 0) {
    return true;
  }
  
  // Second Saturday of the month is a holiday
  if (dayOfWeek === 6) {
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Count Saturdays in this month to determine if this is the second Saturday
    let saturdayCount = 0;
    for (let day = 1; day <= dayOfMonth; day++) {
      const testDate = new Date(year, month, day);
      if (testDate.getDay() === 6) {
        saturdayCount++;
      }
    }
    
    return saturdayCount === 2;
  }
  
  return false;
}

/**
 * Get holiday name for a given date
 */
export function getHolidayName(date: Date): string | null {
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 0) {
    return 'Sunday';
  }
  
  if (dayOfWeek === 6 && isHoliday(date)) {
    return 'Second Saturday';
  }
  
  return null;
}
