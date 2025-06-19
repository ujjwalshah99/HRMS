'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'assigned' | 'created';
  assignedBy?: string;
  createdBy?: string;
  location?: string;
  meetingLink?: string;
  attendees?: string[];
  mode: 'online' | 'offline';
  status: 'upcoming' | 'completed' | 'cancelled';
  createdDate: string;
}

interface MeetingsContextType {
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  addMeeting: (meeting: Meeting) => void;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  getTodaysMeetings: () => Meeting[];
  getAssignedMeetings: () => Meeting[];
  getCreatedMeetings: () => Meeting[];
}

const MeetingsContext = createContext<MeetingsContextType | undefined>(undefined);

export const useMeetings = () => {
  const context = useContext(MeetingsContext);
  if (context === undefined) {
    throw new Error('useMeetings must be used within a MeetingsProvider');
  }
  return context;
};

interface MeetingsProviderProps {
  children: ReactNode;
}

export const MeetingsProvider: React.FC<MeetingsProviderProps> = ({ children }) => {
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
      mode: 'online',
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
      mode: 'online',
      status: 'upcoming',
      createdDate: '2024-01-18'
    },
    {
      id: '3',
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
      mode: 'online',
      status: 'upcoming',
      createdDate: '2024-01-19'
    },
    {
      id: '4',
      title: 'Daily Standup',
      description: 'Daily team standup meeting',
      date: new Date().toISOString().split('T')[0], // Today's date
      time: '09:30',
      duration: 30,
      type: 'created',
      createdBy: 'Sarah Johnson',
      location: 'Conference Room A',
      attendees: ['John Doe', 'Mike Wilson', 'Jane Smith'],
      mode: 'offline',
      status: 'upcoming',
      createdDate: new Date().toISOString().split('T')[0]
    },
    {
      id: '5',
      title: 'Project Review',
      description: 'Review project progress and milestones',
      date: new Date().toISOString().split('T')[0], // Today's date
      time: '14:00',
      duration: 60,
      type: 'assigned',
      assignedBy: 'Michael Director',
      meetingLink: 'https://meet.google.com/project-review',
      attendees: ['Sarah Johnson', 'Michael Director', 'Alex Brown'],
      mode: 'online',
      status: 'upcoming',
      createdDate: new Date().toISOString().split('T')[0]
    }
  ]);

  const addMeeting = (meeting: Meeting) => {
    setMeetings(prev => [meeting, ...prev]);
  };

  const updateMeeting = (id: string, updates: Partial<Meeting>) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === id ? { ...meeting, ...updates } : meeting
    ));
  };

  const deleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== id));
  };

  const getTodaysMeetings = () => {
    const today = new Date().toISOString().split('T')[0];
    return meetings.filter(meeting => meeting.date === today && meeting.status === 'upcoming');
  };

  const getAssignedMeetings = () => {
    return meetings.filter(meeting => meeting.type === 'assigned');
  };

  const getCreatedMeetings = () => {
    return meetings.filter(meeting => meeting.type === 'created');
  };

  const value: MeetingsContextType = {
    meetings,
    setMeetings,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    getTodaysMeetings,
    getAssignedMeetings,
    getCreatedMeetings
  };

  return (
    <MeetingsContext.Provider value={value}>
      {children}
    </MeetingsContext.Provider>
  );
};
