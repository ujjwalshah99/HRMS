'use client';

import React, { useState } from 'react';
import { MDLayout } from '@/components/layout/MDLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  joinDate: string;
  status: 'active' | 'inactive';
  attendanceRate: number;
  tasksCompleted: number;
  totalTasks: number;
}

export default function MDEmployees() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@updesco.com',
      department: 'Engineering',
      position: 'Senior Developer',
      joinDate: '2023-01-15',
      status: 'active',
      attendanceRate: 95,
      tasksCompleted: 15,
      totalTasks: 18
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@updesco.com',
      department: 'Engineering',
      position: 'Frontend Developer',
      joinDate: '2023-03-20',
      status: 'active',
      attendanceRate: 92,
      tasksCompleted: 12,
      totalTasks: 14
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@updesco.com',
      department: 'Marketing',
      position: 'Marketing Specialist',
      joinDate: '2023-02-10',
      status: 'active',
      attendanceRate: 88,
      tasksCompleted: 10,
      totalTasks: 12
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@updesco.com',
      department: 'Engineering',
      position: 'Backend Developer',
      joinDate: '2022-11-05',
      status: 'active',
      attendanceRate: 98,
      tasksCompleted: 16,
      totalTasks: 16
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@updesco.com',
      department: 'HR',
      position: 'HR Coordinator',
      joinDate: '2023-04-12',
      status: 'active',
      attendanceRate: 90,
      tasksCompleted: 14,
      totalTasks: 15
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAttendanceColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600';
    if (rate >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionRate = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsProfileModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateTenure = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - join.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    return months > 12 ? `${Math.floor(months / 12)} year(s)` : `${months} month(s)`;
  };

  return (
    <ProtectedRoute allowedRoles={['managing-director']}>
      <MDLayout
        userName={user?.name || "Managing Director"}
        profilePicture={user?.profilePicture}
      >
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600">Manage team members and their information</p>
          </div>

          {/* Employee Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Employees</p>
                    <p className="text-3xl font-bold text-blue-900">{employees.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Active</p>
                    <p className="text-3xl font-bold text-green-900">
                      {employees.filter(e => e.status === 'active').length}
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

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Avg. Attendance</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {Math.round(employees.reduce((acc, e) => acc + e.attendanceRate, 0) / employees.length)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Task Completion</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {Math.round(employees.reduce((acc, e) => acc + getCompletionRate(e.tasksCompleted, e.totalTasks), 0) / employees.length)}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Employees
                </label>
                <input
                  type="text"
                  placeholder="Search by name, email, or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Employee List */}
          <Card>
            <CardHeader>
              <CardTitle>Employee List ({filteredEmployees.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Employee</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Department</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Position</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Join Date</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Attendance</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Task Progress</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-xs">
                                {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-xs text-gray-500">{employee.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-gray-900">{employee.department}</td>
                        <td className="py-3 px-2 text-gray-900">{employee.position}</td>
                        <td className="py-3 px-2 text-gray-600">{formatDate(employee.joinDate)}</td>
                        <td className="py-3 px-2">
                          <span className={`font-medium ${getAttendanceColor(employee.attendanceRate)}`}>
                            {employee.attendanceRate}%
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {employee.tasksCompleted}/{employee.totalTasks}
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                              ({getCompletionRate(employee.tasksCompleted, employee.totalTasks)}%)
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewProfile(employee)}
                            >
                              View Profile
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg font-medium">No employees found</p>
                  <p className="text-gray-400 text-sm mt-1">Try adjusting your search criteria</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employee Profile Modal */}
          <Modal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            title="Employee Profile"
          >
            {selectedEmployee && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3>
                    <p className="text-gray-600">{selectedEmployee.position}</p>
                    <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Join Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedEmployee.joinDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Attendance Rate</label>
                    <p className={`mt-1 text-sm font-medium ${getAttendanceColor(selectedEmployee.attendanceRate)}`}>
                      {selectedEmployee.attendanceRate}%
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Task Progress</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedEmployee.tasksCompleted}/{selectedEmployee.totalTasks}
                      ({getCompletionRate(selectedEmployee.tasksCompleted, selectedEmployee.totalTasks)}%)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </MDLayout>
    </ProtectedRoute>
  );
}
