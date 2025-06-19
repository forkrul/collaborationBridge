import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.getByTestId('login-button').click();
    
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('password-input').fill('password123');
    
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('password-input').fill('short');
    
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.getByTestId('email-input').fill('demo@example.com');
    await page.getByTestId('password-input').fill('password123');
    await page.getByTestId('login-button').click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByTestId('email-input').fill('wrong@example.com');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.getByTestId('password-input');
    await passwordInput.fill('password123');

    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the toggle button
    await page.getByRole('button', { name: /show password/i }).click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await page.getByRole('button', { name: /hide password/i }).click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should remember me checkbox work', async ({ page }) => {
    const checkbox = page.getByTestId('remember-me-checkbox');
    
    // Should be unchecked by default
    await expect(checkbox).not.toBeChecked();
    
    // Click to check
    await checkbox.click();
    await expect(checkbox).toBeChecked();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByTestId('forgot-password-link').click();
    await expect(page).toHaveURL('/forgot-password');
  });

  test('should show loading state during login', async ({ page }) => {
    await page.getByTestId('email-input').fill('demo@example.com');
    await page.getByTestId('password-input').fill('password123');
    
    const loginButton = page.getByTestId('login-button');
    await loginButton.click();

    // Should show loading state
    await expect(loginButton).toBeDisabled();
    await expect(loginButton).toContainText('Signing in...');
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper ARIA labels and roles
    await expect(page.getByRole('textbox', { name: /email address/i })).toBeVisible();
    await expect(page.getByLabelText(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    
    // Check for proper form structure
    await expect(page.getByRole('form')).toBeVisible();
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('email-input')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('password-input')).toBeFocused();
  });
});
