Layout Components
=================

Layout components provide page structure, theme management, and overall application organization.

ThemeProvider
-------------

Theme system management component that provides dark/light/system theme support.

Usage
~~~~~

.. code-block:: typescript

   import { ThemeProvider } from '@/components/ui/theme-provider';

   function App() {
     return (
       <ThemeProvider
         attribute="class"
         defaultTheme="system"
         enableSystem
         disableTransitionOnChange
       >
         <div className="min-h-screen bg-background text-foreground">
           {/* Your app content */}
         </div>
       </ThemeProvider>
     );
   }

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - attribute
     - string
     - 'class'
     - HTML attribute to use for theme
   * - defaultTheme
     - 'light' \| 'dark' \| 'system'
     - 'system'
     - Default theme
   * - enableSystem
     - boolean
     - true
     - Enable system theme detection
   * - disableTransitionOnChange
     - boolean
     - false
     - Disable transitions when changing themes
   * - storageKey
     - string
     - 'theme'
     - localStorage key for theme persistence

Features
~~~~~~~~

* **System Detection**: Automatically detects system theme preference
* **Persistence**: Saves theme preference to localStorage
* **Smooth Transitions**: Optional smooth transitions between themes
* **CSS Variables**: Uses CSS custom properties for theme values
* **SSR Support**: Works with server-side rendering

Theme Values
~~~~~~~~~~~~

The theme system uses CSS custom properties that automatically switch between light and dark values:

.. code-block:: css

   :root {
     --background: 0 0% 100%;
     --foreground: 222.2 84% 4.9%;
     --primary: 222.2 84% 4.9%;
     --primary-foreground: 210 40% 98%;
     /* ... other light theme values */
   }

   .dark {
     --background: 222.2 84% 4.9%;
     --foreground: 210 40% 98%;
     --primary: 210 40% 98%;
     --primary-foreground: 222.2 84% 4.9%;
     /* ... other dark theme values */
   }

ThemeToggle
-----------

Theme switching component with smooth transitions and system preference support.

Usage
~~~~~

.. code-block:: typescript

   import { ThemeToggle } from '@/components/ui/theme-toggle';

   // Basic usage
   <ThemeToggle />

   // In a header or navigation
   <header className="flex items-center justify-between p-4">
     <h1>My App</h1>
     <ThemeToggle />
   </header>

Features
~~~~~~~~

* **Three Modes**: Light, dark, and system preference
* **Visual Indicators**: Sun/moon icons with smooth transitions
* **Dropdown Menu**: Clean dropdown interface for theme selection
* **Keyboard Accessible**: Full keyboard navigation support
* **Screen Reader Support**: Proper ARIA labels

Implementation
~~~~~~~~~~~~~~

.. code-block:: typescript

   import { Moon, Sun } from "lucide-react"
   import { useTheme } from "next-themes"

   export function ThemeToggle() {
     const { setTheme } = useTheme()

     return (
       <DropdownMenu>
         <DropdownMenuTrigger asChild>
           <Button variant="outline" size="icon">
             <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
             <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
             <span className="sr-only">Toggle theme</span>
           </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
           <DropdownMenuItem onClick={() => setTheme("light")}>
             Light
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => setTheme("dark")}>
             Dark
           </DropdownMenuItem>
           <DropdownMenuItem onClick={() => setTheme("system")}>
             System
           </DropdownMenuItem>
         </DropdownMenuContent>
       </DropdownMenu>
     )
   }

Custom Theme Toggle
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function CustomThemeToggle() {
     const { theme, setTheme } = useTheme();
     const [mounted, setMounted] = useState(false);

     // Avoid hydration mismatch
     useEffect(() => {
       setMounted(true);
     }, []);

     if (!mounted) {
       return null;
     }

     return (
       <div className="flex items-center space-x-2">
         <Button
           variant={theme === 'light' ? 'default' : 'outline'}
           size="sm"
           onClick={() => setTheme('light')}
         >
           <Sun className="h-4 w-4" />
         </Button>
         <Button
           variant={theme === 'dark' ? 'default' : 'outline'}
           size="sm"
           onClick={() => setTheme('dark')}
         >
           <Moon className="h-4 w-4" />
         </Button>
         <Button
           variant={theme === 'system' ? 'default' : 'outline'}
           size="sm"
           onClick={() => setTheme('system')}
         >
           <Monitor className="h-4 w-4" />
         </Button>
       </div>
     );
   }

Layout Patterns
---------------

App Layout
~~~~~~~~~~

Basic application layout with theme support:

.. code-block:: typescript

   import { ThemeProvider } from '@/components/ui/theme-provider';
   import { Header } from '@/components/layout/Header';
   import { Sidebar } from '@/components/layout/Sidebar';

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en" suppressHydrationWarning>
         <body>
           <ThemeProvider
             attribute="class"
             defaultTheme="system"
             enableSystem
           >
             <div className="min-h-screen bg-background">
               <Header />
               <div className="flex">
                 <Sidebar />
                 <main className="flex-1 p-6">
                   {children}
                 </main>
               </div>
             </div>
           </ThemeProvider>
         </body>
       </html>
     );
   }

Dashboard Layout
~~~~~~~~~~~~~~~~

Dashboard-specific layout with metrics and navigation:

.. code-block:: typescript

   export default function DashboardLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <div className="min-h-screen bg-background">
         <Header />
         <div className="flex">
           <Sidebar />
           <main className="flex-1 p-6">
             <div className="max-w-7xl mx-auto space-y-6">
               {/* Dashboard header */}
               <div className="flex items-center justify-between">
                 <h1 className="text-3xl font-bold">Dashboard</h1>
                 <ThemeToggle />
               </div>
               
               {/* Dashboard content */}
               {children}
             </div>
           </main>
         </div>
       </div>
     );
   }

Responsive Layout
~~~~~~~~~~~~~~~~~

Mobile-responsive layout with collapsible sidebar:

.. code-block:: typescript

   function ResponsiveLayout({ children }: { children: React.ReactNode }) {
     const [sidebarOpen, setSidebarOpen] = useState(false);

     return (
       <div className="min-h-screen bg-background">
         <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
         
         {/* Mobile sidebar overlay */}
         {sidebarOpen && (
           <div 
             className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
             onClick={() => setSidebarOpen(false)}
           />
         )}
         
         <div className="flex">
           {/* Sidebar */}
           <div className={cn(
             "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform md:relative md:translate-x-0",
             sidebarOpen ? "translate-x-0" : "-translate-x-full"
           )}>
             <Sidebar onClose={() => setSidebarOpen(false)} />
           </div>
           
           {/* Main content */}
           <main className="flex-1 p-6">
             {children}
           </main>
         </div>
       </div>
     );
   }

Theme Customization
-------------------

Custom Theme Colors
~~~~~~~~~~~~~~~~~~~

.. code-block:: css

   :root {
     /* Custom brand colors */
     --primary: 210 100% 50%;
     --primary-foreground: 0 0% 100%;
     
     /* Custom accent colors */
     --accent: 120 100% 50%;
     --accent-foreground: 0 0% 0%;
     
     /* Custom semantic colors */
     --success: 120 100% 40%;
     --warning: 45 100% 50%;
     --error: 0 100% 50%;
   }

   .dark {
     /* Dark theme overrides */
     --primary: 210 100% 60%;
     --accent: 120 100% 60%;
   }

Dynamic Theme Switching
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function useThemeColors() {
     const { theme } = useTheme();
     
     const colors = useMemo(() => {
       if (theme === 'dark') {
         return {
           primary: 'hsl(210 100% 60%)',
           background: 'hsl(222.2 84% 4.9%)',
           foreground: 'hsl(210 40% 98%)',
         };
       }
       
       return {
         primary: 'hsl(210 100% 50%)',
         background: 'hsl(0 0% 100%)',
         foreground: 'hsl(222.2 84% 4.9%)',
       };
     }, [theme]);
     
     return colors;
   }

   function ThemedComponent() {
     const colors = useThemeColors();
     
     return (
       <div style={{ backgroundColor: colors.background, color: colors.foreground }}>
         Themed content
       </div>
     );
   }

Theme-Aware Components
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function ThemeAwareChart() {
     const { theme } = useTheme();
     
     const chartColors = useMemo(() => {
       if (theme === 'dark') {
         return ['#60a5fa', '#34d399', '#fbbf24', '#f87171'];
       }
       return ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
     }, [theme]);
     
     return (
       <Chart
         data={data}
         colors={chartColors}
         gridColor={theme === 'dark' ? '#374151' : '#e5e7eb'}
       />
     );
   }

Container Components
--------------------

Page Container
~~~~~~~~~~~~~~

.. code-block:: typescript

   function PageContainer({ 
     children, 
     className 
   }: { 
     children: React.ReactNode;
     className?: string;
   }) {
     return (
       <div className={cn(
         "container mx-auto px-4 py-8 max-w-7xl",
         className
       )}>
         {children}
       </div>
     );
   }

Section Container
~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function Section({ 
     title, 
     description, 
     children,
     className 
   }: {
     title?: string;
     description?: string;
     children: React.ReactNode;
     className?: string;
   }) {
     return (
       <section className={cn("space-y-6", className)}>
         {(title || description) && (
           <div className="space-y-2">
             {title && (
               <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
             )}
             {description && (
               <p className="text-muted-foreground">{description}</p>
             )}
           </div>
         )}
         {children}
       </section>
     );
   }

Grid Container
~~~~~~~~~~~~~~

.. code-block:: typescript

   function GridContainer({ 
     children,
     cols = 1,
     gap = 6,
     className 
   }: {
     children: React.ReactNode;
     cols?: 1 | 2 | 3 | 4;
     gap?: number;
     className?: string;
   }) {
     return (
       <div className={cn(
         "grid",
         {
           "grid-cols-1": cols === 1,
           "grid-cols-1 md:grid-cols-2": cols === 2,
           "grid-cols-1 md:grid-cols-2 lg:grid-cols-3": cols === 3,
           "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": cols === 4,
         },
         `gap-${gap}`,
         className
       )}>
         {children}
       </div>
     );
   }

SSR Considerations
------------------

Hydration Handling
~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function ThemeAwareComponent() {
     const [mounted, setMounted] = useState(false);
     const { theme } = useTheme();

     useEffect(() => {
       setMounted(true);
     }, []);

     // Avoid hydration mismatch
     if (!mounted) {
       return <div className="h-10 w-10 bg-muted animate-pulse rounded" />;
     }

     return (
       <div className={theme === 'dark' ? 'dark-specific-class' : 'light-specific-class'}>
         Theme-dependent content
       </div>
     );
   }

Theme Script
~~~~~~~~~~~~

Add theme script to prevent flash of unstyled content:

.. code-block:: html

   <script>
     try {
       if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
         document.documentElement.classList.add('dark')
       } else {
         document.documentElement.classList.remove('dark')
       }
     } catch (_) {}
   </script>

Performance
-----------

Theme switching is optimized for performance:

* **CSS Variables**: Instant theme switching without re-rendering
* **Minimal JavaScript**: Theme logic is lightweight
* **Cached Preferences**: Theme preference is cached in localStorage
* **System Integration**: Respects system theme changes

Accessibility
-------------

Layout components follow WCAG 2.1 AA guidelines:

* **Color Contrast**: All themes meet minimum contrast requirements
* **Focus Indicators**: Visible focus indicators in all themes
* **Reduced Motion**: Respects user's motion preferences
* **Screen Readers**: Theme changes are announced to screen readers

.. code-block:: typescript

   // Accessible theme toggle
   <Button
     variant="outline"
     size="icon"
     onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
     aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
   >
     <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
     <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
   </Button>

Testing
-------

Layout components include comprehensive tests:

* **Theme Switching**: All theme modes work correctly
* **Persistence**: Theme preferences are saved and restored
* **System Integration**: System theme detection works
* **SSR**: Server-side rendering works without hydration issues
* **Accessibility**: ARIA attributes and keyboard navigation
