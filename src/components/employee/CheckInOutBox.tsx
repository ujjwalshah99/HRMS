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
  const [isProcessing, setIsProcessing] = useState(false);

  const formatTime = (dateTimeString?: string) => {
    if (!dateTimeString) return '--:--';
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWorkingHours = () => {
    // If working hours are already calculated and stored in the database, use that
    if (todayAttendance?.workingHours && todayAttendance.workingHours > 0) {
      const totalHours = todayAttendance.workingHours;
      const hours = Math.floor(totalHours);
      const minutes = Math.floor((totalHours - hours) * 60);
      
      // Handle very short durations (less than 1 minute)
      if (hours === 0 && minutes === 0 && totalHours > 0) {
        const seconds = Math.floor(((totalHours - hours) * 60 - minutes) * 60);
        return `${seconds}s`;
      }
      
      // Handle durations less than 1 hour
      if (hours === 0) {
        return `${minutes}m`;
      }
      
      return `${hours}h ${minutes}m`;
    }
    
    // Otherwise, calculate dynamically if both check-in and check-out exist
    if (!todayAttendance?.checkInTime || !todayAttendance?.checkOutTime) {
      return '--:--';
    }
    
    const checkIn = new Date(todayAttendance.checkInTime);
    const checkOut = new Date(todayAttendance.checkOutTime);
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    const hours = Math.floor(diffHours);
    const minutes = Math.floor((diffHours - hours) * 60);
    
    // Handle very short durations (less than 1 minute)
    if (hours === 0 && minutes === 0 && diffMs > 0) {
      const seconds = Math.floor(diffMs / 1000);
      return `${seconds}s`;
    }
    
    // Handle durations less than 1 hour
    if (hours === 0) {
      return `${minutes}m`;
    }
    
    return `${hours}h ${minutes}m`;
  };

  const canCheckOut = todayAttendance?.checkInTime && !todayAttendance?.checkOutTime;
  const canCheckIn = !todayAttendance?.checkInTime;

  const handleSubmit = async (time: string) => {
    setIsProcessing(true);
    setIsModalOpen(false);
    
    try {
      if (canCheckIn) {
        await onCheckIn(time);
      } else {
        await onCheckOut(time);
      }
    } catch (error) {
      console.error('Error in attendance operation:', error);
    } finally {
      setIsProcessing(false);
    }
  };

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
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {canCheckIn ? 'Check In' : 'Check Out'}
                  </>
                )}
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
        onSubmit={handleSubmit}
      />
    </>
  );
};
