'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MDLayout } from '@/components/layout/MDLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface TaskDetail {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'completed' | 'in-progress' | 'pending';
  startDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  category: string;
  assignedBy?: string;
}

interface MonthlyTaskReport {
  month: string;
  year: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  totalHours: number;
  completedHours: number;
  tasks: TaskDetail[];
  achievements: string[];
  challenges: string[];
  goals: string[];
}

export default function EmployeeMPRDetails() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const employeeId = params.id as string;
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  // Mock employee data
  const employee = {
    id: employeeId,
    name: 'John Doe',
    position: 'Senior Developer',
    department: 'Engineering',
    email: 'john.doe@updesco.com',
    employeeId: 'EMP001'
  };

  // Mock data for the monthly task report
  const getMonthlyReport = (month: string): MonthlyTaskReport => {
    const monthDate = new Date(month + '-01');
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const year = monthDate.getFullYear();
    
    // Mock task data based on month
    const mockTasks: TaskDetail[] = [
      {
        id: '1',
        title: 'Implement Authentication System',
        description: 'Design and implement secure user authentication with JWT tokens and role-based access control.',
        priority: 'high',
        status: 'completed',
        startDate: `${year}-${monthDate.getMonth() + 1}-01`,
        completedDate: `${year}-${monthDate.getMonth() + 1}-15`,
        estimatedHours: 40,
        actualHours: 38,
        category: 'Backend Development',
        assignedBy: 'Sarah Johnson'
      },
      {
        id: '2',
        title: 'Optimize Database Queries',
        description: 'Review and optimize slow database queries to improve application performance.',
        priority: 'medium',
        status: 'completed',
        startDate: `${year}-${monthDate.getMonth() + 1}-05`,
        completedDate: `${year}-${monthDate.getMonth() + 1}-20`,
        estimatedHours: 20,
        actualHours: 25,
        category: 'Database',
        assignedBy: 'Sarah Johnson'
      },
      {
        id: '3',
        title: 'Create User Dashboard',
        description: 'Design and implement responsive user dashboard with real-time data visualization.',
        priority: 'high',
        status: 'completed',
        startDate: `${year}-${monthDate.getMonth() + 1}-10`,
        completedDate: `${year}-${monthDate.getMonth() + 1}-28`,
        estimatedHours: 35,
        actualHours: 32,
        category: 'Frontend Development',
        assignedBy: 'Sarah Johnson'
      },
      {
        id: '4',
        title: 'API Documentation',
        description: 'Create comprehensive API documentation using Swagger/OpenAPI specifications.',
        priority: 'medium',
        status: 'in-progress',
        startDate: `${year}-${monthDate.getMonth() + 1}-20`,
        estimatedHours: 15,
        actualHours: 8,
        category: 'Documentation',
        assignedBy: 'Sarah Johnson'
      },
      {
        id: '5',
        title: 'Unit Test Coverage',
        description: 'Increase unit test coverage to 90% for critical application modules.',
        priority: 'low',
        status: 'pending',
        startDate: `${year}-${monthDate.getMonth() + 1}-25`,
        estimatedHours: 25,
        category: 'Testing',
        assignedBy: 'Sarah Johnson'
      }
    ];

    const completedTasks = mockTasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = mockTasks.filter(t => t.status === 'in-progress').length;
    const pendingTasks = mockTasks.filter(t => t.status === 'pending').length;
    const completedHours = mockTasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.actualHours || 0), 0);
    const totalHours = mockTasks.reduce((sum, t) => sum + t.estimatedHours, 0);

    return {
      month: monthName,
      year,
      totalTasks: mockTasks.length,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      totalHours,
      completedHours,
      tasks: mockTasks,
      achievements: [
        'Successfully delivered authentication system ahead of schedule',
        'Improved database performance by 40%',
        'Mentored junior developer on React best practices',
        'Implemented responsive design for mobile compatibility'
      ],
      challenges: [
        'Database migration took longer than expected due to legacy data',
        'Integration with third-party API had compatibility issues',
        'Cross-browser testing revealed unexpected styling issues'
      ],
      goals: [
        'Complete API documentation by end of next month',
        'Achieve 90% unit test coverage',
        'Learn advanced TypeScript patterns',
        'Implement automated deployment pipeline'
      ]
    };
  };

  const report = getMonthlyReport(selectedMonth);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCompletionPercentage = () => {
    return Math.round((report.completedTasks / report.totalTasks) * 100);
  };

  const handleDownloadReport = () => {
    // Comprehensive CSV data with summary and task details
    const csvData = [
      ['Monthly Progress Report'],
      ['Employee:', employee.name],
      ['Employee ID:', employee.employeeId],
      ['Position:', employee.position],
      ['Department:', employee.department],
      ['Month:', report.month],
      [''],
      ['SUMMARY'],
      ['Total Tasks:', report.totalTasks.toString()],
      ['Completed Tasks:', report.completedTasks.toString()],
      ['In Progress Tasks:', report.inProgressTasks.toString()],
      ['Pending Tasks:', report.pendingTasks.toString()],
      ['Total Hours:', report.totalHours.toString()],
      ['Completed Hours:', report.completedHours.toString()],
      ['Completion Rate:', getCompletionPercentage().toString() + '%'],
      [''],
      ['TASK DETAILS'],
      ['Task Title', 'Description', 'Priority', 'Status', 'Category', 'Start Date', 'Completed Date', 'Estimated Hours', 'Actual Hours'],
      ...report.tasks.map(task => [
        task.title,
        task.description,
        task.priority,
        task.status,
        task.category,
        task.startDate,
        task.completedDate || 'N/A',
        task.estimatedHours.toString(),
        task.actualHours?.toString() || 'N/A'
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name}_${report.month.replace(' ', '_')}_MPR_Report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute allowedRoles={['managing-director']}>
      <MDLayout 
        userName={user?.name || "Managing Director"} 
        profilePicture={user?.profilePicture}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="mb-4"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Reports
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                Employee Monthly Progress Report
              </h1>
              <p className="text-gray-600">{employee.name} - {report.month}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Month
                </label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="pt-6">
                <Button
                  onClick={handleDownloadReport}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report
                </Button>
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">
                    {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
                  <p className="text-gray-600">{employee.position} • {employee.department}</p>
                  <p className="text-sm text-gray-500">{employee.email} • {employee.employeeId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                    <p className="text-3xl font-bold text-blue-900">{report.totalTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Completed</p>
                    <p className="text-3xl font-bold text-green-900">{report.completedTasks}</p>
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
                    <p className="text-sm font-medium text-yellow-600">In Progress</p>
                    <p className="text-3xl font-bold text-yellow-900">{report.inProgressTasks}</p>
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
                    <p className="text-sm font-medium text-purple-600">Completion Rate</p>
                    <p className="text-3xl font-bold text-purple-900">{getCompletionPercentage()}%</p>
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

          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {report.tasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Timeline</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Started:</span> {formatDate(task.startDate)}</p>
                          {task.completedDate && (
                            <p><span className="text-gray-500">Completed:</span> {formatDate(task.completedDate)}</p>
                          )}
                          <p><span className="text-gray-500">Category:</span> {task.category}</p>
                          {task.assignedBy && (
                            <p><span className="text-gray-500">Assigned by:</span> {task.assignedBy}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Time Tracking</h4>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-500">Estimated:</span> {task.estimatedHours} hours</p>
                          {task.actualHours && (
                            <p><span className="text-gray-500">Actual:</span> {task.actualHours} hours</p>
                          )}
                          {task.actualHours && (
                            <p className={`font-medium ${task.actualHours <= task.estimatedHours ? 'text-green-600' : 'text-red-600'}`}>
                              {task.actualHours <= task.estimatedHours ? 'On time' : `${task.actualHours - task.estimatedHours}h over`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hours Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Time Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Hours Completed</span>
                    <span className="text-sm text-gray-600">
                      {report.completedHours}/{report.totalHours} hours
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${Math.round((report.completedHours / report.totalHours) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((report.completedHours / report.totalHours) * 100)}% of estimated hours completed
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Estimated Total:</span>
                    <span className="font-medium">{report.totalHours} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-medium text-green-600">{report.completedHours} hours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-blue-600">{report.totalHours - report.completedHours} hours</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MDLayout>
    </ProtectedRoute>
  );
}
