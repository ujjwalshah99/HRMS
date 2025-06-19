'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Meeting } from '@/contexts/MeetingsContext';

interface TodaysMeetingsProps {
  meetings: Meeting[];
}

export const TodaysMeetings: React.FC<TodaysMeetingsProps> = ({ meetings }) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
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

  if (meetings.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Meetings</h3>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📅</div>
          <p className="text-gray-500">No meetings scheduled for today</p>
          <p className="text-sm text-gray-400 mt-1">Enjoy your meeting-free day!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Today's Meetings</h3>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>
      
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
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
        ))}
      </div>
      
      {meetings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            {meetings.length} meeting{meetings.length !== 1 ? 's' : ''} scheduled for today
          </p>
        </div>
      )}
    </Card>
  );
};
