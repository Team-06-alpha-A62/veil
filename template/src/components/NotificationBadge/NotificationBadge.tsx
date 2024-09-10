import React, { useState, useEffect } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import {
  listenToUnreadNotifications,
  clearUnreadNotifications,
  listenToUnreadChannelMessages,
  clearUnreadChannelMessages,
  listenToUnreadDirectNotifications,
  listenToUnreadGroupNotifications,
  listenToUnreadGlobalMessagesNotifications,
} from '../../services/user.service';
import { NotificationType } from '../../enums/NotificationType';
import { Unsubscribe } from 'firebase/database';
import { ChannelType } from '../../enums/ChannelType';

interface NotificationBadgeProps {
  type: NotificationType;
  isViewActive: boolean;
  channelId?: string;
  channelType?: ChannelType;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  type,
  isViewActive,
  channelId,
  channelType,
}) => {
  const { currentUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    let unsubscribe: Unsubscribe | undefined;

    if (currentUser) {
      const username = currentUser.userData!.username;
      if (type === NotificationType.MESSAGE && channelId) {
        unsubscribe = listenToUnreadChannelMessages(
          username,
          channelId,
          async count => {
            if (isViewActive) {
              await clearUnreadChannelMessages(
                username,
                channelId,
                channelType || null
              );
              setUnreadCount(0);
            } else {
              setUnreadCount(count);
            }
          }
        );
      } else if (type === NotificationType.DIRECT) {
        unsubscribe = listenToUnreadDirectNotifications(
          username,
          async count => {
            setUnreadCount(count);
          }
        );
      } else if (type === NotificationType.GROUP) {
        unsubscribe = listenToUnreadGroupNotifications(
          username,
          async count => {
            setUnreadCount(count);
          }
        );
      } else if (type === NotificationType.GLOBAL_MESSAGES) {
        unsubscribe = listenToUnreadGlobalMessagesNotifications(
          username,
          async count => {
            setUnreadCount(count);
          }
        );
      } else {
        unsubscribe = listenToUnreadNotifications(
          username,
          type,
          async count => {
            if (isViewActive) {
              await clearUnreadNotifications(username, type);
              setUnreadCount(0);
            } else {
              setUnreadCount(count);
            }
          }
        );
      }

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [currentUser, type, isViewActive, channelId]);

  return (
    <>
      {unreadCount > 0 && (
        <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </>
  );
};

export default NotificationBadge;
