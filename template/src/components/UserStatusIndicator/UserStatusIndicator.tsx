import React from 'react';
import { UserStatus } from '../../enums/UserStatus';

interface UserStatusIndicatorProps {
  status: UserStatus | undefined;
  size?: number;
  absolute?: boolean;
}

const UserStatusIndicator: React.FC<UserStatusIndicatorProps> = ({
  status,
  size = 12,
  absolute = true,
}) => {
  const statusColor = {
    [UserStatus.ONLINE]: 'bg-green-500',
    [UserStatus.OFFLINE]: 'bg-gray-500',
    [UserStatus.BUSY]: 'bg-red-500',
    [UserStatus.AWAY]: 'bg-yellow-500',
    [UserStatus.IN_MEETING]: 'bg-blue-500',
  };

  const userStatusColor = status ? statusColor[status] : 'bg-gray-500';

  return (
    <span
      className={`rounded-full ${
        absolute ? 'absolute bottom-0 right-0 w-3 h-3' : ''
      } ${userStatusColor}`}
      style={{ width: size, height: size }}
    />
  );
};

export default UserStatusIndicator;
