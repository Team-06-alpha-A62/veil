import { useEffect, useState } from 'react';
import { UserStatus } from '../../enums/UserStatus';

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
  const statusColor = {
    [UserStatus.ONLINE]: 'bg-green-500',
    [UserStatus.OFFLINE]: 'bg-gray-500',
    [UserStatus.BUSY]: 'bg-red-500',
    [UserStatus.AWAY]: 'bg-yellow-500',
    [UserStatus.IN_MEETING]: 'bg-blue-500',
  };
  const userStatusColor = statusColor[status];

  return (
    <div className="flex items-center absolute bottom-3 left-3 space-x-3">
      <div className="avatar ">
        <div className="w-14 rounded-full skeleton">
          <img src={avatarUrl} alt="User Avatar" />
        </div>
        {!shouldRenderContent && (
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${userStatusColor}`}
          />
        )}
      </div>
      {shouldRenderContent && (
        <div className="overflow-hidden text-white">
          <p className="font-semibold">{username}</p>
          <div className="flex items-center space-x-1">
            <span className={`w-3 h-3 rounded-full ${userStatusColor}`} />
            <p className="text-sm text-gray-400 capitalize">{status}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserProfileCard;
