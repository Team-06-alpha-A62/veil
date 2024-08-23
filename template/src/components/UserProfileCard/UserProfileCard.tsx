import { useEffect, useState } from 'react';
import { UserStatus } from '../../enums/UserStatus';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';

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

  return (
    <div className="flex items-center absolute bottom-3 left-3 space-x-3">
      <div className="avatar relative">
        <div className="w-14 rounded-full skeleton">
          <img src={avatarUrl} alt="User Avatar" />
        </div>
        {!shouldRenderContent && (
          <UserStatusIndicator status={status} size={12} />
        )}
      </div>
      {shouldRenderContent && (
        <div className="overflow-hidden text-white">
          <p className="font-semibold">{username}</p>
          <div className="flex items-center space-x-1">
            <UserStatusIndicator status={status} size={12} absolute={false} />
            <p className="text-sm text-gray-400 capitalize">{status}</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserProfileCard;
