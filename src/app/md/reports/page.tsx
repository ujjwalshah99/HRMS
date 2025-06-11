'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function MDReports() {
  const { user } = useAuth();
  const [selectedReportType, setSelectedReportType] = useState<'attendance' | 'mpr' | 'department'>('attendance');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'engineering', name: 'Engineering' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'hr', name: 'Human Resources' },
    { id: 'finance', name: 'Finance' }
  ];

  // Mock executive summary data
  const executiveSummary = {
    attendance: {
      totalEmployees: 45,
      averageAttendance: 92,
      totalWorkingDays: 22,
      totalPresentDays: 912,
      totalAbsentDays: 78,
      departmentBreakdown: [
        { department: 'Engineering', attendance: 94, employees: 20 },
        { department: 'Marketing', attendance: 89, employees: 8 },
        { department: 'HR', attendance: 96, employees: 5 },
        { department: 'Finance', attendance: 91, employees: 12 }
      ]
    },
    productivity: {
      totalProjects: 15,
      completedProjects: 12,
      ongoingProjects: 3,
      averageTaskCompletion: 88,
      departmentProductivity: [
        { department: 'Engineering', completion: 91, projects: 8 },
        { department: 'Marketing', completion: 85, projects: 4 },
        { department: 'HR', completion: 92, projects: 1 },
        { department: 'Finance', completion: 86, projects: 2 }
      ]
    },
    financial: {
      totalBudget: 2500000,
      utilizedBudget: 2100000,
      remainingBudget: 400000,
      departmentBudgets: [
        { department: 'Engineering', allocated: 1200000, utilized: 1050000 },
        { department: 'Marketing', allocated: 600000, utilized: 520000 },
        { department: 'HR', allocated: 300000, utilized: 280000 },
        { department: 'Finance', allocated: 400000, utilized: 250000 }
      ]
    }
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleDownloadReport = () => {
    console.log(`Downloading ${selectedReportType} report for ${selectedDepartment} - ${selectedMonth}`);
    alert('Executive report download started! (This is a demo)');
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
            <h1 className="text-2xl font-bold text-gray-900">Executive Reports</h1>
            <p className="text-gray-600">Comprehensive organizational insights and analytics</p>
          </div>

          {/* Report Configuration */}
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
                    onChange={(e) => setSelectedReportType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="attendance">Attendance Overview</option>
                    <option value="mpr">Productivity Analysis</option>
                    <option value="department">Department Summary</option>
                  </select>
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
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
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

          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Employees</p>
                    <p className="text-3xl font-bold text-blue-900">{executiveSummary.attendance.totalEmployees}</p>
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
                    <p className="text-3xl font-bold text-green-900">{executiveSummary.attendance.averageAttendance}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Productivity</p>
                    <p className="text-3xl font-bold text-purple-900">{executiveSummary.productivity.averageTaskCompletion}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Budget Utilization</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {Math.round((executiveSummary.financial.utilizedBudget / executiveSummary.financial.totalBudget) * 100)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Content Based on Selection */}
          {selectedReportType === 'attendance' && (
            <Card>
              <CardHeader>
                <CardTitle>Department Attendance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Department</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Employees</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Attendance Rate</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {executiveSummary.attendance.departmentBreakdown.map((dept, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-900">{dept.department}</td>
                          <td className="py-3 px-2 text-gray-600">{dept.employees}</td>
                          <td className="py-3 px-2">
                            <span className={`font-medium ${getAttendanceColor(dept.attendance)}`}>
                              {dept.attendance}%
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${dept.attendance}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedReportType === 'mpr' && (
            <Card>
              <CardHeader>
                <CardTitle>Department Productivity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Department</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Active Projects</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Completion Rate</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {executiveSummary.productivity.departmentProductivity.map((dept, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-900">{dept.department}</td>
                          <td className="py-3 px-2 text-gray-600">{dept.projects}</td>
                          <td className="py-3 px-2">
                            <span className={`font-medium ${getCompletionColor(dept.completion)}`}>
                              {dept.completion}%
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${dept.completion}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedReportType === 'department' && (
            <Card>
              <CardHeader>
                <CardTitle>Department Budget Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Department</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Allocated Budget</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Utilized Budget</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Utilization Rate</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {executiveSummary.financial.departmentBudgets.map((dept, index) => {
                        const utilizationRate = Math.round((dept.utilized / dept.allocated) * 100);
                        const remaining = dept.allocated - dept.utilized;
                        return (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-2 font-medium text-gray-900">{dept.department}</td>
                            <td className="py-3 px-2 text-gray-600">{formatCurrency(dept.allocated)}</td>
                            <td className="py-3 px-2 text-gray-600">{formatCurrency(dept.utilized)}</td>
                            <td className="py-3 px-2">
                              <span className={`font-medium ${utilizationRate > 90 ? 'text-red-600' : utilizationRate > 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                                {utilizationRate}%
                              </span>
                            </td>
                            <td className="py-3 px-2 text-green-600 font-medium">{formatCurrency(remaining)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Strong Performance</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• HR department leads with 96% attendance</li>
                    <li>• Engineering shows 91% task completion</li>
                    <li>• Overall productivity above industry average</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2">Areas for Improvement</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Marketing attendance needs attention (89%)</li>
                    <li>• 3 projects still in progress</li>
                    <li>• Budget utilization varies by department</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Strategic Recommendations</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Implement flexible work policies</li>
                    <li>• Cross-department collaboration initiatives</li>
                    <li>• Budget reallocation opportunities</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
