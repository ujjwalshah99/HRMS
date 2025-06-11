'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function ManagerReports() {
  const { user } = useAuth();
  const [selectedReportType, setSelectedReportType] = useState<'attendance' | 'mpr'>('attendance');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const employees = [
    { id: 'all', name: 'All Employees' },
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' },
    { id: '4', name: 'Sarah Wilson' },
    { id: '5', name: 'David Brown' }
  ];

  // Mock attendance report data
  const attendanceReport = {
    summary: {
      totalEmployees: 5,
      averageAttendance: 92,
      totalWorkingDays: 22,
      totalPresentDays: 101,
      totalAbsentDays: 9
    },
    employees: [
      {
        id: '1',
        name: 'John Doe',
        presentDays: 21,
        absentDays: 1,
        lateDays: 2,
        attendancePercentage: 95
      },
      {
        id: '2',
        name: 'Jane Smith',
        presentDays: 20,
        absentDays: 2,
        lateDays: 1,
        attendancePercentage: 91
      },
      {
        id: '3',
        name: 'Mike Johnson',
        presentDays: 19,
        absentDays: 3,
        lateDays: 3,
        attendancePercentage: 86
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        presentDays: 22,
        absentDays: 0,
        lateDays: 0,
        attendancePercentage: 100
      },
      {
        id: '5',
        name: 'David Brown',
        presentDays: 21,
        absentDays: 1,
        lateDays: 1,
        attendancePercentage: 95
      }
    ]
  };

  // Mock MPR report data
  const mprReport = {
    summary: {
      totalReports: 5,
      approvedReports: 4,
      pendingReports: 1,
      averageTaskCompletion: 88
    },
    employees: [
      {
        id: '1',
        name: 'John Doe',
        completedTasks: 15,
        totalTasks: 18,
        completionRate: 83,
        status: 'approved'
      },
      {
        id: '2',
        name: 'Jane Smith',
        completedTasks: 12,
        totalTasks: 14,
        completionRate: 86,
        status: 'approved'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        completedTasks: 10,
        totalTasks: 12,
        completionRate: 83,
        status: 'pending'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        completedTasks: 16,
        totalTasks: 16,
        completionRate: 100,
        status: 'approved'
      },
      {
        id: '5',
        name: 'David Brown',
        completedTasks: 14,
        totalTasks: 15,
        completionRate: 93,
        status: 'approved'
      }
    ]
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600';
    if (percentage >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDownloadReport = () => {
    // Mock download functionality
    console.log(`Downloading ${selectedReportType} report for ${selectedEmployee} - ${selectedMonth}`);
    alert('Report download started! (This is a demo)');
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Monthly Reports</h1>
            <p className="text-gray-600">Generate and view attendance and work progress reports</p>
          </div>

          {/* Report Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Report Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value as 'attendance' | 'mpr')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="attendance">Attendance Report</option>
                    <option value="mpr">Work Done Report (MPR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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

          {/* Report Content */}
          {selectedReportType === 'attendance' ? (
            <>
              {/* Attendance Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Employees</p>
                        <p className="text-3xl font-bold text-blue-900">{attendanceReport.summary.totalEmployees}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Avg. Attendance</p>
                        <p className="text-3xl font-bold text-green-900">{attendanceReport.summary.averageAttendance}%</p>
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
                        <p className="text-sm font-medium text-yellow-600">Present Days</p>
                        <p className="text-3xl font-bold text-yellow-900">{attendanceReport.summary.totalPresentDays}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">Absent Days</p>
                        <p className="text-3xl font-bold text-red-900">{attendanceReport.summary.totalAbsentDays}</p>
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

              {/* Attendance Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Employee Attendance Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Employee</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Present Days</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Absent Days</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Late Days</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Attendance %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceReport.employees.map((employee) => (
                          <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2 font-medium text-gray-900">{employee.name}</td>
                            <td className="py-3 px-2 text-green-600">{employee.presentDays}</td>
                            <td className="py-3 px-2 text-red-600">{employee.absentDays}</td>
                            <td className="py-3 px-2 text-yellow-600">{employee.lateDays}</td>
                            <td className="py-3 px-2">
                              <span className={`font-medium ${getAttendanceColor(employee.attendancePercentage)}`}>
                                {employee.attendancePercentage}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* MPR Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Reports</p>
                        <p className="text-3xl font-bold text-blue-900">{mprReport.summary.totalReports}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Approved</p>
                        <p className="text-3xl font-bold text-green-900">{mprReport.summary.approvedReports}</p>
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
                        <p className="text-sm font-medium text-yellow-600">Pending</p>
                        <p className="text-3xl font-bold text-yellow-900">{mprReport.summary.pendingReports}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Avg. Completion</p>
                        <p className="text-3xl font-bold text-purple-900">{mprReport.summary.averageTaskCompletion}%</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* MPR Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Employee Work Progress Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Employee</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Completed Tasks</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Total Tasks</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Completion Rate</th>
                          <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mprReport.employees.map((employee) => (
                          <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2 font-medium text-gray-900">{employee.name}</td>
                            <td className="py-3 px-2 text-green-600">{employee.completedTasks}</td>
                            <td className="py-3 px-2 text-gray-600">{employee.totalTasks}</td>
                            <td className="py-3 px-2">
                              <span className={`font-medium ${getCompletionColor(employee.completionRate)}`}>
                                {employee.completionRate}%
                              </span>
                            </td>
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
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
