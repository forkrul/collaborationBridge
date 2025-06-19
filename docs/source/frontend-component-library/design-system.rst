Design System
=============

The Frontend Component Library is built on a comprehensive design system that ensures consistency, accessibility, and scalability across all components.

Design Tokens
-------------

Colors
~~~~~~

The color system is built around semantic color tokens that adapt to light and dark themes:

Primary Colors
^^^^^^^^^^^^^^

.. code-block:: css

   --primary: 222.2 84% 4.9%;           /* Primary brand color */
   --primary-foreground: 210 40% 98%;   /* Text on primary */
   --secondary: 210 40% 96%;            /* Secondary actions */
   --secondary-foreground: 222.2 84% 4.9%; /* Text on secondary */

Neutral Colors
^^^^^^^^^^^^^^

.. code-block:: css

   --background: 0 0% 100%;             /* Page background */
   --foreground: 222.2 84% 4.9%;       /* Primary text */
   --muted: 210 40% 96%;                /* Muted backgrounds */
   --muted-foreground: 215.4 16.3% 46.9%; /* Muted text */
   --card: 0 0% 100%;                   /* Card backgrounds */
   --card-foreground: 222.2 84% 4.9%;  /* Card text */

Semantic Colors
^^^^^^^^^^^^^^^

.. code-block:: css

   --destructive: 0 84.2% 60.2%;       /* Error/danger */
   --destructive-foreground: 210 40% 98%; /* Text on destructive */
   --border: 214.3 31.8% 91.4%;        /* Border color */
   --input: 214.3 31.8% 91.4%;         /* Input borders */
   --ring: 222.2 84% 4.9%;             /* Focus rings */

Typography
~~~~~~~~~~

Font Family
^^^^^^^^^^^

The design system uses Inter as the primary font family:

.. code-block:: css

   --font-inter: 'Inter', sans-serif;

Font Sizes
^^^^^^^^^^^

.. code-block:: css

   text-xs: 0.75rem;     /* 12px */
   text-sm: 0.875rem;    /* 14px */
   text-base: 1rem;      /* 16px */
   text-lg: 1.125rem;    /* 18px */
   text-xl: 1.25rem;     /* 20px */
   text-2xl: 1.5rem;     /* 24px */
   text-3xl: 1.875rem;   /* 30px */
   text-4xl: 2.25rem;    /* 36px */

Font Weights
^^^^^^^^^^^^

.. code-block:: css

   font-normal: 400;
   font-medium: 500;
   font-semibold: 600;
   font-bold: 700;

Spacing
~~~~~~~

The spacing system follows a consistent scale:

.. code-block:: css

   0: 0px;
   1: 0.25rem;    /* 4px */
   2: 0.5rem;     /* 8px */
   3: 0.75rem;    /* 12px */
   4: 1rem;       /* 16px */
   5: 1.25rem;    /* 20px */
   6: 1.5rem;     /* 24px */
   8: 2rem;       /* 32px */
   10: 2.5rem;    /* 40px */
   12: 3rem;      /* 48px */
   16: 4rem;      /* 64px */
   20: 5rem;      /* 80px */
   24: 6rem;      /* 96px */

Border Radius
~~~~~~~~~~~~~

.. code-block:: css

   rounded-none: 0px;
   rounded-sm: 0.125rem;    /* 2px */
   rounded: 0.25rem;        /* 4px */
   rounded-md: 0.375rem;    /* 6px */
   rounded-lg: 0.5rem;      /* 8px */
   rounded-xl: 0.75rem;     /* 12px */
   rounded-2xl: 1rem;       /* 16px */
   rounded-full: 9999px;

Shadows
~~~~~~~

.. code-block:: css

   shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
   shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
   shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
   shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

Component Patterns
------------------

Button Variants
~~~~~~~~~~~~~~~

The button component follows a consistent pattern across variants:

.. code-block:: typescript

   // Primary action
   <Button variant="default">Save Changes</Button>

   // Secondary action
   <Button variant="secondary">Cancel</Button>

   // Destructive action
   <Button variant="destructive">Delete</Button>

   // Subtle action
   <Button variant="ghost">Edit</Button>

   // Outlined action
   <Button variant="outline">Learn More</Button>

Size Variants
^^^^^^^^^^^^^

.. code-block:: typescript

   <Button size="sm">Small</Button>
   <Button size="default">Default</Button>
   <Button size="lg">Large</Button>
   <Button size="icon"><Icon /></Button>

Form Patterns
~~~~~~~~~~~~~

Consistent form structure across all form components:

.. code-block:: typescript

   <FormItem>
     <FormLabel>Field Label</FormLabel>
     <FormControl>
       <Input placeholder="Placeholder text" />
     </FormControl>
     <FormDescription>
       Optional help text
     </FormDescription>
     <FormMessage />
   </FormItem>

Card Patterns
~~~~~~~~~~~~~

Standard card structure for content containers:

.. code-block:: typescript

   <Card>
     <CardHeader>
       <CardTitle>Card Title</CardTitle>
       <CardDescription>Card description</CardDescription>
     </CardHeader>
     <CardContent>
       {/* Card content */}
     </CardContent>
   </Card>

Responsive Design
-----------------

Breakpoints
~~~~~~~~~~~

The design system uses mobile-first responsive breakpoints:

.. code-block:: css

   sm: 640px;     /* Small devices */
   md: 768px;     /* Medium devices */
   lg: 1024px;    /* Large devices */
   xl: 1280px;    /* Extra large devices */
   2xl: 1536px;   /* 2X large devices */

Responsive Patterns
~~~~~~~~~~~~~~~~~~~

Grid Layouts
^^^^^^^^^^^^

.. code-block:: typescript

   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {/* Grid items */}
   </div>

Flex Layouts
^^^^^^^^^^^^

.. code-block:: typescript

   <div className="flex flex-col md:flex-row items-center justify-between">
     {/* Flex items */}
   </div>

Container Patterns
^^^^^^^^^^^^^^^^^^

.. code-block:: typescript

   <div className="container mx-auto px-4 py-8">
     {/* Content */}
   </div>

Accessibility Guidelines
------------------------

Color Contrast
~~~~~~~~~~~~~~

All color combinations meet WCAG 2.1 AA standards:

* **Normal text**: Minimum 4.5:1 contrast ratio
* **Large text**: Minimum 3:1 contrast ratio
* **UI components**: Minimum 3:1 contrast ratio

Focus Management
~~~~~~~~~~~~~~~~

Consistent focus indicators across all interactive elements:

.. code-block:: css

   focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2

Semantic HTML
~~~~~~~~~~~~~

All components use proper semantic HTML elements:

* Buttons use ``<button>`` elements
* Links use ``<a>`` elements
* Form controls use appropriate input types
* Headings follow hierarchical order

ARIA Attributes
~~~~~~~~~~~~~~~

Components include appropriate ARIA attributes:

* ``aria-label`` for accessible names
* ``aria-describedby`` for descriptions
* ``aria-expanded`` for collapsible content
* ``role`` attributes where needed

Animation and Transitions
-------------------------

Motion Principles
~~~~~~~~~~~~~~~~~

* **Purposeful**: Animations serve a functional purpose
* **Responsive**: Respect user preferences for reduced motion
* **Consistent**: Use consistent timing and easing
* **Subtle**: Avoid distracting or excessive motion

Transition Classes
~~~~~~~~~~~~~~~~~~

.. code-block:: css

   transition-colors: color, background-color, border-color;
   transition-all: all properties;
   duration-150: 150ms;
   duration-200: 200ms;
   duration-300: 300ms;
   ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

Component States
~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Hover states
   hover:bg-accent hover:text-accent-foreground

   // Focus states
   focus:outline-none focus:ring-2 focus:ring-ring

   // Active states
   active:scale-95

   // Disabled states
   disabled:pointer-events-none disabled:opacity-50

Dark Mode Support
-----------------

Theme Variables
~~~~~~~~~~~~~~~

Dark mode is implemented using CSS custom properties:

.. code-block:: css

   .dark {
     --background: 222.2 84% 4.9%;
     --foreground: 210 40% 98%;
     --primary: 210 40% 98%;
     --primary-foreground: 222.2 84% 4.9%;
     /* ... other dark mode variables */
   }

Theme Toggle
~~~~~~~~~~~~

The theme system supports three modes:

* **Light**: Explicit light theme
* **Dark**: Explicit dark theme  
* **System**: Follows system preference

Implementation
^^^^^^^^^^^^^^

.. code-block:: typescript

   import { ThemeProvider } from '@/components/ui/theme-provider';

   <ThemeProvider
     attribute="class"
     defaultTheme="system"
     enableSystem
   >
     <App />
   </ThemeProvider>

Internationalization Design
---------------------------

Text Expansion
~~~~~~~~~~~~~~

Components accommodate text expansion across languages:

* **German**: Up to 30% longer than English
* **Romance languages**: 15-20% longer
* **Asian languages**: Often shorter but may need more vertical space

Number Formatting
~~~~~~~~~~~~~~~~~

Components respect locale-specific number formatting:

.. code-block:: typescript

   // English: 1,234.56
   // German: 1.234,56
   // Swiss: 1'234.56

Date Formatting
~~~~~~~~~~~~~~~

Date formats adapt to locale conventions:

.. code-block:: typescript

   // US: MM/DD/YYYY
   // UK: DD/MM/YYYY
   // ISO: YYYY-MM-DD

Currency Formatting
~~~~~~~~~~~~~~~~~~~

Currency displays follow local conventions:

.. code-block:: typescript

   // USD: $1,234.56
   // EUR: €1.234,56
   // GBP: £1,234.56

Design System Evolution
-----------------------

Versioning
~~~~~~~~~~

The design system follows semantic versioning:

* **Major**: Breaking changes to design tokens
* **Minor**: New tokens or components
* **Patch**: Bug fixes and refinements

Documentation
~~~~~~~~~~~~~

All design decisions are documented with:

* **Rationale**: Why the decision was made
* **Usage guidelines**: How to apply correctly
* **Examples**: Practical implementation
* **Accessibility notes**: A11y considerations

Governance
~~~~~~~~~~

Design system changes follow a review process:

1. **Proposal**: Document the change and rationale
2. **Review**: Team review for consistency and impact
3. **Implementation**: Update tokens and components
4. **Documentation**: Update guides and examples
5. **Migration**: Provide migration path if needed
