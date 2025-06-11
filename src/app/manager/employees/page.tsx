'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
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

export default function ManagerEmployees() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
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

  const departments = ['all', 'Engineering', 'Marketing', 'HR', 'Finance'];

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
    const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
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
              <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600">Manage team members and their information</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Employee
            </Button>
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
                    <p className="text-sm font-medium text-orange-600">Departments</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {departments.filter(d => d !== 'all').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee List */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory ({filteredEmployees.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(employee.status)}`}>
                              {employee.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                          <p className="text-xs text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <p className="text-gray-500">Attendance</p>
                          <p className={`font-medium ${getAttendanceColor(employee.attendanceRate)}`}>
                            {employee.attendanceRate}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Tasks</p>
                          <p className="font-medium text-gray-900">
                            {employee.tasksCompleted}/{employee.totalTasks}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-500">Completion</p>
                          <p className="font-medium text-blue-600">
                            {getCompletionRate(employee.tasksCompleted, employee.totalTasks)}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewProfile(employee)}
                        >
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredEmployees.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <p className="text-gray-500">No employees found matching your criteria</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Employee Profile Modal */}
          <Modal
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            title="Employee Profile"
            size="lg"
          >
            {selectedEmployee && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xl">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                    <p className="text-gray-600">{selectedEmployee.position}</p>
                    <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Employment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Department:</span>
                        <span className="font-medium">{selectedEmployee.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Join Date:</span>
                        <span className="font-medium">{formatDate(selectedEmployee.joinDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tenure:</span>
                        <span className="font-medium">{calculateTenure(selectedEmployee.joinDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedEmployee.status)}`}>
                          {selectedEmployee.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Attendance Rate:</span>
                        <span className={`font-medium ${getAttendanceColor(selectedEmployee.attendanceRate)}`}>
                          {selectedEmployee.attendanceRate}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tasks Completed:</span>
                        <span className="font-medium">{selectedEmployee.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Total Tasks:</span>
                        <span className="font-medium">{selectedEmployee.totalTasks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Completion Rate:</span>
                        <span className="font-medium text-blue-600">
                          {getCompletionRate(selectedEmployee.tasksCompleted, selectedEmployee.totalTasks)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Edit Profile
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Attendance
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Assign Task
                  </Button>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </ManagerLayout>
    </ProtectedRoute>
  );
}
