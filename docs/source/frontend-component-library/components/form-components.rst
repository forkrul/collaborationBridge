Form Components
===============

Form components provide advanced form handling capabilities with validation, accessibility, and internationalization support.

Form System
-----------

Complete form system built on React Hook Form with Zod validation integration.

Usage
~~~~~

.. code-block:: typescript

   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import * as z from 'zod';
   import {
     Form,
     FormControl,
     FormDescription,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
   } from '@/components/ui/form';

   const formSchema = z.object({
     email: z.string().email('Invalid email address'),
     name: z.string().min(2, 'Name must be at least 2 characters'),
   });

   function MyForm() {
     const form = useForm({
       resolver: zodResolver(formSchema),
       defaultValues: { email: '', name: '' },
     });

     const onSubmit = (data) => {
       console.log(data);
     };

     return (
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
           <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Email</FormLabel>
                 <FormControl>
                   <Input placeholder="Enter email" {...field} />
                 </FormControl>
                 <FormDescription>
                   We'll never share your email.
                 </FormDescription>
                 <FormMessage />
               </FormItem>
             )}
           />
           <Button type="submit">Submit</Button>
         </form>
       </Form>
     );
   }

Components
~~~~~~~~~~

FormField
^^^^^^^^^

Wrapper component that connects form controls to React Hook Form.

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Prop
     - Type
     - Default
     - Description
   * - control
     - Control
     - required
     - React Hook Form control
   * - name
     - string
     - required
     - Field name
   * - render
     - function
     - required
     - Render function

FormItem
^^^^^^^^

Container for form field components with proper spacing and layout.

FormLabel
^^^^^^^^^

Accessible label component that automatically associates with form controls.

FormControl
^^^^^^^^^^^

Wrapper for form control components that handles validation states.

FormDescription
^^^^^^^^^^^^^^^

Optional description text for form fields.

FormMessage
^^^^^^^^^^^

Displays validation error messages.

Select
------

Advanced dropdown selection component with search and keyboard navigation.

Usage
~~~~~

.. code-block:: typescript

   import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
   } from '@/components/ui/select';

   // Basic usage
   <Select>
     <SelectTrigger>
       <SelectValue placeholder="Select an option" />
     </SelectTrigger>
     <SelectContent>
       <SelectItem value="option1">Option 1</SelectItem>
       <SelectItem value="option2">Option 2</SelectItem>
       <SelectItem value="option3">Option 3</SelectItem>
     </SelectContent>
   </Select>

   // With form integration
   <FormField
     control={form.control}
     name="country"
     render={({ field }) => (
       <FormItem>
         <FormLabel>Country</FormLabel>
         <Select onValueChange={field.onChange} defaultValue={field.value}>
           <FormControl>
             <SelectTrigger>
               <SelectValue placeholder="Select a country" />
             </SelectTrigger>
           </FormControl>
           <SelectContent>
             <SelectItem value="us">United States</SelectItem>
             <SelectItem value="uk">United Kingdom</SelectItem>
             <SelectItem value="de">Germany</SelectItem>
           </SelectContent>
         </Select>
         <FormMessage />
       </FormItem>
     )}
   />

Props
~~~~~

.. list-table::
   :header-rows: 1
   :widths: 20 20 20 40

   * - Component
     - Key Props
     - Type
     - Description
   * - Select
     - value, onValueChange
     - string, function
     - Controlled value and change handler
   * - SelectTrigger
     - className
     - string
     - Additional CSS classes
   * - SelectValue
     - placeholder
     - string
     - Placeholder text
   * - SelectContent
     - className
     - string
     - Additional CSS classes
   * - SelectItem
     - value
     - string
     - Item value

Textarea
--------

Multi-line text input component with character counting and resize control.

Usage
~~~~~

.. code-block:: typescript

   import { Textarea } from '@/components/ui/textarea';

   // Basic usage
   <Textarea placeholder="Enter your message..." />

   // With form integration
   <FormField
     control={form.control}
     name="bio"
     render={({ field }) => (
       <FormItem>
         <FormLabel>Bio</FormLabel>
         <FormControl>
           <Textarea
             placeholder="Tell us about yourself..."
             className="resize-none"
             {...field}
           />
         </FormControl>
         <FormDescription>
           Brief description (max 500 characters)
         </FormDescription>
         <FormMessage />
       </FormItem>
     )}
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
   * - placeholder
     - string
     - undefined
     - Placeholder text
   * - disabled
     - boolean
     - false
     - Disable the textarea
   * - className
     - string
     - undefined
     - Additional CSS classes
   * - rows
     - number
     - undefined
     - Number of visible rows

FileUpload
----------

Advanced file upload component with drag & drop, validation, and progress tracking.

Usage
~~~~~

.. code-block:: typescript

   import { FileUpload } from '@/components/ui/file-upload';

   // Basic usage
   <FileUpload
     onFilesChange={(files) => console.log(files)}
   />

   // With restrictions
   <FileUpload
     accept="image/*,.pdf,.doc,.docx"
     multiple={true}
     maxSize={10 * 1024 * 1024} // 10MB
     maxFiles={5}
     onFilesChange={(files) => setFiles(files)}
   />

   // With form integration
   <FormField
     control={form.control}
     name="files"
     render={({ field }) => (
       <FormItem>
         <FormLabel>Upload Files</FormLabel>
         <FormControl>
           <FileUpload
             accept=".pdf,.doc,.docx"
             multiple={true}
             maxSize={5 * 1024 * 1024}
             onFilesChange={field.onChange}
           />
         </FormControl>
         <FormDescription>
           Upload PDF or Word documents (max 5MB each)
         </FormDescription>
         <FormMessage />
       </FormItem>
     )}
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
   * - onFilesChange
     - (files: File[]) => void
     - undefined
     - File change handler
   * - accept
     - string
     - undefined
     - Accepted file types
   * - multiple
     - boolean
     - false
     - Allow multiple files
   * - maxSize
     - number
     - 10MB
     - Maximum file size in bytes
   * - maxFiles
     - number
     - 5
     - Maximum number of files
   * - disabled
     - boolean
     - false
     - Disable the component

Features
~~~~~~~~

* **Drag & Drop**: Native drag and drop support
* **File Validation**: Type, size, and count validation
* **Progress Tracking**: Upload progress indication
* **Preview**: File preview with icons
* **Error Handling**: Clear error messages
* **Accessibility**: Full keyboard and screen reader support

MultiStepForm
-------------

Multi-step form component with progress tracking and validation.

Usage
~~~~~

.. code-block:: typescript

   import { MultiStepForm } from '@/components/ui/multi-step-form';

   const steps = [
     {
       id: 'personal',
       title: 'Personal Information',
       description: 'Tell us about yourself',
       component: PersonalInfoStep,
       validation: () => validatePersonalInfo(),
     },
     {
       id: 'contact',
       title: 'Contact Details',
       description: 'How can we reach you?',
       component: ContactStep,
       validation: () => validateContact(),
     },
     {
       id: 'review',
       title: 'Review & Submit',
       description: 'Please review your information',
       component: ReviewStep,
     },
   ];

   function RegistrationForm() {
     const handleComplete = (data) => {
       console.log('Form completed:', data);
     };

     return (
       <MultiStepForm
         steps={steps}
         onComplete={handleComplete}
         showProgress={true}
         allowSkip={false}
       />
     );
   }

Step Component Interface
~~~~~~~~~~~~~~~~~~~~~~~~

Each step component receives these props:

.. code-block:: typescript

   interface StepComponentProps {
     onNext: () => void;
     onPrevious: () => void;
     isFirst: boolean;
     isLast: boolean;
     data: any;
     updateData: (data: any) => void;
   }

   function PersonalInfoStep({ data, updateData }: StepComponentProps) {
     return (
       <div className="space-y-4">
         <Input
           placeholder="First Name"
           value={data.firstName || ''}
           onChange={(e) => updateData({ firstName: e.target.value })}
         />
         <Input
           placeholder="Last Name"
           value={data.lastName || ''}
           onChange={(e) => updateData({ lastName: e.target.value })}
         />
       </div>
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
   * - steps
     - Step[]
     - required
     - Array of step definitions
   * - onComplete
     - (data: any) => void
     - required
     - Completion handler
   * - onCancel
     - () => void
     - undefined
     - Cancel handler
   * - showProgress
     - boolean
     - true
     - Show progress bar
   * - allowSkip
     - boolean
     - false
     - Allow skipping steps

Features
~~~~~~~~

* **Progress Tracking**: Visual progress indicator
* **Step Navigation**: Forward/backward navigation
* **Validation**: Per-step validation support
* **Data Management**: Centralized form data
* **Accessibility**: Full keyboard navigation
* **Responsive**: Mobile-friendly design

Form Validation Patterns
-------------------------

Zod Schema Examples
~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Basic validation
   const basicSchema = z.object({
     email: z.string().email('Invalid email'),
     password: z.string().min(8, 'Password must be at least 8 characters'),
   });

   // Complex validation
   const complexSchema = z.object({
     name: z.string()
       .min(2, 'Name must be at least 2 characters')
       .max(50, 'Name must be less than 50 characters'),
     age: z.number()
       .min(18, 'Must be at least 18 years old')
       .max(120, 'Age must be realistic'),
     email: z.string()
       .email('Invalid email format')
       .refine(async (email) => {
         // Custom async validation
         const exists = await checkEmailExists(email);
         return !exists;
       }, 'Email already exists'),
     confirmPassword: z.string(),
   }).refine((data) => data.password === data.confirmPassword, {
     message: "Passwords don't match",
     path: ["confirmPassword"],
   });

Custom Validation
~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Custom validator function
   const validatePhoneNumber = (phone: string) => {
     const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
     return phoneRegex.test(phone);
   };

   // Schema with custom validation
   const schema = z.object({
     phone: z.string()
       .refine(validatePhoneNumber, 'Invalid phone number format'),
   });

Internationalization
--------------------

All form components support internationalization:

.. code-block:: typescript

   import { useTranslations } from 'next-intl';

   function InternationalizedForm() {
     const t = useTranslations('forms');

     return (
       <FormField
         name="email"
         render={({ field }) => (
           <FormItem>
             <FormLabel>{t('email')}</FormLabel>
             <FormControl>
               <Input placeholder={t('emailPlaceholder')} {...field} />
             </FormControl>
             <FormMessage />
           </FormItem>
         )}
       />
     );
   }

Error Message Translation
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: typescript

   // Translation-aware validation
   const createSchema = (t: (key: string) => string) => z.object({
     email: z.string().email(t('validation.invalidEmail')),
     password: z.string().min(8, t('validation.passwordTooShort')),
   });

Accessibility
-------------

Form components follow WCAG 2.1 AA guidelines:

* **Labels**: Proper label association with form controls
* **Error Messages**: Clear, descriptive error messages
* **Focus Management**: Logical tab order and focus indicators
* **Screen Readers**: ARIA attributes for form state
* **Keyboard Navigation**: Full keyboard support

Best Practices
--------------

Form Structure
~~~~~~~~~~~~~~

.. code-block:: typescript

   // Good: Proper form structure
   <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)}>
       <fieldset>
         <legend>Personal Information</legend>
         <FormField name="firstName" />
         <FormField name="lastName" />
       </fieldset>
       <Button type="submit">Submit</Button>
     </form>
   </Form>

Error Handling
~~~~~~~~~~~~~~

.. code-block:: typescript

   // Good: Comprehensive error handling
   const onSubmit = async (data) => {
     try {
       await submitForm(data);
       toast({ title: 'Success', description: 'Form submitted successfully' });
     } catch (error) {
       toast({
         variant: 'destructive',
         title: 'Error',
         description: 'Failed to submit form. Please try again.',
       });
     }
   };

Performance
~~~~~~~~~~~

.. code-block:: typescript

   // Good: Debounced validation
   const debouncedValidation = useMemo(
     () => debounce(async (value) => {
       // Async validation logic
     }, 300),
     []
   );

Testing
-------

Form components include comprehensive tests:

* **Validation**: All validation rules work correctly
* **Submission**: Form submission handles success and error cases
* **Accessibility**: ARIA attributes and keyboard navigation
* **User Interactions**: All user interactions work as expected
