'use client';

import React from 'react';
import { TopBar } from './TopBar';
import { MDSideBar } from './MDSideBar';

interface MDLayoutProps {
  children: React.ReactNode;
  userName: string;
  profilePicture?: string;
}

export const MDLayout: React.FC<MDLayoutProps> = ({ 
  children, 
  userName, 
  profilePicture
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50">
        <MDSideBar 
          userName={userName} 
          profilePicture={profilePicture}
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
