import { NotificationMessageType } from '../enums/NotificationMessageType';
import { NotificationType } from '../enums/NotificationType';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: number;
  sender: string;
  receiver: string;
  messageType: NotificationMessageType;
}
