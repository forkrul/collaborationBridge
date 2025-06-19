Frontend Component Library
==========================

.. toctree::
   :maxdepth: 2
   :caption: Component Library Documentation:

   overview
   getting-started
   design-system
   components/index
   patterns/index
   accessibility
   internationalization
   testing
   performance
   migration-guide

Overview
--------

The Frontend Component Library is a comprehensive, accessible, and internationalized component system built with React, TypeScript, and Tailwind CSS. It provides 20+ production-ready components designed for modern web applications.

Key Features
~~~~~~~~~~~~

* **🌐 Full i18n Support**: All components work seamlessly with our 6-language system
* **♿ Accessibility First**: WCAG 2.1 AA compliant with proper ARIA attributes
* **🎨 Consistent Design**: Built on a cohesive design system with Tailwind CSS
* **📱 Responsive**: Mobile-first approach with responsive breakpoints
* **🎭 Theme Support**: Dark/light/system theme modes
* **⚡ Performance**: Optimized with proper code splitting and lazy loading

Supported Languages
~~~~~~~~~~~~~~~~~~~

* **Afrikaans (af)** - South African Afrikaans
* **English UK (en-GB)** - British English (default)
* **German (de)** - Standard German
* **Romanian (ro)** - Romanian
* **isiZulu (zu)** - South African Zulu
* **Swiss German (gsw-CH)** - Zürich dialect

Quick Start
-----------

.. code-block:: bash

   # Install dependencies
   npm install

   # Start development server
   npm run dev

   # View component showcase
   # Navigate to /components in your browser

Component Categories
--------------------

Base Components
~~~~~~~~~~~~~~~
Core building blocks for the application:

* Button - Various styles, sizes, and states
* Card - Content containers with headers and footers
* Input - Text inputs with validation states
* Label - Accessible form labels
* Checkbox - Checkboxes with indeterminate state

Form Components
~~~~~~~~~~~~~~~
Advanced form handling with validation:

* Form - React Hook Form integration with Zod validation
* Select - Dropdown selection with search
* Textarea - Multi-line text input
* FileUpload - Drag & drop file upload with validation
* MultiStepForm - Step-by-step form workflows

Navigation Components
~~~~~~~~~~~~~~~~~~~~~
Navigation and wayfinding:

* Header - Application header with navigation and user menu
* Sidebar - Collapsible sidebar navigation
* NavigationMenu - Dropdown navigation menus
* Breadcrumb - Hierarchical navigation

Data Display
~~~~~~~~~~~~
Components for displaying structured data:

* Table - Data tables with sorting and filtering
* Pagination - Data pagination controls
* Chart - Data visualization with locale support
* StatCard - Metrics display with trend indicators

Feedback Components
~~~~~~~~~~~~~~~~~~~
User feedback and interaction:

* Dialog - Modal dialogs and confirmations
* Progress - Progress indicators and loading states
* Badge - Status indicators and tags
* Toast - Notification system

Layout Components
~~~~~~~~~~~~~~~~~
Page structure and organization:

* ThemeProvider - Theme system management
* ThemeToggle - Theme switching component

Search & Filtering
~~~~~~~~~~~~~~~~~~
Advanced search capabilities:

* Search - Basic search component
* SearchWithFilters - Advanced search with filter system

Architecture
------------

The component library follows these architectural principles:

* **Composition over Inheritance**: Components are built using composition patterns
* **Accessibility by Default**: All components include proper ARIA attributes
* **Internationalization Ready**: Built-in support for multiple languages
* **Type Safety**: Full TypeScript support with comprehensive type definitions
* **Performance Optimized**: Code splitting and lazy loading where appropriate

Getting Help
------------

* **Component Showcase**: Visit ``/components`` for interactive examples
* **Forms Demo**: Visit ``/forms`` for advanced form examples
* **GitHub Issues**: Report bugs and request features
* **Documentation**: This comprehensive guide covers all aspects

Next Steps
----------

1. Read the :doc:`getting-started` guide
2. Explore the :doc:`design-system` principles
3. Browse the :doc:`components/index` reference
4. Learn about :doc:`accessibility` guidelines
5. Understand :doc:`internationalization` support
