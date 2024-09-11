import React, { useEffect } from 'react';
import { Notification } from '../../models/Notification';

export interface ToastNotificationProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  notifications,
  removeNotification,
}) => {
  useEffect(() => {
    const timers = notifications.map(notification =>
      setTimeout(() => {
        removeNotification(notification.id);
      }, 3000)
    );

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [notifications, removeNotification]);

  return (
    <div className="toast toast-end right-7 bottom-7">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`shadow-lg alert ${notification.messageType}`}
        >
          <span>{notification.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastNotification;
