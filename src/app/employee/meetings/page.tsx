'use client';

import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { useMeetings } from '@/contexts/MeetingsContext';

export default function EmployeeMeetings() {
  const { user } = useAuth();
  const { getTodaysMeetings, getAssignedMeetings } = useMeetings();



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

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const mins = duration % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getMeetingMode = (meetingLink?: string, location?: string) => {
    return meetingLink ? 'Online' : 'Offline';
  };

  const getModeIcon = (mode: string) => {
    return mode === 'Online' ? '🌐' : '📍';
  };

  // Get meetings from context
  const todaysMeetings = getTodaysMeetings();
  const assignedMeetings = getAssignedMeetings().filter(meeting => {
    const today = new Date().toISOString().split('T')[0];
    return meeting.date >= today; // Show future meetings including today
  });

  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <Layout employeeName={user?.name || "Employee"}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
            <p className="text-gray-600">View your scheduled meetings and appointments</p>
          </div>

          {/* Meeting Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Today's Meetings</p>
                    <p className="text-3xl font-bold text-blue-900">{todaysMeetings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Assigned Meetings</p>
                    <p className="text-3xl font-bold text-green-900">{assignedMeetings.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Today's Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">📅</span>
                  Today's Meetings ({todaysMeetings.length})
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {todaysMeetings.length > 0 ? (
                    todaysMeetings.map((meeting) => (
                      <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{meeting.title}</h4>
                            {meeting.description && (
                              <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getMeetingMode(meeting.meetingLink, meeting.location) === 'Online'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getModeIcon(getMeetingMode(meeting.meetingLink, meeting.location))} {getMeetingMode(meeting.meetingLink, meeting.location)}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p><span className="font-medium text-gray-700">Time:</span> {formatTime(meeting.time)}</p>
                              <p><span className="font-medium text-gray-700">Duration:</span> {formatDuration(meeting.duration)}</p>
                              <p><span className="font-medium text-gray-700">Mode:</span> {getMeetingMode(meeting.meetingLink, meeting.location)}</p>
                            </div>
                            <div>
                              {meeting.assignedBy && (
                                <p><span className="font-medium text-gray-700">Manager:</span> {meeting.assignedBy}</p>
                              )}
                              {meeting.createdBy && (
                                <p><span className="font-medium text-gray-700">Manager:</span> {meeting.createdBy}</p>
                              )}
                            </div>
                          </div>

                          {meeting.location && getMeetingMode(meeting.meetingLink, meeting.location) === 'Offline' && (
                            <p><span className="font-medium text-gray-700">Location:</span> {meeting.location}</p>
                          )}

                          {meeting.meetingLink && getMeetingMode(meeting.meetingLink, meeting.location) === 'Online' && (
                            <div className="pt-2 border-t border-gray-100">
                              <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                🔗 Join Meeting
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📅</div>
                      <p className="text-gray-500">No meetings scheduled for today</p>
                      <p className="text-sm text-gray-400 mt-1">Enjoy your meeting-free day!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Assigned Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <span className="mr-2">👥</span>
                  Assigned Meetings ({assignedMeetings.length})
                </CardTitle>
                <p className="text-sm text-gray-600">Future meetings scheduled by your manager</p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {assignedMeetings.length > 0 ? (
                    assignedMeetings.map((meeting) => (
                      <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{meeting.title}</h4>
                            {meeting.description && (
                              <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getMeetingMode(meeting.meetingLink, meeting.location) === 'Online'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {getModeIcon(getMeetingMode(meeting.meetingLink, meeting.location))} {getMeetingMode(meeting.meetingLink, meeting.location)}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p><span className="font-medium text-gray-700">Time:</span> {formatTime(meeting.time)}</p>
                              <p><span className="font-medium text-gray-700">Duration:</span> {formatDuration(meeting.duration)}</p>
                              <p><span className="font-medium text-gray-700">Mode:</span> {getMeetingMode(meeting.meetingLink, meeting.location)}</p>
                            </div>
                            <div>
                              {meeting.assignedBy && (
                                <p><span className="font-medium text-gray-700">Manager:</span> {meeting.assignedBy}</p>
                              )}
                              {meeting.createdBy && (
                                <p><span className="font-medium text-gray-700">Manager:</span> {meeting.createdBy}</p>
                              )}
                            </div>
                          </div>

                          {meeting.location && getMeetingMode(meeting.meetingLink, meeting.location) === 'Offline' && (
                            <p><span className="font-medium text-gray-700">Location:</span> {meeting.location}</p>
                          )}

                          {meeting.meetingLink && getMeetingMode(meeting.meetingLink, meeting.location) === 'Online' && (
                            <div className="pt-2 border-t border-gray-100">
                              <a
                                href={meeting.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                🔗 Join Meeting
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500">No assigned meetings found</p>
                      <p className="text-sm text-gray-400 mt-1">Your manager hasn't scheduled any meetings yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </Layout>
    </ProtectedRoute>
  );
}
