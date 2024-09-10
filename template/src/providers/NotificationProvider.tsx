import React, { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '../models/Notification';
import { useAuth } from './AuthProvider';
import {
  listenForNotifications,
  deleteNotification,
} from '../services/notification.service';

interface NotificationContextProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser.userData) return;

    const unsubscribe = listenForNotifications(
      currentUser.userData!.username,
      setNotifications
    );

    return () => unsubscribe();
  }, [currentUser.userData]);

  const removeNotification = async (id: string) => {
    if (!currentUser) return;

    await deleteNotification(currentUser.userData!.username, id);

    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
