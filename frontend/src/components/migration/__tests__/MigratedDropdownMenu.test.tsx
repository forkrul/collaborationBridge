import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { 
  MigratedDropdownMenu, 
  MigratedDropdownMenuTrigger, 
  MigratedDropdownMenuContent,
  MigratedDropdownMenuItem,
  MigratedDropdownMenuSection
} from '../MigratedDropdownMenu';
import { CoexistenceProvider } from '../CoexistenceProvider';

// Mock Reshaped components
jest.mock('reshaped', () => ({
  DropdownMenu: ({ children, position, width, onClose, ...props }: any) => (
    <div 
      data-testid="reshaped-dropdown-menu"
      data-position={position}
      data-width={width}
      {...props}
    >
      {children}
    </div>
  ),
}));

// Mock Reshaped DropdownMenu sub-components
const mockReshapedDropdownMenu = {
  Trigger: ({ children, ...props }: any) => (
    <div data-testid="reshaped-dropdown-trigger" {...props}>
      {typeof children === 'function' ? children({ 'data-testid': 'trigger-attributes' }) : children}
    </div>
  ),
  Content: ({ children, ...props }: any) => (
    <div data-testid="reshaped-dropdown-content" {...props}>
      {children}
    </div>
  ),
  Item: ({ children, onClick, ...props }: any) => (
    <div 
      data-testid="reshaped-dropdown-item" 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  ),
  Section: ({ children, ...props }: any) => (
    <div data-testid="reshaped-dropdown-section" {...props}>
      {children}
    </div>
  ),
  SubMenu: ({ children, ...props }: any) => (
    <div data-testid="reshaped-dropdown-submenu" {...props}>
      {children}
    </div>
  ),
  SubTrigger: ({ children, ...props }: any) => (
    <div data-testid="reshaped-dropdown-subtrigger" {...props}>
      {children}
    </div>
  ),
};

// Add sub-components to the mocked DropdownMenu
require('reshaped').DropdownMenu.Trigger = mockReshapedDropdownMenu.Trigger;
require('reshaped').DropdownMenu.Content = mockReshapedDropdownMenu.Content;
require('reshaped').DropdownMenu.Item = mockReshapedDropdownMenu.Item;
require('reshaped').DropdownMenu.Section = mockReshapedDropdownMenu.Section;
require('reshaped').DropdownMenu.SubMenu = mockReshapedDropdownMenu.SubMenu;
require('reshaped').DropdownMenu.SubTrigger = mockReshapedDropdownMenu.SubTrigger;

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <CoexistenceProvider>
      {component}
    </CoexistenceProvider>
  );
};

describe('MigratedDropdownMenu', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn DropdownMenu by default', () => {
      renderWithProvider(
        <MigratedDropdownMenu>
          <div>Test Content</div>
        </MigratedDropdownMenu>
      );
      
      // shadcn DropdownMenu doesn't render visible content by default
      expect(screen.queryByTestId('reshaped-dropdown-menu')).not.toBeInTheDocument();
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped DropdownMenu when useReshaped is true', () => {
      renderWithProvider(
        <MigratedDropdownMenu useReshaped>
          <div>Test Content</div>
        </MigratedDropdownMenu>
      );
      
      expect(screen.getByTestId('reshaped-dropdown-menu')).toBeInTheDocument();
    });

    it('passes Reshaped-specific props correctly', () => {
      renderWithProvider(
        <MigratedDropdownMenu 
          useReshaped 
          position="top-end" 
          width="trigger"
        >
          <div>Test Content</div>
        </MigratedDropdownMenu>
      );
      
      const menu = screen.getByTestId('reshaped-dropdown-menu');
      expect(menu).toHaveAttribute('data-position', 'top-end');
      expect(menu).toHaveAttribute('data-width', 'trigger');
    });
  });
});

describe('MigratedDropdownMenuTrigger', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders children directly in shadcn mode', () => {
      renderWithProvider(
        <MigratedDropdownMenuTrigger>
          <button>Trigger Button</button>
        </MigratedDropdownMenuTrigger>
      );
      
      expect(screen.getByText('Trigger Button')).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-dropdown-trigger')).not.toBeInTheDocument();
    });

    it('handles render prop pattern in shadcn mode', () => {
      renderWithProvider(
        <MigratedDropdownMenuTrigger>
          {(attrs) => <button {...attrs}>Render Prop Button</button>}
        </MigratedDropdownMenuTrigger>
      );
      
      expect(screen.getByText('Render Prop Button')).toBeInTheDocument();
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped DropdownMenuTrigger when useReshaped is true', () => {
      renderWithProvider(
        <MigratedDropdownMenuTrigger useReshaped>
          <button>Trigger Button</button>
        </MigratedDropdownMenuTrigger>
      );
      
      expect(screen.getByTestId('reshaped-dropdown-trigger')).toBeInTheDocument();
    });

    it('handles render prop pattern in Reshaped mode', () => {
      renderWithProvider(
        <MigratedDropdownMenuTrigger useReshaped>
          {(attrs) => <button {...attrs}>Render Prop Button</button>}
        </MigratedDropdownMenuTrigger>
      );
      
      expect(screen.getByText('Render Prop Button')).toBeInTheDocument();
      expect(screen.getByTestId('trigger-attributes')).toBeInTheDocument();
    });
  });
});

describe('MigratedDropdownMenuContent', () => {
  describe('Reshaped mode', () => {
    it('renders Reshaped DropdownMenuContent when useReshaped is true', () => {
      renderWithProvider(
        <MigratedDropdownMenuContent useReshaped>
          <div>Content</div>
        </MigratedDropdownMenuContent>
      );
      
      expect(screen.getByTestId('reshaped-dropdown-content')).toBeInTheDocument();
    });
  });
});

describe('MigratedDropdownMenuItem', () => {
  describe('Reshaped mode', () => {
    it('renders Reshaped DropdownMenuItem when useReshaped is true', () => {
      renderWithProvider(
        <MigratedDropdownMenuItem useReshaped>
          Menu Item
        </MigratedDropdownMenuItem>
      );
      
      expect(screen.getByTestId('reshaped-dropdown-item')).toBeInTheDocument();
      expect(screen.getByText('Menu Item')).toBeInTheDocument();
    });

    it('handles onClick events correctly', () => {
      const handleClick = jest.fn();
      renderWithProvider(
        <MigratedDropdownMenuItem useReshaped onClick={handleClick}>
          Clickable Item
        </MigratedDropdownMenuItem>
      );
      
      const item = screen.getByTestId('reshaped-dropdown-item');
      fireEvent.click(item);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});

describe('MigratedDropdownMenuSection', () => {
  describe('Reshaped mode', () => {
    it('renders Reshaped DropdownMenuSection when useReshaped is true', () => {
      renderWithProvider(
        <MigratedDropdownMenuSection useReshaped>
          <div>Section Content</div>
        </MigratedDropdownMenuSection>
      );
      
      expect(screen.getByTestId('reshaped-dropdown-section')).toBeInTheDocument();
    });
  });

  describe('shadcn/ui mode (default)', () => {
    it('renders as DropdownMenuGroup in shadcn mode', () => {
      renderWithProvider(
        <MigratedDropdownMenuSection>
          <div>Section Content</div>
        </MigratedDropdownMenuSection>
      );
      
      expect(screen.getByText('Section Content')).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-dropdown-section')).not.toBeInTheDocument();
    });
  });
});

describe('Complete DropdownMenu Integration', () => {
  it('renders complete dropdown structure in Reshaped mode', () => {
    renderWithProvider(
      <MigratedDropdownMenu useReshaped>
        <MigratedDropdownMenuTrigger useReshaped>
          {(attrs) => <button {...attrs}>Open Menu</button>}
        </MigratedDropdownMenuTrigger>
        <MigratedDropdownMenuContent useReshaped>
          <MigratedDropdownMenuSection useReshaped>
            <MigratedDropdownMenuItem useReshaped>Item 1</MigratedDropdownMenuItem>
            <MigratedDropdownMenuItem useReshaped>Item 2</MigratedDropdownMenuItem>
          </MigratedDropdownMenuSection>
        </MigratedDropdownMenuContent>
      </MigratedDropdownMenu>
    );
    
    expect(screen.getByTestId('reshaped-dropdown-menu')).toBeInTheDocument();
    expect(screen.getByTestId('reshaped-dropdown-trigger')).toBeInTheDocument();
    expect(screen.getByTestId('reshaped-dropdown-content')).toBeInTheDocument();
    expect(screen.getByTestId('reshaped-dropdown-section')).toBeInTheDocument();
    expect(screen.getAllByTestId('reshaped-dropdown-item')).toHaveLength(2);
    expect(screen.getByText('Open Menu')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
