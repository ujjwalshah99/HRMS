'use client';

import React, { useState } from 'react';
import { ManagerLayout } from '@/components/layout/ManagerLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';

export default function ManagerAttendance() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  // Initialize attendance data from localStorage or use default data
  const getInitialAttendanceData = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('attendanceData');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@updesco.com',
        employeeId: 'EMP001',
        department: 'Engineering',
        checkIn: '09:00 AM',
        checkOut: '05:30 PM',
        status: 'On Time',
        workingHours: '8h 30m'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@updesco.com',
        employeeId: 'EMP002',
        department: 'Engineering',
        checkIn: '09:15 AM',
        checkOut: '05:45 PM',
        status: 'Late',
        workingHours: '8h 30m'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@updesco.com',
        employeeId: 'EMP003',
        department: 'Marketing',
        checkIn: '--',
        checkOut: '--',
        status: 'Absent',
        workingHours: '--'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@updesco.com',
        employeeId: 'EMP004',
        department: 'Engineering',
        checkIn: '08:45 AM',
        checkOut: '04:30 PM',
        status: 'Early Leave',
        workingHours: '7h 45m'
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david.brown@updesco.com',
        employeeId: 'EMP005',
        department: 'HR',
        checkIn: '09:05 AM',
        checkOut: '05:35 PM',
        status: 'On Time',
        workingHours: '8h 30m'
      }
    ];
  };

  const [attendanceData, setAttendanceData] = useState(getInitialAttendanceData);

  // Mock data
  const employees = [
    { id: 'all', name: 'All Employees', employeeId: '' },
    { id: '1', name: 'John Doe', employeeId: 'EMP001' },
    { id: '2', name: 'Jane Smith', employeeId: 'EMP002' },
    { id: '3', name: 'Mike Johnson', employeeId: 'EMP003' },
    { id: '4', name: 'Sarah Wilson', employeeId: 'EMP004' },
    { id: '5', name: 'David Brown', employeeId: 'EMP005' },
    { id: '6', name: 'Emily Davis', employeeId: 'EMP006' },
    { id: '7', name: 'Robert Miller', employeeId: 'EMP007' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Early Leave':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Absent':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredData = attendanceData.filter(emp =>
    selectedEmployee === 'all' || emp.id === selectedEmployee
  );

  const handleDownloadMonthlyReport = () => {
    const selectedEmp = employees.find(emp => emp.id === selectedEmployee);
    const empName = selectedEmp ? selectedEmp.name : 'All Employees';
    const monthName = new Date(selectedMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Generate CSV data based on selected employee and month
    let csvData = [['Employee', 'Employee ID', 'Date', 'Check-In', 'Check-Out', 'Working Hours', 'Status']];

    if (selectedEmployee === 'all') {
      // Generate data for all employees
      attendanceData.forEach(emp => {
        csvData.push([
          emp.name,
          emp.employeeId,
          selectedMonth + '-15', // Mock date for the month
          emp.checkIn,
          emp.checkOut,
          emp.workingHours,
          emp.status
        ]);
      });
    } else {
      // Generate data for selected employee
      const empData = attendanceData.find(emp => emp.id === selectedEmployee);
      if (empData) {
        // Generate multiple entries for the month
        for (let day = 1; day <= 30; day++) {
          const date = `${selectedMonth}-${day.toString().padStart(2, '0')}`;
          csvData.push([
            empData.name,
            empData.employeeId,
            date,
            empData.checkIn,
            empData.checkOut,
            empData.workingHours,
            empData.status
          ]);
        }
      }
    }

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${empName}_${monthName}_Attendance_Report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEditRecord = (record: any) => {
    // Convert time format for input fields
    const convertTimeToInput = (timeStr: string) => {
      if (!timeStr || timeStr === '--') return '';
      // Convert "09:00 AM" to "09:00"
      const time = timeStr.replace(/\s*(AM|PM)/i, '');
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours);

      if (timeStr.toLowerCase().includes('pm') && hour24 !== 12) {
        hour24 += 12;
      } else if (timeStr.toLowerCase().includes('am') && hour24 === 12) {
        hour24 = 0;
      }

      return `${hour24.toString().padStart(2, '0')}:${minutes}`;
    };

    setEditingRecord({
      ...record,
      checkInTime: convertTimeToInput(record.checkIn),
      checkOutTime: convertTimeToInput(record.checkOut)
    });
    setIsEditModalOpen(true);
  };

  const calculateWorkingHours = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return '--';

    const [inHours, inMinutes] = checkIn.split(':').map(Number);
    const [outHours, outMinutes] = checkOut.split(':').map(Number);

    const inTotalMinutes = inHours * 60 + inMinutes;
    const outTotalMinutes = outHours * 60 + outMinutes;

    let diffMinutes = outTotalMinutes - inTotalMinutes;
    if (diffMinutes < 0) diffMinutes += 24 * 60; // Handle next day

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const convertTimeToDisplay = (timeStr: string) => {
    if (!timeStr) return '--';
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const handleTimeChange = (field: 'checkInTime' | 'checkOutTime', value: string) => {
    const updatedRecord = { ...editingRecord, [field]: value };

    // Update display times
    if (field === 'checkInTime') {
      updatedRecord.checkIn = convertTimeToDisplay(value);
    } else {
      updatedRecord.checkOut = convertTimeToDisplay(value);
    }

    // Auto-calculate working hours if both times are present
    if (updatedRecord.checkInTime && updatedRecord.checkOutTime) {
      updatedRecord.workingHours = calculateWorkingHours(updatedRecord.checkInTime, updatedRecord.checkOutTime);
    }

    setEditingRecord(updatedRecord);
  };

  const handleSaveEdit = () => {
    if (editingRecord) {
      // Update the attendance data state with the edited record
      setAttendanceData(prevData => {
        const updatedData = prevData.map(record =>
          record.id === editingRecord.id ? { ...editingRecord } : record
        );
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('attendanceData', JSON.stringify(updatedData));
        }
        return updatedData;
      });
      setIsEditModalOpen(false);
      setEditingRecord(null);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Daily Attendance</h1>
            <p className="text-gray-600">Monitor employee attendance and working hours</p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        {emp.id === 'all' ? emp.name : `${emp.name} (${emp.employeeId})`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleDownloadMonthlyReport}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Export Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Attendance Records ({filteredData.length})</span>
                <span className="text-sm font-normal text-gray-500">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Employee</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Department</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Check-In</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Check-Out</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Working Hours</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((employee) => (
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
                        <td className="py-3 px-2 text-gray-900">{employee.checkIn}</td>
                        <td className="py-3 px-2 text-gray-900">{employee.checkOut}</td>
                        <td className="py-3 px-2 text-gray-900">{employee.workingHours}</td>
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
                              onClick={() => handleEditRecord(employee)}
                            >
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredData.length === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">No attendance records found for the selected filters</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Attendance Modal */}
          <Modal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            title="Edit Attendance Record"
            size="md"
          >
            {editingRecord && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value={editingRecord.name}
                    onChange={(e) => setEditingRecord({ ...editingRecord, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-In Time
                    </label>
                    <input
                      type="time"
                      value={editingRecord.checkInTime || ''}
                      onChange={(e) => handleTimeChange('checkInTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Display: {editingRecord.checkIn || '--'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-Out Time
                    </label>
                    <input
                      type="time"
                      value={editingRecord.checkOutTime || ''}
                      onChange={(e) => handleTimeChange('checkOutTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Display: {editingRecord.checkOut || '--'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editingRecord.status}
                    onChange={(e) => setEditingRecord({ ...editingRecord, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="On Time">On Time</option>
                    <option value="Late">Late</option>
                    <option value="Early Leave">Early Leave</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Hours (Auto-calculated)
                  </label>
                  <input
                    type="text"
                    value={editingRecord.workingHours || '--'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    placeholder="Auto-calculated based on check-in/out times"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">This field is automatically calculated when you set check-in and check-out times</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
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
