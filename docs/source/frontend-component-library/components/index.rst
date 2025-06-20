Components Reference
====================

This section provides comprehensive documentation for all components in the Frontend Component Library.

.. toctree::
   :maxdepth: 2
   :caption: Component Categories:

   base-components
   form-components
   navigation-components
   data-components
   feedback-components
   layout-components
   search-components
   theme-components

Component Overview
------------------

The component library contains 20+ production-ready components organized into logical categories:

Base Components (8)
~~~~~~~~~~~~~~~~~~~

Foundation components that serve as building blocks:

* :doc:`Button <base-components>` - Interactive buttons with multiple variants
* :doc:`Card <base-components>` - Content containers with headers and footers
* :doc:`Input <base-components>` - Text input fields with validation states
* :doc:`Label <base-components>` - Accessible form labels
* :doc:`Checkbox <base-components>` - Checkbox inputs with indeterminate state
* :doc:`Badge <base-components>` - Status indicators and tags
* :doc:`Progress <base-components>` - Progress bars and loading indicators
* :doc:`Toast <base-components>` - Notification system

Form Components (5)
~~~~~~~~~~~~~~~~~~~

Advanced form handling with validation:

* :doc:`Form <form-components>` - Complete form system with validation
* :doc:`Select <form-components>` - Dropdown selection with search
* :doc:`Textarea <form-components>` - Multi-line text input
* :doc:`FileUpload <form-components>` - File upload with drag & drop
* :doc:`MultiStepForm <form-components>` - Multi-step form workflows

Navigation Components (4)
~~~~~~~~~~~~~~~~~~~~~~~~~

Navigation and wayfinding:

* :doc:`Header <navigation-components>` - Application header with navigation
* :doc:`Sidebar <navigation-components>` - Collapsible sidebar navigation
* :doc:`NavigationMenu <navigation-components>` - Dropdown navigation menus
* :doc:`Breadcrumb <navigation-components>` - Hierarchical navigation

Data Components (4)
~~~~~~~~~~~~~~~~~~~

Data display and visualization:

* :doc:`Table <data-components>` - Data tables with sorting and filtering
* :doc:`Pagination <data-components>` - Data pagination controls
* :doc:`Chart <data-components>` - Data visualization with locale support
* :doc:`StatCard <data-components>` - Metrics display with trend indicators

Feedback Components (2)
~~~~~~~~~~~~~~~~~~~~~~~

User feedback and interaction:

* :doc:`Dialog <feedback-components>` - Modal dialogs and confirmations
* :doc:`Popover <feedback-components>` - Overlay content system

Layout Components (2)
~~~~~~~~~~~~~~~~~~~~~

Page structure and organization:

* :doc:`ThemeProvider <layout-components>` - Theme system management
* :doc:`ThemeToggle <layout-components>` - Theme switching component

Search Components (2)
~~~~~~~~~~~~~~~~~~~~~

Search and filtering capabilities:

* :doc:`Search <search-components>` - Basic search component
* :doc:`SearchWithFilters <search-components>` - Advanced search with filters

Component API Patterns
-----------------------

Consistent Interfaces
~~~~~~~~~~~~~~~~~~~~~

All components follow consistent API patterns:

Props Structure
^^^^^^^^^^^^^^^

.. code-block:: typescript

   interface ComponentProps {
     // Content props
     children?: React.ReactNode;
     
     // Styling props
     className?: string;
     variant?: 'default' | 'secondary' | 'destructive';
     size?: 'sm' | 'default' | 'lg';
     
     // Behavior props
     disabled?: boolean;
     loading?: boolean;
     
     // Event handlers
     onClick?: (event: MouseEvent) => void;
     onChange?: (value: any) => void;
     
     // Accessibility props
     'aria-label'?: string;
     'aria-describedby'?: string;
   }

Ref Forwarding
^^^^^^^^^^^^^^

All components support ref forwarding:

.. code-block:: typescript

   const MyComponent = React.forwardRef<HTMLElement, Props>(
     ({ className, ...props }, ref) => {
       return <element ref={ref} className={cn(baseStyles, className)} {...props} />;
     }
   );

Variant System
~~~~~~~~~~~~~~

Components use a consistent variant system:

.. code-block:: typescript

   const componentVariants = cva(
     "base-styles",
     {
       variants: {
         variant: {
           default: "default-styles",
           secondary: "secondary-styles",
           destructive: "destructive-styles",
         },
         size: {
           sm: "small-styles",
           default: "default-size-styles", 
           lg: "large-styles",
         },
       },
       defaultVariants: {
         variant: "default",
         size: "default",
       },
     }
   );

Accessibility Standards
-----------------------

WCAG 2.1 AA Compliance
~~~~~~~~~~~~~~~~~~~~~~

All components meet WCAG 2.1 AA standards:

* **Keyboard Navigation**: Full keyboard support
* **Screen Readers**: Proper ARIA attributes
* **Color Contrast**: Minimum 4.5:1 ratio
* **Focus Management**: Visible focus indicators
* **Semantic HTML**: Proper element usage

Common Accessibility Features
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Focus Management
^^^^^^^^^^^^^^^^

.. code-block:: typescript

   // Focus trap in modals
   <Dialog>
     <DialogContent> {/* Focus is trapped here */}
       <DialogTitle>Modal Title</DialogTitle>
       <DialogDescription>Modal content</DialogDescription>
     </DialogContent>
   </Dialog>

ARIA Attributes
^^^^^^^^^^^^^^^

.. code-block:: typescript

   // Proper labeling
   <Button aria-label="Close dialog">
     <X className="h-4 w-4" />
   </Button>

   // Descriptive relationships
   <Input aria-describedby="help-text" />
   <div id="help-text">Help text for the input</div>

Keyboard Navigation
^^^^^^^^^^^^^^^^^^^

.. code-block:: typescript

   // Arrow key navigation in menus
   <NavigationMenu>
     <NavigationMenuList> {/* Arrow keys navigate items */}
       <NavigationMenuItem>Item 1</NavigationMenuItem>
       <NavigationMenuItem>Item 2</NavigationMenuItem>
     </NavigationMenuList>
   </NavigationMenu>

Internationalization Support
----------------------------

Translation Integration
~~~~~~~~~~~~~~~~~~~~~~~

All components integrate with next-intl:

.. code-block:: typescript

   import { useTranslations } from 'next-intl';

   function MyComponent() {
     const t = useTranslations('common');
     
     return (
       <Button>{t('save')}</Button>
     );
   }

Locale-Aware Formatting
~~~~~~~~~~~~~~~~~~~~~~~

Components respect locale formatting:

.. code-block:: typescript

   // Numbers
   <StatCard value={1234.56} /> // 1,234.56 (en) | 1.234,56 (de)

   // Dates
   <Chart data={dateData} /> // MM/DD/YYYY (en) | DD.MM.YYYY (de)

   // Currency
   <StatCard value="€1,234.56" /> // Formatted per locale

Text Direction Support
~~~~~~~~~~~~~~~~~~~~~~

Components support RTL languages:

.. code-block:: css

   .component {
     /* Logical properties for RTL support */
     margin-inline-start: 1rem;
     padding-inline-end: 0.5rem;
   }

Performance Considerations
--------------------------

Bundle Size Optimization
~~~~~~~~~~~~~~~~~~~~~~~~

* **Tree Shaking**: Import only used components
* **Code Splitting**: Components are split by route
* **Lazy Loading**: Heavy components load on demand

.. code-block:: typescript

   // Good: Tree-shakeable import
   import { Button } from '@/components/ui/button';

   // Avoid: Barrel imports
   import { Button } from '@/components/ui';

Memory Management
~~~~~~~~~~~~~~~~~

* **Event Cleanup**: Components clean up event listeners
* **Ref Management**: Proper ref cleanup in useEffect
* **State Optimization**: Minimal re-renders with React.memo

.. code-block:: typescript

   const OptimizedComponent = React.memo(({ data }) => {
     return <ExpensiveComponent data={data} />;
   });

Render Optimization
~~~~~~~~~~~~~~~~~~~

* **Virtual Scrolling**: For large data sets
* **Debounced Inputs**: For search and filter components
* **Memoized Calculations**: For expensive computations

Testing Patterns
----------------

Component Testing
~~~~~~~~~~~~~~~~~

All components include comprehensive tests:

.. code-block:: typescript

   describe('Button', () => {
     it('renders correctly', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByRole('button')).toBeInTheDocument();
     });

     it('handles click events', () => {
       const handleClick = jest.fn();
       render(<Button onClick={handleClick}>Click me</Button>);
       fireEvent.click(screen.getByRole('button'));
       expect(handleClick).toHaveBeenCalled();
     });

     it('supports keyboard navigation', () => {
       render(<Button>Click me</Button>);
       const button = screen.getByRole('button');
       button.focus();
       fireEvent.keyDown(button, { key: 'Enter' });
       // Assert expected behavior
     });
   });

Accessibility Testing
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   import { axe, toHaveNoViolations } from 'jest-axe';

   expect.extend(toHaveNoViolations);

   it('should not have accessibility violations', async () => {
     const { container } = render(<Component />);
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });

Migration Guide
---------------

From Previous Versions
~~~~~~~~~~~~~~~~~~~~~~

When updating components, follow the migration guide:

1. **Check Breaking Changes**: Review changelog for breaking changes
2. **Update Imports**: Ensure import paths are correct
3. **Update Props**: Check for renamed or removed props
4. **Test Thoroughly**: Run full test suite
5. **Update Documentation**: Update usage examples

Version Compatibility
~~~~~~~~~~~~~~~~~~~~~

The component library maintains backward compatibility within major versions:

* **Patch versions**: Bug fixes only
* **Minor versions**: New features, backward compatible
* **Major versions**: Breaking changes with migration guide

Contributing
------------

Adding New Components
~~~~~~~~~~~~~~~~~~~~

When adding new components:

1. **Follow Patterns**: Use existing component patterns
2. **Include Tests**: Write comprehensive tests
3. **Document Thoroughly**: Add usage examples
4. **Consider Accessibility**: Ensure WCAG compliance
5. **Support i18n**: Include internationalization support

Code Standards
~~~~~~~~~~~~~~

* **TypeScript**: Full type safety
* **ESLint**: Follow linting rules
* **Prettier**: Consistent formatting
* **Accessibility**: WCAG 2.1 AA compliance
* **Performance**: Optimize for bundle size and runtime
