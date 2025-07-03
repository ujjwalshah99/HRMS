'use client';

import React, { useState } from 'react';
import { MDLayout } from '@/components/layout/MDLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function MDReports() {
  const { user } = useAuth();
  const [selectedReportType, setSelectedReportType] = useState<'attendance' | 'mpr'>('mpr');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const router = useRouter();

  const employees = [
    { id: 'all', name: 'All Employees', employeeId: '' },
    { id: '1', name: 'John Doe', employeeId: 'EMP001' },
    { id: '2', name: 'Jane Smith', employeeId: 'EMP002' },
    { id: '3', name: 'Mike Johnson', employeeId: 'EMP003' },
    { id: '4', name: 'Sarah Wilson', employeeId: 'EMP004' },
    { id: '5', name: 'David Brown', employeeId: 'EMP005' }
  ];

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
    const selectedEmp = employees.find(emp => emp.id === selectedEmployee);
    const empName = selectedEmp ? selectedEmp.name : 'All Employees';
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Generate CSV data based on selected employee
    let csvData = [['Employee', 'Employee ID', 'Completed Tasks', 'Total Tasks', 'Completion Rate']];

    if (selectedEmployee === 'all') {
      // Generate data for all employees
      mprReport.employees.forEach(emp => {
        csvData.push([
          emp.name,
          employees.find(e => e.id === emp.id)?.employeeId || '',
          emp.completedTasks.toString(),
          emp.totalTasks.toString(),
          emp.completionRate.toString() + '%'
        ]);
      });
    } else {
      // Generate data for selected employee
      const empData = mprReport.employees.find(emp => emp.id === selectedEmployee);
      if (empData) {
        csvData.push([
          empData.name,
          employees.find(e => e.id === empData.id)?.employeeId || '',
          empData.completedTasks.toString(),
          empData.totalTasks.toString(),
          empData.completionRate.toString() + '%'
        ]);
      }
    }

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${empName}_${currentDate}_MPR_Report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter MPR data based on selected employee and month
  const filteredMPRData = {
    ...mprReport,
    employees: selectedEmployee === 'all'
      ? mprReport.employees
      : mprReport.employees.filter(emp => emp.id === selectedEmployee)
  };

  // Determine if we should show the table (all employees or specific employee found)
  const shouldShowEmployeeTable = selectedEmployee === 'all' || filteredMPRData.employees.length > 0;

  return (
    <ProtectedRoute allowedRoles={['MD']}>
      <MDLayout
        userName={user?.name || "Managing Director"}
        profilePicture={user?.profilePicture}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select
                    value={selectedReportType}
                    onChange={(e) => setSelectedReportType(e.target.value as 'attendance' | 'mpr')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
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
                      <option key={emp.id} value={emp.id}>
                        {emp.id === 'all' ? emp.name : `${emp.name} (${emp.employeeId})`}
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

          {/* Report Content */}
          {selectedReportType === 'mpr' && (
            <>
              {/* MPR Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          {selectedEmployee === 'all' ? 'Total Employees' : 'Total Tasks'}
                        </p>
                        <p className="text-3xl font-bold text-blue-900">
                          {selectedEmployee === 'all'
                            ? filteredMPRData.employees.length
                            : filteredMPRData.employees[0]?.totalTasks || 0
                          }
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {selectedEmployee === 'all' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          )}
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          {selectedEmployee === 'all' ? 'Avg. Completion' : 'Completed Tasks'}
                        </p>
                        <p className="text-3xl font-bold text-green-900">
                          {selectedEmployee === 'all'
                            ? Math.round(filteredMPRData.employees.reduce((sum, emp) => sum + emp.completionRate, 0) / filteredMPRData.employees.length) + '%'
                            : filteredMPRData.employees[0]?.completedTasks || 0
                          }
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
                        <p className="text-sm font-medium text-yellow-600">
                          {selectedEmployee === 'all' ? 'High Performers' : 'Completion Rate'}
                        </p>
                        <p className="text-3xl font-bold text-yellow-900">
                          {selectedEmployee === 'all'
                            ? filteredMPRData.employees.filter(emp => emp.completionRate >= 80).length
                            : (filteredMPRData.employees[0]?.completionRate || 0) + '%'
                          }
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {selectedEmployee === 'all' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          )}
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">
                          {selectedEmployee === 'all' ? 'Active Projects' : 'Status'}
                        </p>
                        <p className="text-3xl font-bold text-purple-900">
                          {selectedEmployee === 'all'
                            ? filteredMPRData.employees.filter(emp => emp.status === 'active').length
                            : filteredMPRData.employees[0]?.status || 'N/A'
                          }
                        </p>
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
                  <CardTitle>
                    {selectedEmployee === 'all'
                      ? 'Employee Work Progress Details - All Employees'
                      : `Employee Work Progress Details - ${filteredMPRData.employees[0]?.name || 'Employee'}`
                    }
                  </CardTitle>
                  {selectedEmployee !== 'all' && (
                    <p className="text-sm text-gray-600 mt-1">
                      Showing detailed progress for selected employee
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  {shouldShowEmployeeTable ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-medium text-gray-700">Employee</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-700">Employee ID</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-700">Completed Tasks</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-700">Total Tasks</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-700">Completion Rate</th>
                            <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMPRData.employees.map((employee) => {
                            const employeeInfo = employees.find(emp => emp.id === employee.id);
                            return (
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
                                      {selectedEmployee === 'all' && (
                                        <p className="text-xs text-gray-500">Click "View Details" for full MPR</p>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-gray-600">
                                  {employeeInfo?.employeeId || 'N/A'}
                                </td>
                                <td className="py-3 px-2 text-green-600 font-medium">{employee.completedTasks}</td>
                                <td className="py-3 px-2 text-gray-600">{employee.totalTasks}</td>
                                <td className="py-3 px-2">
                                  <span className={`font-medium ${getCompletionColor(employee.completionRate)}`}>
                                    {employee.completionRate}%
                                  </span>
                                </td>
                                <td className="py-3 px-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => router.push(`/md/reports/employee-mpr/${employee.id}`)}
                                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {selectedEmployee === 'all' && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <h4 className="text-sm font-medium text-blue-900">All Employees Overview</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                This table shows a summary of all employees' monthly progress. Click "View Details" for any employee to see their complete MPR with detailed task breakdown, achievements, and time tracking.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {selectedEmployee !== 'all' && filteredMPRData.employees.length === 1 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <h4 className="text-sm font-medium text-green-900">Individual Employee Report</h4>
                              <p className="text-sm text-green-700 mt-1">
                                Showing progress summary for {filteredMPRData.employees[0].name}. Click "View Details" to access the complete MPR with task-by-task breakdown, time tracking, and monthly achievements.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-500 text-lg font-medium">No employee data found</p>
                      <p className="text-gray-400 text-sm mt-1">Please select a different employee or check back later.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}


        </div>
      </MDLayout>
    </ProtectedRoute>
  );
}
