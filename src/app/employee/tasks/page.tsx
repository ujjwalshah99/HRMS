'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
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
  status: 'pending' | 'in-progress' | 'completed';
  type: 'user-added' | 'assigned';
  assignedBy?: string;
  dueDate?: string;
  createdDate: string;
}

export default function EmployeeTasks() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'todo' | 'assigned'>('todo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project documentation',
      description: 'Finish the technical documentation for the new feature',
      priority: 'high',
      status: 'in-progress',
      type: 'user-added',
      dueDate: '2024-01-20',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Review code changes',
      description: 'Review the pull request for the authentication module',
      priority: 'medium',
      status: 'pending',
      type: 'assigned',
      assignedBy: 'Sarah Johnson',
      dueDate: '2024-01-18',
      createdDate: '2024-01-16'
    },
    {
      id: '3',
      title: 'Update user interface',
      description: 'Implement new design system components',
      priority: 'high',
      status: 'completed',
      type: 'assigned',
      assignedBy: 'Sarah Johnson',
      createdDate: '2024-01-10'
    },
    {
      id: '4',
      title: 'Database optimization',
      description: 'Optimize database queries for better performance',
      priority: 'medium',
      status: 'completed',
      type: 'user-added',
      createdDate: '2024-01-12'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  const [managers] = useState([
    { id: '1', name: 'Sarah Johnson', email: 'sarah.johnson@updesco.com' },
    { id: '2', name: 'Mike Wilson', email: 'mike.wilson@updesco.com' },
    { id: '3', name: 'Lisa Chen', email: 'lisa.chen@updesco.com' }
  ]);

  const [selectedManager, setSelectedManager] = useState('');

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
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: 'pending',
        type: 'user-added',
        dueDate: newTask.dueDate,
        createdDate: new Date().toISOString().split('T')[0]
      };
      setTasks([task, ...tasks]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      setIsModalOpen(false);
    }
  };

  const handleToggleStatus = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ));
  };

  const handleRequestApproval = (task: Task) => {
    setSelectedTask(task);
    setIsApprovalModalOpen(true);
  };

  const submitForApproval = () => {
    if (selectedTask && selectedManager) {
      // In a real app, this would send the task to the selected manager for approval
      console.log(`Task "${selectedTask.title}" submitted to ${selectedManager} for approval`);
      setIsApprovalModalOpen(false);
      setSelectedTask(null);
      setSelectedManager('');
    }
  };

  const userAddedTasks = tasks.filter(task => task.type === 'user-added');
  const assignedTasks = tasks.filter(task => task.type === 'assigned');

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const todoTasks = tasks.filter(task => task.status !== 'completed').length;

  return (
    <ProtectedRoute allowedRoles={['employee']}>
      <Layout employeeName={user?.name || "Employee"} profilePicture={user?.profilePicture}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600">Manage your tasks and assignments</p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Task
            </Button>
          </div>

          {/* Task Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Completed Tasks</p>
                    <p className="text-3xl font-bold text-green-900">{completedTasks}</p>
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
                    <p className="text-sm font-medium text-yellow-600">To-Do Tasks</p>
                    <p className="text-3xl font-bold text-yellow-900">{todoTasks}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                onClick={() => setActiveTab('todo')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'todo'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                To-Do Tasks ({userAddedTasks.length})
              </button>
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
            </nav>
          </div>

          {/* Task Lists */}
          <Card>
            <CardContent className="p-6">
              {activeTab === 'todo' ? (
                <div className="space-y-4">
                  {userAddedTasks.length > 0 ? (
                    userAddedTasks.map((task) => (
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
                              <span>Created: {new Date(task.createdDate).toLocaleDateString()}</span>
                              {task.dueDate && (
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(task.id)}
                            >
                              {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                            </Button>
                            {task.status === 'completed' && (
                              <Button
                                size="sm"
                                onClick={() => handleRequestApproval(task)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Request Approval
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500">No to-do tasks found</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {assignedTasks.length > 0 ? (
                    assignedTasks.map((task) => (
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
                              <span>Assigned by: {task.assignedBy}</span>
                              <span>Created: {new Date(task.createdDate).toLocaleDateString()}</span>
                              {task.dueDate && (
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleStatus(task.id)}
                            >
                              {task.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
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
              )}
            </CardContent>
          </Card>

          {/* Add Task Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Add New Task"
            size="md"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
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
                  placeholder="Enter description (optional)..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleAddTask}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newTask.title.trim()}
                >
                  Add Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>

          {/* Approval Request Modal */}
          <Modal
            isOpen={isApprovalModalOpen}
            onClose={() => setIsApprovalModalOpen(false)}
            title="Request Task Approval"
            size="md"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Request approval for the completed task: <strong>{selectedTask?.title}</strong>
                </p>
                
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Manager *
                </label>
                <select
                  value={selectedManager}
                  onChange={(e) => setSelectedManager(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a manager...</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={submitForApproval}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!selectedManager}
                >
                  Submit for Approval
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsApprovalModalOpen(false);
                    setSelectedTask(null);
                    setSelectedManager('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
