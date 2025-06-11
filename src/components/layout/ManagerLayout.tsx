'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { ManagerSideBar } from './ManagerSideBar';
import { UserRole } from '@/contexts/AuthContext';

interface ManagerLayoutProps {
  children: React.ReactNode;
  userName: string;
  profilePicture?: string;
  userRole: UserRole;
}

export const ManagerLayout: React.FC<ManagerLayoutProps> = ({ 
  children, 
  userName, 
  profilePicture,
  userRole
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50">
        <ManagerSideBar 
          userName={userName} 
          profilePicture={profilePicture}
          userRole={userRole}
        />
      </div>

      {/* Main content area */}
      <div className="ml-64">
        {/* Top bar */}
        <TopBar 
          employeeName={userName} 
          profilePicture={profilePicture} 
        />

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
