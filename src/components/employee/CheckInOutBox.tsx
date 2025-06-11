'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckInOutModal } from './CheckInOutModal';
import { AttendanceRecord } from '@/types';

interface CheckInOutBoxProps {
  todayAttendance?: AttendanceRecord;
  onCheckIn: (time: string) => void;
  onCheckOut: (time: string) => void;
}

export const CheckInOutBox: React.FC<CheckInOutBoxProps> = ({
  todayAttendance,
  onCheckIn,
  onCheckOut
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatTime = (timeString?: string) => {
    if (!timeString) return '--:--';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWorkingHours = () => {
    if (!todayAttendance?.checkInTime || !todayAttendance?.checkOutTime) {
      return '--:--';
    }
    
    const checkIn = new Date(`2000-01-01T${todayAttendance.checkInTime}`);
    const checkOut = new Date(`2000-01-01T${todayAttendance.checkOutTime}`);
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffHours - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };

  const canCheckOut = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;
  const canCheckIn = !todayAttendance?.checkInTime;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Check-in Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-blue-600">Check-in Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatTime(todayAttendance?.checkInTime)}
              </div>
              <div className="text-sm text-gray-500">
                {todayAttendance?.checkInTime ? 'Checked in' : 'Not checked in'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-out Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-blue-600">Check-out Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {formatTime(todayAttendance?.checkOutTime)}
              </div>
              <div className="text-sm text-gray-500">
                {todayAttendance?.checkOutTime ? 'Checked out' : 'Not checked out'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-blue-600">Working Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {getWorkingHours()}
              </div>
              <div className="text-sm text-gray-500">
                Today's total
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Button */}
      <div className="mb-8">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {canCheckIn ? 'Ready to start your day?' : canCheckOut ? 'Ready to end your day?' : 'All done for today!'}
            </h3>
            {(canCheckIn || canCheckOut) && (
              <Button 
                onClick={() => setIsModalOpen(true)}
                size="lg"
                className="px-8"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {canCheckIn ? 'Check In' : 'Check Out'}
              </Button>
            )}
            {!canCheckIn && !canCheckOut && (
              <div className="text-green-600 font-medium">
                ✓ Attendance completed for today
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CheckInOutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={canCheckIn ? 'check-in' : 'check-out'}
        onSubmit={canCheckIn ? onCheckIn : onCheckOut}
      />
    </>
  );
};
