'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useMeetings } from '@/contexts/MeetingsContext';

interface TopBarProps {
  employeeName: string;
  profilePicture?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ employeeName, profilePicture }) => {
  const { logout, user } = useAuth();
  const { getTodaysMeetings } = useMeetings();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

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

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  // Mock employee data (in real app, this would come from user context or API)
  const employeeDetails = {
    name: user?.name || employeeName,
    email: user?.email || 'john.doe@updesco.com',
    phone: '+91 9876543210',
    position: 'Software Developer',
    employeeId: 'EMP001'
  };

  // Get today's meetings from context
  const todayMeetingsData = getTodaysMeetings();

  const todayMeetings = todayMeetingsData.map(meeting => ({
    id: meeting.id,
    type: 'meeting' as const,
    title: meeting.title,
    message: `${formatTime(meeting.time)} - ${meeting.mode === 'online' ? 'Online' : meeting.location || 'Location TBD'}`,
    time: formatTime(meeting.time),
    isRead: false
  }));

  const todayTasks = [
    {
      id: '3',
      type: 'task',
      title: 'Complete project documentation',
      message: 'High priority task due today',
      time: 'Due today',
      isRead: false,
      priority: 'high'
    },
    {
      id: '4',
      type: 'task',
      title: 'Review code changes',
      message: 'Review pull request for authentication module',
      time: 'Due today',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'task',
      title: 'Database optimization',
      message: 'Optimize database queries for better performance',
      time: 'Due today',
      isRead: false,
      priority: 'medium'
    }
  ];

  const notifications = [...todayMeetings, ...todayTasks];

  const unreadCount = notifications.filter(n => !n.isRead).length;

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

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors relative"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
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

      {/* Notifications Modal */}
      <Modal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        title="Today's Schedule"
        size="lg"
      >
        <div className="space-y-6">
          {/* Meetings Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
              </svg>
              Meetings ({todayMeetings.length})
            </h3>
            <div className="space-y-3">
              {todayMeetings.length > 0 ? (
                todayMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      meeting.isRead
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                          </svg>
                          <h4 className="text-sm font-semibold text-gray-900">{meeting.title}</h4>
                          {!meeting.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{meeting.message}</p>
                        <p className="text-xs text-blue-600 font-medium">{meeting.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No meetings today</p>
                </div>
              )}
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Tasks ({todayTasks.length})
            </h3>
            <div className="space-y-3">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      task.isRead
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          <h4 className="text-sm font-semibold text-gray-900">{task.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                          {!task.isRead && (
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{task.message}</p>
                        <p className="text-xs text-red-600 font-medium">{task.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <p className="text-gray-500 text-sm">No tasks due today</p>
                </div>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  // In real app, this would mark all notifications as read
                  setIsNotificationModalOpen(false);
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
