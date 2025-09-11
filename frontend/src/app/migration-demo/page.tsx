'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  TextField,
  Select,
  Badge,
  Dialog,
  DialogTrigger,
  DialogContent,
  useMigrationTheme
} from '@/components/migration';

// Dialog Demo Component
function DialogDemo({ useReshaped }: { useReshaped: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex gap-4">
      <Button
        useReshaped={useReshaped}
        onClick={() => setIsOpen(true)}
      >
        Open Dialog
      </Button>

      <Dialog
        useReshaped={useReshaped}
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Confirmation"
        description="Are you sure you want to continue? This action cannot be undone."
        confirmText="Continue"
        cancelText="Cancel"
        onConfirm={() => {
          console.log('Confirmed!');
          setIsOpen(false);
        }}
        onCancel={() => {
          console.log('Cancelled!');
          setIsOpen(false);
        }}
      >
        <p>This is the dialog content. You can put any content here.</p>
      </Dialog>
    </div>
  );
}

export default function MigrationDemoPage() {
  const [useReshaped, setUseReshaped] = useState(false);
  const { colorTheme, isDark, toggleDarkMode, setColorTheme, availableColorThemes } = useMigrationTheme();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Migration Demo</h1>
        <p className="text-muted-foreground">
          Testing the coexistence of shadcn/ui and Reshaped UI components
        </p>
      </div>

      {/* Migration Controls */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title>Migration Controls</Card.Title>
          <Card.Description>
            Toggle between shadcn/ui and Reshaped UI components
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useReshaped}
                onChange={(e) => setUseReshaped(e.target.checked)}
                className="rounded"
              />
              <span>Use Reshaped UI</span>
            </label>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Current Theme:</span>
            <span className="font-mono">{colorTheme}</span>
            <span>({isDark ? 'dark' : 'light'})</span>
            <Button onClick={toggleDarkMode} size="sm">
              Toggle {isDark ? 'Light' : 'Dark'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableColorThemes.map((theme) => (
              <Button
                key={theme}
                onClick={() => setColorTheme(theme)}
                variant={colorTheme === theme ? 'default' : 'outline'}
                size="sm"
              >
                {theme}
              </Button>
            ))}
          </div>
        </Card.Content>
      </Card>

      {/* Button Variants Demo */}
      <Card className="p-6" useReshaped={useReshaped}>
        <Card.Header useReshaped={useReshaped}>
          <Card.Title useReshaped={useReshaped}>Button Variants</Card.Title>
          <Card.Description useReshaped={useReshaped}>
            Comparing button styles between the two systems
          </Card.Description>
        </Card.Header>
        <Card.Content useReshaped={useReshaped}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button useReshaped={useReshaped}>Default</Button>
            <Button useReshaped={useReshaped} variant="destructive">Destructive</Button>
            <Button useReshaped={useReshaped} variant="outline">Outline</Button>
            <Button useReshaped={useReshaped} variant="secondary">Secondary</Button>
            <Button useReshaped={useReshaped} variant="ghost">Ghost</Button>
            <Button useReshaped={useReshaped} variant="link">Link</Button>
          </div>
        </Card.Content>
      </Card>

      {/* Button Sizes Demo */}
      <Card className="p-6" useReshaped={useReshaped}>
        <Card.Header useReshaped={useReshaped}>
          <Card.Title useReshaped={useReshaped}>Button Sizes</Card.Title>
        </Card.Header>
        <Card.Content useReshaped={useReshaped}>
          <div className="flex items-center gap-4">
            <Button useReshaped={useReshaped} size="sm">Small</Button>
            <Button useReshaped={useReshaped}>Default</Button>
            <Button useReshaped={useReshaped} size="lg">Large</Button>
          </div>
        </Card.Content>
      </Card>

      {/* Button States Demo */}
      <Card className="p-6" useReshaped={useReshaped}>
        <Card.Header useReshaped={useReshaped}>
          <Card.Title useReshaped={useReshaped}>Button States</Card.Title>
        </Card.Header>
        <Card.Content useReshaped={useReshaped}>
          <div className="flex items-center gap-4">
            <Button useReshaped={useReshaped}>Normal</Button>
            <Button useReshaped={useReshaped} disabled>Disabled</Button>
            <Button useReshaped={useReshaped} loading>Loading</Button>
          </div>
        </Card.Content>
      </Card>

      {/* Card Variants Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Card.Header>
            <Card.Title>shadcn/ui Card</Card.Title>
            <Card.Description>Traditional shadcn/ui styling</Card.Description>
          </Card.Header>
          <Card.Content>
            <p>This card uses the original shadcn/ui components.</p>
          </Card.Content>
          <Card.Footer>
            <Button>Action</Button>
          </Card.Footer>
        </Card>

        <Card className="p-6" useReshaped={true}>
          <Card.Header useReshaped={true}>
            <Card.Title useReshaped={true}>Reshaped Card</Card.Title>
            <Card.Description useReshaped={true}>Reshaped UI styling</Card.Description>
          </Card.Header>
          <Card.Content useReshaped={true}>
            <p>This card uses the new Reshaped UI components.</p>
          </Card.Content>
          <Card.Footer useReshaped={true}>
            <Button useReshaped={true}>Action</Button>
          </Card.Footer>
        </Card>
      </div>

      {/* Phase 2 Components Demo */}
      <Card className="p-6" useReshaped={useReshaped}>
        <Card.Header useReshaped={useReshaped}>
          <Card.Title useReshaped={useReshaped}>Phase 2: Form Components</Card.Title>
          <Card.Description useReshaped={useReshaped}>
            TextField, Select, Badge, and Dialog components
          </Card.Description>
        </Card.Header>
        <Card.Content useReshaped={useReshaped}>
          <div className="space-y-6">
            {/* TextField Demo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">TextField Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  useReshaped={useReshaped}
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  helperText="We'll never share your email"
                />
                <TextField
                  useReshaped={useReshaped}
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter password"
                  hasError
                  errorMessage="Password is required"
                />
              </div>
            </div>

            {/* Select Demo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Components</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  useReshaped={useReshaped}
                  name="country"
                  label="Country"
                  placeholder="Select a country"
                  options={[
                    { label: 'United States', value: 'us' },
                    { label: 'Canada', value: 'ca' },
                    { label: 'United Kingdom', value: 'uk' },
                    { label: 'Germany', value: 'de' },
                  ]}
                />
                <Select
                  useReshaped={useReshaped}
                  name="priority"
                  label="Priority"
                  placeholder="Select priority"
                  hasError
                  errorMessage="Priority is required"
                  options={[
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'High', value: 'high' },
                    { label: 'Critical', value: 'critical' },
                  ]}
                />
              </div>
            </div>

            {/* Badge Demo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Badge Components</h3>
              <div className="flex flex-wrap gap-2">
                <Badge useReshaped={useReshaped}>Default</Badge>
                <Badge useReshaped={useReshaped} variant="secondary">Secondary</Badge>
                <Badge useReshaped={useReshaped} variant="destructive">Destructive</Badge>
                <Badge useReshaped={useReshaped} variant="outline">Outline</Badge>
                {useReshaped && (
                  <>
                    <Badge useReshaped color="positive">Positive</Badge>
                    <Badge useReshaped color="warning">Warning</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Dialog Demo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dialog Components</h3>
              <DialogDemo useReshaped={useReshaped} />
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* System Information */}
      <Card className="p-6">
        <Card.Header>
          <Card.Title>System Information</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="space-y-2 font-mono text-sm">
            <div>Color Theme: {colorTheme}</div>
            <div>Appearance: {isDark ? 'dark' : 'light'}</div>
            <div>Using Reshaped: {useReshaped ? 'Yes' : 'No'}</div>
            <div>Available Themes: {availableColorThemes.join(', ')}</div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
