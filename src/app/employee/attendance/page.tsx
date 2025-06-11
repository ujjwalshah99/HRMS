'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { AttendanceRecord } from '@/types';

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());

  // Mock attendance data
  const attendanceRecords: AttendanceRecord[] = [
    {
      id: '1',
      employeeId: 'emp1',
      date: '2024-01-15',
      checkInTime: '09:00',
      checkOutTime: '17:30',
      status: 'present',
      workingHours: 8.5
    },
    {
      id: '2',
      employeeId: 'emp1',
      date: '2024-01-16',
      checkInTime: '09:15',
      checkOutTime: '17:45',
      status: 'late',
      workingHours: 8.5
    },
    {
      id: '3',
      employeeId: 'emp1',
      date: '2024-01-17',
      status: 'absent'
    },
    {
      id: '4',
      employeeId: 'emp1',
      date: '2024-01-18',
      checkInTime: '08:45',
      checkOutTime: '16:30',
      status: 'half-day',
      workingHours: 4
    },
    {
      id: '5',
      employeeId: 'emp1',
      date: '2024-01-19',
      status: 'leave'
    }
  ];

  const holidays = [
    { date: '2024-01-26', name: 'Republic Day' },
    { date: '2024-03-08', name: 'Holi' },
    { date: '2024-08-15', name: 'Independence Day' }
  ];

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

  const isHoliday = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays.find(holiday => holiday.date === dateString);
  };

  const getStatusColor = (status?: string, isHoliday?: boolean) => {
    if (isHoliday) return 'bg-purple-100 text-purple-800 border-purple-200';
    
    switch (status) {
      case 'present':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      case 'absent':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'late':
        return 'bg-amber-100 text-amber-900 border-amber-200';
      case 'half-day':
        return 'bg-orange-100 text-orange-900 border-orange-200';
      case 'leave':
        return 'bg-blue-100 text-blue-900 border-blue-200';
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

  // Calculate attendance breakdown
  const currentMonthRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === currentDate.getMonth() && 
           recordDate.getFullYear() === currentDate.getFullYear();
  });

  const breakdown = {
    present: currentMonthRecords.filter(r => r.status === 'present').length,
    absent: currentMonthRecords.filter(r => r.status === 'absent').length,
    late: currentMonthRecords.filter(r => r.status === 'late').length,
    halfDay: currentMonthRecords.filter(r => r.status === 'half-day').length,
    leave: currentMonthRecords.filter(r => r.status === 'leave').length,
    holidays: holidays.filter(h => {
      const holidayDate = new Date(h.date);
      return holidayDate.getMonth() === currentDate.getMonth() && 
             holidayDate.getFullYear() === currentDate.getFullYear();
    }).length
  };

  return (
    <ProtectedRoute allowedRoles={['employee']}>
      <Layout employeeName={user?.name || "Employee"} profilePicture={user?.profilePicture}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600">View your attendance history and calendar</p>
          </div>

          {/* Calendar */}
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
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-lg font-bold min-w-[160px] text-center text-gray-900 bg-blue-50 px-4 py-2 rounded-lg">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </span>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
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
                  <div key={`empty-${index}`} className="p-3 h-14"></div>
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, index) => {
                  const day = index + 1;
                  const attendance = getAttendanceForDate(day);
                  const holiday = isHoliday(day);
                  const isToday = isCurrentMonth && day === today.getDate();
                  const isFutureDate = isCurrentMonth && day > today.getDate();

                  return (
                    <div
                      key={day}
                      className={`p-3 h-14 flex items-center justify-center text-sm relative rounded-xl border transition-all duration-200 ${
                        isToday 
                          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-300 shadow-md' 
                          : holiday || attendance 
                            ? `${getStatusColor(attendance?.status, !!holiday)} border shadow-sm` 
                            : isFutureDate
                              ? 'bg-gray-50 border-gray-100'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`font-semibold ${
                        isToday 
                          ? 'text-blue-900 text-base' 
                          : isFutureDate
                            ? 'text-gray-400'
                            : 'text-gray-800'
                      }`}>
                        {day}
                      </span>
                      {(attendance || holiday) && (
                        <div className="absolute bottom-1 right-1">
                          <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                            holiday ? 'bg-purple-500' :
                            attendance?.status === 'present' ? 'bg-emerald-500' :
                            attendance?.status === 'absent' ? 'bg-red-500' :
                            attendance?.status === 'late' ? 'bg-amber-500' :
                            attendance?.status === 'half-day' ? 'bg-orange-500' :
                            'bg-blue-500'
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
                  <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                    <span className="text-sm font-medium text-blue-800">Leave</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></div>
                    <span className="text-sm font-medium text-purple-800">Holiday</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-900">{breakdown.present}</div>
                  <div className="text-sm text-emerald-700">Present</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-900">{breakdown.absent}</div>
                  <div className="text-sm text-red-700">Absent</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-900">{breakdown.late}</div>
                  <div className="text-sm text-amber-700">Late</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-900">{breakdown.halfDay}</div>
                  <div className="text-sm text-orange-700">Half Day</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-900">{breakdown.leave}</div>
                  <div className="text-sm text-blue-700">Leave</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-900">{breakdown.holidays}</div>
                  <div className="text-sm text-purple-700">Holidays</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
