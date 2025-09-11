import React from 'react';
import { render, screen } from '@testing-library/react';
import { MigratedTable, MigratedTableRow, MigratedTableCell, MigratedTableHead } from '../MigratedTable';
import { CoexistenceProvider } from '../CoexistenceProvider';

// Mock Reshaped components
jest.mock('reshaped', () => ({
  Table: ({ children, border, columnBorder, ...props }: any) => (
    <div 
      data-testid="reshaped-table"
      data-border={border}
      data-column-border={columnBorder}
      {...props}
    >
      {children}
    </div>
  ),
}));

// Mock Reshaped Table sub-components
const mockReshapedTable = {
  Row: ({ children, highlighted, ...props }: any) => (
    <div 
      data-testid="reshaped-table-row"
      data-highlighted={highlighted}
      {...props}
    >
      {children}
    </div>
  ),
  Cell: ({ children, align, colSpan, rowSpan, ...props }: any) => (
    <div 
      data-testid="reshaped-table-cell"
      data-align={align}
      data-col-span={colSpan}
      data-row-span={rowSpan}
      {...props}
    >
      {children}
    </div>
  ),
  Heading: ({ children, align, colSpan, rowSpan, ...props }: any) => (
    <div 
      data-testid="reshaped-table-heading"
      data-align={align}
      data-col-span={colSpan}
      data-row-span={rowSpan}
      {...props}
    >
      {children}
    </div>
  ),
};

// Add sub-components to the mocked Table
require('reshaped').Table.Row = mockReshapedTable.Row;
require('reshaped').Table.Cell = mockReshapedTable.Cell;
require('reshaped').Table.Heading = mockReshapedTable.Heading;

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <CoexistenceProvider>
      {component}
    </CoexistenceProvider>
  );
};

describe('MigratedTable', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn table by default', () => {
      renderWithProvider(
        <MigratedTable>
          <tbody>
            <tr>
              <td>Test Cell</td>
            </tr>
          </tbody>
        </MigratedTable>
      );
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-table')).not.toBeInTheDocument();
    });

    it('renders table content correctly', () => {
      renderWithProvider(
        <MigratedTable>
          <tbody>
            <tr>
              <td>Test Content</td>
            </tr>
          </tbody>
        </MigratedTable>
      );
      
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped Table when useReshaped is true', () => {
      renderWithProvider(
        <MigratedTable useReshaped>
          <div>Test Content</div>
        </MigratedTable>
      );
      
      expect(screen.getByTestId('reshaped-table')).toBeInTheDocument();
    });

    it('passes Reshaped-specific props correctly', () => {
      renderWithProvider(
        <MigratedTable useReshaped border columnBorder>
          <div>Test Content</div>
        </MigratedTable>
      );
      
      const table = screen.getByTestId('reshaped-table');
      expect(table).toHaveAttribute('data-border', 'true');
      expect(table).toHaveAttribute('data-column-border', 'true');
    });
  });
});

describe('MigratedTableRow', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn table row by default', () => {
      renderWithProvider(
        <table>
          <tbody>
            <MigratedTableRow>
              <td>Test Cell</td>
            </MigratedTableRow>
          </tbody>
        </table>
      );
      
      const row = screen.getByRole('row');
      expect(row).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-table-row')).not.toBeInTheDocument();
    });

    it('applies highlighted styling in shadcn mode', () => {
      renderWithProvider(
        <table>
          <tbody>
            <MigratedTableRow highlighted>
              <td>Test Cell</td>
            </MigratedTableRow>
          </tbody>
        </table>
      );
      
      const row = screen.getByRole('row');
      expect(row).toHaveClass('bg-muted/50');
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped TableRow when useReshaped is true', () => {
      renderWithProvider(
        <MigratedTableRow useReshaped>
          <div>Test Content</div>
        </MigratedTableRow>
      );
      
      expect(screen.getByTestId('reshaped-table-row')).toBeInTheDocument();
    });

    it('passes highlighted prop correctly', () => {
      renderWithProvider(
        <MigratedTableRow useReshaped highlighted>
          <div>Test Content</div>
        </MigratedTableRow>
      );
      
      const row = screen.getByTestId('reshaped-table-row');
      expect(row).toHaveAttribute('data-highlighted', 'true');
    });
  });
});

describe('MigratedTableCell', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn table cell by default', () => {
      renderWithProvider(
        <table>
          <tbody>
            <tr>
              <MigratedTableCell>Test Content</MigratedTableCell>
            </tr>
          </tbody>
        </table>
      );
      
      const cell = screen.getByRole('cell');
      expect(cell).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-table-cell')).not.toBeInTheDocument();
    });

    it('applies alignment classes correctly', () => {
      renderWithProvider(
        <table>
          <tbody>
            <tr>
              <MigratedTableCell align="center" verticalAlign="top">
                Test Content
              </MigratedTableCell>
            </tr>
          </tbody>
        </table>
      );
      
      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('text-center', 'align-top');
    });

    it('applies colSpan and rowSpan correctly', () => {
      renderWithProvider(
        <table>
          <tbody>
            <tr>
              <MigratedTableCell colSpan={2} rowSpan={3}>
                Test Content
              </MigratedTableCell>
            </tr>
          </tbody>
        </table>
      );
      
      const cell = screen.getByRole('cell');
      expect(cell).toHaveAttribute('colSpan', '2');
      expect(cell).toHaveAttribute('rowSpan', '3');
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped TableCell when useReshaped is true', () => {
      renderWithProvider(
        <MigratedTableCell useReshaped>Test Content</MigratedTableCell>
      );
      
      expect(screen.getByTestId('reshaped-table-cell')).toBeInTheDocument();
    });

    it('passes props correctly to Reshaped TableCell', () => {
      renderWithProvider(
        <MigratedTableCell 
          useReshaped 
          align="end" 
          colSpan={2} 
          rowSpan={1}
        >
          Test Content
        </MigratedTableCell>
      );
      
      const cell = screen.getByTestId('reshaped-table-cell');
      expect(cell).toHaveAttribute('data-align', 'end');
      expect(cell).toHaveAttribute('data-col-span', '2');
      expect(cell).toHaveAttribute('data-row-span', '1');
    });
  });
});

describe('MigratedTableHead', () => {
  describe('shadcn/ui mode (default)', () => {
    it('renders shadcn table header cell by default', () => {
      renderWithProvider(
        <table>
          <thead>
            <tr>
              <MigratedTableHead>Header Content</MigratedTableHead>
            </tr>
          </thead>
        </table>
      );
      
      const header = screen.getByRole('columnheader');
      expect(header).toBeInTheDocument();
      expect(screen.queryByTestId('reshaped-table-heading')).not.toBeInTheDocument();
    });
  });

  describe('Reshaped mode', () => {
    it('renders Reshaped TableHeading when useReshaped is true', () => {
      renderWithProvider(
        <MigratedTableHead useReshaped>Header Content</MigratedTableHead>
      );
      
      expect(screen.getByTestId('reshaped-table-heading')).toBeInTheDocument();
    });

    it('passes props correctly to Reshaped TableHeading', () => {
      renderWithProvider(
        <MigratedTableHead 
          useReshaped 
          align="center" 
          colSpan={3}
        >
          Header Content
        </MigratedTableHead>
      );
      
      const heading = screen.getByTestId('reshaped-table-heading');
      expect(heading).toHaveAttribute('data-align', 'center');
      expect(heading).toHaveAttribute('data-col-span', '3');
    });
  });
});
