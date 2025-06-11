'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AttendanceRecord } from '@/types';

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
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceRecords.find(record => record.date === dateString);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'present':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'absent':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'late':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'half-day':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
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
            const isToday = isCurrentMonth && day === today.getDate();
            const isFutureDate = isCurrentMonth && day > today.getDate();

            return (
              <div
                key={day}
                className={`p-3 h-14 flex items-center justify-center text-sm relative rounded-xl border transition-all duration-200 cursor-pointer ${
                  isToday
                    ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300 shadow-md'
                    : attendance
                      ? `${getStatusColor(attendance.status)} border shadow-sm hover:shadow-md`
                      : isFutureDate
                        ? 'bg-gray-50 border-gray-100 hover:bg-gray-100 hover:border-gray-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className={`font-semibold ${
                  isToday
                    ? 'text-blue-900 text-base'
                    : attendance
                      ? ''
                      : isFutureDate
                        ? 'text-gray-400'
                        : 'text-gray-800'
                }`}>
                  {day}
                </span>
                {attendance && (
                  <div className="absolute bottom-1 right-1">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                      attendance.status === 'present' ? 'bg-emerald-500' :
                      attendance.status === 'absent' ? 'bg-red-500' :
                      attendance.status === 'late' ? 'bg-amber-500' :
                      'bg-orange-500'
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
              <span className="text-sm font-medium text-emerald-800">Present</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg border border-red-200">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
              <span className="text-sm font-medium text-red-800">Absent</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
              <span className="text-sm font-medium text-amber-800">Late</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <div className="w-3 h-3 rounded-full bg-orange-500 shadow-sm"></div>
              <span className="text-sm font-medium text-orange-800">Half Day</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
