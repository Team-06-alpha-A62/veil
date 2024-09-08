import { get, onValue, push, ref, remove, set } from 'firebase/database';
import { NotificationType } from '../enums/NotificationType';
import { Notification } from '../models/Notification';

import { db } from '../config/firebase.config';
import { transformNotificationData } from '../utils/TransformDataHelpers';
import { NotificationMessageType } from '../enums/NotificationMessageType';

export const createNotification = async (
  senderUsername: string,
  receiverUsername: string,
  type: NotificationType,
  message: string,
  messageType: NotificationMessageType
): Promise<string> => {
  const notificationRef = push(ref(db, `notifications/${receiverUsername}`));
  const newNotification: Notification = {
    id: notificationRef.key!,
    type,
    message,
    createdAt: Date.now(),
    sender: senderUsername,
    receiver: receiverUsername,
    messageType,
  };

  await set(notificationRef, newNotification);

  return notificationRef.key!;
};

export const getNotifications = async (
  username: string
): Promise<Notification[]> => {
  const notificationsRef = ref(db, `notifications/${username}`);
  const snapshot = await get(notificationsRef);
  if (!snapshot.exists()) return [];

  const notifications: Notification[] = [];
  snapshot.forEach(childSnapshot => {
    const notification = transformNotificationData(
      childSnapshot.val() as Partial<Notification>
    );

    notifications.push(notification);
  });

  return notifications;
};

export const listenForNotifications = (
  username: string,
  onNotificationChange: (notifications: Notification[]) => void
) => {
  const notificationsRef = ref(db, `notifications/${username}`);
  const unsubscribe = onValue(notificationsRef, snapshot => {
    if (snapshot.exists()) {
      const notificationsData = snapshot.val();
      const transformedNotifications: Notification[] = Object.values(
        notificationsData
      ).map(notification =>
        transformNotificationData(notification as Notification)
      );
      onNotificationChange(transformedNotifications);
    } else {
      onNotificationChange([]);
    }
  });

  return unsubscribe;
};

export const deleteNotification = async (
  username: string,
  notificationId: string
) => {
  const notificationRef = ref(
    db,
    `notifications/${username}/${notificationId}`
  );
  await remove(notificationRef);
};
