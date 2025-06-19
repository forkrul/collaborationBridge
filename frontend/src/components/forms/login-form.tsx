'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function LoginForm({
  onSubmit,
  loading = false,
  error,
  className,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    clearErrors,
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');

  const handleFormSubmit = async (data: LoginFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      // Error handling is done by parent component
    }
  };

  // Clear errors when user starts typing
  const handleInputChange = () => {
    if (error) {
      clearErrors();
    }
  };

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Sign in to your account
        </h1>
        <p className="mt-2 text-muted-foreground">
          Enter your credentials to access your dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {error && (
          <div
            className="bg-destructive/15 border border-destructive/20 text-destructive px-4 py-3 rounded-lg"
            role="alert"
            data-testid="error-message"
          >
            <p className="text-sm">{error}</p>
          </div>
        )}

        <Input
          {...register('email')}
          type="email"
          label="Email address"
          placeholder="Enter your email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          onChange={(e) => {
            register('email').onChange(e);
            handleInputChange();
          }}
          data-testid="email-input"
          autoComplete="email"
          required
        />

        <Input
          {...register('password')}
          type="password"
          label="Password"
          placeholder="Enter your password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          onChange={(e) => {
            register('password').onChange(e);
            handleInputChange();
          }}
          data-testid="password-input"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
              data-testid="remember-me-checkbox"
            />
            <Label
              htmlFor="remember-me"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </Label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            data-testid="forgot-password-link"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={loading}
          disabled={!isValid || loading}
          data-testid="login-button"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
