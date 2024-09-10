import React, { useState, useRef, useEffect } from 'react';
import {
  addUnreadNotification,
  sendFriendRequest,
} from '../../services/user.service';
import { useAuth } from '../../providers/AuthProvider';
import { NotificationType } from '../../enums/NotificationType';
import { createNotification } from '../../services/notification.service';
import { NotificationMessageType } from '../../enums/NotificationMessageType';
interface AddFriendModalProps {
  onClose: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const handleSubmit = async () => {
    if (currentUser.userData!.username && username) {
      await sendFriendRequest(currentUser.userData!.username, username);

      await createNotification(
        username,
        currentUser.userData!.username,
        NotificationType.FRIEND,
        `Friend request sent to ${username}`,
        NotificationMessageType.ALERT_INFO
      );

      const requestedUserNotificationId = await createNotification(
        currentUser.userData!.username,
        username,
        NotificationType.FRIEND,
        `${currentUser.userData!.username} sent you a friend request`,
        NotificationMessageType.ALERT_INFO
      );

      await addUnreadNotification(
        username,
        requestedUserNotificationId,
        NotificationType.FRIEND
      );
    }
    onClose();
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-300 bg-opacity-75 z-10">
      <div
        ref={modalRef}
        className="relative bg-base-100 p-6 rounded-3xl w-[600px] h-[200px]"
      >
        <button
          className="absolute top-5 right-5 text-base-content"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-lg text-base-content font-semibold mb-4">
          Add Friend
        </h2>
        <p className="text-base-content mb-4">
          You can add friends with their username.
        </p>
        <div className="flex items-center space-x-4 p-2 rounded-3xl bg-base-200">
          <div className="flex w-full items-center rounded-lg">
            <input
              autoFocus
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="flex-1 px-4 py-2 rounded-3xl bg-base-200 input-sm placeholder-base-content focus:border-transparent focus:outline-none caret-primary"
            />
            <button
              onClick={handleSubmit}
              className="bg-primary btn-sm text-center text-primary-content rounded-3xl hover:bg-primary-focus"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
