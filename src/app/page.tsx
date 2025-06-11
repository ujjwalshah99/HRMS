'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on user role
        switch (user.role) {
          case 'employee':
            router.push('/employee/dashboard');
            break;
          case 'manager':
            router.push('/manager/dashboard');
            break;
          case 'managing-director':
            router.push('/md/dashboard');
            break;
          default:
            router.push('/login');
        }
      } else {
        router.push('/login');
      }
    }
  }, [router, user, isLoading]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">U</span>
        </div>
        <h1 className="text-2xl font-bold text-blue-600 mb-2">UPDESCO</h1>
        <p className="text-gray-600">Employee Management System</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
