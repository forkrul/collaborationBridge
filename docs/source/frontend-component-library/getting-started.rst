Getting Started
===============

This guide will help you get up and running with the Frontend Component Library quickly and efficiently.

Prerequisites
-------------

Before you begin, ensure you have the following installed:

* **Node.js**: Version 18.0 or higher
* **npm**: Version 9.0 or higher (or yarn/pnpm equivalent)
* **TypeScript**: Basic familiarity recommended

Installation
------------

The component library is already integrated into the project. To set up the development environment:

.. code-block:: bash

   # Clone the repository
   git clone <repository-url>
   cd project-template-mvp

   # Install dependencies
   cd frontend
   npm install

   # Start development server
   npm run dev

   # Open browser to http://localhost:3000

Project Structure
-----------------

Understanding the component library structure:

.. code-block:: text

   frontend/src/components/
   ├── ui/                          # Core UI components
   │   ├── button.tsx              # Button component
   │   ├── card.tsx                # Card component
   │   ├── form.tsx                # Form system
   │   ├── input.tsx               # Input component
   │   └── ...                     # Other UI components
   ├── layout/                      # Layout components
   │   ├── Header.tsx              # Application header
   │   ├── Sidebar.tsx             # Sidebar navigation
   │   └── __tests__/              # Layout tests
   ├── i18n/                       # Internationalization
   │   ├── LanguageSwitcher.tsx    # Language selection
   │   └── __tests__/              # i18n tests
   └── README.md                   # Component documentation

First Component
---------------

Let's create a simple page using our components:

.. code-block:: typescript

   // src/app/[locale]/my-page/page.tsx
   import { Button } from '@/components/ui/button';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   import { useTranslations } from 'next-intl';

   export default function MyPage() {
     const t = useTranslations('common');

     return (
       <div className="container mx-auto px-4 py-8">
         <Card>
           <CardHeader>
             <CardTitle>Welcome to the Component Library</CardTitle>
           </CardHeader>
           <CardContent>
             <p className="mb-4">
               This is your first page using our component library.
             </p>
             <Button onClick={() => alert('Hello!')}>
               {t('clickMe')}
             </Button>
           </CardContent>
         </Card>
       </div>
     );
   }

Basic Form Example
------------------

Here's how to create a form with validation:

.. code-block:: typescript

   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import * as z from 'zod';
   import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
   } from '@/components/ui/form';
   import { Input } from '@/components/ui/input';
   import { Button } from '@/components/ui/button';

   const formSchema = z.object({
     name: z.string().min(2, 'Name must be at least 2 characters'),
     email: z.string().email('Invalid email address'),
   });

   export function ContactForm() {
     const form = useForm({
       resolver: zodResolver(formSchema),
       defaultValues: { name: '', email: '' },
     });

     const onSubmit = (data) => {
       console.log(data);
     };

     return (
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField
             control={form.control}
             name="name"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Name</FormLabel>
                 <FormControl>
                   <Input placeholder="Enter your name" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           
           <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Email</FormLabel>
                 <FormControl>
                   <Input type="email" placeholder="Enter your email" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           
           <Button type="submit">Submit</Button>
         </form>
       </Form>
     );
   }

Layout with Header and Sidebar
-------------------------------

Create a layout using our layout components:

.. code-block:: typescript

   import { Header } from '@/components/layout/Header';
   import { Sidebar } from '@/components/layout/Sidebar';

   export default function AppLayout({ children }) {
     return (
       <div className="min-h-screen bg-background">
         <Header />
         <div className="flex">
           <Sidebar />
           <main className="flex-1 p-6">
             {children}
           </main>
         </div>
       </div>
     );
   }

Internationalization
--------------------

All components support internationalization:

.. code-block:: typescript

   import { useTranslations } from 'next-intl';
   import { Button } from '@/components/ui/button';
   import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

   export function InternationalizedComponent() {
     const t = useTranslations('common');

     return (
       <div>
         <h1>{t('welcome')}</h1>
         <Button>{t('save')}</Button>
         <LanguageSwitcher />
       </div>
     );
   }

Theme Support
-------------

Enable theme switching in your application:

.. code-block:: typescript

   import { ThemeProvider } from '@/components/ui/theme-provider';
   import { ThemeToggle } from '@/components/ui/theme-toggle';

   export function App() {
     return (
       <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
       >
         <div>
           <ThemeToggle />
           {/* Your app content */}
         </div>
       </ThemeProvider>
     );
   }

Development Tools
-----------------

Component Showcase
~~~~~~~~~~~~~~~~~~

Visit ``/components`` in your browser to see all components in action with interactive examples.

Forms Demo
~~~~~~~~~~

Visit ``/forms`` to see advanced form examples including:

* Complex validation
* Multi-step forms
* File uploads
* Search and filtering

Development Commands
~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   # Start development server
   npm run dev

   # Run tests
   npm test

   # Run tests with coverage
   npm test -- --coverage

   # Build for production
   npm run build

   # Type checking
   npm run type-check

   # Linting
   npm run lint

   # Format code
   npm run format

Best Practices
--------------

Component Usage
~~~~~~~~~~~~~~~

1. **Import from the correct path**: Always import from ``@/components/ui/``
2. **Use TypeScript**: Take advantage of full type safety
3. **Follow naming conventions**: Use PascalCase for components
4. **Include accessibility**: Use proper ARIA attributes
5. **Test your components**: Write tests for custom implementations

Styling Guidelines
~~~~~~~~~~~~~~~~~~

1. **Use Tailwind classes**: Leverage the design system
2. **Avoid custom CSS**: Use design tokens when possible
3. **Responsive design**: Use mobile-first approach
4. **Dark mode support**: Test in both light and dark themes
5. **Consistent spacing**: Use the spacing scale

Performance Tips
~~~~~~~~~~~~~~~~

1. **Import only what you need**: Use tree shaking effectively
2. **Lazy load heavy components**: Use dynamic imports when appropriate
3. **Optimize images**: Use Next.js Image component
4. **Monitor bundle size**: Keep track of component impact
5. **Use React.memo**: For expensive re-renders

Common Patterns
---------------

Data Tables
~~~~~~~~~~~

.. code-block:: typescript

   import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
   } from '@/components/ui/table';

   export function DataTable({ data }) {
     return (
       <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Name</TableHead>
             <TableHead>Email</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody>
           {data.map((item) => (
             <TableRow key={item.id}>
               <TableCell>{item.name}</TableCell>
               <TableCell>{item.email}</TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     );
   }

Modal Dialogs
~~~~~~~~~~~~~

.. code-block:: typescript

   import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
   } from '@/components/ui/dialog';
   import { Button } from '@/components/ui/button';

   export function ConfirmDialog() {
     return (
       <Dialog>
         <DialogTrigger asChild>
           <Button variant="destructive">Delete</Button>
         </DialogTrigger>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Confirm Deletion</DialogTitle>
             <DialogDescription>
               This action cannot be undone.
             </DialogDescription>
           </DialogHeader>
           <div className="flex justify-end space-x-2">
             <Button variant="outline">Cancel</Button>
             <Button variant="destructive">Delete</Button>
           </div>
         </DialogContent>
       </Dialog>
     );
   }

Next Steps
----------

1. **Explore Components**: Browse the :doc:`components/index` reference
2. **Learn Design System**: Read about :doc:`design-system` principles
3. **Understand Accessibility**: Review :doc:`accessibility` guidelines
4. **Master i18n**: Learn about :doc:`internationalization` features
5. **Write Tests**: Follow :doc:`testing` best practices

Troubleshooting
---------------

Common Issues
~~~~~~~~~~~~~

**TypeScript Errors**
  Ensure you're importing components from the correct paths and using proper types.

**Styling Issues**
  Check that Tailwind CSS is properly configured and classes are not being purged.

**i18n Not Working**
  Verify that the locale is properly set and translation files exist.

**Theme Not Switching**
  Ensure ThemeProvider is wrapping your application correctly.

Getting Help
~~~~~~~~~~~~

* Check the component showcase at ``/components``
* Review the comprehensive documentation
* Look at existing implementations in the codebase
* Check the test files for usage examples
