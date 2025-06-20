import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LanguageSwitcher } from '../LanguageSwitcher';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useLocale: jest.fn(),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockUseLocale = useLocale as jest.MockedFunction<typeof useLocale>;

describe('LanguageSwitcher', () => {
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
    mockUseLocale.mockReturnValue('en-GB');
    mockPush.mockClear();
  });

  it('renders current locale correctly', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('English (UK)')).toBeInTheDocument();
  });

  it('shows all supported locales in dropdown', async () => {
    render(<LanguageSwitcher />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByText('Afrikaans')).toBeInTheDocument();
      expect(screen.getByText('Deutsch')).toBeInTheDocument();
      expect(screen.getByText('Română')).toBeInTheDocument();
      expect(screen.getByText('isiZulu')).toBeInTheDocument();
      expect(screen.getByText('Züritüütsch')).toBeInTheDocument();
    });
  });

  it('navigates to correct locale path when language is selected', async () => {
    render(<LanguageSwitcher />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Deutsch'));
    });

    expect(mockPush).toHaveBeenCalledWith('/de/dashboard');
  });

  it('handles root path correctly', async () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<LanguageSwitcher />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Afrikaans'));
    });

    expect(mockPush).toHaveBeenCalledWith('/af/');
  });

  it('renders compact variant correctly', () => {
    render(<LanguageSwitcher variant="compact" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8', 'w-8');
    expect(screen.getByLabelText('Change language')).toBeInTheDocument();
  });

  it('sets locale cookie when language is changed', async () => {
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });

    render(<LanguageSwitcher />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      fireEvent.click(screen.getByText('Afrikaans'));
    });

    expect(document.cookie).toContain('NEXT_LOCALE=af');
  });
});
