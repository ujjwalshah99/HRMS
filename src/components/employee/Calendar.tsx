'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AttendanceRecord } from '@/types';
import { isHoliday, getHolidayName } from '@/lib/utils';

interface CalendarProps {
  attendanceRecords: AttendanceRecord[];
}

export const Calendar: React.FC<CalendarProps> = ({ attendanceRecords }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAttendanceForDate = (day: number) => {
    const targetDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const records = Array.isArray(attendanceRecords) ? attendanceRecords : [];
    return records.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === targetDate;
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'PRESENT':
      case 'present':
        return {
          background: 'bg-emerald-500/20',
          text: 'text-emerald-900',
          border: 'border-emerald-300'
        };
      case 'ABSENT':
      case 'absent':
        return {
          background: 'bg-red-500/20',
          text: 'text-red-900', 
          border: 'border-red-300'
        };
      case 'LATE':
      case 'late':
        return {
          background: 'bg-yellow-400/20',
          text: 'text-yellow-800',
          border: 'border-yellow-400'
        };
      case 'HALF_DAY':
      case 'half-day':
        return {
          background: 'bg-amber-600/20',
          text: 'text-amber-900',
          border: 'border-amber-300'
        };
      case 'LEAVE':
      case 'leave':
        return {
          background: 'bg-blue-500/20',
          text: 'text-blue-900',
          border: 'border-blue-300'
        };
      case 'HOLIDAY':
      case 'holiday':
        return {
          background: 'bg-purple-500/20',
          text: 'text-purple-900',
          border: 'border-purple-300'
        };
      default:
        return {
          background: 'bg-gray-50',
          text: 'text-gray-800',
          border: 'border-gray-200'
        };
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
            </svg>
            <span>Attendance Calendar</span>
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <span className="text-lg font-bold min-w-[160px] text-center text-gray-900 bg-blue-50 px-4 py-2 rounded-lg">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="hover:bg-blue-50 hover:border-blue-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-bold text-gray-800 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDay }, (_, index) => (
            <div key={`empty-${index}`} className="p-2 h-12"></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const attendance = getAttendanceForDate(day);
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isDayHoliday = isHoliday(dayDate);
            const isToday = isCurrentMonth && day === today.getDate();
            const isFutureDate = isCurrentMonth && day > today.getDate();
            
            // Priority: Holiday > Attendance > Default
            let statusColors = null;
            if (isDayHoliday) {
              statusColors = getStatusColor('HOLIDAY');
            } else if (attendance) {
              statusColors = getStatusColor(attendance.status);
            }

            return (
              <div
                key={day}
                className={`p-3 h-14 flex items-center justify-center text-sm relative rounded-xl border transition-all duration-200 cursor-pointer ${
                  statusColors
                    ? `${statusColors.background} ${statusColors.border} shadow-sm hover:shadow-md ${
                        isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                      }`
                    : isToday
                      ? 'ring-2 ring-blue-500 bg-blue-100/40 border-blue-400 shadow-md'
                      : isFutureDate
                        ? 'bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className={`font-semibold text-base z-10 ${
                  statusColors
                    ? statusColors.text
                    : isToday
                      ? 'text-blue-900'
                      : isFutureDate
                        ? 'text-gray-400'
                        : 'text-gray-800'
                }`}>
                  {day}
                </span>
                {(attendance || isDayHoliday) && (
                  <div className="absolute bottom-1 right-1 z-10">
                    <div className={`w-2 h-2 rounded-full shadow-sm ${
                      isDayHoliday ? 'bg-purple-600' :
                      attendance?.status === 'PRESENT' ? 'bg-emerald-600' :
                      attendance?.status === 'ABSENT' ? 'bg-red-600' :
                      attendance?.status === 'LATE' ? 'bg-yellow-400' :
                      attendance?.status === 'HALF_DAY' ? 'bg-amber-600' :
                      attendance?.status === 'LEAVE' ? 'bg-blue-600' :
                      'bg-gray-600'
                    }`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-emerald-500/10 rounded-lg border border-emerald-200">
              <div className="w-3 h-3 rounded-full bg-emerald-600 shadow-sm"></div>
              <span className="text-sm font-medium text-emerald-800">Present</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-red-500/10 rounded-lg border border-red-200">
              <div className="w-3 h-3 rounded-full bg-red-600 shadow-sm"></div>
              <span className="text-sm font-medium text-red-800">Absent</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-yellow-400/10 rounded-lg border border-yellow-300">
              <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
              <span className="text-sm font-medium text-yellow-700">Late</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-amber-600/10 rounded-lg border border-amber-200">
              <div className="w-3 h-3 rounded-full bg-amber-600 shadow-sm"></div>
              <span className="text-sm font-medium text-amber-800">Half Day</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-blue-500/10 rounded-lg border border-blue-200">
              <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm"></div>
              <span className="text-sm font-medium text-blue-800">Leave</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-purple-500/10 rounded-lg border border-purple-200">
              <div className="w-3 h-3 rounded-full bg-purple-600 shadow-sm"></div>
              <span className="text-sm font-medium text-purple-800">Holiday</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
