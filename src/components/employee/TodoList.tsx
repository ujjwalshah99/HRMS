'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Todo } from '@/types';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (todoId: string) => void;
  onAddTodo?: (title: string, description: string) => void;
  onDeleteTodo?: (todoId: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ 
  todos, 
  onToggleTodo, 
  onAddTodo, 
  onDeleteTodo 
}) => {

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border border-red-200 shadow-sm';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 shadow-sm';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
    }
  };



  const pendingTodos = todos.filter(todo => todo.status !== 'completed');
  const completedTodos = todos.filter(todo => todo.status === 'completed');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>Todo List</span>
          </CardTitle>
          <Link href="/employee/tasks">
            <Button
              size="sm"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Todos
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>


        {/* Pending todos */}
        {pendingTodos.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending Tasks ({pendingTodos.length})
            </h4>
            <div className="space-y-3">
              {pendingTodos.map(todo => (
                <div
                  key={todo.id}
                  className="group flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-200 transition-all duration-200"
                >
                  <button
                    onClick={() => onToggleTodo(todo.id)}
                    className="flex-shrink-0 hover:scale-110 transition-transform"
                  >
                    {getStatusIcon(todo.status)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="text-xs text-gray-500 truncate">
                        {todo.description}
                      </p>
                    )}
                    {todo.dueDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        Due: {new Date(todo.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${getPriorityColor(todo.priority)}`}>
                      {getPriorityIcon(todo.priority)}
                      <span className="ml-1 capitalize">{todo.priority}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed todos */}
        {completedTodos.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Completed Tasks ({completedTodos.length})
            </h4>
            <div className="space-y-3">
              {completedTodos.map(todo => (
                <div
                  key={todo.id}
                  className="group flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-xl opacity-80 hover:opacity-100 transition-all duration-200"
                >
                  <button
                    onClick={() => onToggleTodo(todo.id)}
                    className="flex-shrink-0 hover:scale-110 transition-transform"
                  >
                    {getStatusIcon(todo.status)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-600 line-through truncate mb-1">
                      {todo.title}
                    </p>
                    {todo.description && (
                      <p className="text-xs text-gray-400 line-through truncate">
                        {todo.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full opacity-60 ${getPriorityColor(todo.priority)}`}>
                      {getPriorityIcon(todo.priority)}
                      <span className="ml-1 capitalize">{todo.priority}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {todos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No todos yet</h3>
            <p className="text-gray-500 mb-4">Use the "Edit Todos" button above to manage your tasks!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
