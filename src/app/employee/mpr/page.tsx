'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

import { useAuth } from '@/contexts/AuthContext';

interface MPRData {
  id: string;
  month: string;
  year: number;
  completedTasks: number;
  totalTasks: number;
  workingDays: number;
  attendanceDays: number;
  achievements: string[];
  challenges: string[];
  goals: string[];
  status: 'draft' | 'submitted' | 'approved';
  submittedDate?: string;
  approvedDate?: string;
}

export default function EmployeeMPR() {
  const { user } = useAuth();
  const router = useRouter();

  
  const [mprReports] = useState<MPRData[]>([
    {
      id: '1',
      month: 'December',
      year: 2023,
      completedTasks: 15,
      totalTasks: 18,
      workingDays: 22,
      attendanceDays: 21,
      achievements: [
        'Successfully implemented new authentication system',
        'Reduced page load time by 40%',
        'Mentored 2 junior developers'
      ],
      challenges: [
        'Database migration took longer than expected',
        'Integration with third-party API had compatibility issues'
      ],
      goals: [
        'Complete React migration project',
        'Improve code coverage to 90%',
        'Learn TypeScript advanced patterns'
      ],
      status: 'approved',
      submittedDate: '2024-01-05',
      approvedDate: '2024-01-08'
    },
    {
      id: '2',
      month: 'November',
      year: 2023,
      completedTasks: 12,
      totalTasks: 14,
      workingDays: 21,
      attendanceDays: 20,
      achievements: [
        'Delivered mobile app MVP',
        'Optimized database queries',
        'Conducted technical interviews'
      ],
      challenges: [
        'Mobile testing on different devices was time-consuming',
        'Cross-browser compatibility issues'
      ],
      goals: [
        'Start authentication system project',
        'Improve mobile app performance',
        'Learn advanced React patterns'
      ],
      status: 'approved',
      submittedDate: '2023-12-02',
      approvedDate: '2023-12-05'
    },
    {
      id: '3',
      month: 'October',
      year: 2023,
      completedTasks: 10,
      totalTasks: 12,
      workingDays: 23,
      attendanceDays: 22,
      achievements: [
        'Launched new dashboard feature',
        'Fixed critical security vulnerabilities',
        'Improved API response time by 30%'
      ],
      challenges: [
        'Legacy code refactoring was complex',
        'Coordinating with multiple teams'
      ],
      goals: [
        'Begin mobile app development',
        'Enhance dashboard analytics',
        'Implement automated testing'
      ],
      status: 'submitted',
      submittedDate: '2023-11-03'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const getAttendancePercentage = (attended: number, working: number) => {
    return Math.round((attended / working) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewDetails = (month: string, year: number) => {
    router.push(`/employee/mpr/${month.toLowerCase()}/${year}`);
  };

  const handleDownloadReport = (report: MPRData) => {
    // Mock task data for the month (this would come from API in real implementation)
    const mockTasks = [
      {
        id: '1',
        title: 'Implement Authentication System',
        description: 'Design and implement secure user authentication with JWT tokens and role-based access control.',
        priority: 'high',
        status: 'completed',
        startDate: `${report.year}-${report.month === 'December' ? '12' : report.month === 'November' ? '11' : '10'}-01`,
        completedDate: `${report.year}-${report.month === 'December' ? '12' : report.month === 'November' ? '11' : '10'}-15`,
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
        startDate: `${report.year}-${report.month === 'December' ? '12' : report.month === 'November' ? '11' : '10'}-05`,
        completedDate: `${report.year}-${report.month === 'December' ? '12' : report.month === 'November' ? '11' : '10'}-20`,
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
        startDate: `${report.year}-${report.month === 'December' ? '12' : report.month === 'November' ? '11' : '10'}-10`,
        completedDate: `${report.year}-${report.month === 'December' ? '12' : report.month === 'November' ? '11' : '10'}-28`,
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
        startDate: `${report.year}-${report.month === 'December' ? '12' : report.month === 'November' ? '11' : '10'}-20`,
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
        startDate: `${report.year}-${report.month === 'December' ? '12' : report.month === 'November' ? '11' : '10'}-25`,
        estimatedHours: 25,
        category: 'Testing',
        assignedBy: 'Sarah Johnson'
      }
    ];

    // Create CSV content with task details only
    const csvContent = [
      ['Task Details Report'],
      ['Month', `${report.month} ${report.year}`],
      ['Employee', 'John Doe'],
      [''],
      ['Task ID', 'Title', 'Description', 'Priority', 'Status', 'Category', 'Start Date', 'Completed Date', 'Estimated Hours', 'Actual Hours', 'Assigned By'],
      ...mockTasks.map(task => [
        task.id,
        task.title,
        task.description,
        task.priority,
        task.status,
        task.category,
        task.startDate,
        task.completedDate || 'Not completed',
        task.estimatedHours.toString(),
        task.actualHours ? task.actualHours.toString() : 'Not recorded',
        task.assignedBy || 'Not assigned'
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Tasks_${report.month}_${report.year}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ProtectedRoute allowedRoles={['employee']}>
      <Layout employeeName={user?.name || "Employee"} profilePicture={user?.profilePicture}>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Monthly Progress Reports</h1>
            <p className="text-gray-600">Track your monthly achievements and progress</p>
          </div>

          {/* MPR Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                    <p className="text-3xl font-bold text-blue-900">{mprReports.length}</p>
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
                    <p className="text-sm font-medium text-green-600">Completed Task</p>
                    <p className="text-3xl font-bold text-green-900">
                      {mprReports.filter(r => r.status === 'approved').length}
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
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-900">
                      {mprReports.filter(r => r.status === 'submitted').length}
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

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Avg. Completion</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {Math.round(mprReports.reduce((acc, r) => acc + getCompletionPercentage(r.completedTasks, r.totalTasks), 0) / mprReports.length)}%
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

          {/* MPR Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mprReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {report.month} {report.year}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(report.status)}`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                          {report.submittedDate && (
                            <span className="text-sm text-gray-500">
                              Submitted: {formatDate(report.submittedDate)}
                            </span>
                          )}
                          {report.approvedDate && (
                            <span className="text-sm text-gray-500">
                              Approved: {formatDate(report.approvedDate)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(report.month, report.year)}
                        >
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReport(report)}
                          className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download
                        </Button>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Task Completion</span>
                            <span className="text-sm text-gray-600">
                              {report.completedTasks}/{report.totalTasks} ({getCompletionPercentage(report.completedTasks, report.totalTasks)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${getCompletionPercentage(report.completedTasks, report.totalTasks)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Attendance</span>
                            <span className="text-sm text-gray-600">
                              {report.attendanceDays}/{report.workingDays} ({getAttendancePercentage(report.attendanceDays, report.workingDays)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${getAttendancePercentage(report.attendanceDays, report.workingDays)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Achievements</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {report.achievements.slice(0, 2).map((achievement, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {achievement}
                              </li>
                            ))}
                            {report.achievements.length > 2 && (
                              <li className="text-blue-600 text-xs">
                                +{report.achievements.length - 2} more achievements
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {mprReports.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">No monthly progress reports found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
