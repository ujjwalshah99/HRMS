'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { isHoliday, getHolidayName } from '@/lib/utils';
import { AttendanceRecord } from '@/types';

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch attendance data on component mount and when date changes
  useEffect(() => {
    if (user) {
      fetchAttendanceData();
    }
  }, [user]);

  // Force refresh function to clear cache
  const forceRefresh = async () => {
    setAttendanceRecords([]); // Clear current data
    await fetchAttendanceData(); // Refetch
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAttendance();
      const attendanceData = (response as any)?.attendanceRecords || [];
      setAttendanceRecords(Array.isArray(attendanceData) ? attendanceData : []);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getAttendanceForDate = (day: number) => {
    const targetDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceRecords.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === targetDate;
    });
  };

  const isDayHoliday = (day: number) => {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return isHoliday(dayDate);
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

  // Calculate attendance breakdown
  const currentMonthRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === currentDate.getMonth() && 
           recordDate.getFullYear() === currentDate.getFullYear();
  });

  // Calculate holidays for current month
  const holidayCount = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return isHoliday(dayDate);
  }).filter(Boolean).length;

  const breakdown = {
    present: currentMonthRecords.filter(r => r.status === 'PRESENT').length,
    absent: currentMonthRecords.filter(r => r.status === 'ABSENT').length,
    late: currentMonthRecords.filter(r => r.status === 'LATE').length,
    halfDay: currentMonthRecords.filter(r => r.status === 'HALF_DAY').length,
    leave: currentMonthRecords.filter(r => r.status === 'LEAVE').length,
    holidays: holidayCount
  };

  const handleDownloadAttendance = () => {
    const monthName = monthNames[currentDate.getMonth()];
    const year = currentDate.getFullYear();

    // Create CSV content
    const csvContent = [
      ['Monthly Attendance Report'],
      ['Employee', user?.name || 'Employee'],
      ['Month', `${monthName} ${year}`],
      [''],
      ['Date', 'Day', 'Status', 'Check In', 'Check Out', 'Working Hours'],
      ...Array.from({ length: daysInMonth }, (_, index) => {
        const day = index + 1;
        const dateString = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const attendance = attendanceRecords.find(record => record.date === dateString);
        const dayDate = new Date(year, currentDate.getMonth(), day);
        const isDayHoliday = isHoliday(dayDate);
        const dayName = dayNames[new Date(dateString).getDay()];

        if (isDayHoliday) {
          return [dateString, dayName, 'Holiday', '-', '-', '-'];
        } else if (attendance) {
          return [
            dateString,
            dayName,
            attendance.status,
            attendance.checkInTime || '-',
            attendance.checkOutTime || '-',
            attendance.workingHours ? `${attendance.workingHours} hours` : '-'
          ];
        } else {
          return [dateString, dayName, 'No Record', '-', '-', '-'];
        }
      }),
      [''],
      ['Summary'],
      ['Present Days', breakdown.present.toString()],
      ['Absent Days', breakdown.absent.toString()],
      ['Late Days', breakdown.late.toString()],
      ['Half Days', breakdown.halfDay.toString()],
      ['Leave Days', breakdown.leave.toString()],
      ['Holidays', breakdown.holidays.toString()],
      ['Total Working Days', (daysInMonth - breakdown.holidays).toString()]
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_${monthName}_${year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <Layout employeeName={user?.name || "Employee"}>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
              <p className="text-gray-600">View your attendance history and calendar</p>
            </div>
            <Button
              onClick={handleDownloadAttendance}
              className="bg-green-600 hover:bg-green-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Monthly Attendance
            </Button>
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
                  <button
                    onClick={forceRefresh}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors bg-blue-50 text-blue-600"
                    title="Force refresh attendance data"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl font-bold text-yellow-900">{breakdown.late}</div>
                  <div className="text-sm text-yellow-700">Late</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-2xl font-bold text-amber-900">{breakdown.halfDay}</div>
                  <div className="text-sm text-amber-700">Half Day</div>
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
        )}
      </Layout>
    </ProtectedRoute>
  );
}
