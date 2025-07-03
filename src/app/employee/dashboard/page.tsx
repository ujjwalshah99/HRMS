'use client';

import React, { useState, useEffect } from 'react';
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
import { apiClient } from '@/lib/api';
import { getTodayDateString, isHoliday } from '@/lib/utils';
import { AttendanceRecord, Todo, LeaveRequest, WorkingDaysStats, Meeting } from '@/types';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { getTodaysMeetings } = useMeetings();
  
  // State for dashboard data
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | undefined>(undefined);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<WorkingDaysStats>({
    totalWorkingDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    attendancePercentage: 0
  });
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data on component mount
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all dashboard data in parallel
      const [
        statsResponse,
        attendanceResponse,
        tasksResponse,
        leavesResponse,
        meetingsResponse
      ] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getAttendance(),
        apiClient.getTasks(),
        apiClient.getLeaves(),
        apiClient.getMeetings()
      ]);

      setStats(statsResponse as any);
      
      // Handle attendance response structure
      const attendanceData = (attendanceResponse as any)?.attendanceRecords || [];
      setAttendanceRecords(Array.isArray(attendanceData) ? attendanceData : []);
      
      setTodos(Array.isArray(tasksResponse) ? tasksResponse.filter((task: any) => task.status !== 'completed') : []);
      setLeaves(Array.isArray(leavesResponse) ? leavesResponse : []);
      setMeetings(Array.isArray(meetingsResponse) ? meetingsResponse : []);

      // Check if user has checked in today - improved date handling with timezone consistency
      const today = getTodayDateString();
      const attendanceArray = Array.isArray(attendanceData) ? attendanceData : [];
      
      const todayRecord = attendanceArray.find((record: AttendanceRecord) => {
        // Compare dates in the same format
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });
      
      setTodayAttendance(todayRecord);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handlers for user interactions
  const handleCheckIn = async (time: string) => {
    try {
      const response = await apiClient.markAttendance('check-in') as any;
      
      // Update the today's attendance with the response data immediately
      if (response.attendance) {
        setTodayAttendance(response.attendance as AttendanceRecord);
      }
      
      // Refresh stats after check-in
      const updatedStats = await apiClient.getDashboardStats();
      setStats(updatedStats as WorkingDaysStats);
      
      // Refresh attendance data to update the calendar, but don't overwrite today's attendance
      const [attendanceResponse] = await Promise.all([
        apiClient.getAttendance()
      ]);
      
      const attendanceData = (attendanceResponse as any)?.attendanceRecords || [];
      setAttendanceRecords(Array.isArray(attendanceData) ? attendanceData : []);
      
    } catch (error: any) {
      console.error('Error checking in:', error);
      const errorMessage = error.message || 'Failed to check in. Please try again.';
      
      // Handle specific error cases
      if (errorMessage.includes('Already checked in')) {
        alert('You have already checked in for today. If this is incorrect, please contact your manager.');
      } else if (errorMessage.includes('Network error')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleCheckOut = async (time: string) => {
    try {
      const response = await apiClient.markAttendance('check-out') as any;
      
      // Update the today's attendance with the response data immediately
      if (response.attendance) {
        setTodayAttendance(response.attendance as AttendanceRecord);
      }
      
      // Refresh stats after check-out
      const updatedStats = await apiClient.getDashboardStats();
      setStats(updatedStats as WorkingDaysStats);
      
      // Refresh attendance data to update the calendar, but don't overwrite today's attendance
      const [attendanceResponse] = await Promise.all([
        apiClient.getAttendance()
      ]);
      
      const attendanceData = (attendanceResponse as any)?.attendanceRecords || [];
      setAttendanceRecords(Array.isArray(attendanceData) ? attendanceData : []);
      
    } catch (error: any) {
      console.error('Error checking out:', error);
      const errorMessage = error.message || 'Failed to check out. Please try again.';
      
      // Handle specific error cases
      if (errorMessage.includes('Already checked out')) {
        alert('You have already checked out for today. If this is incorrect, please contact your manager.');
      } else if (errorMessage.includes('Must check in')) {
        alert('You must check in before checking out.');
      } else if (errorMessage.includes('Network error')) {
        alert('Network error. Please check your connection and try again.');
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleAddTodo = async (title: string, description: string) => {
    try {
      const newTask = await apiClient.createTask({
        title,
        description,
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      });
      setTodos(prev => [...prev, newTask as Todo]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const task = todos.find(t => t.id === id);
      if (task) {
        const updatedTask = await apiClient.updateTask(id, {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed'
        });
        setTodos(prev => prev.map(t => t.id === id ? updatedTask as Todo : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await apiClient.deleteTask(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Calculate calendar-based breakdown for current month
  const calculateMonthlyBreakdown = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    let breakdown = {
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      leave: 0,
      holidays: 0,
      total: daysInMonth
    };

    // Count holidays
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentYear, currentMonth, day);
      if (isHoliday(dayDate)) {
        breakdown.holidays++;
      }
    }

    // Count attendance records for current month
    const currentMonthRecords = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });

    currentMonthRecords.forEach(record => {
      switch (record.status) {
        case 'PRESENT':
          breakdown.present++;
          break;
        case 'ABSENT':
          breakdown.absent++;
          break;
        case 'LATE':
          breakdown.late++;
          break;
        case 'HALF_DAY':
          breakdown.halfDay++;
          break;
        case 'LEAVE':
          breakdown.leave++;
          break;
      }
    });

    return breakdown;
  };

  const monthlyBreakdown = calculateMonthlyBreakdown();

  // Get today's meetings - use getTodaysMeetings from context since meeting types differ
  const todaysMeetings = getTodaysMeetings();

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['EMPLOYEE']}>
        <Layout employeeName="Employee">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }



  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <Layout employeeName={user?.name || "Employee"}>
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
              onAddTodo={handleAddTodo}
              onDeleteTodo={handleDeleteTodo}
            />
          </div>

          {/* Today's Meetings */}
          <TodaysMeetings meetings={getTodaysMeetings()} />

          {/* Leave Status Table */}
          <LeaveStatusTable leaveRequests={leaves} />

          {/* Statistics */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Monthly Statistics</h2>
            <StatsBoxes stats={{
              ...stats,
              presentDays: monthlyBreakdown.present,
              absentDays: monthlyBreakdown.absent,
              lateDays: monthlyBreakdown.late,
              leaveDays: monthlyBreakdown.leave,
              totalWorkingDays: monthlyBreakdown.total - monthlyBreakdown.holidays,
              attendancePercentage: monthlyBreakdown.total - monthlyBreakdown.holidays > 0 
                ? Math.round((monthlyBreakdown.present / (monthlyBreakdown.total - monthlyBreakdown.holidays)) * 100)
                : 0
            }} />
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
