'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User } from '@/types';

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'MD';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      setIsInitialized(true);
      return;
    }
    
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        const userData = JSON.parse(storedUser);
        
        if (userData && typeof userData === 'object' && userData.id && userData.email && userData.role) {
          setUser(userData);
          apiClient.setToken(storedToken);
        } else {
          // Invalid user data, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          apiClient.removeToken();
        }
      } catch (error) {
        console.error('AuthContext: Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        apiClient.removeToken();
      }
    } else {
      // No valid stored data, ensure clean state
      if (storedUser && storedUser !== 'null') localStorage.removeItem('user');
      if (storedToken && storedToken !== 'null') localStorage.removeItem('token');
      apiClient.removeToken();
    }
    
    setIsLoading(false);
    setIsInitialized(true);
  }, []);

  // Don't render anything until we've checked localStorage
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">U</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-600 mb-2">UPDESCO</h1>
          <p className="text-gray-600">Initializing...</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password);
      
      // Store both user data and token
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      apiClient.setToken(response.token);
      
      // Redirect based on role
      if (response.user.role === 'EMPLOYEE') {
        router.push('/employee/dashboard');
      } else if (response.user.role === 'MANAGER') {
        router.push('/manager/dashboard');
      } else if (response.user.role === 'MD') {
        router.push('/md/dashboard');
      }
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    apiClient.removeToken();
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};
