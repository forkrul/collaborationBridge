Design Patterns
===============

This section covers common design patterns and best practices for using the Frontend Component Library effectively.

.. toctree::
   :maxdepth: 2
   :caption: Pattern Categories:

   layout-patterns
   form-patterns
   data-patterns
   navigation-patterns
   feedback-patterns

Pattern Overview
----------------

The component library provides proven patterns for common UI scenarios. These patterns ensure consistency, accessibility, and optimal user experience across your application.

Core Principles
~~~~~~~~~~~~~~~

1. **Consistency**: Use established patterns for similar functionality
2. **Accessibility**: All patterns meet WCAG 2.1 AA standards
3. **Responsiveness**: Patterns work across all device sizes
4. **Internationalization**: Patterns support multiple languages and cultures
5. **Performance**: Patterns are optimized for speed and efficiency

Pattern Categories
------------------

Layout Patterns
~~~~~~~~~~~~~~~

Common page and component layout structures:

* **App Layout**: Standard application layout with header and sidebar
* **Dashboard Layout**: Data-focused layout with metrics and charts
* **Content Layout**: Article and content-focused layouts
* **Grid Systems**: Responsive grid patterns for various content types

Form Patterns
~~~~~~~~~~~~~

Comprehensive form design patterns:

* **Single-Step Forms**: Simple forms with validation
* **Multi-Step Forms**: Complex workflows broken into steps
* **Search Forms**: Search and filtering interfaces
* **Data Entry**: Efficient data input patterns

Data Patterns
~~~~~~~~~~~~~

Patterns for displaying and managing data:

* **Data Tables**: Sortable, filterable data displays
* **Data Visualization**: Charts and metrics presentation
* **Lists and Cards**: Content organization patterns
* **Pagination**: Large dataset navigation

Navigation Patterns
~~~~~~~~~~~~~~~~~~~

User navigation and wayfinding:

* **Primary Navigation**: Main application navigation
* **Secondary Navigation**: Contextual navigation
* **Breadcrumbs**: Hierarchical navigation
* **Mobile Navigation**: Touch-optimized navigation

Feedback Patterns
~~~~~~~~~~~~~~~~~

User feedback and interaction patterns:

* **Loading States**: Progress and loading indicators
* **Error Handling**: Error display and recovery
* **Success Feedback**: Confirmation and success states
* **Notifications**: Toast and alert patterns

Implementation Guidelines
-------------------------

Pattern Selection
~~~~~~~~~~~~~~~~~

Choose patterns based on:

1. **User Goals**: What is the user trying to accomplish?
2. **Content Type**: What kind of information is being displayed?
3. **Context**: Where does this pattern fit in the user journey?
4. **Constraints**: What are the technical and design limitations?

Customization Guidelines
~~~~~~~~~~~~~~~~~~~~~~~~

When customizing patterns:

1. **Maintain Accessibility**: Ensure WCAG compliance is preserved
2. **Test Thoroughly**: Verify patterns work across devices and browsers
3. **Document Changes**: Keep track of customizations for maintenance
4. **Consider Impact**: Evaluate how changes affect the overall design system

Pattern Composition
~~~~~~~~~~~~~~~~~~~

Combine patterns effectively:

.. code-block:: typescript

   // Example: Dashboard with multiple patterns
   function Dashboard() {
     return (
       <AppLayout> {/* Layout Pattern */}
         <DashboardHeader /> {/* Navigation Pattern */}
         
         <MetricsGrid> {/* Data Pattern */}
           <StatCard title="Users" value={1234} />
           <StatCard title="Revenue" value="€45,231" />
         </MetricsGrid>
         
         <DataSection> {/* Data Pattern */}
           <SearchWithFilters /> {/* Form Pattern */}
           <DataTable /> {/* Data Pattern */}
           <Pagination /> {/* Navigation Pattern */}
         </DataSection>
         
         <ChartSection> {/* Data Pattern */}
           <Chart type="bar" data={chartData} />
         </ChartSection>
       </AppLayout>
     );
   }

Responsive Patterns
-------------------

Mobile-First Approach
~~~~~~~~~~~~~~~~~~~~~

All patterns are designed mobile-first:

.. code-block:: typescript

   // Responsive grid pattern
   function ResponsiveGrid({ children }: { children: React.ReactNode }) {
     return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {children}
       </div>
     );
   }

   // Responsive navigation pattern
   function ResponsiveNavigation() {
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

     return (
       <nav className="bg-background border-b">
         {/* Desktop navigation */}
         <div className="hidden md:flex items-center space-x-8">
           <NavigationItems />
         </div>
         
         {/* Mobile navigation */}
         <div className="md:hidden">
           <Button
             variant="ghost"
             size="icon"
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           >
             <Menu className="h-6 w-6" />
           </Button>
           
           {isMobileMenuOpen && (
             <div className="absolute top-full left-0 right-0 bg-background border-b">
               <NavigationItems />
             </div>
           )}
         </div>
       </nav>
     );
   }

Breakpoint Strategy
~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 60

   * - Breakpoint
     - Size
     - Usage
   * - sm
     - 640px+
     - Small tablets and large phones
   * - md
     - 768px+
     - Tablets and small laptops
   * - lg
     - 1024px+
     - Laptops and desktops
   * - xl
     - 1280px+
     - Large desktops
   * - 2xl
     - 1536px+
     - Extra large screens

Accessibility Patterns
----------------------

Focus Management
~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Skip link pattern
   function SkipLink() {
     return (
       <a
         href="#main-content"
         className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded"
       >
         Skip to main content
       </a>
     );
   }

   // Focus trap pattern for modals
   function Modal({ children, isOpen, onClose }: ModalProps) {
     const modalRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
       if (isOpen) {
         const focusableElements = modalRef.current?.querySelectorAll(
           'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
         );
         
         if (focusableElements?.length) {
           (focusableElements[0] as HTMLElement).focus();
         }
       }
     }, [isOpen]);

     return (
       <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent ref={modalRef}>
           {children}
         </DialogContent>
       </Dialog>
     );
   }

Semantic HTML Patterns
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Proper heading hierarchy
   function ArticlePage() {
     return (
       <article>
         <header>
           <h1>Article Title</h1>
           <p>Article subtitle</p>
         </header>
         
         <main>
           <section>
             <h2>Section Title</h2>
             <p>Section content...</p>
             
             <section>
               <h3>Subsection Title</h3>
               <p>Subsection content...</p>
             </section>
           </section>
         </main>
       </article>
     );
   }

   // Proper form structure
   function ContactForm() {
     return (
       <form>
         <fieldset>
           <legend>Contact Information</legend>
           
           <div>
             <label htmlFor="name">Name</label>
             <input id="name" type="text" required />
           </div>
           
           <div>
             <label htmlFor="email">Email</label>
             <input id="email" type="email" required />
           </div>
         </fieldset>
         
         <button type="submit">Send Message</button>
       </form>
     );
   }

Performance Patterns
--------------------

Lazy Loading Patterns
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Component lazy loading
   const HeavyComponent = lazy(() => import('./HeavyComponent'));

   function App() {
     const [showHeavyComponent, setShowHeavyComponent] = useState(false);

     return (
       <div>
         <Button onClick={() => setShowHeavyComponent(true)}>
           Load Heavy Component
         </Button>
         
         {showHeavyComponent && (
           <Suspense fallback={<ComponentSkeleton />}>
             <HeavyComponent />
           </Suspense>
         )}
       </div>
     );
   }

   // Image lazy loading pattern
   function LazyImage({ src, alt }: { src: string; alt: string }) {
     const [isLoaded, setIsLoaded] = useState(false);
     const [isInView, setIsInView] = useState(false);
     const imgRef = useRef<HTMLImageElement>(null);

     useEffect(() => {
       const observer = new IntersectionObserver(
         ([entry]) => {
           if (entry.isIntersecting) {
             setIsInView(true);
             observer.disconnect();
           }
         },
         { threshold: 0.1 }
       );

       if (imgRef.current) {
         observer.observe(imgRef.current);
       }

       return () => observer.disconnect();
     }, []);

     return (
       <div ref={imgRef} className="relative">
         {isInView && (
           <img
             src={src}
             alt={alt}
             onLoad={() => setIsLoaded(true)}
             className={`transition-opacity duration-300 ${
               isLoaded ? 'opacity-100' : 'opacity-0'
             }`}
           />
         )}
         {!isLoaded && <ImageSkeleton />}
       </div>
     );
   }

Memoization Patterns
~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Expensive calculation memoization
   function DataProcessor({ data }: { data: any[] }) {
     const processedData = useMemo(() => {
       return data.map(item => ({
         ...item,
         computed: expensiveCalculation(item),
       }));
     }, [data]);

     return (
       <div>
         {processedData.map(item => (
           <DataItem key={item.id} data={item} />
         ))}
       </div>
     );
   }

   // Component memoization
   const ExpensiveListItem = React.memo(({ item, onUpdate }: {
     item: any;
     onUpdate: (id: string, value: any) => void;
   }) => {
     const handleUpdate = useCallback((value: any) => {
       onUpdate(item.id, value);
     }, [item.id, onUpdate]);

     return (
       <div>
         <span>{item.name}</span>
         <Button onClick={() => handleUpdate(item.value)}>
           Update
         </Button>
       </div>
     );
   });

Error Handling Patterns
-----------------------

Error Boundaries
~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Error boundary component
   class ErrorBoundary extends React.Component<
     { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
     { hasError: boolean; error?: Error }
   > {
     constructor(props: any) {
       super(props);
       this.state = { hasError: false };
     }

     static getDerivedStateFromError(error: Error) {
       return { hasError: true, error };
     }

     componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
       console.error('Error caught by boundary:', error, errorInfo);
       // Send to error reporting service
     }

     render() {
       if (this.state.hasError) {
         const FallbackComponent = this.props.fallback || DefaultErrorFallback;
         return <FallbackComponent error={this.state.error!} />;
       }

       return this.props.children;
     }
   }

   // Usage
   function App() {
     return (
       <ErrorBoundary fallback={CustomErrorFallback}>
         <Router>
           <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/dashboard" element={<DashboardPage />} />
           </Routes>
         </Router>
       </ErrorBoundary>
     );
   }

Graceful Degradation
~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Feature detection pattern
   function AdvancedFeature() {
     const [isSupported, setIsSupported] = useState(false);

     useEffect(() => {
       // Check for feature support
       setIsSupported('IntersectionObserver' in window);
     }, []);

     if (!isSupported) {
       return <BasicFallback />;
     }

     return <AdvancedComponent />;
   }

   // Progressive enhancement
   function EnhancedForm() {
     const [jsEnabled, setJsEnabled] = useState(false);

     useEffect(() => {
       setJsEnabled(true);
     }, []);

     return (
       <form>
         {/* Basic form that works without JS */}
         <input type="text" name="query" />
         <button type="submit">Search</button>
         
         {/* Enhanced features with JS */}
         {jsEnabled && (
           <>
             <SearchSuggestions />
             <AdvancedFilters />
           </>
         )}
       </form>
     );
   }

Testing Patterns
----------------

Component Testing
~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Test pattern for complex components
   describe('DataTable', () => {
     const mockData = [
       { id: 1, name: 'John', email: 'john@example.com' },
       { id: 2, name: 'Jane', email: 'jane@example.com' },
     ];

     it('renders data correctly', () => {
       render(<DataTable data={mockData} />);
       
       expect(screen.getByText('John')).toBeInTheDocument();
       expect(screen.getByText('jane@example.com')).toBeInTheDocument();
     });

     it('handles sorting', async () => {
       const user = userEvent.setup();
       render(<DataTable data={mockData} sortable />);
       
       const nameHeader = screen.getByRole('button', { name: /name/i });
       await user.click(nameHeader);
       
       const rows = screen.getAllByRole('row');
       expect(rows[1]).toHaveTextContent('Jane');
       expect(rows[2]).toHaveTextContent('John');
     });

     it('is accessible', async () => {
       const { container } = render(<DataTable data={mockData} />);
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });
   });

Integration Testing
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Test pattern for user workflows
   describe('User Registration Flow', () => {
     it('completes registration successfully', async () => {
       const user = userEvent.setup();
       render(<RegistrationForm />);

       // Fill out form
       await user.type(screen.getByLabelText(/first name/i), 'John');
       await user.type(screen.getByLabelText(/last name/i), 'Doe');
       await user.type(screen.getByLabelText(/email/i), 'john@example.com');
       
       // Submit form
       await user.click(screen.getByRole('button', { name: /register/i }));
       
       // Verify success
       await waitFor(() => {
         expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
       });
     });
   });

Best Practices
--------------

Pattern Documentation
~~~~~~~~~~~~~~~~~~~~~

1. **Document Intent**: Explain why the pattern exists
2. **Provide Examples**: Show real-world usage
3. **List Variations**: Document different use cases
4. **Include Accessibility**: Note accessibility considerations
5. **Performance Notes**: Mention performance implications

Pattern Evolution
~~~~~~~~~~~~~~~~~

1. **Monitor Usage**: Track how patterns are used
2. **Gather Feedback**: Collect user feedback on patterns
3. **Iterate Regularly**: Improve patterns based on learnings
4. **Version Changes**: Document pattern changes over time
5. **Deprecate Gracefully**: Provide migration paths for old patterns

The design patterns in this library provide a solid foundation for building consistent, accessible, and performant user interfaces. Use these patterns as starting points and adapt them to your specific needs while maintaining the core principles of the design system.
