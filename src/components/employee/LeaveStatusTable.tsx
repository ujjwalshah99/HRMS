'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LeaveRequest } from '@/types';

interface LeaveStatusTableProps {
  leaveRequests: LeaveRequest[];
}

export const LeaveStatusTable: React.FC<LeaveStatusTableProps> = ({ leaveRequests }) => {
  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (type) {
      case 'sick':
        return `${baseClasses} bg-red-50 text-red-700 border border-red-200`;
      case 'vacation':
        return `${baseClasses} bg-blue-50 text-blue-700 border border-blue-200`;
      case 'personal':
        return `${baseClasses} bg-purple-50 text-purple-700 border border-purple-200`;
      case 'emergency':
        return `${baseClasses} bg-orange-50 text-orange-700 border border-orange-200`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border border-gray-200`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Sort leave requests by applied date (most recent first)
  const sortedLeaveRequests = [...leaveRequests].sort((a, b) => 
    new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Status</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedLeaveRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Duration</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Days</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Applied</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Reason</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaveRequests.map((leave) => (
                  <tr key={leave.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <span className={getLeaveTypeBadge(leave.type)}>
                        {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-900">
                      <div className="text-sm">
                        {formatDate(leave.startDate)}
                        {leave.startDate !== leave.endDate && (
                          <>
                            <span className="text-gray-500"> to </span>
                            {formatDate(leave.endDate)}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-900">
                      <span className="font-medium">
                        {calculateDays(leave.startDate, leave.endDate)} day{calculateDays(leave.startDate, leave.endDate) > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600">
                      {formatDate(leave.appliedDate)}
                    </td>
                    <td className="py-3 px-2">
                      <span className={getStatusBadge(leave.status)}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600 max-w-xs">
                      <div className="truncate" title={leave.reason}>
                        {leave.reason}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">No leave requests found</p>
            <p className="text-sm text-gray-400 mt-1">Your leave applications will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
