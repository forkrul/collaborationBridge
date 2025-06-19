'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { MultiStepForm, ExampleMultiStepForm } from '@/components/ui/multi-step-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  country: z.string().min(1, 'Please select a country'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  newsletter: z.boolean().default(false),
  files: z.array(z.any()).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function FormsPage() {
  const t = useTranslations('common');
  const [showMultiStep, setShowMultiStep] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      bio: '',
      skills: [],
      newsletter: false,
      files: [],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    setSubmittedData(data);
  };

  const skillOptions = [
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'Design',
    'Marketing',
  ];

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'za', label: 'South Africa' },
    { value: 'ch', label: 'Switzerland' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Advanced Forms</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive form examples with validation, file uploads, and multi-step workflows
        </p>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Forms</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Form Type Selector */}
      <div className="flex space-x-4">
        <Button
          variant={!showMultiStep ? 'default' : 'outline'}
          onClick={() => setShowMultiStep(false)}
        >
          Single Form
        </Button>
        <Button
          variant={showMultiStep ? 'default' : 'outline'}
          onClick={() => setShowMultiStep(true)}
        >
          Multi-Step Form
        </Button>
      </div>

      {!showMultiStep ? (
        /* Single Form */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>User Registration Form</CardTitle>
              <CardDescription>
                Complete form with validation, file uploads, and advanced inputs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Information */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {countryOptions.map((country) => (
                              <SelectItem key={country.value} value={country.value}>
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bio */}
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
                          Brief description about yourself (max 500 characters)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Skills */}
                  <FormField
                    control={form.control}
                    name="skills"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Skills</FormLabel>
                          <FormDescription>
                            Select your areas of expertise
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {skillOptions.map((skill) => (
                            <FormField
                              key={skill}
                              control={form.control}
                              name="skills"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={skill}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(skill)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, skill])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== skill
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {skill}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Upload */}
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume/Portfolio</FormLabel>
                        <FormControl>
                          <FileUpload
                            accept=".pdf,.doc,.docx,image/*"
                            multiple={true}
                            maxSize={10 * 1024 * 1024} // 10MB
                            maxFiles={3}
                            onFilesChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          Upload your resume or portfolio files (PDF, DOC, or images)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Newsletter */}
                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Subscribe to newsletter
                          </FormLabel>
                          <FormDescription>
                            Receive updates about new features and opportunities
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {t('submit') || 'Submit'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Form Data Display */}
          {submittedData && (
            <Card>
              <CardHeader>
                <CardTitle>Submitted Data</CardTitle>
                <CardDescription>Form data with validation results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Personal Information</h4>
                    <p className="text-sm text-muted-foreground">
                      {submittedData.firstName} {submittedData.lastName}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">Contact</h4>
                    <p className="text-sm text-muted-foreground">
                      {submittedData.email}
                      {submittedData.phone && ` • ${submittedData.phone}`}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Skills</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {submittedData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {submittedData.bio && (
                    <div>
                      <h4 className="font-medium">Bio</h4>
                      <p className="text-sm text-muted-foreground">
                        {submittedData.bio}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium">Newsletter</h4>
                    <p className="text-sm text-muted-foreground">
                      {submittedData.newsletter ? 'Subscribed' : 'Not subscribed'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Multi-Step Form */
        <Card>
          <CardHeader>
            <CardTitle>Multi-Step Registration</CardTitle>
            <CardDescription>
              Step-by-step form with progress tracking and validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExampleMultiStepForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
