import { useCallback } from 'react';
import { useNotificationStore, type Notification } from '@/stores/notification-store';

export const useNotifications = () => {
  const { addNotification, removeNotification, clearAllNotifications } = useNotificationStore();

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    addNotification(notification);
  }, [addNotification]);

  const showSuccess = useCallback((title: string, message?: string) => {
    showNotification({
      type: 'success',
      title,
      message,
    });
  }, [showNotification]);

  const showError = useCallback((title: string, message?: string) => {
    showNotification({
      type: 'error',
      title,
      message,
      duration: 8000, // Errors stay longer
    });
  }, [showNotification]);

  const showWarning = useCallback((title: string, message?: string) => {
    showNotification({
      type: 'warning',
      title,
      message,
    });
  }, [showNotification]);

  const showInfo = useCallback((title: string, message?: string) => {
    showNotification({
      type: 'info',
      title,
      message,
    });
  }, [showNotification]);

  const dismissNotification = useCallback((id: string) => {
    removeNotification(id);
  }, [removeNotification]);

  const clearAll = useCallback(() => {
    clearAllNotifications();
  }, [clearAllNotifications]);

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissNotification,
    clearAll,
  };
};
