Accessibility
=============

The Frontend Component Library is built with accessibility as a core principle, ensuring all components meet WCAG 2.1 AA standards and provide an inclusive experience for all users.

WCAG 2.1 AA Compliance
-----------------------

All components in the library meet or exceed WCAG 2.1 AA standards across four main principles:

Perceivable
~~~~~~~~~~~

* **Color Contrast**: Minimum 4.5:1 contrast ratio for normal text, 3:1 for large text
* **Text Alternatives**: All images and icons have appropriate alt text or ARIA labels
* **Adaptable Content**: Content can be presented in different ways without losing meaning
* **Distinguishable**: Content is easy to see and hear

Operable
~~~~~~~~

* **Keyboard Accessible**: All functionality is available via keyboard
* **No Seizures**: No content flashes more than three times per second
* **Navigable**: Users can navigate and find content easily
* **Input Assistance**: Users are helped to avoid and correct mistakes

Understandable
~~~~~~~~~~~~~~

* **Readable**: Text is readable and understandable
* **Predictable**: Web pages appear and operate in predictable ways
* **Input Assistance**: Users are helped to avoid and correct mistakes

Robust
~~~~~~

* **Compatible**: Content can be interpreted by assistive technologies
* **Valid Code**: Markup is valid and semantic
* **Future-proof**: Components work with current and future assistive technologies

Keyboard Navigation
-------------------

All components support comprehensive keyboard navigation:

Standard Keyboard Patterns
~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 30 50

   * - Key
     - Action
     - Components
   * - Tab
     - Move focus to next focusable element
     - All interactive components
   * - Shift + Tab
     - Move focus to previous focusable element
     - All interactive components
   * - Enter
     - Activate button or link
     - Button, Link, MenuItem
   * - Space
     - Activate button or toggle checkbox
     - Button, Checkbox, Switch
   * - Escape
     - Close dialog or popover
     - Dialog, Popover, DropdownMenu
   * - Arrow Keys
     - Navigate within component
     - Menu, Tabs, RadioGroup

Component-Specific Patterns
~~~~~~~~~~~~~~~~~~~~~~~~~~~

Navigation Menu
^^^^^^^^^^^^^^^

.. code-block:: typescript

   // Arrow key navigation in menus
   <NavigationMenu>
     <NavigationMenuList>
       <NavigationMenuItem>
         <NavigationMenuTrigger>
           Products
         </NavigationMenuTrigger>
         <NavigationMenuContent>
           {/* Arrow keys navigate between items */}
           <NavigationMenuLink>Product 1</NavigationMenuLink>
           <NavigationMenuLink>Product 2</NavigationMenuLink>
         </NavigationMenuContent>
       </NavigationMenuItem>
     </NavigationMenuList>
   </NavigationMenu>

Dialog
^^^^^^

.. code-block:: typescript

   // Focus management in dialogs
   <Dialog>
     <DialogContent>
       {/* Focus is trapped within dialog */}
       <DialogTitle>Dialog Title</DialogTitle>
       <Input autoFocus /> {/* First focusable element */}
       <Button>Save</Button>
       <DialogClose>Cancel</DialogClose> {/* Last focusable element */}
     </DialogContent>
   </Dialog>

Table
^^^^^

.. code-block:: typescript

   // Keyboard navigation in tables
   <Table>
     <TableHeader>
       <TableRow>
         <TableHead>
           <Button onClick={handleSort}>
             Name
             {/* Sortable columns are keyboard accessible */}
           </Button>
         </TableHead>
       </TableRow>
     </TableHeader>
   </Table>

Screen Reader Support
---------------------

All components include proper ARIA attributes and semantic HTML for screen reader compatibility.

ARIA Attributes
~~~~~~~~~~~~~~~

Essential ARIA attributes used throughout the library:

.. list-table::
   :header-rows: 1
   :widths: 25 25 50

   * - Attribute
     - Purpose
     - Example Usage
   * - aria-label
     - Accessible name
     - ``<Button aria-label="Close dialog">×</Button>``
   * - aria-labelledby
     - Reference to labeling element
     - ``<Input aria-labelledby="email-label" />``
   * - aria-describedby
     - Reference to description
     - ``<Input aria-describedby="email-help" />``
   * - aria-expanded
     - Collapsible state
     - ``<Button aria-expanded={isOpen}>Menu</Button>``
   * - aria-selected
     - Selection state
     - ``<Option aria-selected={isSelected}>Item</Option>``
   * - aria-checked
     - Checkbox/radio state
     - ``<Checkbox aria-checked={isChecked} />``
   * - aria-disabled
     - Disabled state
     - ``<Button aria-disabled={isDisabled}>Save</Button>``
   * - aria-hidden
     - Hide decorative elements
     - ``<Icon aria-hidden="true" />``

Semantic HTML
~~~~~~~~~~~~~

Components use appropriate semantic HTML elements:

.. code-block:: typescript

   // Navigation uses nav element
   <nav aria-label="Main navigation">
     <ul>
       <li><a href="/home">Home</a></li>
       <li><a href="/about">About</a></li>
     </ul>
   </nav>

   // Forms use proper form elements
   <form>
     <fieldset>
       <legend>Personal Information</legend>
       <label htmlFor="name">Name</label>
       <input id="name" type="text" required />
     </fieldset>
   </form>

   // Tables use proper table structure
   <table>
     <caption>User Data</caption>
     <thead>
       <tr>
         <th scope="col">Name</th>
         <th scope="col">Email</th>
       </tr>
     </thead>
     <tbody>
       <tr>
         <td>John Doe</td>
         <td>john@example.com</td>
       </tr>
     </tbody>
   </table>

Live Regions
~~~~~~~~~~~~

Dynamic content updates are announced to screen readers:

.. code-block:: typescript

   // Search results announcement
   <div aria-live="polite" aria-atomic="true">
     {searchResults.length > 0 
       ? `${searchResults.length} results found`
       : 'No results found'
     }
   </div>

   // Form validation messages
   <div aria-live="assertive" aria-atomic="true">
     {error && `Error: ${error.message}`}
   </div>

   // Loading states
   <div aria-live="polite">
     {loading ? 'Loading...' : 'Content loaded'}
   </div>

Focus Management
----------------

Proper focus management ensures users can navigate efficiently and understand their current location.

Focus Indicators
~~~~~~~~~~~~~~~~

All interactive elements have visible focus indicators:

.. code-block:: css

   /* Default focus styles */
   .focus-visible {
     outline: 2px solid hsl(var(--ring));
     outline-offset: 2px;
   }

   /* Button focus styles */
   .button:focus-visible {
     ring: 2px;
     ring-color: hsl(var(--ring));
     ring-offset: 2px;
   }

Focus Trapping
~~~~~~~~~~~~~~

Modal dialogs and popovers trap focus within their boundaries:

.. code-block:: typescript

   // Focus trap implementation
   function FocusTrap({ children }: { children: React.ReactNode }) {
     const trapRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
       const trap = createFocusTrap(trapRef.current!, {
         initialFocus: '[autofocus]',
         fallbackFocus: trapRef.current!,
         escapeDeactivates: true,
         returnFocusOnDeactivate: true,
       });

       trap.activate();
       return () => trap.deactivate();
     }, []);

     return <div ref={trapRef}>{children}</div>;
   }

Focus Restoration
~~~~~~~~~~~~~~~~~

Focus is restored to the triggering element when modals close:

.. code-block:: typescript

   function Dialog({ open, onOpenChange, children }) {
     const triggerRef = useRef<HTMLElement>();

     useEffect(() => {
       if (open) {
         // Store the currently focused element
         triggerRef.current = document.activeElement as HTMLElement;
       } else if (triggerRef.current) {
         // Restore focus when dialog closes
         triggerRef.current.focus();
       }
     }, [open]);

     return (
       <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
         {children}
       </DialogPrimitive.Root>
     );
   }

Color and Contrast
------------------

The design system ensures sufficient color contrast across all themes and components.

Contrast Ratios
~~~~~~~~~~~~~~~

All color combinations meet WCAG AA standards:

.. list-table::
   :header-rows: 1
   :widths: 30 20 20 30

   * - Element Type
     - Minimum Ratio
     - Achieved Ratio
     - Status
   * - Normal Text
     - 4.5:1
     - 7.2:1
     - ✅ Pass
   * - Large Text
     - 3:1
     - 5.8:1
     - ✅ Pass
   * - UI Components
     - 3:1
     - 4.1:1
     - ✅ Pass
   * - Focus Indicators
     - 3:1
     - 4.5:1
     - ✅ Pass

Color Independence
~~~~~~~~~~~~~~~~~~

Information is never conveyed by color alone:

.. code-block:: typescript

   // Good: Status with icon and text
   function StatusBadge({ status }: { status: 'success' | 'error' | 'warning' }) {
     const config = {
       success: { icon: CheckCircle, text: 'Success', color: 'green' },
       error: { icon: XCircle, text: 'Error', color: 'red' },
       warning: { icon: AlertTriangle, text: 'Warning', color: 'yellow' },
     }[status];

     return (
       <Badge className={`bg-${config.color}-100 text-${config.color}-800`}>
         <config.icon className="w-4 h-4 mr-1" />
         {config.text}
       </Badge>
     );
   }

   // Good: Form validation with multiple indicators
   function FormField({ error }: { error?: string }) {
     return (
       <div>
         <Input 
           className={error ? 'border-red-500' : 'border-gray-300'}
           aria-invalid={!!error}
           aria-describedby={error ? 'error-message' : undefined}
         />
         {error && (
           <div id="error-message" className="text-red-600 text-sm mt-1">
             <AlertCircle className="w-4 h-4 inline mr-1" />
             {error}
           </div>
         )}
       </div>
     );
   }

Motion and Animation
--------------------

Animations respect user preferences and accessibility needs.

Reduced Motion
~~~~~~~~~~~~~~

All animations respect the `prefers-reduced-motion` setting:

.. code-block:: css

   /* Default animations */
   .animate-in {
     animation: slideIn 0.2s ease-out;
   }

   /* Respect reduced motion preference */
   @media (prefers-reduced-motion: reduce) {
     .animate-in {
       animation: none;
     }
     
     * {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }

Safe Animation Patterns
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Safe animation component
   function AnimatedComponent({ children }: { children: React.ReactNode }) {
     const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

     return (
       <motion.div
         initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ 
           duration: prefersReducedMotion ? 0 : 0.2,
           ease: 'easeOut'
         }}
       >
         {children}
       </motion.div>
     );
   }

Testing Accessibility
---------------------

Automated Testing
~~~~~~~~~~~~~~~~~

All components include automated accessibility tests:

.. code-block:: typescript

   import { axe, toHaveNoViolations } from 'jest-axe';

   expect.extend(toHaveNoViolations);

   describe('Button accessibility', () => {
     it('should not have accessibility violations', async () => {
       const { container } = render(
         <Button>Click me</Button>
       );
       
       const results = await axe(container);
       expect(results).toHaveNoViolations();
     });

     it('should be keyboard accessible', () => {
       const handleClick = jest.fn();
       render(<Button onClick={handleClick}>Click me</Button>);
       
       const button = screen.getByRole('button');
       fireEvent.keyDown(button, { key: 'Enter' });
       expect(handleClick).toHaveBeenCalled();
     });

     it('should have proper ARIA attributes', () => {
       render(<Button aria-label="Close dialog">×</Button>);
       
       const button = screen.getByRole('button');
       expect(button).toHaveAttribute('aria-label', 'Close dialog');
     });
   });

Manual Testing
~~~~~~~~~~~~~~

Regular manual testing includes:

* **Keyboard Navigation**: Testing all interactions with keyboard only
* **Screen Reader Testing**: Using NVDA, JAWS, and VoiceOver
* **High Contrast Mode**: Testing in Windows High Contrast mode
* **Zoom Testing**: Testing at 200% zoom level
* **Color Blindness**: Testing with color blindness simulators

Testing Checklist
~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1
   :widths: 40 60

   * - Test Category
     - Verification Points
   * - Keyboard Navigation
     - All interactive elements are keyboard accessible
   * - Focus Management
     - Focus indicators are visible and logical
   * - Screen Reader
     - All content is announced correctly
   * - Color Contrast
     - All text meets minimum contrast ratios
   * - Semantic HTML
     - Proper HTML elements and structure
   * - ARIA Attributes
     - Correct ARIA labels and properties
   * - Error Handling
     - Errors are announced and accessible
   * - Form Labels
     - All form controls have proper labels

Accessibility Guidelines
------------------------

Development Guidelines
~~~~~~~~~~~~~~~~~~~~~~

1. **Use Semantic HTML**: Always use the most appropriate HTML element
2. **Provide Text Alternatives**: All images and icons need alt text or ARIA labels
3. **Ensure Keyboard Access**: All functionality must be keyboard accessible
4. **Use Sufficient Contrast**: Meet WCAG AA contrast requirements
5. **Test with Real Users**: Include users with disabilities in testing

Component Guidelines
~~~~~~~~~~~~~~~~~~~~

1. **Focus Management**: Implement proper focus handling
2. **ARIA Attributes**: Use appropriate ARIA attributes
3. **Error Messages**: Make error messages accessible
4. **Loading States**: Announce loading states to screen readers
5. **Dynamic Content**: Use live regions for dynamic updates

Design Guidelines
~~~~~~~~~~~~~~~~~

1. **Color Independence**: Don't rely on color alone to convey information
2. **Touch Targets**: Minimum 44px touch targets on mobile
3. **Text Size**: Minimum 16px font size for body text
4. **Line Height**: Minimum 1.5 line height for readability
5. **Spacing**: Adequate spacing between interactive elements

Resources
---------

Tools and References
~~~~~~~~~~~~~~~~~~~~

* **axe-core**: Automated accessibility testing
* **WAVE**: Web accessibility evaluation tool
* **Lighthouse**: Accessibility auditing in Chrome DevTools
* **NVDA**: Free screen reader for testing
* **Color Oracle**: Color blindness simulator

Documentation
~~~~~~~~~~~~~

* `WCAG 2.1 Guidelines <https://www.w3.org/WAI/WCAG21/quickref/>`_
* `ARIA Authoring Practices Guide <https://www.w3.org/WAI/ARIA/apg/>`_
* `WebAIM Resources <https://webaim.org/>`_
* `A11y Project <https://www.a11yproject.com/>`_

Getting Help
~~~~~~~~~~~~

* Review component documentation for accessibility notes
* Use the automated testing tools provided
* Test with real assistive technologies
* Consult the accessibility team for complex scenarios
