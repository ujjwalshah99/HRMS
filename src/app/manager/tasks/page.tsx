'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
  assignedBy: string;
  dueDate?: string;
  createdDate: string;
  type: 'assigned' | 'approval-request';
}

export default function ManagerTasks() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'assigned' | 'approval'>('assigned');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Create secure login system with JWT tokens',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'John Doe',
      assignedBy: 'Sarah Johnson',
      dueDate: '2024-01-25',
      createdDate: '2024-01-15',
      type: 'assigned'
    },
    {
      id: '2',
      title: 'Database optimization',
      description: 'Optimize database queries for better performance',
      priority: 'medium',
      status: 'completed',
      assignedTo: 'Jane Smith',
      assignedBy: 'Sarah Johnson',
      dueDate: '2024-01-20',
      createdDate: '2024-01-10',
      type: 'assigned'
    },
    {
      id: '3',
      title: 'Code review for payment module',
      description: 'Review and approve payment integration code',
      priority: 'high',
      status: 'pending',
      assignedTo: 'Mike Johnson',
      assignedBy: 'Sarah Johnson',
      dueDate: '2024-01-18',
      createdDate: '2024-01-12',
      type: 'approval-request'
    },
    {
      id: '4',
      title: 'Update documentation',
      description: 'Update API documentation with new endpoints',
      priority: 'low',
      status: 'overdue',
      assignedTo: 'David Brown',
      assignedBy: 'Sarah Johnson',
      dueDate: '2024-01-15',
      createdDate: '2024-01-08',
      type: 'assigned'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignedTo: '',
    dueDate: ''
  });

  const employees = [
    { id: '1', name: 'John Doe', email: 'john.doe@updesco.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@updesco.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@updesco.com' },
    { id: '4', name: 'David Brown', email: 'david.brown@updesco.com' },
    { id: '5', name: 'Sarah Wilson', email: 'sarah.wilson@updesco.com' }
  ];

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

  const handleAssignTask = () => {
    if (newTask.title.trim() && newTask.assignedTo) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: 'pending',
        assignedTo: newTask.assignedTo,
        assignedBy: user?.name || 'Manager',
        dueDate: newTask.dueDate,
        createdDate: new Date().toISOString().split('T')[0],
        type: 'assigned'
      };
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '' });
      setIsAssignModalOpen(false);
    }
  };

  const handleApproveTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: 'completed' as const }
        : task
    ));
  };

  const handleRejectTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: 'pending' as const }
        : task
    ));
  };

  const assignedTasks = tasks.filter(task => task.type === 'assigned');
  const approvalTasks = tasks.filter(task => task.type === 'approval-request');

  const filteredTasks = (taskList: Task[]) => {
    if (selectedStatus === 'all') return taskList;
    return taskList.filter(task => task.status === selectedStatus);
  };

  const taskStats = {
    total: assignedTasks.length,
    pending: assignedTasks.filter(t => t.status === 'pending').length,
    completed: assignedTasks.filter(t => t.status === 'completed').length,
    overdue: assignedTasks.filter(t => t.status === 'overdue').length
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks Management</h1>
              <p className="text-gray-600">Assign tasks and manage team workload</p>
            </div>
            <Button 
              onClick={() => setIsAssignModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Assign Task
            </Button>
          </div>

          {/* Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          {/* Task Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('assigned')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Assigned Tasks ({assignedTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('approval')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'approval'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Approval Requests ({approvalTasks.length})
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
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

          {/* Task Lists */}
          <Card>
            <CardContent className="p-6">
              {activeTab === 'assigned' ? (
                <div className="space-y-4">
                  {filteredTasks(assignedTasks).length > 0 ? (
                    filteredTasks(assignedTasks).map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                              <span>Assigned to: {task.assignedTo}</span>
                              <span>Created: {new Date(task.createdDate).toLocaleDateString()}</span>
                              {task.dueDate && (
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500">No assigned tasks found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {approvalTasks.length > 0 ? (
                    approvalTasks.map((task) => (
                      <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
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
                              <span>Submitted by: {task.assignedTo}</span>
                              <span>Created: {new Date(task.createdDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveTask(task.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectTask(task.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500">No approval requests found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assign Task Modal */}
          <Modal
            isOpen={isAssignModalOpen}
            onClose={() => setIsAssignModalOpen(false)}
            title="Assign New Task"
            size="md"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To *
                  </label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select employee...</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🔵 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleAssignTask}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newTask.title.trim() || !newTask.assignedTo}
                >
                  Assign Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAssignModalOpen(false);
                    setNewTask({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
