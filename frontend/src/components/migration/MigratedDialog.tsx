'use client';

import React from 'react';
import { Modal as ReshapedModal, Button as ReshapedButton } from 'reshaped';
import { 
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MigratedDialogProps {
  children?: React.ReactNode;
  
  // Common props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Content props
  title?: string;
  description?: string;
  
  // Trigger element
  trigger?: React.ReactNode;
  
  // Footer actions
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  
  // Styling
  className?: string;
  size?: 'small' | 'medium' | 'large';
  
  // Migration control
  useReshaped?: boolean;
  
  // Additional props
  [key: string]: any;
}

/**
 * MigratedDialog provides a gradual migration path from shadcn/ui Dialog to Reshaped Modal
 * 
 * Usage:
 * - Set useReshaped={true} to use Reshaped Modal
 * - Set useReshaped={false} or omit to use shadcn Dialog
 * - Props are automatically mapped between the two systems
 */
export function MigratedDialog({
  children,
  open,
  onOpenChange,
  title,
  description,
  trigger,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  className,
  size = 'medium',
  useReshaped = false,
  ...props
}: MigratedDialogProps) {
  
  if (useReshaped) {
    return (
      <ReshapedModal
        active={open}
        onClose={() => onOpenChange?.(false)}
        size={size}
        className={cn(className)}
        {...props}
      >
        <ReshapedModal.Header>
          {title && <ReshapedModal.Title>{title}</ReshapedModal.Title>}
          {description && <ReshapedModal.Description>{description}</ReshapedModal.Description>}
        </ReshapedModal.Header>
        
        <ReshapedModal.Body>
          {children}
        </ReshapedModal.Body>
        
        {(confirmText || cancelText || onConfirm || onCancel) && (
          <ReshapedModal.Footer>
            <div className="flex gap-2 justify-end">
              {cancelText && (
                <ReshapedButton
                  variant="outline"
                  onClick={() => {
                    onCancel?.();
                    onOpenChange?.(false);
                  }}
                >
                  {cancelText}
                </ReshapedButton>
              )}
              {confirmText && (
                <ReshapedButton
                  color="primary"
                  onClick={() => {
                    onConfirm?.();
                    onOpenChange?.(false);
                  }}
                >
                  {confirmText}
                </ReshapedButton>
              )}
            </div>
          </ReshapedModal.Footer>
        )}
      </ReshapedModal>
    );
  }

  // Use existing shadcn Dialog
  return (
    <ShadcnDialog open={open} onOpenChange={onOpenChange} {...props}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn(className)}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        
        {children}
        
        {(confirmText || cancelText || onConfirm || onCancel) && (
          <DialogFooter>
            {cancelText && (
              <ShadcnButton
                variant="outline"
                onClick={() => {
                  onCancel?.();
                  onOpenChange?.(false);
                }}
              >
                {cancelText}
              </ShadcnButton>
            )}
            {confirmText && (
              <ShadcnButton
                onClick={() => {
                  onConfirm?.();
                  onOpenChange?.(false);
                }}
              >
                {confirmText}
              </ShadcnButton>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </ShadcnDialog>
  );
}

// Compound components for more complex usage
export const MigratedDialogTrigger = ({ children, useReshaped = false, ...props }: { children: React.ReactNode; useReshaped?: boolean; [key: string]: any }) => {
  if (useReshaped) {
    // For Reshaped, trigger is handled differently - return the children as-is
    return <>{children}</>;
  }
  return <DialogTrigger {...props}>{children}</DialogTrigger>;
};

export const MigratedDialogContent = ({ children, useReshaped = false, className, ...props }: { children: React.ReactNode; useReshaped?: boolean; className?: string; [key: string]: any }) => {
  if (useReshaped) {
    // For Reshaped, content is handled by the main Modal component
    return <>{children}</>;
  }
  return <DialogContent className={cn(className)} {...props}>{children}</DialogContent>;
};

// Export compound components
export { 
  MigratedDialog as Dialog,
  MigratedDialogTrigger as DialogTrigger,
  MigratedDialogContent as DialogContent,
};
