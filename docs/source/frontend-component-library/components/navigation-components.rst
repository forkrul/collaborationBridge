Navigation Components
=====================

Navigation components provide wayfinding and navigation functionality with internationalization and accessibility support.

Header
------

Application header component with navigation, user menu, and language switching.

Usage
~~~~~

.. code-block:: typescript

   import { Header } from '@/components/layout/Header';

   // Basic usage
   <Header />

   // With custom className
   <Header className="border-b-2" />

Features
~~~~~~~~

* **Responsive Navigation**: Collapses to hamburger menu on mobile
* **User Menu**: Dropdown menu with profile, settings, and logout
* **Language Switcher**: Integrated language selection
* **Active State**: Highlights current page in navigation
* **Accessibility**: Full keyboard navigation and screen reader support

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - className
     - string
     - undefined
     - Additional CSS classes

Navigation Structure
~~~~~~~~~~~~~~~~~~~~

The header includes these navigation items by default:

.. code-block:: typescript

   const navigation = [
     { name: t('home'), href: '/' },
     { name: t('dashboard'), href: '/dashboard' },
     { name: 'API Docs', href: '/docs' },
   ];

Customization
~~~~~~~~~~~~~

To customize navigation items, modify the navigation array in the Header component:

.. code-block:: typescript

   // Custom navigation items
   const customNavigation = [
     { name: 'Products', href: '/products' },
     { name: 'Services', href: '/services' },
     { name: 'About', href: '/about' },
     { name: 'Contact', href: '/contact' },
   ];

Sidebar
-------

Collapsible sidebar navigation component with icons and state management.

Usage
~~~~~

.. code-block:: typescript

   import { Sidebar } from '@/components/layout/Sidebar';

   // Basic usage
   <Sidebar />

   // With custom className
   <Sidebar className="bg-gray-50" />

Features
~~~~~~~~

* **Collapsible**: Toggle between expanded and collapsed states
* **Icons**: Each navigation item includes an icon
* **Active State**: Highlights current page
* **Badges**: Optional badges for navigation items
* **Responsive**: Adapts to mobile screens
* **Accessibility**: Full keyboard navigation

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - className
     - string
     - undefined
     - Additional CSS classes

Navigation Items
~~~~~~~~~~~~~~~~

Default navigation structure:

.. code-block:: typescript

   const navigation = [
     { name: t('home'), href: '/', icon: Home },
     { name: t('dashboard'), href: '/dashboard', icon: BarChart3 },
     { name: 'Users', href: '/users', icon: Users },
     { name: 'Reports', href: '/reports', icon: FileText },
     { name: t('settings'), href: '/settings', icon: Settings },
   ];

Adding Badges
~~~~~~~~~~~~~

.. code-block:: typescript

   // Navigation item with badge
   {
     name: 'Messages',
     href: '/messages',
     icon: Mail,
     badge: '3' // Shows notification count
   }

NavigationMenu
--------------

Dropdown navigation menu component with keyboard navigation and accessibility.

Usage
~~~~~

.. code-block:: typescript

   import {
     NavigationMenu,
     NavigationMenuContent,
     NavigationMenuItem,
     NavigationMenuLink,
     NavigationMenuList,
     NavigationMenuTrigger,
   } from '@/components/ui/navigation-menu';

   <NavigationMenu>
     <NavigationMenuList>
       <NavigationMenuItem>
         <NavigationMenuTrigger>Products</NavigationMenuTrigger>
         <NavigationMenuContent>
           <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
             <li className="row-span-3">
               <NavigationMenuLink asChild>
                 <a href="/products/featured">
                   <div className="mb-2 mt-4 text-lg font-medium">
                     Featured Product
                   </div>
                   <p className="text-sm leading-tight text-muted-foreground">
                     Our most popular product with advanced features.
                   </p>
                 </a>
               </NavigationMenuLink>
             </li>
             <li>
               <NavigationMenuLink asChild>
                 <a href="/products/basic">Basic Plan</a>
               </NavigationMenuLink>
             </li>
             <li>
               <NavigationMenuLink asChild>
                 <a href="/products/pro">Pro Plan</a>
               </NavigationMenuLink>
             </li>
           </ul>
         </NavigationMenuContent>
       </NavigationMenuItem>
     </NavigationMenuList>
   </NavigationMenu>

Components
~~~~~~~~~~

NavigationMenu
^^^^^^^^^^^^^^

Root container for the navigation menu.

NavigationMenuList
^^^^^^^^^^^^^^^^^^

Container for navigation menu items.

NavigationMenuItem
^^^^^^^^^^^^^^^^^^

Individual navigation menu item.

NavigationMenuTrigger
^^^^^^^^^^^^^^^^^^^^^

Trigger button for dropdown content.

NavigationMenuContent
^^^^^^^^^^^^^^^^^^^^^

Dropdown content container.

NavigationMenuLink
^^^^^^^^^^^^^^^^^^

Link component for navigation items.

Features
~~~~~~~~

* **Keyboard Navigation**: Arrow keys, Enter, Escape support
* **Hover Interactions**: Smooth hover states
* **Focus Management**: Proper focus handling
* **Accessibility**: ARIA attributes and roles
* **Responsive**: Adapts to different screen sizes

Breadcrumb
----------

Hierarchical navigation component showing the current page's location.

Usage
~~~~~

.. code-block:: typescript

   import {
     Breadcrumb,
     BreadcrumbEllipsis,
     BreadcrumbItem,
     BreadcrumbLink,
     BreadcrumbList,
     BreadcrumbPage,
     BreadcrumbSeparator,
   } from '@/components/ui/breadcrumb';

   <Breadcrumb>
     <BreadcrumbList>
       <BreadcrumbItem>
         <BreadcrumbLink href="/">Home</BreadcrumbLink>
       </BreadcrumbItem>
       <BreadcrumbSeparator />
       <BreadcrumbItem>
         <BreadcrumbLink href="/products">Products</BreadcrumbLink>
       </BreadcrumbItem>
       <BreadcrumbSeparator />
       <BreadcrumbItem>
         <BreadcrumbPage>Laptop</BreadcrumbPage>
       </BreadcrumbItem>
     </BreadcrumbList>
   </Breadcrumb>

Components
~~~~~~~~~~

Breadcrumb
^^^^^^^^^^

Root container for the breadcrumb navigation.

BreadcrumbList
^^^^^^^^^^^^^^

Container for breadcrumb items.

BreadcrumbItem
^^^^^^^^^^^^^^

Individual breadcrumb item.

BreadcrumbLink
^^^^^^^^^^^^^^

Link component for navigable breadcrumb items.

BreadcrumbPage
^^^^^^^^^^^^^^

Current page indicator (non-clickable).

BreadcrumbSeparator
^^^^^^^^^^^^^^^^^^^

Visual separator between breadcrumb items.

BreadcrumbEllipsis
^^^^^^^^^^^^^^^^^^

Ellipsis indicator for collapsed breadcrumb items.

Advanced Usage
~~~~~~~~~~~~~~

.. code-block:: typescript

   // With ellipsis for long paths
   <Breadcrumb>
     <BreadcrumbList>
       <BreadcrumbItem>
         <BreadcrumbLink href="/">Home</BreadcrumbLink>
       </BreadcrumbItem>
       <BreadcrumbSeparator />
       <BreadcrumbItem>
         <BreadcrumbEllipsis />
       </BreadcrumbItem>
       <BreadcrumbSeparator />
       <BreadcrumbItem>
         <BreadcrumbLink href="/category">Category</BreadcrumbLink>
       </BreadcrumbItem>
       <BreadcrumbSeparator />
       <BreadcrumbItem>
         <BreadcrumbPage>Current Page</BreadcrumbPage>
       </BreadcrumbItem>
     </BreadcrumbList>
   </Breadcrumb>

   // Dynamic breadcrumbs
   function DynamicBreadcrumb({ path }: { path: string[] }) {
     return (
       <Breadcrumb>
         <BreadcrumbList>
           {path.map((segment, index) => (
             <React.Fragment key={segment}>
               <BreadcrumbItem>
                 {index === path.length - 1 ? (
                   <BreadcrumbPage>{segment}</BreadcrumbPage>
                 ) : (
                   <BreadcrumbLink href={`/${path.slice(0, index + 1).join('/')}`}>
                     {segment}
                   </BreadcrumbLink>
                 )}
               </BreadcrumbItem>
               {index < path.length - 1 && <BreadcrumbSeparator />}
             </React.Fragment>
           ))}
         </BreadcrumbList>
       </Breadcrumb>
     );
   }

Layout Patterns
---------------

App Layout with Header and Sidebar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { Header } from '@/components/layout/Header';
   import { Sidebar } from '@/components/layout/Sidebar';

   export default function AppLayout({ children }: { children: React.ReactNode }) {
     return (
       <div className="min-h-screen bg-background">
         <Header />
         <div className="flex">
           <Sidebar />
           <main className="flex-1 p-6">
             <div className="max-w-7xl mx-auto">
               {children}
             </div>
           </main>
         </div>
       </div>
     );
   }

Dashboard Layout
~~~~~~~~~~~~~~~~

.. code-block:: typescript

   export default function DashboardLayout({ children }: { children: React.ReactNode }) {
     return (
       <div className="min-h-screen bg-background">
         <Header />
         <div className="flex">
           <Sidebar />
           <main className="flex-1 p-6">
             {/* Breadcrumb navigation */}
             <Breadcrumb className="mb-6">
               <BreadcrumbList>
                 <BreadcrumbItem>
                   <BreadcrumbLink href="/">Home</BreadcrumbLink>
                 </BreadcrumbItem>
                 <BreadcrumbSeparator />
                 <BreadcrumbItem>
                   <BreadcrumbPage>Dashboard</BreadcrumbPage>
                 </BreadcrumbItem>
               </BreadcrumbList>
             </Breadcrumb>
             
             {/* Page content */}
             {children}
           </main>
         </div>
       </div>
     );
   }

Responsive Behavior
-------------------

Mobile Navigation
~~~~~~~~~~~~~~~~~

On mobile devices:

* **Header**: Navigation collapses to hamburger menu
* **Sidebar**: Becomes an overlay that can be toggled
* **Breadcrumbs**: May truncate or wrap on small screens
* **Navigation Menu**: Adapts to touch interactions

Breakpoint Behavior
~~~~~~~~~~~~~~~~~~~

.. code-block:: css

   /* Mobile (< 768px) */
   .sidebar {
     position: fixed;
     transform: translateX(-100%);
     transition: transform 0.3s ease;
   }

   .sidebar.open {
     transform: translateX(0);
   }

   /* Desktop (>= 768px) */
   @media (min-width: 768px) {
     .sidebar {
       position: relative;
       transform: translateX(0);
     }
   }

Internationalization
--------------------

All navigation components support internationalization:

.. code-block:: typescript

   import { useTranslations } from 'next-intl';

   function LocalizedNavigation() {
     const t = useTranslations('navigation');

     return (
       <NavigationMenu>
         <NavigationMenuList>
           <NavigationMenuItem>
             <NavigationMenuLink href="/dashboard">
               {t('dashboard')}
             </NavigationMenuLink>
           </NavigationMenuItem>
           <NavigationMenuItem>
             <NavigationMenuLink href="/settings">
               {t('settings')}
             </NavigationMenuLink>
           </NavigationMenuItem>
         </NavigationMenuList>
       </NavigationMenu>
     );
   }

Translation Keys
~~~~~~~~~~~~~~~~

Common translation keys used in navigation components:

.. code-block:: json

   {
     "navigation": {
       "home": "Home",
       "dashboard": "Dashboard",
       "settings": "Settings",
       "profile": "Profile",
       "logout": "Logout",
       "menu": "Menu",
       "close": "Close"
     }
   }

Accessibility
-------------

Navigation components follow WCAG 2.1 AA guidelines:

* **Keyboard Navigation**: Full keyboard support with arrow keys
* **Screen Readers**: Proper ARIA labels and landmarks
* **Focus Management**: Logical focus order and visible indicators
* **Semantic HTML**: Proper use of nav, ul, li elements
* **Skip Links**: Support for skip navigation links

ARIA Attributes
~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Navigation landmark
   <nav aria-label="Main navigation">
     <ul role="menubar">
       <li role="none">
         <a role="menuitem" href="/dashboard">Dashboard</a>
       </li>
     </ul>
   </nav>

   // Breadcrumb navigation
   <nav aria-label="Breadcrumb">
     <ol>
       <li><a href="/">Home</a></li>
       <li aria-current="page">Current Page</li>
     </ol>
   </nav>

Testing
-------

Navigation components include comprehensive tests:

* **Rendering**: Components render correctly with all variants
* **Navigation**: Links and navigation work as expected
* **Responsive**: Mobile and desktop behavior
* **Accessibility**: ARIA attributes and keyboard navigation
* **Internationalization**: Translation integration works correctly
