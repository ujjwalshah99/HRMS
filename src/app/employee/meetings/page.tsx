'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
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
  type: 'assigned' | 'personal';
  assignedBy?: string;
  location?: string;
  meetingLink?: string;
  attendees?: string[];
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'completed' | 'cancelled';
  createdDate: string;
}

export default function EmployeeMeetings() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'assigned' | 'personal'>('assigned');

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      title: 'Weekly Team Standup',
      description: 'Weekly team sync to discuss progress and blockers',
      date: '2024-01-20',
      time: '09:00',
      duration: 30,
      type: 'assigned',
      assignedBy: 'Sarah Johnson',
      location: 'Conference Room A',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      attendees: ['John Doe', 'Sarah Johnson', 'Mike Wilson'],
      priority: 'high',
      status: 'upcoming',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Project Review Meeting',
      description: 'Review project milestones and deliverables',
      date: '2024-01-22',
      time: '14:00',
      duration: 60,
      type: 'assigned',
      assignedBy: 'Lisa Chen',
      location: 'Conference Room B',
      attendees: ['John Doe', 'Lisa Chen', 'Alex Brown'],
      priority: 'medium',
      status: 'upcoming',
      createdDate: '2024-01-16'
    },
    {
      id: '3',
      title: 'Client Presentation',
      description: 'Present project demo to client stakeholders',
      date: '2024-01-25',
      time: '11:00',
      duration: 90,
      type: 'assigned',
      assignedBy: 'Sarah Johnson',
      meetingLink: 'https://zoom.us/j/123456789',
      attendees: ['John Doe', 'Sarah Johnson', 'Client Team'],
      priority: 'high',
      status: 'upcoming',
      createdDate: '2024-01-17'
    },
    {
      id: '4',
      title: 'Personal Learning Session',
      description: 'Study new React patterns and best practices',
      date: '2024-01-21',
      time: '16:00',
      duration: 60,
      type: 'personal',
      location: 'Personal Workspace',
      priority: 'medium',
      status: 'upcoming',
      createdDate: '2024-01-18'
    },
    {
      id: '5',
      title: 'Doctor Appointment',
      description: 'Annual health checkup',
      date: '2024-01-23',
      time: '10:30',
      duration: 45,
      type: 'personal',
      location: 'City Medical Center',
      priority: 'high',
      status: 'upcoming',
      createdDate: '2024-01-19'
    }
  ]);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    meetingLink: ''
  });

  const handleAddMeeting = () => {
    if (newMeeting.title.trim() && newMeeting.date && newMeeting.time) {
      const meeting: Meeting = {
        id: Date.now().toString(),
        title: newMeeting.title,
        description: newMeeting.description,
        date: newMeeting.date,
        time: newMeeting.time,
        duration: 60, // Default duration
        type: 'personal',
        meetingLink: newMeeting.meetingLink,
        priority: 'medium', // Default priority
        status: 'upcoming',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setMeetings([meeting, ...meetings]);
      setNewMeeting({
        title: '',
        description: '',
        date: '',
        time: '',
        meetingLink: ''
      });
      setIsModalOpen(false);
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMeetingMode = (meeting: Meeting) => {
    return meeting.meetingLink ? 'Online' : 'Offline';
  };

  // Filter meetings by type
  const assignedMeetings = meetings.filter(meeting => meeting.type === 'assigned');
  const personalMeetings = meetings.filter(meeting => meeting.type === 'personal');

  const upcomingMeetings = meetings.filter(meeting => meeting.status === 'upcoming').length;
  const todayMeetings = meetings.filter(meeting => {
    const today = new Date().toISOString().split('T')[0];
    return meeting.date === today && meeting.status === 'upcoming';
  }).length;

  return (
    <ProtectedRoute allowedRoles={['employee']}>
      <Layout employeeName={user?.name || "Employee"} profilePicture={user?.profilePicture}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
              <p className="text-gray-600">Manage your meetings and appointments</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Meeting Reminder
            </Button>
          </div>

          {/* Meeting Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Upcoming Meetings</p>
                    <p className="text-3xl font-bold text-blue-900">{upcomingMeetings}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Today's Meetings</p>
                    <p className="text-3xl font-bold text-green-900">{todayMeetings}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
                onClick={() => setActiveTab('personal')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'personal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Meeting Reminders ({personalMeetings.length})
              </button>
            </nav>
          </div>

          {/* Meeting Lists */}
          <div className="space-y-6">
            {activeTab === 'assigned' ? (
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
                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                }`}>
                                  {getMeetingMode(meeting)}
                                </span>
                              </div>
                              {meeting.description && (
                                <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><span className="font-medium text-gray-700">Date:</span> {formatDate(meeting.date)}</p>
                                  <p><span className="font-medium text-gray-700">Time:</span> {formatTime(meeting.time)}</p>
                                  <p><span className="font-medium text-gray-700">Mode:</span> {getMeetingMode(meeting)}</p>
                                </div>
                                <div>
                                  <p><span className="font-medium text-gray-700">Assigned by:</span> {meeting.assignedBy}</p>
                                  {meeting.meetingLink && (
                                    <p>
                                      <span className="font-medium text-gray-700">Link:</span>{' '}
                                      <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        Join Meeting
                                      </a>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No assigned meetings found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Meeting Reminders ({personalMeetings.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {personalMeetings.length > 0 ? (
                      personalMeetings.map((meeting) => (
                        <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                                  getMeetingMode(meeting) === 'Online'
                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                }`}>
                                  {getMeetingMode(meeting)}
                                </span>
                              </div>
                              {meeting.description && (
                                <p className="text-sm text-gray-600 mb-3">{meeting.description}</p>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p><span className="font-medium text-gray-700">Date:</span> {formatDate(meeting.date)}</p>
                                  <p><span className="font-medium text-gray-700">Time:</span> {formatTime(meeting.time)}</p>
                                  <p><span className="font-medium text-gray-700">Mode:</span> {getMeetingMode(meeting)}</p>
                                </div>
                                <div>
                                  {meeting.meetingLink && (
                                    <p>
                                      <span className="font-medium text-gray-700">Link:</span>{' '}
                                      <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        Join Meeting
                                      </a>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-gray-500">No personal meetings found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Add Meeting Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Add Meeting Reminder"
            size="lg"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meeting title..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newMeeting.description}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter description (optional)..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newMeeting.date}
                    onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={newMeeting.meetingLink}
                  onChange={(e) => setNewMeeting({ ...newMeeting, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter meeting link (optional)..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleAddMeeting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newMeeting.title.trim() || !newMeeting.date || !newMeeting.time}
                >
                  Add Meeting Reminder
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewMeeting({
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
      </Layout>
    </ProtectedRoute>
  );
}
