import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '../Dialog'
import { Button } from '../../Button'

expect.extend(toHaveNoViolations)

describe('Dialog', () => {
  it('renders trigger and opens dialog', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
            <DialogDescription>This is a test dialog</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument()
    
    fireEvent.click(screen.getByRole('button', { name: 'Open Dialog' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Test Dialog')).toBeInTheDocument()
    expect(screen.getByText('This is a test dialog')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent size="sm">
          <DialogTitle>Small Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole('dialog')).toHaveClass('max-w-sm')
  })

  it('shows close button by default', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog with close</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })

  it('hides close button when showCloseButton is false', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent showCloseButton={false}>
          <DialogTitle>Dialog without close</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument()
  })

  it('renders footer content', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Dialog with footer</DialogTitle>
          <DialogFooter>
            <Button>Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('closes when close button is clicked', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Closeable Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders with data-testid', () => {
    render(
      <Dialog defaultOpen>
        <DialogContent data-testid="test-dialog">
          <DialogTitle>Test Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    expect(screen.getByTestId('test-dialog')).toBeInTheDocument()
  })

  it('should not have accessibility violations', async () => {
    const { container } = render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>This dialog is accessible</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations with footer', async () => {
    const { container } = render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog with Footer</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button>Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
