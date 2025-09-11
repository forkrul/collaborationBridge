import React from 'react';
import { render, screen } from '@testing-library/react';
import { MigratedProgress } from '../MigratedProgress';
import { CoexistenceProvider } from '../CoexistenceProvider';

// Mock Reshaped components
jest.mock('reshaped', () => ({
  Progress: ({ value, max, color, size, ...props }: any) => (
    <div 
      data-testid="reshaped-progress"
      data-value={value}
      data-max={max}
      data-color={color}
      data-size={size}
      {...props}
    />
  ),
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <CoexistenceProvider>
      {component}
    </CoexistenceProvider>
  );
};

describe('MigratedProgress', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn progress by default', () => {
      renderWithProvider(
        <MigratedProgress value={50} />
      );
      
      // shadcn Progress uses progressbar role
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-progress')).not.toBeInTheDocument();
    });

    it('displays correct value', () => {
      renderWithProvider(
        <MigratedProgress value={75} max={100} />
      );
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '75');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('renders with label and showValue', () => {
      renderWithProvider(
        <MigratedProgress 
          value={60} 
          label="Loading Progress"
          showValue
        />
      );
      
      expect(screen.getByText('Loading Progress')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
    });

    it('uses custom formatValue function', () => {
      renderWithProvider(
        <MigratedProgress 
          value={30} 
          max={50}
          showValue
          formatValue={(value, max) => `${value} of ${max} items`}
        />
      );
      
      expect(screen.getByText('30 of 50 items')).toBeInTheDocument();
    });

    it('renders without label wrapper when no label or showValue', () => {
      renderWithProvider(
        <MigratedProgress value={25} />
      );
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      // Should not have wrapper div with label
      expect(progress.parentElement?.className).not.toContain('space-y-2');
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped Progress when useReshaped is true', () => {
      renderWithProvider(
        <MigratedProgress 
          useReshaped
          value={50}
        />
      );
      
      const progress = screen.getByTestId('reshaped-progress');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('data-value', '50');
    });

    it('passes Reshaped-specific props correctly', () => {
      renderWithProvider(
        <MigratedProgress 
          useReshaped
          value={75}
          max={100}
          color="critical"
          size="small"
          min={0}
          duration={2000}
        />
      );
      
      const progress = screen.getByTestId('reshaped-progress');
      expect(progress).toHaveAttribute('data-value', '75');
      expect(progress).toHaveAttribute('data-max', '100');
      expect(progress).toHaveAttribute('data-color', 'critical');
      expect(progress).toHaveAttribute('data-size', 'small');
    });

    it('renders with label and showValue in Reshaped mode', () => {
      renderWithProvider(
        <MigratedProgress 
          useReshaped
          value={80} 
          label="Upload Progress"
          showValue
        />
      );
      
      expect(screen.getByText('Upload Progress')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('calculates percentage correctly with min value', () => {
      renderWithProvider(
        <MigratedProgress 
          useReshaped
          value={75}
          min={50}
          max={100}
          showValue
        />
      );
      
      // (75 - 50) / (100 - 50) * 100 = 50%
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });

  describe('prop mapping', () => {
    it('maps value prop correctly', () => {
      renderWithProvider(
        <MigratedProgress value={42} />
      );
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '42');
    });

    it('maps max prop correctly', () => {
      renderWithProvider(
        <MigratedProgress value={30} max={60} />
      );
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemax', '60');
    });

    it('handles zero value correctly', () => {
      renderWithProvider(
        <MigratedProgress value={0} showValue />
      );
      
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles 100% value correctly', () => {
      renderWithProvider(
        <MigratedProgress value={100} showValue />
      );
      
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles undefined value gracefully', () => {
      renderWithProvider(
        <MigratedProgress showValue />
      );
      
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('handles custom className', () => {
      renderWithProvider(
        <MigratedProgress 
          value={50} 
          className="custom-progress-class"
        />
      );
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveClass('custom-progress-class');
    });
  });
});
