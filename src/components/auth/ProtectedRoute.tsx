'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login'
}) => {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth context to be fully initialized
    if (!isInitialized) {
      return;
    }
    
    if (!isLoading) {
      if (!user) {
        router.push(redirectTo);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
          case 'EMPLOYEE':
            router.push('/employee/dashboard');
            break;
          case 'MANAGER':
            router.push('/manager/dashboard');
            break;
          case 'MD':
            router.push('/md/dashboard');
            break;
          default:
            router.push('/login');
        }
        return;
      }
    }
  }, [user, isLoading, isInitialized, allowedRoles, router, redirectTo]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">UPDESCO</h1>
          <p className="text-gray-600">Loading...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized || !user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};
