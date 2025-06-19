import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../form';
import { Input } from '../input';
import { Button } from '../button';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type FormData = z.infer<typeof formSchema>;

function TestForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  const onSubmit = jest.fn();

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
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormDescription>
                We'll never share your email with anyone else.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

describe('Form Components', () => {
  it('renders form fields correctly', () => {
    render(<TestForm />);
    
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByText("We'll never share your email with anyone else.")).toBeInTheDocument();
  });

  it('shows validation errors for invalid input', async () => {
    render(<TestForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByText('Submit');
    
    // Enter invalid data
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(nameInput, { target: { value: 'a' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn();
    render(<TestForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByText('Submit');
    
    // Enter valid data
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Invalid email address')).not.toBeInTheDocument();
      expect(screen.queryByText('Name must be at least 2 characters')).not.toBeInTheDocument();
    });
  });

  it('applies correct ARIA attributes', () => {
    render(<TestForm />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const nameInput = screen.getByPlaceholderText('Enter your name');
    
    expect(emailInput).toHaveAttribute('aria-describedby');
    expect(nameInput).toHaveAttribute('aria-describedby');
  });

  it('associates labels with inputs correctly', () => {
    render(<TestForm />);
    
    const emailLabel = screen.getByText('Email');
    const nameLabel = screen.getByText('Name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const nameInput = screen.getByPlaceholderText('Enter your name');
    
    expect(emailLabel).toHaveAttribute('for', emailInput.id);
    expect(nameLabel).toHaveAttribute('for', nameInput.id);
  });
});
