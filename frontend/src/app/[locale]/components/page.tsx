import { useTranslations } from 'next-intl';
import { 
  Calendar, 
  Download, 
  Mail, 
  Plus, 
  Search, 
  Settings,
  User,
  ChevronDown
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { FileUpload } from '@/components/ui/file-upload';
import { Chart, StatCard } from '@/components/ui/chart';
import { SearchWithFilters } from '@/components/ui/search';
import { Badge } from '@/components/ui/badge';

export default function ComponentsPage() {
  const t = useTranslations('common');

  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Component Showcase</h1>
          <p className="text-muted-foreground mt-2">
            Explore all available UI components with i18n support
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Components</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Buttons Section */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Various button styles and states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button disabled>Disabled</Button>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              With Icon
            </Button>
            <Button>
              {t('loading')}
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Components */}
      <Card>
        <CardHeader>
          <CardTitle>Form Components</CardTitle>
          <CardDescription>Input fields, selects, and form controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Type your message here..." />
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>Displaying data in a structured format</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of recent users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      {t('edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Progress & Feedback</CardTitle>
          <CardDescription>Progress indicators and user feedback</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Upload Progress</Label>
            <Progress value={33} className="w-full" />
            <p className="text-sm text-muted-foreground">33% complete</p>
          </div>

          <div className="space-y-2">
            <Label>Processing</Label>
            <Progress value={75} className="w-full" />
            <p className="text-sm text-muted-foreground">75% complete</p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
                  Are you sure you want to perform this action? This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline">{t('cancel')}</Button>
                <Button>{t('confirm')}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Advanced Components */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Components</CardTitle>
          <CardDescription>File uploads, search, and data visualization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* File Upload */}
          <div className="space-y-4">
            <h4 className="font-semibold">File Upload</h4>
            <FileUpload
              accept="image/*,.pdf,.doc,.docx"
              multiple={true}
              maxSize={5 * 1024 * 1024} // 5MB
              maxFiles={3}
              onFilesChange={(files) => console.log('Files:', files)}
            />
          </div>

          {/* Search with Filters */}
          <div className="space-y-4">
            <h4 className="font-semibold">Search with Filters</h4>
            <SearchWithFilters
              placeholder="Search users..."
              filters={[
                {
                  id: 'role',
                  label: 'Role',
                  type: 'select',
                  options: [
                    { value: 'admin', label: 'Admin' },
                    { value: 'user', label: 'User' },
                    { value: 'editor', label: 'Editor' }
                  ]
                },
                {
                  id: 'status',
                  label: 'Status',
                  type: 'checkbox',
                  options: [
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'pending', label: 'Pending' }
                  ]
                }
              ]}
              onSearch={(query, filters) => console.log('Search:', query, filters)}
            />
          </div>

          {/* Badges */}
          <div className="space-y-4">
            <h4 className="font-semibold">Badges</h4>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Chart
          title="Monthly Revenue"
          description="Revenue trends over the last 6 months"
          type="bar"
          data={[
            { label: 'Jan', value: 12000 },
            { label: 'Feb', value: 15000 },
            { label: 'Mar', value: 18000 },
            { label: 'Apr', value: 14000 },
            { label: 'May', value: 22000 },
            { label: 'Jun', value: 25000 }
          ]}
        />

        <Chart
          title="User Distribution"
          description="Users by role"
          type="pie"
          data={[
            { label: 'Admin', value: 5, color: '#3b82f6' },
            { label: 'Editor', value: 15, color: '#10b981' },
            { label: 'User', value: 80, color: '#f59e0b' }
          ]}
        />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={2543}
          change={12}
          changeLabel="from last month"
          icon={<User className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          title="Revenue"
          value="€45,231"
          change={8}
          changeLabel="from last month"
          icon={<div className="h-5 w-5 text-green-600">€</div>}
        />
        <StatCard
          title="Orders"
          value={1234}
          change={-3}
          changeLabel="from last month"
          icon={<div className="h-5 w-5 text-orange-600">📦</div>}
        />
        <StatCard
          title="Growth Rate"
          value="12.5%"
          change={2}
          changeLabel="from last month"
          icon={<div className="h-5 w-5 text-purple-600">📈</div>}
        />
      </div>
    </div>
  );
}
