import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Header } from '../Header';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseTranslations = useTranslations as jest.MockedFunction<typeof useTranslations>;

// Mock translation function
const mockT = jest.fn((key: string) => {
  const translations: Record<string, string> = {
    'home': 'Home',
    'dashboard': 'Dashboard',
    'profile': 'Profile',
    'settings': 'Settings',
    'logout': 'Logout',
  };
  return translations[key] || key;
});

describe('Header', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    });
    mockUsePathname.mockReturnValue('/dashboard');
    mockUseTranslations.mockReturnValue(mockT);
    mockPush.mockClear();
  });

  it('renders header with logo and navigation', () => {
    render(<Header />);
    
    expect(screen.getByText('App')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('API Docs')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    render(<Header />);
    
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-accent');
  });

  it('shows mobile menu when hamburger is clicked', async () => {
    render(<Header />);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(screen.getAllByText('Home')).toHaveLength(2); // Desktop + mobile
    });
  });

  it('renders language switcher', () => {
    render(<Header />);
    
    expect(screen.getByTestId('language-switcher')).toBeInTheDocument();
  });

  it('renders user menu with profile options', async () => {
    render(<Header />);
    
    const userMenuButton = screen.getByLabelText('Open user menu');
    fireEvent.click(userMenuButton);
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  it('applies correct styling classes', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('border-b', 'bg-background/95', 'backdrop-blur');
  });

  it('handles custom className prop', () => {
    render(<Header className="custom-class" />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-class');
  });
});
