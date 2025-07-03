// HRMS Types - Updated to match backend

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'MD';
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
  manager?: Manager;
  md?: MD;
}

export interface Employee {
  id: string;
  userId: string;
  employeeId: string;
  department: string;
  position: string;
  joinDate: string;
  profilePicture?: string;
  managerId?: string;
  user: User;
  manager?: Manager;
  attendances?: AttendanceRecord[];
  leaveRequests?: LeaveRequest[];
  assignedTasks?: Task[];
  createdTasks?: Task[];
  meetingParticipants?: MeetingParticipant[];
  monthlyReports?: MonthlyReport[];
}

export interface Manager {
  id: string;
  userId: string;
  managerId: string;
  department: string;
  user: User;
  employees?: Employee[];
  createdTasks?: Task[];
  createdMeetings?: Meeting[];
  approvedLeaves?: LeaveRequest[];
}

export interface MD {
  id: string;
  userId: string;
  mdId: string;
  user: User;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'LEAVE';
  workingHours?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'SICK' | 'VACATION' | 'PERSONAL' | 'EMERGENCY' | 'MATERNITY' | 'PATERNITY';
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  notes?: string;
  employee?: Employee;
  approvedByManager?: Manager;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  dueDate?: string;
  assignedToId?: string;
  createdById: string;
  managerId?: string;
  isUserAdded: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: Employee;
  createdBy: Employee;
  manager?: Manager;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'TEAM' | 'ONE_ON_ONE' | 'PROJECT' | 'COMPANY_WIDE' | 'CLIENT';
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdById?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: Manager;
  participants: MeetingParticipant[];
}

export interface MeetingParticipant {
  id: string;
  meetingId: string;
  employeeId: string;
  status: 'INVITED' | 'ACCEPTED' | 'DECLINED' | 'MAYBE';
  meeting: Meeting;
  employee: Employee;
}

export interface MonthlyReport {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  performanceScore?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  employee: Employee;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'TASK_ASSIGNED' | 'TASK_APPROVED' | 'TASK_REJECTED' | 'MEETING_SCHEDULED' | 'MEETING_CANCELLED' | 'LEAVE_APPROVED' | 'LEAVE_REJECTED' | 'ATTENDANCE_REMINDER' | 'GENERAL';
  isRead: boolean;
  senderId?: string;
  receiverId: string;
  createdAt: string;
  sender?: User;
  receiver: User;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  description?: string;
}

// Legacy types for backward compatibility
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
  totalWorkingDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendancePercentage: number;
  leaveDays?: number;
  currentMonth?: string;
}

export interface CheckInOutData {
  type: 'check-in' | 'check-out';
  time: string;
  date: string;
}

export type UserRole = 'employee' | 'manager' | 'managing-director';

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  // Employee stats
  todayAttendance?: AttendanceRecord;
  monthlyAttendanceCount?: number;
  pendingTasks?: number;
  completedTasksThisMonth?: number;
  pendingLeaveRequests?: number;
  todaysMeetings?: number;
  monthlyReport?: MonthlyReport;
  workingDays?: {
    total: number;
    attended: number;
  };

  // Manager stats
  totalEmployees?: number;
  presentToday?: number;
  absentToday?: number;
  lateToday?: number;
  teamPerformance?: any[];

  // MD stats
  totalManagers?: number;
  companyPerformance?: any[];
}
