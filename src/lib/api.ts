import { LoginResponse, User, ApiResponse } from '@/types';

const API_BASE_URL = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  removeToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    department?: string;
    position?: string;
    joinDate?: string;
  }): Promise<ApiResponse<User>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Attendance endpoints
  async getAttendance(params?: {
    month?: string;
    year?: string;
    employeeId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.append('month', params.month);
    if (params?.year) searchParams.append('year', params.year);
    if (params?.employeeId) searchParams.append('employeeId', params.employeeId);
    
    // Add cache-busting parameter
    searchParams.append('_t', Date.now().toString());
    
    return this.request(`/attendance?${searchParams}`);
  }

  async checkInOut(type: 'check-in' | 'check-out') {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async updateAttendance(attendanceId: string, status: string, notes?: string) {
    return this.request('/attendance', {
      method: 'PUT',
      body: JSON.stringify({ attendanceId, status, notes }),
    });
  }

  async markAttendance(action: 'check-in' | 'check-out') {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify({ type: action }),
    });
  }

  // Leave endpoints
  async getLeaves(params?: { status?: string; employeeId?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.employeeId) searchParams.append('employeeId', params.employeeId);
    
    return this.request(`/leaves?${searchParams}`);
  }

  async createLeaveRequest(leaveData: {
    startDate: string;
    endDate: string;
    type: string;
    reason: string;
  }) {
    return this.request('/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async updateLeaveRequest(leaveRequestId: string, status: string, notes?: string) {
    return this.request('/leaves', {
      method: 'PUT',
      body: JSON.stringify({ leaveRequestId, status, notes }),
    });
  }

  // Task endpoints
  async getTasks(params?: {
    type?: string;
    status?: string;
    employeeId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.employeeId) searchParams.append('employeeId', params.employeeId);
    
    return this.request(`/tasks?${searchParams}`);
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    priority: string;
    dueDate?: string;
    assignedToId?: string;
    isUserAdded?: boolean;
  }) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId: string, updateData: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    dueDate?: string;
    approvalStatus?: string;
  }) {
    return this.request('/tasks', {
      method: 'PUT',
      body: JSON.stringify({ taskId, ...updateData }),
    });
  }

  async deleteTask(taskId: string) {
    return this.request(`/tasks?taskId=${taskId}`, {
      method: 'DELETE',
    });
  }

  // Meeting endpoints
  async getMeetings(params?: { date?: string; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.append('date', params.date);
    if (params?.status) searchParams.append('status', params.status);
    
    return this.request(`/meetings?${searchParams}`);
  }

  async createMeeting(meetingData: {
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    location?: string;
    type?: string;
    participantIds: string[];
  }) {
    return this.request('/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  }

  async updateMeeting(meetingId: string, updateData: {
    title?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    status?: string;
    participantStatus?: string;
  }) {
    return this.request('/meetings', {
      method: 'PUT',
      body: JSON.stringify({ meetingId, ...updateData }),
    });
  }

  async deleteMeeting(meetingId: string) {
    return this.request(`/meetings?meetingId=${meetingId}`, {
      method: 'DELETE',
    });
  }

  // MPR endpoints
  async getMPRReports(params?: {
    month?: string;
    year?: string;
    employeeId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.append('month', params.month);
    if (params?.year) searchParams.append('year', params.year);
    if (params?.employeeId) searchParams.append('employeeId', params.employeeId);
    
    return this.request(`/mpr?${searchParams}`);
  }

  async generateMPRReport(data: {
    month: string;
    year: string;
    employeeId?: string;
  }) {
    return this.request('/mpr', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMPRReport(reportId: string, data: {
    feedback?: string;
    performanceScore?: number;
  }) {
    return this.request('/mpr', {
      method: 'PUT',
      body: JSON.stringify({ reportId, ...data }),
    });
  }

  // Employee endpoints
  async getEmployees(params?: {
    department?: string;
    employeeId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.department) searchParams.append('department', params.department);
    if (params?.employeeId) searchParams.append('employeeId', params.employeeId);
    
    return this.request(`/employees?${searchParams}`);
  }

  async updateEmployee(employeeId: string, updateData: {
    name?: string;
    department?: string;
    position?: string;
    managerId?: string;
    profilePicture?: string;
  }) {
    return this.request('/employees', {
      method: 'PUT',
      body: JSON.stringify({ employeeId, ...updateData }),
    });
  }

  async deleteEmployee(employeeId: string) {
    return this.request(`/employees?employeeId=${employeeId}`, {
      method: 'DELETE',
    });
  }

  // Notification endpoints
  async getNotifications(params?: { isRead?: boolean; type?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.isRead !== undefined) searchParams.append('isRead', params.isRead.toString());
    if (params?.type) searchParams.append('type', params.type);
    
    return this.request(`/notifications?${searchParams}`);
  }

  async markNotificationsAsRead(notificationIds: string[]) {
    return this.request('/notifications', {
      method: 'PUT',
      body: JSON.stringify({ notificationIds, isRead: true }),
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request(`/notifications?notificationId=${notificationId}`, {
      method: 'DELETE',
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }
}

export const apiClient = new ApiClient();
