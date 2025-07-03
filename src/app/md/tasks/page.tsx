'use client';

import React, { useState } from 'react';
import { MDLayout } from '@/components/layout/MDLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
  assignedBy: string;
  department: string;
  dueDate?: string;
  createdDate: string;
}

export default function MDTasks() {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Implement user authentication system',
      description: 'Create secure login system with JWT tokens and multi-factor authentication',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'John Doe',
      assignedBy: 'Sarah Johnson',
      department: 'Engineering',
      dueDate: '2024-01-25',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Database optimization project',
      description: 'Optimize database queries and implement caching for better performance',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Jane Smith',
      assignedBy: 'Sarah Johnson',
      department: 'Engineering',
      dueDate: '2024-01-20',
      createdDate: '2024-01-10'
    },
    {
      id: '3',
      title: 'Q1 Marketing campaign launch',
      description: 'Launch comprehensive marketing campaign for new product line',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Mike Johnson',
      assignedBy: 'Lisa Chen',
      department: 'Marketing',
      dueDate: '2024-02-01',
      createdDate: '2024-01-12'
    },
    {
      id: '4',
      title: 'Employee handbook update',
      description: 'Update company policies and procedures in employee handbook',
      priority: 'low',
      status: 'overdue',
      assignedTo: 'David Brown',
      assignedBy: 'HR Manager',
      department: 'HR',
      dueDate: '2024-01-15',
      createdDate: '2024-01-08'
    },
    {
      id: '5',
      title: 'Financial audit preparation',
      description: 'Prepare documentation and reports for annual financial audit',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'Sarah Wilson',
      assignedBy: 'Finance Director',
      department: 'Finance',
      dueDate: '2024-01-30',
      createdDate: '2024-01-18'
    },
    {
      id: '6',
      title: 'Mobile app UI redesign',
      description: 'Redesign mobile application user interface for better user experience',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'Alex Turner',
      assignedBy: 'Sarah Johnson',
      department: 'Engineering',
      dueDate: '2024-02-15',
      createdDate: '2024-01-20'
    }
  ]);

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Finance'];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-blue-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesDepartment = selectedDepartment === 'all' || task.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length
  };

  const departmentStats = departments.filter(d => d !== 'all').map(dept => ({
    department: dept,
    total: tasks.filter(t => t.department === dept).length,
    completed: tasks.filter(t => t.department === dept && t.status === 'completed').length,
    overdue: tasks.filter(t => t.department === dept && t.status === 'overdue').length
  }));

  return (
    <ProtectedRoute allowedRoles={['MD']}>
      <MDLayout
        userName={user?.name || "Managing Director"}
        profilePicture={user?.profilePicture}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks Overview</h1>
              <p className="text-gray-600">Executive view of organizational task management and progress</p>
            </div>
            <div className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Read Only Access
            </div>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                    <p className="text-3xl font-bold text-blue-900">{taskStats.total}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
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
                    <p className="text-3xl font-bold text-yellow-900">{taskStats.pending}</p>
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
                    <p className="text-sm font-medium text-purple-600">In Progress</p>
                    <p className="text-3xl font-bold text-purple-900">{taskStats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
                    <p className="text-3xl font-bold text-green-900">{taskStats.completed}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Overdue</p>
                    <p className="text-3xl font-bold text-red-900">{taskStats.overdue}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Department Task Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {departmentStats.map((dept) => (
                  <div key={dept.department} className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">{dept.department}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Tasks:</span>
                        <span className="font-medium">{dept.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completed:</span>
                        <span className="font-medium text-green-600">{dept.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overdue:</span>
                        <span className="font-medium text-red-600">{dept.overdue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Completion Rate:</span>
                        <span className="font-medium text-blue-600">
                          {dept.total > 0 ? Math.round((dept.completed / dept.total) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.filter(d => d !== 'all').map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          {/* Task List */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details ({filteredTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{task.title}</h3>
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                              <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                            </div>
                          </div>
                          {task.description && (
                            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Department: {task.department}</span>
                            <span>Assigned to: {task.assignedTo}</span>
                            <span>Assigned by: {task.assignedBy}</span>
                            <span>Created: {new Date(task.createdDate).toLocaleDateString()}</span>
                            {task.dueDate && (
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 px-3 py-1 bg-gray-100 rounded">
                          View Only
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-500">No tasks found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </MDLayout>
    </ProtectedRoute>
  );
}
