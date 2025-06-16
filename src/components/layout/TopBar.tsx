'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';

interface TopBarProps {
  employeeName: string;
  profilePicture?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ employeeName, profilePicture }) => {
  const { logout, user } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  // Mock employee data (in real app, this would come from user context or API)
  const employeeDetails = {
    name: user?.name || employeeName,
    email: user?.email || 'john.doe@updesco.com',
    phone: '+91 9876543210',
    position: 'Software Developer',
    employeeId: 'EMP001'
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
            <button
              onClick={handleProfileClick}
              className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden hover:bg-blue-200 transition-colors cursor-pointer"
            >
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
            </button>

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

      {/* Profile Details Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Employee Profile"
        size="md"
      >
        <div className="space-y-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={employeeDetails.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-bold text-xl">
                  {employeeDetails.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{employeeDetails.name}</h3>
              <p className="text-sm text-gray-600">{employeeDetails.position}</p>
            </div>
          </div>

          {/* Employee Details */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-900">{employeeDetails.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-900">{employeeDetails.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Employment Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Employee ID:</span>
                  <span className="text-sm font-medium text-gray-900">{employeeDetails.employeeId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Position:</span>
                  <span className="text-sm font-medium text-gray-900">{employeeDetails.position}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
