Base Components
===============

Base components are the foundation of the component library, providing essential UI elements that other components build upon.

Button
------

Interactive button component with multiple variants, sizes, and states.

Usage
~~~~~

.. code-block:: typescript

   import { Button } from '@/components/ui/button';

   // Basic usage
   <Button>Click me</Button>

   // With variants
   <Button variant="secondary">Secondary</Button>
   <Button variant="destructive">Delete</Button>
   <Button variant="outline">Outline</Button>
   <Button variant="ghost">Ghost</Button>
   <Button variant="link">Link</Button>

   // With sizes
   <Button size="sm">Small</Button>
   <Button size="default">Default</Button>
   <Button size="lg">Large</Button>
   <Button size="icon"><Icon /></Button>

   // With states
   <Button disabled>Disabled</Button>
   <Button loading>Loading...</Button>

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - variant
     - 'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'
     - 'default'
     - Button style variant
   * - size
     - 'sm' \| 'default' \| 'lg' \| 'icon'
     - 'default'
     - Button size
   * - disabled
     - boolean
     - false
     - Disable the button
   * - loading
     - boolean
     - false
     - Show loading state
   * - asChild
     - boolean
     - false
     - Render as child element
   * - onClick
     - (event: MouseEvent) => void
     - undefined
     - Click handler

Examples
~~~~~~~~

.. code-block:: typescript

   // Button with icon
   <Button>
     <Mail className="mr-2 h-4 w-4" />
     Send Email
   </Button>

   // Loading button
   <Button loading disabled>
     Processing...
   </Button>

   // As link
   <Button asChild>
     <Link href="/dashboard">Go to Dashboard</Link>
   </Button>

Card
----

Content container component with optional header and footer sections.

Usage
~~~~~

.. code-block:: typescript

   import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

   <Card>
     <CardHeader>
       <CardTitle>Card Title</CardTitle>
       <CardDescription>Card description text</CardDescription>
     </CardHeader>
     <CardContent>
       <p>Card content goes here.</p>
     </CardContent>
   </Card>

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Component
     - Props
     - Type
     - Description
   * - Card
     - className
     - string
     - Additional CSS classes
   * - CardHeader
     - className
     - string
     - Additional CSS classes
   * - CardTitle
     - className
     - string
     - Additional CSS classes
   * - CardDescription
     - className
     - string
     - Additional CSS classes
   * - CardContent
     - className
     - string
     - Additional CSS classes

Examples
~~~~~~~~

.. code-block:: typescript

   // Simple card
   <Card>
     <CardContent className="p-6">
       <p>Simple card content</p>
     </CardContent>
   </Card>

   // Card with actions
   <Card>
     <CardHeader>
       <CardTitle>Settings</CardTitle>
       <CardDescription>Manage your account settings</CardDescription>
     </CardHeader>
     <CardContent>
       <form>
         {/* Form content */}
       </form>
     </CardContent>
   </Card>

Input
-----

Text input component with validation states and accessibility features.

Usage
~~~~~

.. code-block:: typescript

   import { Input } from '@/components/ui/input';

   // Basic usage
   <Input placeholder="Enter text..." />

   // With type
   <Input type="email" placeholder="Enter email..." />
   <Input type="password" placeholder="Enter password..." />

   // With form integration
   <Input {...register('email')} />

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - type
     - string
     - 'text'
     - Input type
   * - placeholder
     - string
     - undefined
     - Placeholder text
   * - disabled
     - boolean
     - false
     - Disable the input
   * - className
     - string
     - undefined
     - Additional CSS classes

Examples
~~~~~~~~

.. code-block:: typescript

   // With label and validation
   <div className="space-y-2">
     <Label htmlFor="email">Email</Label>
     <Input
       id="email"
       type="email"
       placeholder="Enter your email"
       aria-describedby="email-error"
     />
     <p id="email-error" className="text-sm text-destructive">
       Please enter a valid email
     </p>
   </div>

Label
-----

Accessible form label component that properly associates with form controls.

Usage
~~~~~

.. code-block:: typescript

   import { Label } from '@/components/ui/label';

   <Label htmlFor="email">Email Address</Label>
   <Input id="email" type="email" />

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - htmlFor
     - string
     - undefined
     - ID of associated form control
   * - className
     - string
     - undefined
     - Additional CSS classes

Checkbox
--------

Checkbox input component with support for indeterminate state.

Usage
~~~~~

.. code-block:: typescript

   import { Checkbox } from '@/components/ui/checkbox';

   // Basic usage
   <Checkbox />

   // With label
   <div className="flex items-center space-x-2">
     <Checkbox id="terms" />
     <Label htmlFor="terms">Accept terms and conditions</Label>
   </div>

   // Controlled
   <Checkbox
     checked={isChecked}
     onCheckedChange={setIsChecked}
   />

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - checked
     - boolean \| 'indeterminate'
     - undefined
     - Checked state
   * - onCheckedChange
     - (checked: boolean) => void
     - undefined
     - Change handler
   * - disabled
     - boolean
     - false
     - Disable the checkbox

Badge
-----

Small status indicator component for displaying tags, statuses, or counts.

Usage
~~~~~

.. code-block:: typescript

   import { Badge } from '@/components/ui/badge';

   // Basic usage
   <Badge>New</Badge>

   // With variants
   <Badge variant="secondary">Secondary</Badge>
   <Badge variant="destructive">Error</Badge>
   <Badge variant="outline">Outline</Badge>

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - variant
     - 'default' \| 'secondary' \| 'destructive' \| 'outline'
     - 'default'
     - Badge style variant

Examples
~~~~~~~~

.. code-block:: typescript

   // Status badges
   <Badge variant="default">Active</Badge>
   <Badge variant="secondary">Pending</Badge>
   <Badge variant="destructive">Inactive</Badge>

   // Count badge
   <div className="relative">
     <Button variant="ghost" size="icon">
       <Bell className="h-4 w-4" />
     </Button>
     <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
       3
     </Badge>
   </div>

Progress
--------

Progress indicator component for showing completion status.

Usage
~~~~~

.. code-block:: typescript

   import { Progress } from '@/components/ui/progress';

   // Basic usage
   <Progress value={33} />

   // With custom styling
   <Progress value={75} className="h-2" />

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - value
     - number
     - undefined
     - Progress value (0-100)
   * - className
     - string
     - undefined
     - Additional CSS classes

Examples
~~~~~~~~

.. code-block:: typescript

   // Upload progress
   <div className="space-y-2">
     <div className="flex justify-between text-sm">
       <span>Uploading...</span>
       <span>75%</span>
     </div>
     <Progress value={75} />
   </div>

   // Multi-step progress
   <div className="space-y-4">
     <div className="text-sm text-muted-foreground">
       Step 2 of 4
     </div>
     <Progress value={50} />
   </div>

Toast
-----

Notification system for displaying temporary messages to users.

Usage
~~~~~

.. code-block:: typescript

   import { toast } from '@/components/ui/use-toast';

   // Basic usage
   toast({
     title: "Success",
     description: "Your changes have been saved.",
   });

   // With variant
   toast({
     variant: "destructive",
     title: "Error",
     description: "Something went wrong.",
   });

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - title
     - string
     - undefined
     - Toast title
   * - description
     - string
     - undefined
     - Toast description
   * - variant
     - 'default' \| 'destructive'
     - 'default'
     - Toast variant
   * - duration
     - number
     - 5000
     - Auto-dismiss duration (ms)

Examples
~~~~~~~~

.. code-block:: typescript

   // Success notification
   const handleSave = () => {
     // Save logic...
     toast({
       title: "Saved!",
       description: "Your changes have been saved successfully.",
     });
   };

   // Error notification
   const handleError = () => {
     toast({
       variant: "destructive",
       title: "Uh oh! Something went wrong.",
       description: "There was a problem with your request.",
     });
   };

Accessibility
-------------

All base components follow WCAG 2.1 AA guidelines:

* **Keyboard Navigation**: Full keyboard support
* **Screen Readers**: Proper ARIA attributes and semantic HTML
* **Focus Management**: Visible focus indicators
* **Color Contrast**: Minimum 4.5:1 contrast ratio
* **Touch Targets**: Minimum 44px touch targets on mobile

Testing
-------

All base components include comprehensive tests covering:

* **Rendering**: Components render correctly
* **Interactions**: User interactions work as expected
* **Accessibility**: ARIA attributes and keyboard navigation
* **Variants**: All variants and states render correctly
* **Props**: All props work as documented
