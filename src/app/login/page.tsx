'use client';

import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string, role: string) => {
    const success = await login(email, password, role);
    if (!success) {
      alert('Invalid credentials. Please try again.');
    }
  };

  return <LoginForm onLogin={handleLogin} />;
}
