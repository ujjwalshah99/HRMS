'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { SideBar } from './SideBar';

interface LayoutProps {
  children: React.ReactNode;
  employeeName: string;
  profilePicture?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  employeeName, 
  profilePicture 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50">
        <SideBar 
          employeeName={employeeName} 
          profilePicture={profilePicture} 
        />
      </div>

      {/* Main content area */}
      <div className="ml-64">
        {/* Top bar */}
        <TopBar 
          employeeName={employeeName} 
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
