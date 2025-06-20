Testing
=======

The Frontend Component Library includes comprehensive testing strategies to ensure reliability, accessibility, and performance across all components.

Testing Philosophy
------------------

Our testing approach follows these principles:

* **Test Behavior, Not Implementation**: Focus on what users experience
* **Accessibility First**: Every test includes accessibility verification
* **Real User Scenarios**: Test components as users would interact with them
* **Performance Aware**: Monitor and test performance implications
* **Internationalization**: Test components across different locales

Testing Stack
-------------

The testing infrastructure uses modern tools and best practices:

.. list-table::
   :header-rows: 1
   :widths: 25 25 50

   * - Tool
     - Purpose
     - Usage
   * - Jest
     - Test runner and framework
     - Unit and integration tests
   * - React Testing Library
     - Component testing utilities
     - User-centric testing approach
   * - jest-axe
     - Accessibility testing
     - Automated a11y violation detection
   * - MSW (Mock Service Worker)
     - API mocking
     - Network request mocking
   * - Playwright
     - End-to-end testing
     - Cross-browser testing
   * - Storybook
     - Component development
     - Visual regression testing

Unit Testing
------------

Component Testing Patterns
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { render, screen, fireEvent, waitFor } from '@testing-library/react';
   import { axe, toHaveNoViolations } from 'jest-axe';
   import { Button } from '../button';

   expect.extend(toHaveNoViolations);

   describe('Button', () => {
     it('renders correctly', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
     });

     it('handles click events', () => {
       const handleClick = jest.fn();
       render(<Button onClick={handleClick}>Click me</Button>);
       
       fireEvent.click(screen.getByRole('button'));
       expect(handleClick).toHaveBeenCalledTimes(1);
     });

     it('supports keyboard interaction', () => {
       const handleClick = jest.fn();
       render(<Button onClick={handleClick}>Click me</Button>);
       
       const button = screen.getByRole('button');
       fireEvent.keyDown(button, { key: 'Enter' });
       expect(handleClick).toHaveBeenCalledTimes(1);
     });

     it('should not have accessibility violations', async () => {
       const { container } = render(<Button>Accessible button</Button>);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });

     it('applies variant styles correctly', () => {
       render(<Button variant="destructive">Delete</Button>);
       const button = screen.getByRole('button');
       expect(button).toHaveClass('bg-destructive');
     });

     it('handles disabled state', () => {
       render(<Button disabled>Disabled button</Button>);
       const button = screen.getByRole('button');
       expect(button).toBeDisabled();
       expect(button).toHaveAttribute('aria-disabled', 'true');
     });
   });

Form Testing
~~~~~~~~~~~~

.. code-block:: typescript

   import { render, screen, fireEvent, waitFor } from '@testing-library/react';
   import userEvent from '@testing-library/user-event';
   import { ContactForm } from '../ContactForm';

   describe('ContactForm', () => {
     it('validates required fields', async () => {
       const user = userEvent.setup();
       render(<ContactForm />);

       const submitButton = screen.getByRole('button', { name: /submit/i });
       await user.click(submitButton);

       await waitFor(() => {
         expect(screen.getByText('Name is required')).toBeInTheDocument();
         expect(screen.getByText('Email is required')).toBeInTheDocument();
       });
     });

     it('validates email format', async () => {
       const user = userEvent.setup();
       render(<ContactForm />);

       const emailInput = screen.getByLabelText(/email/i);
       await user.type(emailInput, 'invalid-email');
       
       const submitButton = screen.getByRole('button', { name: /submit/i });
       await user.click(submitButton);

       await waitFor(() => {
         expect(screen.getByText('Invalid email address')).toBeInTheDocument();
       });
     });

     it('submits form with valid data', async () => {
       const user = userEvent.setup();
       const mockSubmit = jest.fn();
       render(<ContactForm onSubmit={mockSubmit} />);

       await user.type(screen.getByLabelText(/name/i), 'John Doe');
       await user.type(screen.getByLabelText(/email/i), 'john@example.com');
       await user.type(screen.getByLabelText(/message/i), 'Hello world');

       await user.click(screen.getByRole('button', { name: /submit/i }));

       await waitFor(() => {
         expect(mockSubmit).toHaveBeenCalledWith({
           name: 'John Doe',
           email: 'john@example.com',
           message: 'Hello world',
         });
       });
     });
   });

Accessibility Testing
---------------------

Automated Accessibility Testing
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { axe, toHaveNoViolations } from 'jest-axe';

   expect.extend(toHaveNoViolations);

   describe('Accessibility', () => {
     it('should not have violations in default state', async () => {
       const { container } = render(<MyComponent />);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });

     it('should not have violations in error state', async () => {
       const { container } = render(<MyComponent error="Something went wrong" />);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });

     it('should not have violations in loading state', async () => {
       const { container } = render(<MyComponent loading />);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });
   });

Keyboard Navigation Testing
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   describe('Keyboard Navigation', () => {
     it('supports tab navigation', () => {
       render(<NavigationMenu />);
       
       const firstItem = screen.getByRole('menuitem', { name: 'Home' });
       const secondItem = screen.getByRole('menuitem', { name: 'About' });
       
       firstItem.focus();
       expect(firstItem).toHaveFocus();
       
       fireEvent.keyDown(firstItem, { key: 'Tab' });
       expect(secondItem).toHaveFocus();
     });

     it('supports arrow key navigation', () => {
       render(<NavigationMenu />);
       
       const firstItem = screen.getByRole('menuitem', { name: 'Home' });
       const secondItem = screen.getByRole('menuitem', { name: 'About' });
       
       firstItem.focus();
       fireEvent.keyDown(firstItem, { key: 'ArrowDown' });
       expect(secondItem).toHaveFocus();
     });

     it('supports escape key to close', () => {
       render(<Dialog open />);
       
       const dialog = screen.getByRole('dialog');
       fireEvent.keyDown(dialog, { key: 'Escape' });
       
       expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
     });
   });

Screen Reader Testing
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   describe('Screen Reader Support', () => {
     it('announces form errors', async () => {
       render(<FormField error="This field is required" />);
       
       const input = screen.getByRole('textbox');
       expect(input).toHaveAttribute('aria-invalid', 'true');
       expect(input).toHaveAttribute('aria-describedby');
       
       const errorMessage = screen.getByText('This field is required');
       expect(errorMessage).toHaveAttribute('id', input.getAttribute('aria-describedby'));
     });

     it('provides proper labels', () => {
       render(
         <div>
           <Label htmlFor="email">Email Address</Label>
           <Input id="email" type="email" />
         </div>
       );
       
       const input = screen.getByLabelText('Email Address');
       expect(input).toBeInTheDocument();
     });

     it('announces dynamic content changes', async () => {
       render(<SearchResults />);
       
       const liveRegion = screen.getByRole('status');
       expect(liveRegion).toHaveAttribute('aria-live', 'polite');
       
       // Simulate search results update
       fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'test' } });
       
       await waitFor(() => {
         expect(liveRegion).toHaveTextContent('5 results found');
       });
     });
   });

Internationalization Testing
----------------------------

Translation Testing
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { NextIntlProvider } from 'next-intl';

   const messages = {
     'en-GB': { common: { save: 'Save', cancel: 'Cancel' } },
     'de': { common: { save: 'Speichern', cancel: 'Abbrechen' } },
     'af': { common: { save: 'Stoor', cancel: 'Kanselleer' } },
   };

   describe('Internationalization', () => {
     it.each(['en-GB', 'de', 'af'])('renders in %s locale', (locale) => {
       render(
         <NextIntlProvider locale={locale} messages={messages[locale]}>
           <MyComponent />
         </NextIntlProvider>
       );
       
       expect(screen.getByText(messages[locale].common.save)).toBeInTheDocument();
     });

     it('formats numbers according to locale', () => {
       const testCases = [
         { locale: 'en-GB', number: 1234.56, expected: '1,234.56' },
         { locale: 'de', number: 1234.56, expected: '1.234,56' },
         { locale: 'gsw-CH', number: 1234.56, expected: '1'234.56' },
       ];

       testCases.forEach(({ locale, number, expected }) => {
         render(
           <NextIntlProvider locale={locale} messages={{}}>
             <NumberDisplay value={number} />
           </NextIntlProvider>
         );
         
         expect(screen.getByText(expected)).toBeInTheDocument();
       });
     });
   });

Locale-Aware Component Testing
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   describe('Locale-aware components', () => {
     it('adapts date format to locale', () => {
       const date = new Date('2024-03-15');
       
       render(
         <NextIntlProvider locale="en-GB" messages={{}}>
           <DateDisplay date={date} />
         </NextIntlProvider>
       );
       expect(screen.getByText('15/03/2024')).toBeInTheDocument();
       
       render(
         <NextIntlProvider locale="de" messages={{}}>
           <DateDisplay date={date} />
         </NextIntlProvider>
       );
       expect(screen.getByText('15.03.2024')).toBeInTheDocument();
     });

     it('handles text expansion in different languages', () => {
       // German text is typically 30% longer than English
       const longGermanText = 'Sehr langer deutscher Text der mehr Platz benötigt';
       
       render(
         <NextIntlProvider locale="de" messages={{ common: { title: longGermanText } }}>
           <Card title={longGermanText} />
         </NextIntlProvider>
       );
       
       const card = screen.getByRole('article');
       expect(card).not.toHaveClass('truncate'); // Ensure text isn't cut off
     });
   });

Performance Testing
-------------------

Render Performance
~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { render } from '@testing-library/react';
   import { performance } from 'perf_hooks';

   describe('Performance', () => {
     it('renders large lists efficiently', () => {
       const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
       
       const startTime = performance.now();
       render(<VirtualizedList items={items} />);
       const endTime = performance.now();
       
       expect(endTime - startTime).toBeLessThan(100); // Should render in under 100ms
     });

     it('does not cause memory leaks', () => {
       const { unmount } = render(<ComplexComponent />);
       
       // Simulate component lifecycle
       unmount();
       
       // Check for memory leaks (simplified example)
       expect(global.gc).toBeDefined();
       global.gc();
       
       const memoryUsage = process.memoryUsage();
       expect(memoryUsage.heapUsed).toBeLessThan(50 * 1024 * 1024); // Under 50MB
     });
   });

Bundle Size Testing
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   describe('Bundle Size', () => {
     it('tree-shakes unused components', async () => {
       // This would be run as part of build process
       const bundleAnalysis = await analyzeBundleSize();
       
       expect(bundleAnalysis.unusedExports).toHaveLength(0);
       expect(bundleAnalysis.totalSize).toBeLessThan(500 * 1024); // Under 500KB
     });

     it('lazy loads heavy components', async () => {
       const { findByText } = render(<App />);
       
       // Heavy component should not be in initial bundle
       expect(document.querySelector('[data-component="heavy-chart"]')).toBeNull();
       
       // Trigger lazy loading
       fireEvent.click(screen.getByText('Show Chart'));
       
       await findByText('Chart loaded');
       expect(document.querySelector('[data-component="heavy-chart"]')).toBeInTheDocument();
     });
   });

Integration Testing
-------------------

Component Integration
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   describe('Component Integration', () => {
     it('integrates form components correctly', async () => {
       const user = userEvent.setup();
       render(<UserRegistrationForm />);

       // Fill out multi-step form
       await user.type(screen.getByLabelText(/first name/i), 'John');
       await user.type(screen.getByLabelText(/last name/i), 'Doe');
       await user.click(screen.getByText('Next'));

       await user.type(screen.getByLabelText(/email/i), 'john@example.com');
       await user.type(screen.getByLabelText(/password/i), 'password123');
       await user.click(screen.getByText('Next'));

       // File upload step
       const fileInput = screen.getByLabelText(/upload resume/i);
       const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
       await user.upload(fileInput, file);

       await user.click(screen.getByText('Submit'));

       await waitFor(() => {
         expect(screen.getByText('Registration successful')).toBeInTheDocument();
       });
     });

     it('handles search with filters', async () => {
       const user = userEvent.setup();
       render(<ProductSearch />);

       // Enter search query
       await user.type(screen.getByPlaceholderText(/search products/i), 'laptop');

       // Apply filters
       await user.click(screen.getByLabelText(/filters/i));
       await user.click(screen.getByText('Electronics'));
       await user.click(screen.getByText('In Stock'));

       await waitFor(() => {
         expect(screen.getByText('15 products found')).toBeInTheDocument();
       });
     });
   });

API Integration Testing
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { rest } from 'msw';
   import { setupServer } from 'msw/node';

   const server = setupServer(
     rest.get('/api/users', (req, res, ctx) => {
       return res(
         ctx.json([
           { id: 1, name: 'John Doe', email: 'john@example.com' },
           { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
         ])
       );
     }),
     rest.post('/api/users', (req, res, ctx) => {
       return res(ctx.json({ id: 3, ...req.body }));
     })
   );

   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());

   describe('API Integration', () => {
     it('loads and displays user data', async () => {
       render(<UserList />);

       await waitFor(() => {
         expect(screen.getByText('John Doe')).toBeInTheDocument();
         expect(screen.getByText('Jane Smith')).toBeInTheDocument();
       });
     });

     it('handles API errors gracefully', async () => {
       server.use(
         rest.get('/api/users', (req, res, ctx) => {
           return res(ctx.status(500), ctx.json({ error: 'Server error' }));
         })
       );

       render(<UserList />);

       await waitFor(() => {
         expect(screen.getByText('Failed to load users')).toBeInTheDocument();
       });
     });
   });

End-to-End Testing
------------------

Playwright E2E Tests
~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { test, expect } from '@playwright/test';

   test.describe('User Registration Flow', () => {
     test('completes full registration process', async ({ page }) => {
       await page.goto('/register');

       // Fill personal information
       await page.fill('[data-testid="first-name"]', 'John');
       await page.fill('[data-testid="last-name"]', 'Doe');
       await page.click('[data-testid="next-button"]');

       // Fill contact information
       await page.fill('[data-testid="email"]', 'john@example.com');
       await page.fill('[data-testid="phone"]', '+44 20 1234 5678');
       await page.click('[data-testid="next-button"]');

       // Upload file
       await page.setInputFiles('[data-testid="file-upload"]', 'test-files/resume.pdf');
       await page.click('[data-testid="submit-button"]');

       // Verify success
       await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
       await expect(page).toHaveURL('/dashboard');
     });

     test('validates form fields', async ({ page }) => {
       await page.goto('/register');

       // Try to proceed without filling required fields
       await page.click('[data-testid="next-button"]');

       // Check for validation errors
       await expect(page.locator('[data-testid="first-name-error"]')).toBeVisible();
       await expect(page.locator('[data-testid="last-name-error"]')).toBeVisible();
     });
   });

Cross-Browser Testing
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { devices } from '@playwright/test';

   const config = {
     projects: [
       {
         name: 'chromium',
         use: { ...devices['Desktop Chrome'] },
       },
       {
         name: 'firefox',
         use: { ...devices['Desktop Firefox'] },
       },
       {
         name: 'webkit',
         use: { ...devices['Desktop Safari'] },
       },
       {
         name: 'mobile-chrome',
         use: { ...devices['Pixel 5'] },
       },
       {
         name: 'mobile-safari',
         use: { ...devices['iPhone 12'] },
       },
     ],
   };

   test.describe('Cross-browser compatibility', () => {
     test('navigation works on all browsers', async ({ page }) => {
       await page.goto('/');
       
       await page.click('[data-testid="menu-toggle"]');
       await expect(page.locator('[data-testid="navigation-menu"]')).toBeVisible();
       
       await page.click('[data-testid="dashboard-link"]');
       await expect(page).toHaveURL('/dashboard');
     });
   });

Visual Regression Testing
-------------------------

Storybook Visual Testing
~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { test, expect } from '@playwright/test';

   test.describe('Visual Regression', () => {
     test('button variants look correct', async ({ page }) => {
       await page.goto('/storybook/?path=/story/button--all-variants');
       
       await expect(page).toHaveScreenshot('button-variants.png');
     });

     test('form components in different states', async ({ page }) => {
       await page.goto('/storybook/?path=/story/form--with-validation');
       
       // Test default state
       await expect(page).toHaveScreenshot('form-default.png');
       
       // Test error state
       await page.click('[data-testid="trigger-validation"]');
       await expect(page).toHaveScreenshot('form-errors.png');
     });

     test('dark theme components', async ({ page }) => {
       await page.goto('/storybook/?path=/story/button--primary');
       await page.emulateMedia({ colorScheme: 'dark' });
       
       await expect(page).toHaveScreenshot('button-dark-theme.png');
     });
   });

Testing Utilities
-----------------

Custom Render Function
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { render as rtlRender } from '@testing-library/react';
   import { NextIntlProvider } from 'next-intl';
   import { ThemeProvider } from '@/components/ui/theme-provider';

   function render(
     ui: React.ReactElement,
     {
       locale = 'en-GB',
       messages = {},
       theme = 'light',
       ...renderOptions
     } = {}
   ) {
     function Wrapper({ children }: { children: React.ReactNode }) {
       return (
         <NextIntlProvider locale={locale} messages={messages}>
           <ThemeProvider defaultTheme={theme}>
             {children}
           </ThemeProvider>
         </NextIntlProvider>
       );
     }

     return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
   }

   // Re-export everything
   export * from '@testing-library/react';
   export { render };

Test Data Factories
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Test data factories for consistent test data
   export const createUser = (overrides = {}) => ({
     id: Math.random().toString(36),
     name: 'John Doe',
     email: 'john@example.com',
     role: 'user',
     createdAt: new Date().toISOString(),
     ...overrides,
   });

   export const createProduct = (overrides = {}) => ({
     id: Math.random().toString(36),
     name: 'Test Product',
     price: 99.99,
     category: 'electronics',
     inStock: true,
     ...overrides,
   });

   // Usage in tests
   test('displays user information', () => {
     const user = createUser({ name: 'Jane Smith', role: 'admin' });
     render(<UserCard user={user} />);
     
     expect(screen.getByText('Jane Smith')).toBeInTheDocument();
     expect(screen.getByText('admin')).toBeInTheDocument();
   });

Continuous Integration
----------------------

GitHub Actions Configuration
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: yaml

   name: Test Suite
   
   on: [push, pull_request]
   
   jobs:
     test:
       runs-on: ubuntu-latest
       
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
             
         - run: npm ci
         - run: npm run test:unit
         - run: npm run test:accessibility
         - run: npm run test:e2e
         
         - name: Upload coverage
           uses: codecov/codecov-action@v3
           with:
             file: ./coverage/lcov.info

Test Coverage Requirements
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: json

   {
     "jest": {
       "coverageThreshold": {
         "global": {
           "branches": 80,
           "functions": 80,
           "lines": 80,
           "statements": 80
         },
         "./src/components/": {
           "branches": 90,
           "functions": 90,
           "lines": 90,
           "statements": 90
         }
       }
     }
   }

Best Practices
--------------

Testing Guidelines
~~~~~~~~~~~~~~~~~~

1. **Test User Behavior**: Focus on what users do, not implementation details
2. **Accessibility First**: Include accessibility tests for every component
3. **Real Data**: Use realistic test data that matches production scenarios
4. **Error Scenarios**: Test error states and edge cases
5. **Performance**: Include performance tests for critical components

Common Patterns
~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Good: Test user behavior
   test('allows user to submit form', async () => {
     const user = userEvent.setup();
     render(<ContactForm />);
     
     await user.type(screen.getByLabelText(/name/i), 'John');
     await user.click(screen.getByRole('button', { name: /submit/i }));
     
     expect(screen.getByText('Form submitted')).toBeInTheDocument();
   });

   // Avoid: Testing implementation details
   test('calls handleSubmit when form is submitted', () => {
     const handleSubmit = jest.fn();
     render(<ContactForm onSubmit={handleSubmit} />);
     
     // This tests implementation, not user behavior
     expect(handleSubmit).toHaveBeenCalled();
   });

Debugging Tests
~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Debug failing tests
   test('debug example', () => {
     const { debug } = render(<MyComponent />);
     
     // Print current DOM
     debug();
     
     // Print specific element
     debug(screen.getByRole('button'));
     
     // Use screen.logTestingPlaygroundURL() for interactive debugging
     screen.logTestingPlaygroundURL();
   });

Running Tests
-------------

Test Scripts
~~~~~~~~~~~~

.. code-block:: json

   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage",
       "test:accessibility": "jest --testNamePattern='accessibility'",
       "test:e2e": "playwright test",
       "test:visual": "playwright test --grep='visual'",
       "test:ci": "jest --ci --coverage --watchAll=false"
     }
   }

Test Configuration
~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

   // jest.config.js
   module.exports = {
     testEnvironment: 'jsdom',
     setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
     moduleNameMapping: {
       '^@/(.*)$': '<rootDir>/src/$1',
     },
     collectCoverageFrom: [
       'src/components/**/*.{ts,tsx}',
       '!src/components/**/*.stories.{ts,tsx}',
       '!src/components/**/*.test.{ts,tsx}',
     ],
     coverageReporters: ['text', 'lcov', 'html'],
   };

The comprehensive testing strategy ensures that all components are reliable, accessible, and performant across different browsers, devices, and locales.
