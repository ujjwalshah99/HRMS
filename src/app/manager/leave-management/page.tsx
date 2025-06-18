'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'personal' | 'emergency';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  rejectedBy?: string;
}

export default function ManagerLeaveManagement() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Initialize leave requests from localStorage or use default data
  const getInitialLeaveRequests = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('managerLeaveRequests');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        startDate: '2024-02-15',
        endDate: '2024-02-16',
        type: 'vacation',
        reason: 'Family vacation',
        status: 'pending',
        appliedDate: '2024-02-01'
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        startDate: '2024-02-05',
        endDate: '2024-02-05',
        type: 'sick',
        reason: 'Medical appointment',
        status: 'pending',
        appliedDate: '2024-01-18'
      },
      {
        id: '3',
        employeeId: 'EMP003',
        employeeName: 'Mike Johnson',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        type: 'personal',
        reason: 'Personal work',
        status: 'approved',
        appliedDate: '2024-01-10',
        approvedBy: 'Manager'
      },
      {
        id: '4',
        employeeId: 'EMP004',
        employeeName: 'Sarah Wilson',
        startDate: '2024-01-15',
        endDate: '2024-01-15',
        type: 'emergency',
        reason: 'Family emergency',
        status: 'rejected',
        appliedDate: '2024-01-12',
        rejectedBy: 'Manager'
      },
      {
        id: '5',
        employeeId: 'EMP005',
        employeeName: 'David Brown',
        startDate: '2024-02-10',
        endDate: '2024-02-12',
        type: 'vacation',
        reason: 'Weekend getaway',
        status: 'approved',
        appliedDate: '2024-01-25',
        approvedBy: 'Manager'
      },
      {
        id: '6',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        startDate: '2024-02-20',
        endDate: '2024-02-21',
        type: 'sick',
        reason: 'Flu symptoms',
        status: 'pending',
        appliedDate: '2024-02-18'
      }
    ];
  };

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(getInitialLeaveRequests);

  // Employee list for filter
  const employees = [
    { id: 'all', name: 'All Employees' },
    { id: 'EMP001', name: 'John Doe' },
    { id: 'EMP002', name: 'Jane Smith' },
    { id: 'EMP003', name: 'Mike Johnson' },
    { id: 'EMP004', name: 'Sarah Wilson' },
    { id: 'EMP005', name: 'David Brown' }
  ];

  const handleApproveLeave = (leaveId: string) => {
    setLeaveRequests(prevRequests => {
      const updatedRequests = prevRequests.map(request =>
        request.id === leaveId 
          ? { ...request, status: 'approved' as const, approvedBy: user?.name || 'Manager' }
          : request
      );
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('managerLeaveRequests', JSON.stringify(updatedRequests));
      }
      return updatedRequests;
    });
  };

  const handleRejectLeave = (leaveId: string) => {
    setLeaveRequests(prevRequests => {
      const updatedRequests = prevRequests.map(request =>
        request.id === leaveId 
          ? { ...request, status: 'rejected' as const, rejectedBy: user?.name || 'Manager' }
          : request
      );
      // Persist to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('managerLeaveRequests', JSON.stringify(updatedRequests));
      }
      return updatedRequests;
    });
  };

  // Calculate statistics
  const stats = {
    totalRequests: leaveRequests.length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
    pending: leaveRequests.filter(r => r.status === 'pending').length
  };

  // Filter leave requests
  const filteredRequests = leaveRequests.filter(request => {
    const matchesEmployee = selectedEmployee === 'all' || request.employeeId === selectedEmployee;
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesDate = !selectedDate || 
      request.startDate <= selectedDate && request.endDate >= selectedDate ||
      request.appliedDate === selectedDate;
    
    return matchesEmployee && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'sick':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'personal':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'emergency':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600">Manage employee leave requests and approvals</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Leave Requests</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.totalRequests}</p>
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
                    <p className="text-sm font-medium text-green-600">Approved</p>
                    <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
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
                    <p className="text-sm font-medium text-red-600">Rejected</p>
                    <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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
                        {emp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leave Requests Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Leave Requests ({filteredRequests.length})</CardTitle>
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Filter by status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Employee</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Leave Type</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Duration</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Days</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Reason</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Applied Date</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium text-gray-900">{request.employeeName}</p>
                            <p className="text-xs text-gray-500">{request.employeeId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getLeaveTypeColor(request.type)}`}>
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{formatDate(request.startDate)}</p>
                            {request.startDate !== request.endDate && (
                              <p className="text-xs text-gray-500">to {formatDate(request.endDate)}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-medium text-blue-600">
                            {calculateDays(request.startDate, request.endDate)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <p className="max-w-xs truncate" title={request.reason}>
                            {request.reason}
                          </p>
                        </td>
                        <td className="py-3 px-2">
                          {formatDate(request.appliedDate)}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {request.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveLeave(request.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectLeave(request.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">
                              {request.status === 'approved' ? `Approved by ${request.approvedBy}` :
                               request.status === 'rejected' ? `Rejected by ${request.rejectedBy}` :
                               'No action needed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredRequests.length === 0 && (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">No leave requests found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your filters to see more results.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
