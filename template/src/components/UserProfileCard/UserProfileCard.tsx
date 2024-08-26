import { useEffect, useState } from 'react';
import { UserStatus } from '../../enums/UserStatus';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';
import UserProfilePopup from '../UserProfilePopup/UserProfilePopup';
import { updateUserStatus } from '../../services/user.service';

interface UserProfileCardProps {
  avatarUrl: string | undefined;
  username: string | undefined;
  status: UserStatus | undefined;
  isExpanded: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  avatarUrl,
  username,
  status,
  isExpanded,
}) => {
  const [shouldRenderContent, setShouldRenderContent] =
    useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<UserStatus | undefined>(
    status
  );

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isExpanded) {
      timeout = setTimeout(() => {
        setShouldRenderContent(true);
      }, 100);
    } else {
      setShouldRenderContent(false);
    }

    return () => clearTimeout(timeout);
  }, [isExpanded]);

  const handleStatusChange = async (newStatus: UserStatus) => {
    if (!username) return;

    try {
      await updateUserStatus(username, newStatus);

      setCurrentStatus(newStatus);

      setIsPopupVisible(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div>
      <div
        className="flex items-center absolute bottom-3 left-3 space-x-3 cursor-pointer"
        onClick={() => setIsPopupVisible(true)}
      >
        <div className="avatar relative">
          <div className="w-14 rounded-full skeleton">
            <img src={avatarUrl} alt="User Avatar" />
          </div>
          {!shouldRenderContent && (
            <UserStatusIndicator status={currentStatus} size={12} />
          )}
        </div>
        {shouldRenderContent && (
          <div className="overflow-hidden text-white">
            <p className="font-semibold">{username}</p>
            <div className="flex items-center space-x-1">
              <UserStatusIndicator
                status={currentStatus}
                size={12}
                absolute={false}
              />
              <p className="text-sm text-gray-400 capitalize">
                {currentStatus}
              </p>
            </div>
          </div>
        )}
      </div>
      {isPopupVisible && (
        <div className="absolute left-2 bottom-20 mt-2 z-50">
          <UserProfilePopup
            username={username}
            currentStatus={currentStatus}
            onClose={() => setIsPopupVisible(false)}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfileCard;
