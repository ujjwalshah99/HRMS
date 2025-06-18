'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const dashboardStats = {
    totalEmployees: 45,
    presentToday: 38,
    absentToday: 7,
    lateArrivals: 3,
    earlyDepartures: 2
  };

  const recentEmployees = [
    { id: '1', name: 'John Doe', email: 'john.doe@updesco.com', status: 'present', checkIn: '09:00 AM' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@updesco.com', status: 'late', checkIn: '09:15 AM' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@updesco.com', status: 'absent', checkIn: '--' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@updesco.com', status: 'present', checkIn: '08:45 AM' },
    { id: '5', name: 'David Brown', email: 'david.brown@updesco.com', status: 'present', checkIn: '09:05 AM' },
    { id: '6', name: 'Emily Davis', email: 'emily.davis@updesco.com', status: 'early-departure', checkIn: '09:00 AM' },
    { id: '7', name: 'Robert Miller', email: 'robert.miller@updesco.com', status: 'late', checkIn: '09:20 AM' },
    { id: '8', name: 'Lisa Anderson', email: 'lisa.anderson@updesco.com', status: 'early-departure', checkIn: '08:55 AM' }
  ];

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

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const filteredEmployees = recentEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter based on status
    let matchesStatus = true;
    if (statusFilter === 'present') {
      matchesStatus = emp.status === 'present';
    } else if (statusFilter === 'absent') {
      matchesStatus = emp.status === 'absent';
    } else if (statusFilter === 'late') {
      matchesStatus = emp.status === 'late';
    } else if (statusFilter === 'early-departure') {
      matchesStatus = emp.status === 'early-departure';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute allowedRoles={['manager']}>
      <ManagerLayout 
        userName={user?.name || "Manager"} 
        profilePicture={user?.profilePicture}
        userRole="manager"
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600">Overview of employee attendance and activities</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Employees</p>
                    <p className="text-3xl font-bold text-blue-900">{dashboardStats.totalEmployees}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-green-50 border-green-200 cursor-pointer hover:shadow-md transition-shadow ${
                statusFilter === 'present' ? 'ring-2 ring-green-500 shadow-lg' : ''
              }`}
              onClick={() => handleStatusFilter('present')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Present Today</p>
                    <p className="text-3xl font-bold text-green-900">{dashboardStats.presentToday}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-red-50 border-red-200 cursor-pointer hover:shadow-md transition-shadow ${
                statusFilter === 'absent' ? 'ring-2 ring-red-500 shadow-lg' : ''
              }`}
              onClick={() => handleStatusFilter('absent')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Absent Today</p>
                    <p className="text-3xl font-bold text-red-900">{dashboardStats.absentToday}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-yellow-50 border-yellow-200 cursor-pointer hover:shadow-md transition-shadow ${
                statusFilter === 'late' ? 'ring-2 ring-yellow-500 shadow-lg' : ''
              }`}
              onClick={() => handleStatusFilter('late')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Late Arrivals</p>
                    <p className="text-3xl font-bold text-yellow-900">{dashboardStats.lateArrivals}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-orange-50 border-orange-200 cursor-pointer hover:shadow-md transition-shadow ${
                statusFilter === 'early-departure' ? 'ring-2 ring-orange-500 shadow-lg' : ''
              }`}
              onClick={() => handleStatusFilter('early-departure')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Early Departures</p>
                    <p className="text-3xl font-bold text-orange-900">{dashboardStats.earlyDepartures}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>
                    {statusFilter === 'all' ? 'All Employees' :
                     statusFilter === 'present' ? 'Present Today' :
                     statusFilter === 'absent' ? 'Absent Today' :
                     statusFilter === 'late' ? 'Late Arrivals' :
                     statusFilter === 'early-departure' ? 'Early Departures' : 'Employee Search'}
                  </span>
                  <span className="text-sm text-gray-500">({filteredEmployees.length})</span>
                </div>
                {statusFilter !== 'all' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusFilter('all')}
                    className="text-sm"
                  >
                    Show All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Employees</option>
                    <option value="present">Present Today</option>
                    <option value="absent">Absent Today</option>
                    <option value="late">Late Arrivals</option>
                    <option value="early-departure">Early Departures</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Check-in: {employee.checkIn}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status === 'early-departure' ? 'Early Departure' : employee.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
