import { create } from 'zustand';

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  actions?: NotificationAction[];
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const newNotification: Notification = {
      id,
      duration: 5000, // Default 5 seconds
      ...notification,
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));
    
    // Auto-remove notification after duration
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },
  
  clearAllNotifications: () => {
    set({ notifications: [] });
  },
}));
