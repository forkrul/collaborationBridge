Feedback Components
===================

Feedback components provide user interaction and notification functionality with accessibility and internationalization support.

Dialog
------

Modal dialog component for confirmations, forms, and content display.

Usage
~~~~~

.. code-block:: typescript

   import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
   } from '@/components/ui/dialog';

   // Basic dialog
   <Dialog>
     <DialogTrigger asChild>
       <Button>Open Dialog</Button>
     </DialogTrigger>
     <DialogContent>
       <DialogHeader>
         <DialogTitle>Dialog Title</DialogTitle>
         <DialogDescription>
           This is a description of what the dialog contains.
         </DialogDescription>
       </DialogHeader>
       <div className="py-4">
         <p>Dialog content goes here.</p>
       </div>
     </DialogContent>
   </Dialog>

Components
~~~~~~~~~~

Dialog
^^^^^^

Root dialog component that manages open/close state.

DialogTrigger
^^^^^^^^^^^^^

Button or element that triggers the dialog to open.

DialogContent
^^^^^^^^^^^^^

Main dialog content container with backdrop and positioning.

DialogHeader
^^^^^^^^^^^^

Header section for title and description.

DialogTitle
^^^^^^^^^^^

Dialog title component (required for accessibility).

DialogDescription
^^^^^^^^^^^^^^^^^

Optional description text for the dialog.

DialogClose
^^^^^^^^^^^

Component that closes the dialog when clicked.

Advanced Usage
~~~~~~~~~~~~~~

.. code-block:: typescript

   // Confirmation dialog
   function ConfirmationDialog({ onConfirm, onCancel }) {
     return (
       <Dialog>
         <DialogTrigger asChild>
           <Button variant="destructive">Delete Item</Button>
         </DialogTrigger>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Confirm Deletion</DialogTitle>
             <DialogDescription>
               Are you sure you want to delete this item? This action cannot be undone.
             </DialogDescription>
           </DialogHeader>
           <div className="flex justify-end space-x-2 mt-6">
             <DialogClose asChild>
               <Button variant="outline" onClick={onCancel}>
                 Cancel
               </Button>
             </DialogClose>
             <DialogClose asChild>
               <Button variant="destructive" onClick={onConfirm}>
                 Delete
               </Button>
             </DialogClose>
           </div>
         </DialogContent>
       </Dialog>
     );
   }

   // Form dialog
   function FormDialog() {
     const [open, setOpen] = useState(false);

     const handleSubmit = (data) => {
       // Handle form submission
       console.log(data);
       setOpen(false);
     };

     return (
       <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
           <Button>Add User</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
           <DialogHeader>
             <DialogTitle>Add New User</DialogTitle>
             <DialogDescription>
               Enter the user details below.
             </DialogDescription>
           </DialogHeader>
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="name">Name</Label>
               <Input id="name" placeholder="Enter name" />
             </div>
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <Input id="email" type="email" placeholder="Enter email" />
             </div>
             <div className="flex justify-end space-x-2">
               <DialogClose asChild>
                 <Button variant="outline">Cancel</Button>
               </DialogClose>
               <Button type="submit">Add User</Button>
             </div>
           </form>
         </DialogContent>
       </Dialog>
     );
   }

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Component
     - Key Props
     - Type
     - Description
   * - Dialog
     - open, onOpenChange
     - boolean, function
     - Controlled open state
   * - DialogContent
     - className
     - string
     - Additional CSS classes
   * - DialogTrigger
     - asChild
     - boolean
     - Render as child element

Features
~~~~~~~~

* **Focus Management**: Automatic focus trapping and restoration
* **Keyboard Navigation**: Escape key closes dialog
* **Backdrop Click**: Click outside to close (configurable)
* **Scroll Lock**: Prevents background scrolling
* **Accessibility**: Full ARIA support and screen reader compatibility
* **Animation**: Smooth open/close animations

Popover
-------

Overlay content component for contextual information and actions.

Usage
~~~~~

.. code-block:: typescript

   import {
     Popover,
     PopoverContent,
     PopoverTrigger,
   } from '@/components/ui/popover';

   // Basic popover
   <Popover>
     <PopoverTrigger asChild>
       <Button variant="outline">Open Popover</Button>
     </PopoverTrigger>
     <PopoverContent>
       <div className="space-y-2">
         <h4 className="font-medium">Popover Title</h4>
         <p className="text-sm text-muted-foreground">
           This is the popover content.
         </p>
       </div>
     </PopoverContent>
   </Popover>

Advanced Usage
~~~~~~~~~~~~~~

.. code-block:: typescript

   // Settings popover
   function SettingsPopover() {
     return (
       <Popover>
         <PopoverTrigger asChild>
           <Button variant="ghost" size="icon">
             <Settings className="h-4 w-4" />
           </Button>
         </PopoverTrigger>
         <PopoverContent className="w-80">
           <div className="space-y-4">
             <div className="space-y-2">
               <h4 className="font-medium leading-none">Settings</h4>
               <p className="text-sm text-muted-foreground">
                 Customize your preferences.
               </p>
             </div>
             <div className="space-y-2">
               <div className="flex items-center space-x-2">
                 <Checkbox id="notifications" />
                 <Label htmlFor="notifications">Enable notifications</Label>
               </div>
               <div className="flex items-center space-x-2">
                 <Checkbox id="marketing" />
                 <Label htmlFor="marketing">Marketing emails</Label>
               </div>
             </div>
           </div>
         </PopoverContent>
       </Popover>
     );
   }

   // User profile popover
   function UserProfilePopover() {
     return (
       <Popover>
         <PopoverTrigger asChild>
           <Button variant="ghost" className="relative h-8 w-8 rounded-full">
             <Avatar>
               <AvatarImage src="/avatar.jpg" alt="User" />
               <AvatarFallback>JD</AvatarFallback>
             </Avatar>
           </Button>
         </PopoverTrigger>
         <PopoverContent className="w-56" align="end">
           <div className="space-y-2">
             <div className="flex items-center space-x-2">
               <Avatar className="h-8 w-8">
                 <AvatarImage src="/avatar.jpg" alt="User" />
                 <AvatarFallback>JD</AvatarFallback>
               </Avatar>
               <div>
                 <p className="text-sm font-medium">John Doe</p>
                 <p className="text-xs text-muted-foreground">john@example.com</p>
               </div>
             </div>
             <Separator />
             <div className="space-y-1">
               <Button variant="ghost" className="w-full justify-start">
                 <User className="mr-2 h-4 w-4" />
                 Profile
               </Button>
               <Button variant="ghost" className="w-full justify-start">
                 <Settings className="mr-2 h-4 w-4" />
                 Settings
               </Button>
               <Button variant="ghost" className="w-full justify-start">
                 <LogOut className="mr-2 h-4 w-4" />
                 Logout
               </Button>
             </div>
           </div>
         </PopoverContent>
       </Popover>
     );
   }

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Component
     - Key Props
     - Type
     - Description
   * - Popover
     - open, onOpenChange
     - boolean, function
     - Controlled open state
   * - PopoverContent
     - align, side
     - string, string
     - Positioning options
   * - PopoverTrigger
     - asChild
     - boolean
     - Render as child element

Positioning
~~~~~~~~~~~

PopoverContent supports various positioning options:

.. code-block:: typescript

   // Align options: start, center, end
   <PopoverContent align="start">Content</PopoverContent>

   // Side options: top, right, bottom, left
   <PopoverContent side="top">Content</PopoverContent>

   // Offset from trigger
   <PopoverContent sideOffset={10}>Content</PopoverContent>

Features
~~~~~~~~

* **Smart Positioning**: Automatically adjusts position to stay in viewport
* **Collision Detection**: Avoids viewport edges
* **Focus Management**: Proper focus handling
* **Keyboard Navigation**: Arrow keys and escape support
* **Accessibility**: ARIA attributes for screen readers

Toast Notifications
-------------------

Toast notifications are handled by the existing toast system. Here's how to use them effectively:

Usage
~~~~~

.. code-block:: typescript

   import { toast } from '@/components/ui/use-toast';

   // Success notification
   const handleSuccess = () => {
     toast({
       title: "Success!",
       description: "Your changes have been saved.",
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

   // Custom duration
   const handleCustom = () => {
     toast({
       title: "Custom Toast",
       description: "This will disappear in 10 seconds.",
       duration: 10000,
     });
   };

Advanced Toast Patterns
~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Toast with action
   const handleWithAction = () => {
     toast({
       title: "File deleted",
       description: "Your file has been moved to trash.",
       action: (
         <Button variant="outline" size="sm" onClick={undoDelete}>
           Undo
         </Button>
       ),
     });
   };

   // Loading toast that updates
   const handleAsyncOperation = async () => {
     const { dismiss } = toast({
       title: "Processing...",
       description: "Please wait while we process your request.",
       duration: Infinity, // Don't auto-dismiss
     });

     try {
       await performAsyncOperation();
       dismiss();
       toast({
         title: "Success!",
         description: "Operation completed successfully.",
       });
     } catch (error) {
       dismiss();
       toast({
         variant: "destructive",
         title: "Error",
         description: "Operation failed. Please try again.",
       });
     }
   };

Feedback Patterns
-----------------

Loading States
~~~~~~~~~~~~~~

.. code-block:: typescript

   function LoadingDialog() {
     const [loading, setLoading] = useState(false);

     const handleSubmit = async () => {
       setLoading(true);
       try {
         await submitData();
         toast({ title: "Success", description: "Data submitted successfully" });
       } catch (error) {
         toast({
           variant: "destructive",
           title: "Error",
           description: "Failed to submit data",
         });
       } finally {
         setLoading(false);
       }
     };

     return (
       <Dialog>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Submit Data</DialogTitle>
           </DialogHeader>
           <div className="py-4">
             <Button onClick={handleSubmit} disabled={loading}>
               {loading ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   Submitting...
                 </>
               ) : (
                 'Submit'
               )}
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     );
   }

Confirmation Patterns
~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   function useConfirmation() {
     const [isOpen, setIsOpen] = useState(false);
     const [config, setConfig] = useState({});

     const confirm = (options) => {
       return new Promise((resolve) => {
         setConfig({
           ...options,
           onConfirm: () => {
             resolve(true);
             setIsOpen(false);
           },
           onCancel: () => {
             resolve(false);
             setIsOpen(false);
           },
         });
         setIsOpen(true);
       });
     };

     const ConfirmationDialog = () => (
       <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{config.title}</DialogTitle>
             <DialogDescription>{config.description}</DialogDescription>
           </DialogHeader>
           <div className="flex justify-end space-x-2">
             <Button variant="outline" onClick={config.onCancel}>
               Cancel
             </Button>
             <Button variant="destructive" onClick={config.onConfirm}>
               Confirm
             </Button>
           </div>
         </DialogContent>
       </Dialog>
     );

     return { confirm, ConfirmationDialog };
   }

   // Usage
   function DeleteButton({ onDelete }) {
     const { confirm, ConfirmationDialog } = useConfirmation();

     const handleDelete = async () => {
       const confirmed = await confirm({
         title: "Delete Item",
         description: "Are you sure? This action cannot be undone.",
       });

       if (confirmed) {
         onDelete();
       }
     };

     return (
       <>
         <Button variant="destructive" onClick={handleDelete}>
           Delete
         </Button>
         <ConfirmationDialog />
       </>
     );
   }

Internationalization
--------------------

Feedback components support internationalization:

.. code-block:: typescript

   import { useTranslations } from 'next-intl';

   function LocalizedDialog() {
     const t = useTranslations('dialogs');

     return (
       <Dialog>
         <DialogTrigger asChild>
           <Button>{t('open')}</Button>
         </DialogTrigger>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>{t('confirmTitle')}</DialogTitle>
             <DialogDescription>{t('confirmDescription')}</DialogDescription>
           </DialogHeader>
           <div className="flex justify-end space-x-2">
             <DialogClose asChild>
               <Button variant="outline">{t('cancel')}</Button>
             </DialogClose>
             <Button>{t('confirm')}</Button>
           </div>
         </DialogContent>
       </Dialog>
     );
   }

Translation Keys
~~~~~~~~~~~~~~~~

Common translation keys for feedback components:

.. code-block:: json

   {
     "dialogs": {
       "open": "Open",
       "close": "Close",
       "cancel": "Cancel",
       "confirm": "Confirm",
       "save": "Save",
       "delete": "Delete",
       "confirmTitle": "Confirm Action",
       "confirmDescription": "Are you sure you want to proceed?"
     },
     "notifications": {
       "success": "Success",
       "error": "Error",
       "warning": "Warning",
       "info": "Information"
     }
   }

Accessibility
-------------

Feedback components follow WCAG 2.1 AA guidelines:

* **Focus Management**: Proper focus trapping and restoration
* **Keyboard Navigation**: Full keyboard support
* **Screen Readers**: ARIA attributes and announcements
* **Color Independence**: Information not conveyed by color alone
* **Touch Targets**: Minimum 44px touch targets

Dialog Accessibility
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   <Dialog>
     <DialogContent
       aria-labelledby="dialog-title"
       aria-describedby="dialog-description"
     >
       <DialogHeader>
         <DialogTitle id="dialog-title">Dialog Title</DialogTitle>
         <DialogDescription id="dialog-description">
           Dialog description
         </DialogDescription>
       </DialogHeader>
     </DialogContent>
   </Dialog>

Toast Accessibility
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Accessible toast notifications
   toast({
     title: "Success",
     description: "Operation completed",
     // Automatically announced to screen readers
   });

Testing
-------

Feedback components include comprehensive tests:

* **Rendering**: Components render correctly
* **Interactions**: User interactions work as expected
* **Focus Management**: Focus trapping and restoration
* **Keyboard Navigation**: All keyboard interactions
* **Accessibility**: ARIA attributes and screen reader support
