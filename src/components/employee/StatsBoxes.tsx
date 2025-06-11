'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { WorkingDaysStats } from '@/types';

interface StatsBoxesProps {
  stats: WorkingDaysStats;
}

export const StatsBoxes: React.FC<StatsBoxesProps> = ({ stats }) => {
  const attendancePercentage = stats.totalWorkingDays > 0 
    ? Math.round((stats.presentDays / stats.totalWorkingDays) * 100)
    : 0;

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const statsData = [
    {
      title: 'Present Days',
      value: stats.presentDays,
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-600'
    },
    {
      title: 'Leave Days',
      value: stats.leaveDays,
      icon: (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-600'
    },
    {
      title: 'Total Working Days',
      value: stats.totalWorkingDays,
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600'
    },
    {
      title: 'Attendance Rate',
      value: `${attendancePercentage}%`,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: attendancePercentage >= 90 ? 'bg-green-50' : attendancePercentage >= 75 ? 'bg-yellow-50' : 'bg-red-50',
      borderColor: attendancePercentage >= 90 ? 'border-green-200' : attendancePercentage >= 75 ? 'border-yellow-200' : 'border-red-200',
      textColor: getAttendanceColor(attendancePercentage)
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} ${stat.borderColor} border-2`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
                {stat.title === 'Attendance Rate' && (
                  <p className="text-xs text-gray-500 mt-1">
                    This month
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </div>
            
            {/* Progress bar for attendance rate */}
            {stat.title === 'Attendance Rate' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      attendancePercentage >= 90 ? 'bg-green-500' : 
                      attendancePercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
