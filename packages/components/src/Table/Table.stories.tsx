import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableCaption 
} from './Table'
import { Checkbox } from '../Checkbox'
import { Badge } from '../Badge'
import { Button } from '../Button'
import { useState } from 'react'

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A table component with support for sorting, selection, variants, and responsive design. Built with semantic HTML for accessibility.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped', 'bordered'],
      description: 'Visual variant of the table',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the table',
    },
    scrollable: {
      control: 'boolean',
      description: 'Whether the table is scrollable',
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Moderator', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'User', status: 'Pending' },
]

// Basic table
export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of your recent users.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Badge 
                variant={user.status === 'Active' ? 'success' : user.status === 'Inactive' ? 'error' : 'warning'}
              >
                {user.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

// Table variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default</h3>
        <Table variant="default">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.slice(0, 3).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Striped</h3>
        <Table variant="striped">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.slice(0, 3).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Bordered</h3>
        <Table variant="bordered">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.slice(0, 3).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  ),
}

// Sortable table
export const SortableTable: Story = {
  render: () => {
    const [sortField, setSortField] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null)

    const handleSort = (field: string) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc')
      } else {
        setSortField(field)
        setSortDirection('asc')
      }
    }

    const sortedUsers = [...users].sort((a, b) => {
      if (!sortField || !sortDirection) return 0
      
      const aValue = a[sortField as keyof typeof a]
      const bValue = b[sortField as keyof typeof b]
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return (
      <Table>
        <TableCaption>Sortable user table - click headers to sort</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead 
              sortable 
              sortDirection={sortField === 'name' ? sortDirection : null}
              onSort={() => handleSort('name')}
            >
              Name
            </TableHead>
            <TableHead 
              sortable 
              sortDirection={sortField === 'email' ? sortDirection : null}
              onSort={() => handleSort('email')}
            >
              Email
            </TableHead>
            <TableHead 
              sortable 
              sortDirection={sortField === 'role' ? sortDirection : null}
              onSort={() => handleSort('role')}
            >
              Role
            </TableHead>
            <TableHead 
              sortable 
              sortDirection={sortField === 'status' ? sortDirection : null}
              onSort={() => handleSort('status')}
            >
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge 
                  variant={user.status === 'Active' ? 'success' : user.status === 'Inactive' ? 'error' : 'warning'}
                >
                  {user.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive table with sortable columns. Click column headers to sort.',
      },
    },
  },
}

// Selectable table
export const SelectableTable: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<number[]>([])

    const toggleRow = (id: number) => {
      setSelectedRows(prev => 
        prev.includes(id) 
          ? prev.filter(rowId => rowId !== id)
          : [...prev, id]
      )
    }

    const toggleAll = () => {
      setSelectedRows(prev => 
        prev.length === users.length ? [] : users.map(user => user.id)
      )
    }

    const isAllSelected = selectedRows.length === users.length
    const isIndeterminate = selectedRows.length > 0 && selectedRows.length < users.length

    return (
      <Table>
        <TableCaption>Selectable user table with bulk actions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onCheckedChange={toggleAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow 
              key={user.id} 
              selected={selectedRows.includes(user.id)}
            >
              <TableCell>
                <Checkbox 
                  checked={selectedRows.includes(user.id)}
                  onCheckedChange={() => toggleRow(user.id)}
                  aria-label={`Select ${user.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Badge 
                  variant={user.status === 'Active' ? 'success' : user.status === 'Inactive' ? 'error' : 'warning'}
                >
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {selectedRows.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>
                {selectedRows.length} row(s) selected
                <Button variant="outline" size="sm" className="ml-4">
                  Delete Selected
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Table with row selection and bulk actions. Select individual rows or all rows.',
      },
    },
  },
}

// Responsive table
export const ResponsiveTable: Story = {
  render: () => (
    <Table scrollable>
      <TableCaption>Responsive table with horizontal scroll</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[150px]">Name</TableHead>
          <TableHead className="min-w-[200px]">Email</TableHead>
          <TableHead className="min-w-[100px]">Role</TableHead>
          <TableHead className="min-w-[100px]">Status</TableHead>
          <TableHead className="min-w-[150px]">Department</TableHead>
          <TableHead className="min-w-[120px]">Join Date</TableHead>
          <TableHead className="min-w-[100px]">Salary</TableHead>
          <TableHead className="min-w-[120px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Badge 
                variant={user.status === 'Active' ? 'success' : user.status === 'Inactive' ? 'error' : 'warning'}
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>Engineering</TableCell>
            <TableCell>2023-01-15</TableCell>
            <TableCell>$75,000</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive table that scrolls horizontally on smaller screens.',
      },
    },
  },
}
