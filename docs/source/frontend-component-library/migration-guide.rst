Migration Guide
===============

This guide helps you migrate between versions of the Frontend Component Library and provides upgrade paths for breaking changes.

Version 2.0.0 (Current)
------------------------

Major Changes
~~~~~~~~~~~~~

Version 2.0.0 introduces several breaking changes and new features:

**New Components Added:**
- FileUpload with drag & drop support
- MultiStepForm with progress tracking
- Chart with locale-aware formatting
- SearchWithFilters with advanced filtering
- Badge for status indicators
- Popover for overlay content

**Breaking Changes:**
- Removed deprecated `variant="ghost"` from Card component
- Updated Button component API for better accessibility
- Changed theme system to use CSS custom properties
- Restructured form validation to use Zod schemas

**New Features:**
- Complete internationalization support for 6 languages
- Dark/light/system theme support
- Advanced accessibility features (WCAG 2.1 AA)
- Performance optimizations and bundle size reduction

Migration Steps
~~~~~~~~~~~~~~~

1. **Update Dependencies**

.. code-block:: bash

   npm install @radix-ui/react-popover@latest
   npm install @hookform/resolvers@latest
   npm install zod@latest

2. **Update Button Components**

.. code-block:: typescript

   // Before (v1.x)
   <Button variant="ghost" size="small">
     Click me
   </Button>

   // After (v2.0)
   <Button variant="ghost" size="sm">
     Click me
   </Button>

3. **Update Form Validation**

.. code-block:: typescript

   // Before (v1.x) - Manual validation
   const validateForm = (data) => {
     const errors = {};
     if (!data.email) errors.email = 'Email is required';
     if (!data.email.includes('@')) errors.email = 'Invalid email';
     return errors;
   };

   // After (v2.0) - Zod schema validation
   import * as z from 'zod';

   const formSchema = z.object({
     email: z.string().email('Invalid email address'),
     name: z.string().min(2, 'Name must be at least 2 characters'),
   });

   const form = useForm({
     resolver: zodResolver(formSchema),
   });

4. **Update Theme Provider**

.. code-block:: typescript

   // Before (v1.x)
   <ThemeProvider theme="dark">
     <App />
   </ThemeProvider>

   // After (v2.0)
   <ThemeProvider
     attribute="class"
     defaultTheme="system"
     enableSystem
   >
     <App />
   </ThemeProvider>

5. **Update Internationalization**

.. code-block:: typescript

   // Before (v1.x) - react-i18next
   import { useTranslation } from 'react-i18next';

   function MyComponent() {
     const { t } = useTranslation();
     return <Button>{t('save')}</Button>;
   }

   // After (v2.0) - next-intl
   import { useTranslations } from 'next-intl';

   function MyComponent() {
     const t = useTranslations('common');
     return <Button>{t('save')}</Button>;
   }

Version 1.5.0 to 2.0.0
-----------------------

Component API Changes
~~~~~~~~~~~~~~~~~~~~~

Button Component
^^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 30 30 40

   * - v1.5.0
     - v2.0.0
     - Migration
   * - size="small"
     - size="sm"
     - Update size prop values
   * - size="large"
     - size="lg"
     - Update size prop values
   * - loading={true}
     - loading={true}
     - No change required

.. code-block:: typescript

   // Migration example
   // Before
   <Button size="small" variant="outline">
     Small Button
   </Button>

   // After
   <Button size="sm" variant="outline">
     Small Button
   </Button>

Form Components
^^^^^^^^^^^^^^^

.. list-table::
   :header-rows: 1
   :widths: 30 30 40

   * - v1.5.0
     - v2.0.0
     - Migration
   * - Manual validation
     - Zod schema validation
     - Implement schema-based validation
   * - Custom error handling
     - FormMessage component
     - Use FormMessage for errors
   * - Basic form structure
     - FormField wrapper
     - Wrap inputs in FormField

.. code-block:: typescript

   // Before (v1.5.0)
   function ContactForm() {
     const [errors, setErrors] = useState({});

     const validate = (data) => {
       const newErrors = {};
       if (!data.email) newErrors.email = 'Required';
       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
     };

     return (
       <form>
         <label>Email</label>
         <input type="email" />
         {errors.email && <span className="error">{errors.email}</span>}
       </form>
     );
   }

   // After (v2.0.0)
   const schema = z.object({
     email: z.string().email('Invalid email'),
   });

   function ContactForm() {
     const form = useForm({
       resolver: zodResolver(schema),
     });

     return (
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)}>
           <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Email</FormLabel>
                 <FormControl>
                   <Input {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
         </form>
       </Form>
     );
   }

Theme System Changes
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1
   :widths: 30 30 40

   * - v1.5.0
     - v2.0.0
     - Migration
   * - CSS classes for themes
     - CSS custom properties
     - Update theme implementation
   * - Manual theme switching
     - ThemeProvider + ThemeToggle
     - Use provided theme components
   * - Limited theme options
     - Light/Dark/System themes
     - Update theme configuration

.. code-block:: typescript

   // Before (v1.5.0)
   function App() {
     const [theme, setTheme] = useState('light');

     return (
       <div className={`app ${theme}`}>
         <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
           Toggle Theme
         </button>
         <Content />
       </div>
     );
   }

   // After (v2.0.0)
   function App() {
     return (
       <ThemeProvider defaultTheme="system" enableSystem>
         <div className="app">
           <ThemeToggle />
           <Content />
         </div>
       </ThemeProvider>
     );
   }

Automated Migration
-------------------

Migration Script
~~~~~~~~~~~~~~~~

We provide a migration script to automate common changes:

.. code-block:: bash

   # Install migration tool
   npm install -g @project-template/migrate

   # Run migration
   npx @project-template/migrate --from=1.5.0 --to=2.0.0

   # Preview changes without applying
   npx @project-template/migrate --from=1.5.0 --to=2.0.0 --dry-run

Codemod Transformations
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: javascript

   // Example codemod for Button size prop
   module.exports = function transformer(fileInfo, api) {
     const j = api.jscodeshift;
     const root = j(fileInfo.source);

     // Transform Button size props
     root
       .find(j.JSXElement, {
         openingElement: {
           name: { name: 'Button' }
         }
       })
       .find(j.JSXAttribute, {
         name: { name: 'size' }
       })
       .forEach(path => {
         const value = path.value.value;
         if (value.type === 'Literal') {
           if (value.value === 'small') {
             value.value = 'sm';
           } else if (value.value === 'large') {
             value.value = 'lg';
           }
         }
       });

     return root.toSource();
   };

Breaking Changes by Version
---------------------------

Version 2.0.0 Breaking Changes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. **Button Component**
   - Changed size prop values: `small` → `sm`, `large` → `lg`
   - Removed deprecated `ghost` variant from Card component

2. **Form System**
   - Replaced manual validation with Zod schema validation
   - Introduced FormField wrapper requirement
   - Changed error handling to use FormMessage component

3. **Theme System**
   - Migrated from CSS classes to CSS custom properties
   - Changed ThemeProvider API
   - Removed manual theme switching in favor of ThemeToggle

4. **Internationalization**
   - Migrated from react-i18next to next-intl
   - Changed translation hook from `useTranslation` to `useTranslations`
   - Updated translation file structure

5. **Dependencies**
   - Updated to React 18
   - Updated to Next.js 14
   - Added Zod for form validation
   - Added Radix UI primitives

Version 1.5.0 Breaking Changes
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

1. **Component Structure**
   - Introduced compound component patterns
   - Changed prop naming conventions
   - Updated TypeScript interfaces

2. **Styling System**
   - Migrated to Tailwind CSS
   - Removed styled-components
   - Updated class naming conventions

Deprecation Warnings
---------------------

Components and APIs marked for deprecation:

Version 2.1.0 (Planned)
~~~~~~~~~~~~~~~~~~~~~~~

- `Card` component `variant="ghost"` will be removed
- `Button` component `size="default"` will become implicit
- Legacy theme class names will be removed

Version 2.2.0 (Planned)
~~~~~~~~~~~~~~~~~~~~~~~

- Old form validation patterns will be removed
- Legacy i18n hooks will be removed
- Deprecated CSS custom properties will be removed

Migration Testing
-----------------

Test Your Migration
~~~~~~~~~~~~~~~~~~~

1. **Run Existing Tests**

.. code-block:: bash

   npm test

2. **Check for TypeScript Errors**

.. code-block:: bash

   npm run type-check

3. **Verify Visual Regression**

.. code-block:: bash

   npm run test:visual

4. **Test Accessibility**

.. code-block:: bash

   npm run test:accessibility

5. **Performance Testing**

.. code-block:: bash

   npm run test:performance

Migration Checklist
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   □ Update package.json dependencies
   □ Run migration script
   □ Update Button component size props
   □ Migrate form validation to Zod
   □ Update theme provider configuration
   □ Migrate i18n from react-i18next to next-intl
   □ Update translation files structure
   □ Test all components in isolation
   □ Test complete user flows
   □ Verify accessibility compliance
   □ Check performance metrics
   □ Update documentation
   □ Train team on new patterns

Common Migration Issues
-----------------------

TypeScript Errors
~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Common error: Property 'size' does not exist
   // Solution: Update size prop values
   <Button size="sm" /> // instead of size="small"

   // Common error: Type 'string' is not assignable to type 'never'
   // Solution: Update form validation schema
   const schema = z.object({
     email: z.string().email(),
   });

Runtime Errors
~~~~~~~~~~~~~~

.. code-block:: typescript

   // Common error: Cannot read property 'useTranslation' of undefined
   // Solution: Update i18n import
   import { useTranslations } from 'next-intl'; // instead of react-i18next

   // Common error: Theme not applied correctly
   // Solution: Wrap app in ThemeProvider
   <ThemeProvider defaultTheme="system">
     <App />
   </ThemeProvider>

Styling Issues
~~~~~~~~~~~~~~

.. code-block:: css

   /* Common issue: Theme colors not working */
   /* Solution: Use CSS custom properties */
   .my-component {
     background-color: hsl(var(--primary));
     color: hsl(var(--primary-foreground));
   }

Getting Help
------------

Support Resources
~~~~~~~~~~~~~~~~~

- **Documentation**: Comprehensive component documentation
- **Migration Tool**: Automated migration assistance
- **GitHub Issues**: Report migration problems
- **Community Discord**: Get help from the community
- **Migration Guide**: This comprehensive guide

Best Practices
~~~~~~~~~~~~~~

1. **Incremental Migration**: Migrate components one at a time
2. **Test Thoroughly**: Test each migrated component
3. **Use TypeScript**: Leverage TypeScript for migration safety
4. **Follow Patterns**: Use established patterns from the library
5. **Document Changes**: Keep track of customizations

Rollback Plan
~~~~~~~~~~~~~

If migration issues occur:

1. **Revert Dependencies**: Roll back to previous versions
2. **Restore Code**: Use version control to restore previous state
3. **Identify Issues**: Document specific problems encountered
4. **Plan Fixes**: Address issues before attempting migration again
5. **Gradual Approach**: Consider migrating smaller portions at a time

The migration process is designed to be as smooth as possible, with comprehensive tooling and documentation to support the transition to the latest version of the component library.
