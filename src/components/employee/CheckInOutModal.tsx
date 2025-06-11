'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface CheckInOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'check-in' | 'check-out';
  onSubmit: (time: string) => void;
}

export const CheckInOutModal: React.FC<CheckInOutModalProps> = ({
  isOpen,
  onClose,
  type,
  onSubmit
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5); // HH:MM format
      setCurrentTime(timeString);
      if (!useCustomTime) {
        setCustomTime(timeString);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [useCustomTime]);

  const handleSubmit = () => {
    const timeToSubmit = useCustomTime ? customTime : currentTime;
    if (timeToSubmit) {
      onSubmit(timeToSubmit);
      onClose();
      setUseCustomTime(false);
      setCustomTime('');
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const title = type === 'check-in' ? 'Check In' : 'Check Out';
  const actionText = type === 'check-in' ? 'Check In' : 'Check Out';
  const icon = type === 'check-in' ? (
    <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="text-center">
        {icon}
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {type === 'check-in' ? 'Good morning!' : 'End of workday?'}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {getCurrentDateTime()}
        </p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="text-sm text-gray-600 mb-2">Current Time</div>
          <div className="text-3xl font-bold text-gray-900 mb-4">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="customTime"
              checked={useCustomTime}
              onChange={(e) => setUseCustomTime(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="customTime" className="text-sm text-gray-600">
              Use custom time
            </label>
          </div>

          {useCustomTime && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Time
              </label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
          >
            {actionText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
