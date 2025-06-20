'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { useNotificationStore, type Notification } from '@/stores/notification-store';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  const iconClass = 'h-5 w-5';

  const iconStyles = {
    success: 'text-success',
    error: 'text-destructive',
    warning: 'text-warning',
    info: 'text-info',
  };

  switch (type) {
    case 'success':
      return <CheckCircle className={cn(iconClass, iconStyles.success)} />;
    case 'error':
      return <AlertCircle className={cn(iconClass, iconStyles.error)} />;
    case 'warning':
      return <AlertTriangle className={cn(iconClass, iconStyles.warning)} />;
    case 'info':
    default:
      return <Info className={cn(iconClass, iconStyles.info)} />;
  }
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const t = useTranslations();
  const { removeNotification } = useNotificationStore();

  const handleDismiss = () => {
    removeNotification(notification.id);
  };

  const notificationStyles = {
    success: {
      bg: 'bg-success/10 border-success/20',
      text: 'text-success-foreground',
      icon: 'text-success',
    },
    error: {
      bg: 'bg-destructive/10 border-destructive/20',
      text: 'text-destructive-foreground',
      icon: 'text-destructive',
    },
    warning: {
      bg: 'bg-warning/10 border-warning/20',
      text: 'text-warning-foreground',
      icon: 'text-warning',
    },
    info: {
      bg: 'bg-info/10 border-info/20',
      text: 'text-info-foreground',
      icon: 'text-info',
    },
  }[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border',
        notificationStyles.bg
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <NotificationIcon type={notification.type} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={cn('text-sm font-medium', notificationStyles.text)}>
              {notification.title}
            </p>
            {notification.message && (
              <p className={cn('mt-1 text-sm', notificationStyles.text, 'opacity-90')}>
                {notification.message}
              </p>
            )}
            {notification.actions && notification.actions.length > 0 && (
              <div className="mt-3 flex space-x-2">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick();
                      handleDismiss();
                    }}
                    className="text-sm font-medium text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleDismiss}
              className={cn(
                'rounded-md inline-flex hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                notificationStyles.text
              )}
              aria-label={t('components.notifications.dismiss')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const NotificationSystem: React.FC = () => {
  const { notifications } = useNotificationStore();

  return (
    <div
      aria-live="assertive"
      className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50"
    >
      <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
        <AnimatePresence>
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
