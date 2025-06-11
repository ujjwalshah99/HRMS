'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function MDAttendance() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock attendance data
  const attendanceData = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@updesco.com',
      department: 'Engineering',
      checkIn: '09:00 AM',
      checkOut: '05:30 PM',
      status: 'On Time',
      workingHours: '8h 30m'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@updesco.com',
      department: 'Engineering',
      checkIn: '09:15 AM',
      checkOut: '05:45 PM',
      status: 'Late',
      workingHours: '8h 30m'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@updesco.com',
      department: 'Marketing',
      checkIn: '--',
      checkOut: '--',
      status: 'Absent',
      workingHours: '--'
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@updesco.com',
      department: 'Engineering',
      checkIn: '08:45 AM',
      checkOut: '04:30 PM',
      status: 'Early Leave',
      workingHours: '7h 45m'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@updesco.com',
      department: 'HR',
      checkIn: '09:05 AM',
      checkOut: '05:35 PM',
      status: 'On Time',
      workingHours: '8h 30m'
    }
  ];

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Finance'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Early Leave':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredData = attendanceData.filter(emp => 
    selectedDepartment === 'all' || emp.department === selectedDepartment
  );

  const handleDownloadReport = () => {
    console.log(`Downloading attendance report for ${selectedDate}`);
    alert('Report download started! (This is a demo - MD has read-only access)');
  };

  return (
    <ProtectedRoute allowedRoles={['managing-director']}>
      <ManagerLayout 
        userName={user?.name || "Managing Director"} 
        profilePicture={user?.profilePicture}
        userRole="managing-director"
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daily Attendance Overview</h1>
            <p className="text-gray-600">Executive view of employee attendance and working hours</p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>View Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleDownloadReport}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Attendance Records ({filteredData.length})</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-normal text-gray-500">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Read Only
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Employee</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Department</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Check-In</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Check-Out</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Working Hours</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-xs">
                                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-900">{employee.department}</td>
                        <td className="py-3 px-2 text-gray-900">{employee.checkIn}</td>
                        <td className="py-3 px-2 text-gray-900">{employee.checkOut}</td>
                        <td className="py-3 px-2 text-gray-900">{employee.workingHours}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">No attendance records found for the selected filters</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">On Time</p>
                    <p className="text-3xl font-bold text-green-900">
                      {filteredData.filter(e => e.status === 'On Time').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Late Arrivals</p>
                    <p className="text-3xl font-bold text-yellow-900">
                      {filteredData.filter(e => e.status === 'Late').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Early Departures</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {filteredData.filter(e => e.status === 'Early Leave').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Absent</p>
                    <p className="text-3xl font-bold text-red-900">
                      {filteredData.filter(e => e.status === 'Absent').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
