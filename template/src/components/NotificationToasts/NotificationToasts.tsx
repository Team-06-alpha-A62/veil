import { useNotifications } from '../../providers/NotificationProvider';
import ToastNotification from '../ToastNotification/ToastNotification';

const NotificationToasts: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <ToastNotification
      notifications={notifications}
      removeNotification={removeNotification}
    />
  );
};

export default NotificationToasts;
