'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/forms/login-form';
import { useNotifications } from '@/hooks/use-notifications';

interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showSuccess, showError } = useNotifications();

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (data.email === 'demo@example.com' && data.password === 'password123') {
            resolve(true);
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 1000);
      });

      showSuccess('Login successful', 'Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      showError('Login failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm
          onSubmit={handleLogin}
          loading={loading}
          error={error}
        />
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</h3>
          <p className="text-sm text-muted-foreground">
            Email: <code className="bg-background px-1 rounded">demo@example.com</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Password: <code className="bg-background px-1 rounded">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
