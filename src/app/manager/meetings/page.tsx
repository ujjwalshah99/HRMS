'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';

interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'assigned' | 'created' | 'reminder';
  assignedBy?: string;
  createdBy?: string;
  location?: string;
  meetingLink?: string;
  attendees?: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'completed' | 'cancelled';
  createdDate: string;
}

export default function ManagerMeetings() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateMeetingModalOpen, setIsCreateMeetingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'assigned' | 'created' | 'reminders'>('assigned');

  // Filter states
  const [filters, setFilters] = useState({
    priority: 'all' as 'all' | 'low' | 'medium' | 'high',
    meetingMode: 'all' as 'all' | 'online' | 'in-person',
    dateFilter: 'all' as 'all' | 'today' | 'this-week' | 'this-month'
  });

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Board Meeting - Q4 Review',
      description: 'Quarterly review meeting with board members',
      date: '2024-01-22',
      time: '14:00',
      duration: 120,
      type: 'assigned',
      assignedBy: 'Michael Director',
      location: 'Board Room',
      meetingLink: 'https://meet.google.com/board-q4-review',
      attendees: ['Sarah Johnson', 'Michael Director', 'John Smith'],
      priority: 'high',
      status: 'upcoming',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Team Performance Review',
      description: 'Monthly team performance and goal setting meeting',
      date: '2024-01-25',
      time: '10:00',
      duration: 90,
      type: 'created',
      createdBy: 'Sarah Johnson',
      location: 'Conference Room B',
      meetingLink: 'https://meet.google.com/team-performance',
      attendees: ['John Doe', 'Mike Wilson', 'Jane Smith', 'Alex Brown'],
      priority: 'high',
      status: 'upcoming',
      createdDate: '2024-01-18'
    },
    {
      id: '3',
      title: 'Client Presentation Prep',
      description: 'Prepare for upcoming client presentation',
      date: '2024-01-24',
      time: '15:30',
      duration: 60,
      type: 'reminder',
      location: 'Meeting Room A',
      priority: 'medium',
      status: 'upcoming',
      createdDate: '2024-01-20'
    },
    {
      id: '4',
      title: 'Weekly Department Sync',
      description: 'Weekly sync with all department heads',
      date: '2024-01-26',
      time: '09:00',
      duration: 45,
      type: 'created',
      createdBy: 'Sarah Johnson',
      location: 'Main Conference Room',
      meetingLink: 'https://meet.google.com/dept-sync',
      attendees: ['HR Head', 'Finance Head', 'IT Head', 'Operations Head'],
      priority: 'medium',
      status: 'upcoming',
      createdDate: '2024-01-19'
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    meetingLink: '',
    location: '',
    attendees: [] as string[],
    duration: 60,
    priority: 'medium' as 'low' | 'medium' | 'high'
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
    { id: 'md', name: 'Michael Director', email: 'md@updesco.com', employeeId: 'MD001', role: 'managing-director' }
  ];

  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    meetingLink: ''
  });

  // Filter function
  const applyFilters = (meetingList: Meeting[]) => {
    return meetingList.filter(meeting => {
      // Priority filter
      if (filters.priority !== 'all' && meeting.priority !== filters.priority) {
        return false;
      }

      // Meeting mode filter
      if (filters.meetingMode !== 'all') {
        const isOnline = !!meeting.meetingLink;
        if (filters.meetingMode === 'online' && !isOnline) return false;
        if (filters.meetingMode === 'in-person' && isOnline) return false;
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
  const reminderMeetings = applyFilters(meetings.filter(meeting => meeting.type === 'reminder'));

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
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        time: newMeeting.time,
        duration: newMeeting.duration,
        type: 'created',
        createdBy: user?.name || 'Manager',
        location: newMeeting.location,
        meetingLink: newMeeting.meetingLink,
        attendees: newMeeting.attendees,
        priority: newMeeting.priority,
        status: 'upcoming',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setMeetings([meeting, ...meetings]);
      setNewMeeting({
        title: '',
        description: '',
        date: '',
        time: '',
        meetingLink: '',
        location: '',
        attendees: [],
        duration: 60,
        priority: 'medium'
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

  const handleAddReminder = () => {
    if (newReminder.title.trim() && newReminder.date && newReminder.time) {
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newReminder.title,
        description: newReminder.description,
        date: newReminder.date,
        time: newReminder.time,
        duration: 60,
        type: 'reminder',
        meetingLink: newReminder.meetingLink,
        priority: 'medium',
        status: 'upcoming',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setMeetings([meeting, ...meetings]);
      setNewReminder({
        title: '',
        description: '',
        date: '',
        time: '',
        meetingLink: ''
      });
      setIsModalOpen(false);
    }
  };

  const getMeetingMode = (meeting: Meeting) => {
    return meeting.meetingLink ? 'Online' : 'In-Person';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
    <ProtectedRoute allowedRoles={['manager']}>
      <ManagerLayout 
        userName={user?.name || "Manager"} 
        profilePicture={user?.profilePicture}
        userRole={user?.role || 'manager'}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
              <p className="text-gray-600">Manage your meetings and appointments</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setIsCreateMeetingModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Meeting
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Reminder
              </Button>
            </div>
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
                    priority: 'all',
                    meetingMode: 'all',
                    dateFilter: 'all'
                  })}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

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
                    <option value="in-person">In-Person Meetings</option>
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
              {(filters.priority !== 'all' || filters.meetingMode !== 'all' || filters.dateFilter !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Active filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.priority !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Priority: {filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1)}
                        <button
                          onClick={() => setFilters({ ...filters, priority: 'all' })}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </span>
                    )}
                    {filters.meetingMode !== 'all' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Mode: {filters.meetingMode === 'online' ? 'Online' : 'In-Person'}
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
              <button
                onClick={() => setActiveTab('reminders')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reminders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meeting Reminders ({reminderMeetings.length})
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
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(meeting.priority)}`}>
                                  {meeting.priority.charAt(0).toUpperCase() + meeting.priority.slice(1)} Priority
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
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(meeting.priority)}`}>
                                  {meeting.priority.charAt(0).toUpperCase() + meeting.priority.slice(1)} Priority
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
                                  setMeetings(meetings.filter(m => m.id !== meeting.id));
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

            {activeTab === 'reminders' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Meeting Reminders ({reminderMeetings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {reminderMeetings.length > 0 ? (
                      reminderMeetings.map((meeting) => (
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
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(meeting.priority)}`}>
                                  {meeting.priority.charAt(0).toUpperCase() + meeting.priority.slice(1)} Priority
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
                                  {formatTime(meeting.time)}
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
                                  setMeetings(meetings.filter(m => m.id !== meeting.id));
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 010-15v5z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No meeting reminders</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven't set any meeting reminders yet.</p>
                        <div className="mt-6">
                          <Button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Add Your First Reminder
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
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter meeting description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={newMeeting.duration}
                  onChange={(e) => setNewMeeting({ ...newMeeting, duration: parseInt(e.target.value) || 60 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="60"
                  min="15"
                  max="480"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Conference Room A or leave empty for online"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link (Optional)
                </label>
                <input
                  type="url"
                  value={newMeeting.meetingLink}
                  onChange={(e) => setNewMeeting({ ...newMeeting, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendees *
                </label>
                <div className="space-y-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAttendeeToggle(e.target.value);
                        e.target.value = ''; // Reset dropdown
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select attendees...</option>
                    {availableAttendees.map(attendee => {
                      const attendeeName = `${attendee.name} (${attendee.employeeId})`;
                      const isSelected = newMeeting.attendees.includes(attendeeName);
                      return (
                        <option
                          key={attendee.id}
                          value={attendee.id}
                          disabled={isSelected}
                        >
                          {attendeeName} {isSelected ? '✓' : ''}
                        </option>
                      );
                    })}
                  </select>

                  {/* Selected attendees display */}
                  {newMeeting.attendees.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Selected attendees:</p>
                      <div className="flex flex-wrap gap-2">
                        {newMeeting.attendees.map((attendee, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {attendee}
                            <button
                              type="button"
                              onClick={() => {
                                setNewMeeting({
                                  ...newMeeting,
                                  attendees: newMeeting.attendees.filter((_, i) => i !== index)
                                });
                              }}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {newMeeting.attendees.length === 0 && (
                    <p className="text-sm text-red-600">Please select at least one attendee</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newMeeting.priority}
                  onChange={(e) => setNewMeeting({ ...newMeeting, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleCreateMeeting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!newMeeting.title.trim() || !newMeeting.date || !newMeeting.time || newMeeting.attendees.length === 0}
                >
                  Create Meeting
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateMeetingModalOpen(false);
                    setNewMeeting({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      meetingLink: '',
                      location: '',
                      attendees: [],
                      duration: 60,
                      priority: 'medium'
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>

          {/* Add Reminder Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Add Meeting Reminder"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meeting title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter meeting description or notes"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link (Optional)
                </label>
                <input
                  type="url"
                  value={newReminder.meetingLink}
                  onChange={(e) => setNewReminder({ ...newReminder, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleAddReminder}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newReminder.title.trim() || !newReminder.date || !newReminder.time}
                >
                  Add Reminder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewReminder({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      meetingLink: ''
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
