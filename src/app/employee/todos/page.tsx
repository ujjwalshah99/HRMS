'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Todo } from '@/types';

export default function TodosDashboard() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      employeeId: 'emp1',
      title: 'Complete project documentation',
      description: 'Finish the technical documentation for the new feature',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-20',
      createdDate: '2024-01-15'
    },
    {
      id: '2',
      employeeId: 'emp1',
      title: 'Review code changes',
      description: 'Review the pull request for the authentication module',
      priority: 'medium',
      status: 'pending',
      createdDate: '2024-01-16'
    },
    {
      id: '3',
      employeeId: 'emp1',
      title: 'Attend team meeting',
      description: 'Weekly team sync meeting',
      priority: 'low',
      status: 'completed',
      createdDate: '2024-01-14'
    },
    {
      id: '4',
      employeeId: 'emp1',
      title: 'Update user interface',
      description: 'Implement new design system components',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-01-25',
      createdDate: '2024-01-18'
    },
    {
      id: '5',
      employeeId: 'emp1',
      title: 'Database optimization',
      description: 'Optimize database queries for better performance',
      priority: 'medium',
      status: 'completed',
      createdDate: '2024-01-12'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

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

  const handleAddTodo = () => {
    if (newTodo.title.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        employeeId: 'emp1',
        title: newTodo.title,
        description: newTodo.description,
        priority: newTodo.priority,
        status: 'pending',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setTodos([todo, ...todos]);
      setNewTodo({ title: '', description: '', priority: 'medium' });
      setIsModalOpen(false);
    }
  };

  const handleToggleStatus = (todoId: string) => {
    setTodos(todos.map(todo =>
      todo.id === todoId
        ? { ...todo, status: todo.status === 'completed' ? 'pending' : 'completed' }
        : todo
    ));
  };

  const completedTodos = todos.filter(todo => todo.status === 'completed');
  const pendingTodos = todos.filter(todo => todo.status !== 'completed');

  return (
    <ProtectedRoute allowedRoles={['employee']}>
      <Layout employeeName={user?.name || "Employee"} profilePicture={user?.profilePicture}>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Todo Dashboard</h1>
            <p className="text-gray-600">Manage and track your tasks</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Todo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Completed Tasks</p>
                  <p className="text-3xl font-bold text-green-900">{completedTodos.length}</p>
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
                  <p className="text-sm font-medium text-yellow-600">To Be Completed</p>
                  <p className="text-3xl font-bold text-yellow-900">{pendingTodos.length}</p>
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

        {/* Pending Todos */}
        {pendingTodos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Pending Tasks ({pendingTodos.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingTodos.map(todo => (
                  <div key={todo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/employee/todos/${todo.id}`} className="block">
                          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                            {todo.title}
                          </h3>
                        </Link>
                        {todo.description && (
                          <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
                        )}
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(todo.status)}`}>
                            {todo.status}
                          </span>
                          <div className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(todo.priority)}`}></div>
                            <span className="text-xs text-gray-500 capitalize">{todo.priority} priority</span>
                          </div>
                          {todo.dueDate && (
                            <span className="text-xs text-gray-500">
                              Due: {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleStatus(todo.id)}
                        className="ml-4"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Completed Tasks ({completedTodos.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTodos.map(todo => (
                  <div key={todo.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/employee/todos/${todo.id}`} className="block">
                          <h3 className="font-semibold text-gray-600 line-through hover:text-blue-600 transition-colors cursor-pointer">
                            {todo.title}
                          </h3>
                        </Link>
                        {todo.description && (
                          <p className="text-sm text-gray-500 mt-1 line-through">{todo.description}</p>
                        )}
                        <div className="flex items-center space-x-3 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(todo.status)}`}>
                            {todo.status}
                          </span>
                          <div className="flex items-center space-x-1">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(todo.priority)}`}></div>
                            <span className="text-xs text-gray-400 capitalize">{todo.priority} priority</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleStatus(todo.id)}
                        className="ml-4 text-gray-500"
                      >
                        Mark Pending
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Todo Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Todo"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter todo title..."
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter description (optional)..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setNewTodo({ ...newTodo, priority })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      newTodo.priority === priority
                        ? priority === 'high'
                          ? 'border-red-500 bg-red-50'
                          : priority === 'medium'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`}></div>
                      <span className="text-sm font-medium capitalize">{priority}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                onClick={handleAddTodo}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!newTodo.title.trim()}
              >
                Add Todo
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setNewTodo({ title: '', description: '', priority: 'medium' });
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
