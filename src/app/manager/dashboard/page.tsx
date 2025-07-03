'use client';

import React, { useState, useEffect } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useMeetings } from '@/contexts/MeetingsContext';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { getTodaysMeetings } = useMeetings();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    lateArrivals: 0,
    earlyDepartures: 0
  });
  
  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);

  useEffect(() => {
    if (user && user.role === 'MANAGER') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use mock data for now since backend integration is in progress
      setDashboardStats({
        totalEmployees: 45,
        presentToday: 38,
        absentToday: 7,
        lateArrivals: 3,
        earlyDepartures: 2
      });
      
      // Mock data for employees
      setRecentEmployees([
        { id: '1', name: 'John Doe', email: 'john.doe@updesco.com', status: 'present', checkIn: '09:00 AM' },
        { id: '2', name: 'Jane Smith', email: 'jane.smith@updesco.com', status: 'late', checkIn: '09:15 AM' },
        { id: '3', name: 'Mike Johnson', email: 'mike.johnson@updesco.com', status: 'absent', checkIn: '--' },
        { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@updesco.com', status: 'present', checkIn: '08:45 AM' },
        { id: '5', name: 'David Brown', email: 'david.brown@updesco.com', status: 'present', checkIn: '09:05 AM' },
        { id: '6', name: 'Emily Davis', email: 'emily.davis@updesco.com', status: 'early-departure', checkIn: '09:00 AM' },
        { id: '7', name: 'Robert Miller', email: 'robert.miller@updesco.com', status: 'late', checkIn: '09:20 AM' },
        { id: '8', name: 'Lisa Anderson', email: 'lisa.anderson@updesco.com', status: 'early-departure', checkIn: '08:55 AM' }
      ]);
    } catch (error) {
      console.error('Error fetching manager dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get today's meetings
  const todaysMeetings = getTodaysMeetings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'early-departure':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string) => {
    if (timeString === '--') return timeString;
    return timeString;
  };

  const filteredEmployees = recentEmployees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={['MANAGER']}>
        <ManagerLayout userName="Manager" userRole="MANAGER">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </ManagerLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['MANAGER']}>
      <ManagerLayout 
        userName={user?.name || "Manager"} 
        userRole="MANAGER"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalEmployees}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold">👥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Present Today</p>
                    <p className="text-2xl font-bold text-green-600">{dashboardStats.presentToday}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Absent Today</p>
                    <p className="text-2xl font-bold text-red-600">{dashboardStats.absentToday}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold">✗</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Late Arrivals</p>
                    <p className="text-2xl font-bold text-yellow-600">{dashboardStats.lateArrivals}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">⏰</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Early Departures</p>
                    <p className="text-2xl font-bold text-orange-600">{dashboardStats.earlyDepartures}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 font-bold">🏃</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Employee List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Employee Activity</CardTitle>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                      <option value="early-departure">Early Departure</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredEmployees.map((employee) => (
                      <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {employee.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{employee.name}</p>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                            {employee.status.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">{formatTime(employee.checkIn)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/manager/employees">
                      <Button variant="outline">View All Employees</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Meetings */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Today's Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaysMeetings.length > 0 ? (
                      todaysMeetings.map((meeting) => (
                        <div key={meeting.id} className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                          <p className="text-sm text-gray-600">{meeting.time}</p>
                          <p className="text-sm text-blue-600">{meeting.attendees?.length || 0} participants</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No meetings scheduled for today</p>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <Link href="/manager/meetings">
                      <Button variant="outline" size="sm">View All Meetings</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Link href="/manager/employees" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        👥 Manage Employees
                      </Button>
                    </Link>
                    <Link href="/manager/attendance" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        📊 Attendance Reports
                      </Button>
                    </Link>
                    <Link href="/manager/leave-management" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        📝 Leave Management
                      </Button>
                    </Link>
                    <Link href="/manager/tasks" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        ✅ Task Management
                      </Button>
                    </Link>
                    <Link href="/manager/reports" className="block">
                      <Button variant="outline" className="w-full justify-start">
                        📈 Reports
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
