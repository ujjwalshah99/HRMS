'use client';

import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { LeaveRequest } from '@/types';

export default function EmployeeLeave() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeId: 'emp1',
      startDate: '2024-01-25',
      endDate: '2024-01-26',
      type: 'VACATION',
      reason: 'Family vacation',
      status: 'APPROVED',
      appliedDate: '2024-01-10',
      approvedBy: 'manager1'
    },
    {
      id: '2',
      employeeId: 'emp1',
      startDate: '2024-02-05',
      endDate: '2024-02-05',
      type: 'SICK',
      reason: 'Medical appointment',
      status: 'PENDING',
      appliedDate: '2024-01-18'
    },
    {
      id: '3',
      employeeId: 'emp1',
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      type: 'PERSONAL',
      reason: 'Personal work',
      status: 'REJECTED',
      appliedDate: '2024-01-10',
      rejectedBy: 'manager1'
    }
  ]);

  const [newLeave, setNewLeave] = useState({
    startDate: '',
    endDate: '',
    type: 'VACATION' as 'VACATION' | 'SICK' | 'PERSONAL' | 'EMERGENCY' | 'MATERNITY' | 'PATERNITY',
    reason: ''
  });

  const leaveStats = {
    totalLeaves: 24,
    usedLeaves: 8,
    remainingLeaves: 16,
    pendingRequests: leaveRequests.filter(req => req.status === 'PENDING').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'VACATION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SICK':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'PERSONAL':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'EMERGENCY':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSubmitLeave = () => {
    if (newLeave.startDate && newLeave.endDate && newLeave.reason.trim()) {
      const leaveRequest: LeaveRequest = {
        id: Date.now().toString(),
        employeeId: 'emp1',
        startDate: newLeave.startDate,
        endDate: newLeave.endDate,
        type: newLeave.type,
        reason: newLeave.reason,
        status: 'PENDING',
        appliedDate: new Date().toISOString().split('T')[0]
      };
      
      setLeaveRequests([leaveRequest, ...leaveRequests]);
      setNewLeave({ startDate: '', endDate: '', type: 'VACATION', reason: '' });
      setIsModalOpen(false);
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

  const appliedLeaves = leaveRequests;
  const approvedLeaves = leaveRequests.filter(req => req.status === 'APPROVED');
  const rejectedLeaves = leaveRequests.filter(req => req.status === 'REJECTED');

  return (
    <ProtectedRoute allowedRoles={['EMPLOYEE']}>
      <Layout employeeName={user?.name || "Employee"}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
              <p className="text-gray-600">Apply for leave and track your requests</p>
            </div>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Apply for Leave
            </Button>
          </div>

          {/* Leave Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Leaves</p>
                    <p className="text-3xl font-bold text-blue-900">{leaveStats.totalLeaves}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Leaves Taken</p>
                    <p className="text-3xl font-bold text-red-900">{leaveStats.usedLeaves}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Leaves Remaining</p>
                    <p className="text-3xl font-bold text-green-900">{leaveStats.remainingLeaves}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leave Requests - Full Screen */}
          <Card className="min-h-[calc(100vh-200px)]">
            <CardHeader>
              <CardTitle>All Leave Requests ({appliedLeaves.length})</CardTitle>
            </CardHeader>
              <CardContent>
                {appliedLeaves.length > 0 ? (
                  <div className="space-y-4">
                    {appliedLeaves.map((leave) => (
                      <div key={leave.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getLeaveTypeColor(leave.type)}`}>
                                {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                              </span>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(leave.status)}`}>
                                {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Duration</p>
                                <p className="font-medium">
                                  {formatDate(leave.startDate)}
                                  {leave.startDate !== leave.endDate && ` - ${formatDate(leave.endDate)}`}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {calculateDays(leave.startDate, leave.endDate)} day(s)
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600">Applied Date</p>
                                <p className="font-medium">{formatDate(leave.appliedDate)}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Reason</p>
                                <p className="font-medium">{leave.reason}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">No leave requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>

          {/* Leave Application Modal */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Apply for Leave"
            size="md"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={newLeave.startDate}
                    onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={newLeave.endDate}
                    onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type *
                </label>
                <select
                  value={newLeave.type}
                  onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide a reason for your leave..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={handleSubmitLeave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={!newLeave.startDate || !newLeave.endDate || !newLeave.reason.trim()}
                >
                  Submit Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    setNewLeave({ startDate: '', endDate: '', type: 'VACATION', reason: '' });
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
