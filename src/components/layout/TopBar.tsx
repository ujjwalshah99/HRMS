'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  employeeName: string;
  profilePicture?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ employeeName, profilePicture }) => {
  const { logout } = useAuth();

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Employee name */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome, {employeeName}
          </h1>
        </div>

        {/* Right side - Date, Profile, Logout */}
        <div className="flex items-center space-x-6">
          {/* Date and Day */}
          <div className="text-sm text-gray-600">
            <div className="font-medium">{getCurrentDate()}</div>
          </div>

          {/* Profile Picture */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt={employeeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-medium text-sm">
                  {employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>

            {/* Logout Button */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
