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
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  rejectionRemarks?: string;
  submittedTo?: string;
}

export default function EmployeeTasks() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'todo' | 'assigned'>('todo');

  // To-Do Tasks State
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isTodoEditModalOpen, setIsTodoEditModalOpen] = useState(false);
  const [isTodoApprovalModalOpen, setIsTodoApprovalModalOpen] = useState(false);
  const [selectedTodoTask, setSelectedTodoTask] = useState<Task | null>(null);
  const [editingTodoTask, setEditingTodoTask] = useState<Task | null>(null);

  // Assigned Tasks State
  const [isAssignedEditModalOpen, setIsAssignedEditModalOpen] = useState(false);
  const [selectedAssignedTask, setSelectedAssignedTask] = useState<Task | null>(null);
  const [editingAssignedTask, setEditingAssignedTask] = useState<Task | null>(null);

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
      createdDate: '2024-01-10',
      approvalStatus: 'pending'
    },
    {
      id: '4',
      title: 'Database optimization',
      description: 'Optimize database queries for better performance',
      priority: 'medium',
      status: 'completed',
      type: 'user-added',
      createdDate: '2024-01-12',
      approvalStatus: 'approved',
      approvedBy: 'Sarah Johnson',
      approvedDate: '2024-01-14'
    },
    {
      id: '5',
      title: 'API integration testing',
      description: 'Test all API endpoints for the new integration',
      priority: 'high',
      status: 'completed',
      type: 'user-added',
      createdDate: '2024-01-08',
      approvalStatus: 'approved',
      approvedBy: 'Mike Wilson',
      approvedDate: '2024-01-10'
    },
    {
      id: '6',
      title: 'Security audit implementation',
      description: 'Implement security recommendations from the audit',
      priority: 'medium',
      status: 'completed',
      type: 'assigned',
      assignedBy: 'Lisa Chen',
      createdDate: '2024-01-05',
      approvalStatus: 'approved',
      approvedBy: 'Lisa Chen',
      approvedDate: '2024-01-07'
    },
    {
      id: '7',
      title: 'Code refactoring task',
      description: 'Refactor legacy code to improve maintainability',
      priority: 'medium',
      status: 'completed',
      type: 'user-added',
      createdDate: '2024-01-13',
      approvalStatus: 'pending',
      submittedTo: 'Sarah Johnson'
    },
    {
      id: '8',
      title: 'Performance optimization',
      description: 'Optimize application performance for better user experience',
      priority: 'high',
      status: 'completed',
      type: 'user-added',
      createdDate: '2024-01-11',
      approvalStatus: 'rejected',
      approvedBy: 'Sarah Johnson',
      approvedDate: '2024-01-15',
      rejectionRemarks: 'The optimization approach needs to be more comprehensive. Please include database query optimization and implement proper caching mechanisms before resubmitting.'
    },
    {
      id: '9',
      title: 'Update legacy system',
      description: 'Modernize the legacy payment processing system',
      priority: 'high',
      status: 'in-progress',
      type: 'assigned',
      assignedBy: 'Mike Wilson',
      createdDate: '2024-01-09',
      approvalStatus: 'rejected',
      approvedBy: 'Mike Wilson',
      approvedDate: '2024-01-16',
      rejectionRemarks: 'The current implementation does not follow our security standards. Please review the security guidelines and implement proper encryption for payment data.'
    }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: ''
  });

  const [editTask, setEditTask] = useState({
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

  const handleAddTodoTask = () => {
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
      setIsTodoModalOpen(false);
    }
  };

  const handleToggleStatus = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);

    // For to-do tasks, when marking complete, show manager selection popup
    if (task && task.type === 'user-added' && task.status !== 'completed') {
      setSelectedTodoTask(task);
      setIsTodoApprovalModalOpen(true);
      return;
    }

    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            // Handle status changes based on current state
            status: task.approvalStatus === 'rejected'
              ? 'pending' // When restarting a rejected task, set to pending
              : task.status === 'completed' ? 'pending' : 'completed',
            // For assigned tasks, when marked complete, automatically set to pending approval
            ...(task.type === 'assigned' && task.status !== 'completed' && task.approvalStatus !== 'rejected' && { approvalStatus: 'pending' as const }),
            // Reset approval status when reopening a rejected task, but keep remarks for reference
            ...(task.approvalStatus === 'rejected' && { approvalStatus: undefined, approvedBy: undefined, approvedDate: undefined })
            // Note: rejectionRemarks are preserved when reopening
          }
        : task
    ));
  };

  const handleRequestTodoApproval = (task: Task) => {
    setSelectedTodoTask(task);
    setIsTodoApprovalModalOpen(true);
  };

  const submitTodoForApproval = () => {
    if (selectedTodoTask && selectedManager) {
      // Find the selected manager's name
      const selectedManagerData = managers.find(m => m.id === selectedManager);

      // Update the task with completion and approval status
      setTasks(tasks.map(task =>
        task.id === selectedTodoTask.id
          ? {
              ...task,
              status: 'completed',
              approvalStatus: 'pending' as const,
              submittedTo: selectedManagerData?.name || 'Unknown Manager'
            }
          : task
      ));

      // In a real app, this would send the task to the selected manager for approval
      console.log(`Task "${selectedTodoTask.title}" completed and submitted to ${selectedManagerData?.name} for approval`);
      setIsTodoApprovalModalOpen(false);
      setSelectedTodoTask(null);
      setSelectedManager('');
    }
  };

  const handleEditTodoTask = (task: Task) => {
    setEditingTodoTask(task);
    setEditTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || ''
    });
    setIsTodoEditModalOpen(true);
  };

  const handleUpdateTodoTask = () => {
    if (editingTodoTask && editTask.title.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingTodoTask.id
          ? {
              ...task,
              title: editTask.title,
              description: editTask.description,
              priority: editTask.priority,
              dueDate: editTask.dueDate
            }
          : task
      ));
      setIsTodoEditModalOpen(false);
      setEditingTodoTask(null);
      setEditTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
  };

  const handleEditAssignedTask = (task: Task) => {
    setEditingAssignedTask(task);
    setEditTask({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || ''
    });
    setIsAssignedEditModalOpen(true);
  };

  const handleUpdateAssignedTask = () => {
    if (editingAssignedTask && editTask.title.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingAssignedTask.id
          ? {
              ...task,
              title: editTask.title,
              description: editTask.description,
              priority: editTask.priority,
              dueDate: editTask.dueDate
            }
          : task
      ));
      setIsAssignedEditModalOpen(false);
      setEditingAssignedTask(null);
      setEditTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    }
  };

  const handleRevertTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            status: 'pending',
            approvalStatus: undefined,
            approvedBy: undefined,
            approvedDate: undefined,
            submittedTo: undefined
          }
        : task
    ));
  };

  // Filter tasks by type and status
  const pendingUserTasks = tasks.filter(task =>
    task.type === 'user-added' && task.status !== 'completed'
  );
  const completedNotApprovedUserTasks = tasks.filter(task =>
    task.type === 'user-added' && task.status === 'completed' && (!task.approvalStatus || task.approvalStatus === 'pending')
  );
  const completedApprovedUserTasks = tasks.filter(task =>
    task.type === 'user-added' && task.status === 'completed' && task.approvalStatus === 'approved'
  );
  const rejectedUserTasks = tasks.filter(task =>
    task.type === 'user-added' && task.approvalStatus === 'rejected'
  );
  const pendingAssignedTasks = tasks.filter(task =>
    task.type === 'assigned' && task.status !== 'completed' && task.approvalStatus !== 'rejected'
  );
  const completedAwaitingApprovalAssignedTasks = tasks.filter(task =>
    task.type === 'assigned' && task.status === 'completed' && task.approvalStatus === 'pending'
  );
  const completedApprovedAssignedTasks = tasks.filter(task =>
    task.type === 'assigned' && task.status === 'completed' && task.approvalStatus === 'approved'
  );
  const rejectedAssignedTasks = tasks.filter(task =>
    task.type === 'assigned' && task.approvalStatus === 'rejected'
  );

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
              onClick={() => setIsTodoModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Todo
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
                To-Do Tasks ({pendingUserTasks.length + completedNotApprovedUserTasks.length + completedApprovedUserTasks.length + rejectedUserTasks.length})
              </button>
              <button
                onClick={() => setActiveTab('assigned')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'assigned'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Assigned Tasks ({pendingAssignedTasks.length + completedAwaitingApprovalAssignedTasks.length + completedApprovedAssignedTasks.length + rejectedAssignedTasks.length})
              </button>
            </nav>
          </div>

          {/* Task Lists */}
          <div className="space-y-6">
            {activeTab === 'todo' ? (
              <>
                {/* Pending To-Do Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Pending Tasks ({pendingUserTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {pendingUserTasks.length > 0 ? (
                        pendingUserTasks.map((task) => (
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
                                {task.rejectionRemarks && (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                                    <div className="flex items-start space-x-2">
                                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                      </svg>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-red-800 mb-1">Manager Remarks:</p>
                                        <p className="text-xs text-red-700">{task.rejectionRemarks}</p>
                                      </div>
                                    </div>
                                  </div>
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
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditTodoTask(task)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
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
                          <p className="text-gray-500">No pending tasks found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Completed & Not Approved To-Do Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-yellow-700">
                      Completed & Awaiting Approval ({completedNotApprovedUserTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {completedNotApprovedUserTasks.length > 0 ? (
                        completedNotApprovedUserTasks.map((task) => (
                          <div key={task.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
                                    {task.approvalStatus === 'pending' ? 'Pending Approval' : 'Awaiting Approval'}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                    <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                                  </div>
                                </div>
                                {task.description && (
                                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                )}
                                {task.submittedTo && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                                    <div className="flex items-start space-x-2">
                                      <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-blue-800 mb-1">Submitted for approval to:</p>
                                        <p className="text-xs text-blue-700 font-semibold">{task.submittedTo}</p>
                                      </div>
                                    </div>
                                  </div>
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
                                  onClick={() => handleRevertTask(task.id)}
                                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                >
                                  Revert Task
                                </Button>
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-500">No tasks awaiting approval</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Completed & Approved To-Do Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-green-700">
                      Completed & Approved Tasks ({completedApprovedUserTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {completedApprovedUserTasks.length > 0 ? (
                        completedApprovedUserTasks.map((task) => (
                          <div key={task.id} className="border border-green-200 bg-green-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
                                    Approved
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
                                  {task.approvedBy && (
                                    <span>Approved by: {task.approvedBy}</span>
                                  )}
                                  {task.approvedDate && (
                                    <span>Approved: {new Date(task.approvedDate).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-500">No approved tasks found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Rejected To-Do Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-red-700">
                      Rejected Tasks ({rejectedUserTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {rejectedUserTasks.length > 0 ? (
                        rejectedUserTasks.map((task) => (
                          <div key={task.id} className="border border-red-200 bg-red-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200">
                                    Rejected
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                    <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                                  </div>
                                </div>
                                {task.description && (
                                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                )}
                                {task.rejectionRemarks && (
                                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-2">
                                    <div className="flex items-start space-x-2">
                                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                      </svg>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-red-800 mb-1">Rejection Remarks:</p>
                                        <p className="text-xs text-red-700">{task.rejectionRemarks}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Created: {new Date(task.createdDate).toLocaleDateString()}</span>
                                  {task.approvedBy && (
                                    <span>Rejected by: {task.approvedBy}</span>
                                  )}
                                  {task.approvedDate && (
                                    <span>Rejected: {new Date(task.approvedDate).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleStatus(task.id)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  Reopen Task
                                </Button>
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <p className="text-gray-500">No rejected tasks found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Pending Assigned Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Pending Assigned Tasks ({pendingAssignedTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {pendingAssignedTasks.length > 0 ? (
                        pendingAssignedTasks.map((task) => (
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
                                {task.rejectionRemarks && (
                                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                                    <div className="flex items-start space-x-2">
                                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                      </svg>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-red-800 mb-1">Manager Remarks:</p>
                                        <p className="text-xs text-red-700">{task.rejectionRemarks}</p>
                                      </div>
                                    </div>
                                  </div>
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
                          <p className="text-gray-500">No pending assigned tasks found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Completed & Awaiting Approval Assigned Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-yellow-700">
                      Completed & Awaiting Approval ({completedAwaitingApprovalAssignedTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {completedAwaitingApprovalAssignedTasks.length > 0 ? (
                        completedAwaitingApprovalAssignedTasks.map((task) => (
                          <div key={task.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border bg-yellow-100 text-yellow-800 border-yellow-200">
                                    Pending Approval
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
                                  onClick={() => handleRevertTask(task.id)}
                                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                                >
                                  Revert Task
                                </Button>
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-500">No tasks awaiting approval</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Completed & Approved Assigned Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-green-700">
                      Completed & Approved Tasks ({completedApprovedAssignedTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {completedApprovedAssignedTasks.length > 0 ? (
                        completedApprovedAssignedTasks.map((task) => (
                          <div key={task.id} className="border border-green-200 bg-green-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border bg-green-100 text-green-800 border-green-200">
                                    Approved
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
                                  {task.approvedBy && (
                                    <span>Approved by: {task.approvedBy}</span>
                                  )}
                                  {task.approvedDate && (
                                    <span>Approved: {new Date(task.approvedDate).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-gray-500">No approved assigned tasks found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Rejected Assigned Tasks */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-red-700">
                      Rejected Assigned Tasks ({rejectedAssignedTasks.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {rejectedAssignedTasks.length > 0 ? (
                        rejectedAssignedTasks.map((task) => (
                          <div key={task.id} className="border border-red-200 bg-red-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border bg-red-100 text-red-800 border-red-200">
                                    Rejected
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                    <span className="text-xs text-gray-500 capitalize">{task.priority}</span>
                                  </div>
                                </div>
                                {task.description && (
                                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                )}
                                {task.rejectionRemarks && (
                                  <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-2">
                                    <div className="flex items-start space-x-2">
                                      <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                      </svg>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-red-800 mb-1">Rejection Remarks:</p>
                                        <p className="text-xs text-red-700">{task.rejectionRemarks}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Assigned by: {task.assignedBy}</span>
                                  <span>Created: {new Date(task.createdDate).toLocaleDateString()}</span>
                                  {task.approvedBy && (
                                    <span>Rejected by: {task.approvedBy}</span>
                                  )}
                                  {task.approvedDate && (
                                    <span>Rejected: {new Date(task.approvedDate).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleStatus(task.id)}
                                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                                >
                                  Restart Task
                                </Button>
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <p className="text-gray-500">No rejected assigned tasks found</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Add Todo Task Modal */}
          <Modal
            isOpen={isTodoModalOpen}
            onClose={() => setIsTodoModalOpen(false)}
            title="Add New Todo Task"
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
                  onClick={handleAddTodoTask}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newTask.title.trim()}
                >
                  Add Todo Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTodoModalOpen(false);
                    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>

          {/* Todo Completion & Approval Request Modal */}
          <Modal
            isOpen={isTodoApprovalModalOpen}
            onClose={() => setIsTodoApprovalModalOpen(false)}
            title="Complete Task & Request Approval"
            size="md"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Complete and submit task for approval: <strong>{selectedTodoTask?.title}</strong>
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
                  onClick={submitTodoForApproval}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!selectedManager}
                >
                  Complete & Submit for Approval
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTodoApprovalModalOpen(false);
                    setSelectedTodoTask(null);
                    setSelectedManager('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>

          {/* Edit Todo Task Modal */}
          <Modal
            isOpen={isTodoEditModalOpen}
            onClose={() => setIsTodoEditModalOpen(false)}
            title="Edit Todo Task"
            size="md"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
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
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
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
                    value={editTask.priority}
                    onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as any })}
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
                    value={editTask.dueDate}
                    onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleUpdateTodoTask}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!editTask.title.trim()}
                >
                  Update Todo Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsTodoEditModalOpen(false);
                    setEditingTodoTask(null);
                    setEditTask({ title: '', description: '', priority: 'medium', dueDate: '' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>

          {/* Edit Assigned Task Modal */}
          <Modal
            isOpen={isAssignedEditModalOpen}
            onClose={() => setIsAssignedEditModalOpen(false)}
            title="Edit Assigned Task"
            size="md"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
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
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
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
                    value={editTask.priority}
                    onChange={(e) => setEditTask({ ...editTask, priority: e.target.value as any })}
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
                    value={editTask.dueDate}
                    onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleUpdateAssignedTask}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!editTask.title.trim()}
                >
                  Update Assigned Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAssignedEditModalOpen(false);
                    setEditingAssignedTask(null);
                    setEditTask({ title: '', description: '', priority: 'medium', dueDate: '' });
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
