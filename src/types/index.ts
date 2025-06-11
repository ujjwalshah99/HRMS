// Employee Management System Types

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  profilePicture?: string;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
  workingHours?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'sick' | 'vacation' | 'personal' | 'emergency';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  rejectedBy?: string;
}

export interface Todo {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  createdDate: string;
}

export interface WorkingDaysStats {
  presentDays: number;
  leaveDays: number;
  totalWorkingDays: number;
  currentMonth: string;
}

export interface CheckInOutData {
  type: 'check-in' | 'check-out';
  time: string;
  date: string;
}

export type UserRole = 'employee' | 'admin' | 'managing-director';

export interface User {
  id: string;
  employee: Employee;
  role: UserRole;
}
