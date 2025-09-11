import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children, ...props }) => <div data-testid="theme-provider" {...props}>{children}</div>,
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
    themes: ['light', 'dark'],
    systemTheme: 'light',
  }),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key) => key,
  NextIntlClientProvider: ({ children }) => children,
}))

// Mock Reshaped UI components
jest.mock('reshaped', () => ({
  Button: ({ children, ...props }) => <button data-testid="reshaped-button" {...props}>{children}</button>,
  Card: ({ children, ...props }) => <div data-testid="reshaped-card" {...props}>{children}</div>,
  TextField: ({ children, ...props }) => <input data-testid="reshaped-textfield" {...props} />,
  Select: ({ children, ...props }) => <select data-testid="reshaped-select" {...props}>{children}</select>,
  Badge: ({ children, ...props }) => <span data-testid="reshaped-badge" {...props}>{children}</span>,
  Modal: ({ children, ...props }) => <div data-testid="reshaped-modal" {...props}>{children}</div>,
  Checkbox: ({ children, ...props }) => (
    <div data-testid="reshaped-checkbox" {...props}>
      <input type="checkbox" {...props} />
      <label>{children}</label>
    </div>
  ),
  CheckboxGroup: ({ children, ...props }) => <div data-testid="reshaped-checkbox-group" {...props}>{children}</div>,
  TextArea: ({ ...props }) => <textarea data-testid="reshaped-textarea" {...props} />,
  Progress: ({ ...props }) => <div data-testid="reshaped-progress" {...props} />,
  Switch: ({ children, ...props }) => (
    <div data-testid="reshaped-switch" {...props}>
      <input type="checkbox" {...props} />
      <label>{children}</label>
    </div>
  ),
  Table: ({ children, ...props }) => <table data-testid="reshaped-table" {...props}>{children}</table>,
  DropdownMenu: ({ children, ...props }) => <div data-testid="reshaped-dropdown-menu" {...props}>{children}</div>,
  Breadcrumbs: ({ children, ...props }) => <nav data-testid="reshaped-breadcrumbs" {...props}>{children}</nav>,
  Pagination: ({ ...props }) => <div data-testid="reshaped-pagination" {...props} />,
  FormControl: ({ children, ...props }) => <div data-testid="reshaped-form-control" {...props}>{children}</div>,
}))

// Add compound component mocks
const mockReshaped = require('reshaped')

// Card compound components
mockReshaped.Card.Header = ({ children, ...props }) => <div data-testid="reshaped-card-header" {...props}>{children}</div>
mockReshaped.Card.Content = ({ children, ...props }) => <div data-testid="reshaped-card-content" {...props}>{children}</div>
mockReshaped.Card.Footer = ({ children, ...props }) => <div data-testid="reshaped-card-footer" {...props}>{children}</div>

// Modal compound components
mockReshaped.Modal.Header = ({ children, ...props }) => <div data-testid="reshaped-modal-header" {...props}>{children}</div>
mockReshaped.Modal.Content = ({ children, ...props }) => <div data-testid="reshaped-modal-content" {...props}>{children}</div>
mockReshaped.Modal.Footer = ({ children, ...props }) => <div data-testid="reshaped-modal-footer" {...props}>{children}</div>

// Table compound components
mockReshaped.Table.Row = ({ children, ...props }) => <tr data-testid="reshaped-table-row" {...props}>{children}</tr>
mockReshaped.Table.Cell = ({ children, ...props }) => <td data-testid="reshaped-table-cell" {...props}>{children}</td>
mockReshaped.Table.Heading = ({ children, ...props }) => <th data-testid="reshaped-table-heading" {...props}>{children}</th>

// DropdownMenu compound components
mockReshaped.DropdownMenu.Trigger = ({ children, ...props }) => <div data-testid="reshaped-dropdown-trigger" {...props}>{typeof children === 'function' ? children({}) : children}</div>
mockReshaped.DropdownMenu.Content = ({ children, ...props }) => <div data-testid="reshaped-dropdown-content" {...props}>{children}</div>
mockReshaped.DropdownMenu.Item = ({ children, ...props }) => <div data-testid="reshaped-dropdown-item" {...props}>{children}</div>
mockReshaped.DropdownMenu.Section = ({ children, ...props }) => <div data-testid="reshaped-dropdown-section" {...props}>{children}</div>
mockReshaped.DropdownMenu.SubMenu = ({ children, ...props }) => <div data-testid="reshaped-dropdown-submenu" {...props}>{children}</div>
mockReshaped.DropdownMenu.SubTrigger = ({ children, ...props }) => <div data-testid="reshaped-dropdown-subtrigger" {...props}>{children}</div>

// Breadcrumbs compound components
mockReshaped.Breadcrumbs.Item = ({ children, ...props }) => <span data-testid="reshaped-breadcrumbs-item" {...props}>{children}</span>

// FormControl compound components
mockReshaped.FormControl.Label = ({ children, ...props }) => <label data-testid="reshaped-form-control-label" {...props}>{children}</label>
mockReshaped.FormControl.Helper = ({ children, ...props }) => <div data-testid="reshaped-form-control-helper" {...props}>{children}</div>
mockReshaped.FormControl.Error = ({ children, ...props }) => <div data-testid="reshaped-form-control-error" {...props}>{children}</div>

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))
