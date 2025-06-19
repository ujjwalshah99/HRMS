'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { CheckInOutBox } from '@/components/employee/CheckInOutBox';
import { Calendar } from '@/components/employee/Calendar';
import { TodoList } from '@/components/employee/TodoList';
import { TodaysMeetings } from '@/components/employee/TodaysMeetings';
import { LeaveStatusTable } from '@/components/employee/LeaveStatusTable';
import { StatsBoxes } from '@/components/employee/StatsBoxes';
import { useMeetings } from '@/contexts/MeetingsContext';
import { AttendanceRecord, Todo, LeaveRequest, WorkingDaysStats } from '@/types';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { getTodaysMeetings } = useMeetings();
  // Mock data - In a real app, this would come from an API
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | undefined>(undefined);
  
  const [attendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      employeeId: 'emp1',
      date: '2024-01-15',
      checkInTime: '09:00',
      checkOutTime: '17:30',
      status: 'present',
      workingHours: 8.5
    },
    {
      id: '2',
      employeeId: 'emp1',
      date: '2024-01-16',
      checkInTime: '09:15',
      checkOutTime: '17:45',
      status: 'late',
      workingHours: 8.5
    },
    {
      id: '3',
      employeeId: 'emp1',
      date: '2024-01-17',
      status: 'absent'
    }
  ]);

  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      employeeId: 'emp1',
      title: 'Complete project documentation',
      description: 'Finish the technical documentation for the new feature',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-20',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      employeeId: 'emp1',
      title: 'Review code changes',
      priority: 'medium',
      status: 'pending',
      createdDate: '2024-01-16'
    },
    {
      id: '3',
      employeeId: 'emp1',
      title: 'Attend team meeting',
      priority: 'low',
      status: 'completed',
      createdDate: '2024-01-14'
    }
  ]);

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeId: 'emp1',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      type: 'vacation',
      reason: 'Family vacation',
      status: 'approved',
      appliedDate: '2024-01-10',
      approvedBy: 'manager1'
    },
    {
      id: '2',
      employeeId: 'emp1',
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      type: 'sick',
      reason: 'Medical appointment',
      status: 'pending',
      appliedDate: '2024-01-18'
    }
  ]);

  const [workingDaysStats] = useState<WorkingDaysStats>({
    presentDays: 18,
    leaveDays: 2,
    totalWorkingDays: 22,
    currentMonth: 'January 2024'
  });

  const handleCheckIn = (time: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newAttendance: AttendanceRecord = {
      id: Date.now().toString(),
      employeeId: 'emp1',
      date: today,
      checkInTime: time,
      status: 'present'
    };
    setTodayAttendance(newAttendance);
  };

  const handleCheckOut = (time: string) => {
    if (todayAttendance) {
      const updatedAttendance = {
        ...todayAttendance,
        checkOutTime: time
      };
      setTodayAttendance(updatedAttendance);
    }
  };

  const handleToggleTodo = (todoId: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId
          ? {
              ...todo,
              status: todo.status === 'completed' ? 'pending' : 'completed'
            }
          : todo
      )
    );
  };



  return (
    <ProtectedRoute allowedRoles={['employee']}>
      <Layout employeeName={user?.name || "Employee"} profilePicture={user?.profilePicture}>
        <div className="space-y-8">
        {/* Check-in/out Section */}
        <CheckInOutBox
          todayAttendance={todayAttendance}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />

        {/* Calendar and Todo List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Calendar attendanceRecords={attendanceRecords} />
          <TodoList
            todos={todos}
            onToggleTodo={handleToggleTodo}
          />
        </div>

        {/* Today's Meetings */}
        <TodaysMeetings meetings={getTodaysMeetings()} />

        {/* Leave Status Table */}
        <LeaveStatusTable leaveRequests={leaveRequests} />

        {/* Statistics */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Statistics</h2>
          <StatsBoxes stats={workingDaysStats} />
        </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
