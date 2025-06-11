'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'employee' | 'manager' | 'managing-director';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  const router = useRouter();

  // Mock user database
  const mockUsers: Record<string, User> = {
    'john.doe@updesco.com': {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@updesco.com',
      role: 'employee',
      department: 'Engineering',
      profilePicture: ''
    },
    'sarah.manager@updesco.com': {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.manager@updesco.com',
      role: 'manager',
      department: 'Engineering',
      profilePicture: ''
    },
    'md@updesco.com': {
      id: '3',
      name: 'Michael Director',
      email: 'md@updesco.com',
      role: 'managing-director',
      department: 'Executive',
      profilePicture: ''
    }
  };

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    try {
      // Mock authentication logic
      const user = mockUsers[email];
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.role !== role) {
        throw new Error('Invalid role selected');
      }

      // Mock password validation (in real app, this would be done on server)
      const validPasswords: Record<string, string> = {
        'john.doe@updesco.com': 'employee123',
        'sarah.manager@updesco.com': 'manager123',
        'md@updesco.com': 'md123'
      };

      if (validPasswords[email] !== password) {
        throw new Error('Invalid password');
      }

      // Store user data
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect based on role
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
          router.push('/');
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  const value = {
    user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
