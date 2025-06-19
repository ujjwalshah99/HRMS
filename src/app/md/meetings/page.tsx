'use client';

import React, { useState } from 'react';
import { MDLayout } from '@/components/layout/MDLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useMeetings, Meeting } from '@/contexts/MeetingsContext';

export default function MDMeetings() {
  const { user } = useAuth();
  const { meetings, addMeeting, deleteMeeting } = useMeetings();
  const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'assigned' | 'created'>('assigned');

  // Filter states
  const [filters, setFilters] = useState({
    meetingMode: 'all' as 'all' | 'online' | 'offline',
    dateFilter: 'all' as 'all' | 'today' | 'this-week' | 'this-month'
  });

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    meetingLink: '',
    location: '',
    attendees: [] as string[],
    duration: 60,
    mode: 'offline' as 'online' | 'offline'
  });

  // Mock employee data for attendees dropdown
  const availableAttendees = [
    { id: '1', name: 'John Doe', email: 'john.doe@updesco.com', employeeId: 'EMP001', role: 'employee' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@updesco.com', employeeId: 'EMP002', role: 'employee' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@updesco.com', employeeId: 'EMP003', role: 'employee' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@updesco.com', employeeId: 'EMP004', role: 'employee' },
    { id: '5', name: 'David Brown', email: 'david.brown@updesco.com', employeeId: 'EMP005', role: 'employee' },
    { id: '6', name: 'Emily Davis', email: 'emily.davis@updesco.com', employeeId: 'EMP006', role: 'employee' },
    { id: '7', name: 'Robert Miller', email: 'robert.miller@updesco.com', employeeId: 'EMP007', role: 'employee' },
    { id: '8', name: 'Lisa Chen', email: 'lisa.chen@updesco.com', employeeId: 'EMP008', role: 'employee' },
    { id: '9', name: 'Alex Brown', email: 'alex.brown@updesco.com', employeeId: 'EMP009', role: 'employee' },
    { id: 'manager', name: 'Sarah Johnson', email: 'sarah.manager@updesco.com', employeeId: 'MGR001', role: 'manager' }
  ];

  // Filter function
  const applyFilters = (meetingList: Meeting[]) => {
    return meetingList.filter(meeting => {
      // Meeting mode filter
      if (filters.meetingMode !== 'all') {
        if (meeting.mode !== filters.meetingMode) return false;
      }

      // Date filter
      if (filters.dateFilter !== 'all') {
        const meetingDate = new Date(meeting.date);
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        switch (filters.dateFilter) {
          case 'today':
            if (meetingDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'this-week':
            if (meetingDate < startOfWeek || meetingDate > endOfWeek) return false;
            break;
          case 'this-month':
            if (meetingDate < startOfMonth || meetingDate > endOfMonth) return false;
            break;
        }
      }

      return true;
    });
  };

  // Filter meetings by type and apply filters
  const assignedMeetings = applyFilters(meetings.filter(meeting => meeting.type === 'assigned'));
  const createdMeetings = applyFilters(meetings.filter(meeting => meeting.type === 'created'));

  // Get today's meetings
  const today = new Date().toISOString().split('T')[0];
  const todaysMeetings = meetings.filter(meeting => meeting.date === today && meeting.status === 'upcoming');

  // Get upcoming meetings (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    const today = new Date();
    return meetingDate >= today && meetingDate <= nextWeek && meeting.status === 'upcoming';
  });

  const handleCreateMeeting = () => {
    if (newMeeting.title.trim() && newMeeting.date && newMeeting.time && newMeeting.attendees.length > 0) {
      // Validate mode-specific requirements
      if (newMeeting.mode === 'online' && !newMeeting.meetingLink.trim()) {
        alert('Meeting link is required for online meetings');
        return;
      }
      if (newMeeting.mode === 'offline' && !newMeeting.location.trim()) {
        alert('Location is required for offline meetings');
        return;
      }

      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        time: newMeeting.time,
        duration: newMeeting.duration,
        type: 'created',
        createdBy: user?.name || 'Managing Director',
        location: newMeeting.location,
        meetingLink: newMeeting.meetingLink,
        attendees: newMeeting.attendees,
        mode: newMeeting.mode,
        status: 'upcoming',
        createdDate: new Date().toISOString().split('T')[0]
      };
      addMeeting(meeting);
      setNewMeeting({
        title: '',
        description: '',
        date: '',
        time: '',
        meetingLink: '',
        location: '',
        attendees: [],
        duration: 60,
        mode: 'offline'
      });
      setIsCreateMeetingModalOpen(false);
    }
  };

  const handleAttendeeToggle = (attendeeId: string) => {
    const attendee = availableAttendees.find(a => a.id === attendeeId);
    if (!attendee) return;

    const attendeeName = `${attendee.name} (${attendee.employeeId})`;

    if (newMeeting.attendees.includes(attendeeName)) {
      setNewMeeting({
        ...newMeeting,
        attendees: newMeeting.attendees.filter(a => a !== attendeeName)
      });
    } else {
      setNewMeeting({
        ...newMeeting,
        attendees: [...newMeeting.attendees, attendeeName]
      });
    }
  };

  const handleSelectAllAttendees = () => {
    const allAttendeeNames = availableAttendees.map(attendee =>
      `${attendee.name} (${attendee.employeeId})`
    );
    setNewMeeting({
      ...newMeeting,
      attendees: allAttendeeNames
    });
  };

  const handleDeselectAllAttendees = () => {
    setNewMeeting({
      ...newMeeting,
      attendees: []
    });
  };

  const getMeetingMode = (meeting: Meeting) => {
    return meeting.mode === 'online' ? 'Online' : 'Offline';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <ProtectedRoute allowedRoles={['managing-director']}>
      <MDLayout 
        userName={user?.name || "Managing Director"} 
        profilePicture={user?.profilePicture}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
              <p className="text-gray-600">Manage your meetings and appointments</p>
            </div>
            <Button
              onClick={() => setIsCreateMeetingModalOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Meeting
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Today's Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">{todaysMeetings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Upcoming (7 days)</p>
                    <p className="text-2xl font-bold text-gray-900">{upcomingMeetings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Created Meetings</p>
                    <p className="text-2xl font-bold text-gray-900">{createdMeetings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Meetings</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters({
                    meetingMode: 'all',
                    dateFilter: 'all'
                  })}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Mode
                  </label>
                  <select
                    value={filters.meetingMode}
                    onChange={(e) => setFilters({ ...filters, meetingMode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Modes</option>
                    <option value="online">Online Meetings</option>
                    <option value="offline">Offline Meetings</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateFilter}
                    onChange={(e) => setFilters({ ...filters, dateFilter: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Dates</option>
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                  </select>
                </div>
              </div>

              {/* Active filters display */}
              {(filters.meetingMode !== 'all' || filters.dateFilter !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Active filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.meetingMode !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Mode: {filters.meetingMode === 'online' ? 'Online' : 'Offline'}
                        <button
                          onClick={() => setFilters({ ...filters, meetingMode: 'all' })}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.dateFilter !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Date: {filters.dateFilter.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        <button
                          onClick={() => setFilters({ ...filters, dateFilter: 'all' })}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Meeting Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('assigned')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Assigned Meetings ({assignedMeetings.length})
              </button>
              <button
                onClick={() => setActiveTab('created')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'created'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Created Meetings ({createdMeetings.length})
              </button>
            </nav>
          </div>

          {/* Meeting Lists */}
          <div className="space-y-6">
            {activeTab === 'assigned' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Assigned Meetings ({assignedMeetings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {assignedMeetings.length > 0 ? (
                      assignedMeetings.map((meeting) => (
                        <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                  getMeetingMode(meeting) === 'Online'
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                }`}>
                                  {getMeetingMode(meeting)}
                                </span>
                              </div>
                              {meeting.description && (
                                <p className="text-gray-600 text-sm mb-3">{meeting.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6" />
                                  </svg>
                                  {formatDate(meeting.date)}
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {formatTime(meeting.time)} ({meeting.duration} min)
                                </div>
                                {meeting.location && (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {meeting.location}
                                  </div>
                                )}
                                {meeting.assignedBy && (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Assigned by {meeting.assignedBy}
                                  </div>
                                )}
                              </div>
                              {meeting.attendees && meeting.attendees.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-500 mb-1">Attendees:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {meeting.attendees.map((attendee, index) => (
                                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                        {attendee}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              {meeting.meetingLink && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(meeting.meetingLink, '_blank')}
                                >
                                  Join
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No assigned meetings</h3>
                        <p className="mt-1 text-sm text-gray-500">You don't have any meetings assigned to you.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'created' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Created Meetings ({createdMeetings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {createdMeetings.length > 0 ? (
                      createdMeetings.map((meeting) => (
                        <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                  getMeetingMode(meeting) === 'Online'
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                }`}>
                                  {getMeetingMode(meeting)}
                                </span>
                              </div>
                              {meeting.description && (
                                <p className="text-gray-600 text-sm mb-3">{meeting.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6" />
                                  </svg>
                                  {formatDate(meeting.date)}
                                </div>
                                <div className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {formatTime(meeting.time)} ({meeting.duration} min)
                                </div>
                                {meeting.location && (
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {meeting.location}
                                  </div>
                                )}
                              </div>
                              {meeting.attendees && meeting.attendees.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm text-gray-500 mb-1">Attendees:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {meeting.attendees.map((attendee, index) => (
                                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                        {attendee}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2 ml-4">
                              {meeting.meetingLink && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(meeting.meetingLink, '_blank')}
                                >
                                  Join
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  deleteMeeting(meeting.id);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11m-6 0V9a2 2 0 012-2h4a2 2 0 012 2v2m-6 0h6" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No created meetings</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven't created any meetings yet.</p>
                        <div className="mt-6">
                          <Button
                            onClick={() => setIsCreateMeetingModalOpen(true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Create Your First Meeting
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Create Meeting Modal */}
          <Modal
            isOpen={isCreateMeetingModalOpen}
            onClose={() => setIsCreateMeetingModalOpen(false)}
            title="Create New Meeting"
            size="lg"
          >
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meeting title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    value={newMeeting.duration}
                    onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meeting description"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newMeeting.time}
                    onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Meeting Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Mode *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="online"
                      checked={newMeeting.mode === 'online'}
                      onChange={(e) => setNewMeeting({ ...newMeeting, mode: e.target.value as 'online' | 'offline' })}
                      className="mr-2"
                    />
                    Online Meeting
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="offline"
                      checked={newMeeting.mode === 'offline'}
                      onChange={(e) => setNewMeeting({ ...newMeeting, mode: e.target.value as 'online' | 'offline' })}
                      className="mr-2"
                    />
                    Offline Meeting
                  </label>
                </div>
              </div>

              {/* Conditional Fields */}
              {newMeeting.mode === 'online' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link *
                  </label>
                  <input
                    type="url"
                    value={newMeeting.meetingLink}
                    onChange={(e) => setNewMeeting({ ...newMeeting, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>
              )}

              {newMeeting.mode === 'offline' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newMeeting.location}
                    onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter meeting location"
                  />
                </div>
              )}

              {/* Attendees */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Attendees * ({newMeeting.attendees.length} selected)
                  </label>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAllAttendees}
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDeselectAllAttendees}
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-3">
                  <div className="space-y-2">
                    {availableAttendees.map((attendee) => {
                      const attendeeName = `${attendee.name} (${attendee.employeeId})`;
                      return (
                        <label key={attendee.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newMeeting.attendees.includes(attendeeName)}
                            onChange={() => handleAttendeeToggle(attendee.id)}
                            className="mr-2"
                          />
                          <span className="text-sm">
                            {attendee.name} ({attendee.employeeId}) - {attendee.role}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected Attendees Display */}
              {newMeeting.attendees.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Attendees
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {newMeeting.attendees.map((attendee, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateMeetingModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateMeeting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Meeting
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </MDLayout>
    </ProtectedRoute>
  );
}
