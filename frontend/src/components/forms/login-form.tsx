'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Create schema factory to use translations
const createLoginSchema = (t: any) => z.object({
  email: z
    .string()
    .email(t('validation.email'))
    .min(1, t('validation.required')),
  password: z
    .string()
    .min(8, t('validation.minLength', { min: 8 }))
    .min(1, t('validation.required')),
  rememberMe: z.boolean().default(false),
});

type LoginFormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

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
  const t = useTranslations();
  const loginSchema = React.useMemo(() => createLoginSchema(t), [t]);

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
          {t('components.forms.loginForm.title')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t('components.forms.loginForm.subtitle')}
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
          label={t('components.forms.loginForm.email')}
          placeholder={t('components.forms.loginForm.emailPlaceholder')}
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
          label={t('components.forms.loginForm.password')}
          placeholder={t('components.forms.loginForm.passwordPlaceholder')}
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
              {t('components.forms.loginForm.rememberMe')}
            </Label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            data-testid="forgot-password-link"
          >
            {t('components.forms.loginForm.forgotPassword')}
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
          {loading ? t('components.forms.loginForm.signingIn') : t('components.forms.loginForm.signIn')}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {t('components.forms.loginForm.noAccount')}{' '}
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              {t('components.forms.loginForm.signUpHere')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
