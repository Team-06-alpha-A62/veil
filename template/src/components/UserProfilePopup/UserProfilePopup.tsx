import React, { useState } from 'react';
import { UserStatus } from '../../enums/UserStatus';
import { FaChevronRight, FaPencilAlt } from 'react-icons/fa';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';

import { IoLogOutOutline } from 'react-icons/io5';

interface UserProfilePopupProps {
  username: string | undefined;
  currentStatus: UserStatus | undefined;
  onClose: () => void;
  onStatusChange: (status: UserStatus) => void;
}

const statusOptions = [
  {
    label: 'Online',
    value: UserStatus.ONLINE,
    color: 'bg-green-500',
    description: 'You are online.',
  },
  {
    label: 'Away',
    value: UserStatus.AWAY,
    color: 'bg-yellow-500',
    description: 'You are idle.',
  },
  {
    label: 'Do Not Disturb',
    value: UserStatus.BUSY,
    color: 'bg-red-500',
    description: 'You will not receive any notifications.',
  },
  {
    label: 'Offline',
    value: UserStatus.OFFLINE,
    color: 'bg-gray-500',
    description: 'You appear offline.',
  },
];

const UserProfilePopup: React.FC<UserProfilePopupProps> = ({
  username,
  currentStatus,
  onClose,
  onStatusChange,
}) => {
  const [isStatusPopupVisible, setIsStatusPopupVisible] = useState(false);

  return (
    <div className="relative bg-base-300 p-4 rounded-lg shadow-lg w-[250px] z-20 text-white">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        onClick={onClose}
      >
        ✕
      </button>
      <div className="text-lg font-semibold text-white mb-4">{username}</div>

      <div
        className="w-full flex items-center justify-between mb-4 p-3 bg-base-200 rounded-lg hover:bg-base-100 transition-colors cursor-pointer relative"
        onMouseEnter={() => setIsStatusPopupVisible(true)}
        onMouseLeave={() => setIsStatusPopupVisible(false)}
      >
        <div
          className="flex items-center space-x-3"
          onMouseEnter={() => setIsStatusPopupVisible(true)}
        >
          <UserStatusIndicator status={currentStatus} absolute={false} />
          <span>
            {
              statusOptions.find(option => option.value === currentStatus)
                ?.label
            }
          </span>
        </div>
        <FaChevronRight className="text-gray-400" />

        {isStatusPopupVisible && (
          <div className="absolute left-48  ml-6 p-3 bg-base-300 rounded-lg shadow-lg w-[300px] z-30">
            {statusOptions.map(option => (
              <div
                key={option.value}
                className="flex items-start p-2 hover:bg-base-200 rounded cursor-pointer transition-colors"
                onClick={() => {
                  onStatusChange(option.value);
                  setIsStatusPopupVisible(false);
                }}
              >
                <UserStatusIndicator status={option.value} absolute={false} />
                <div className="ml-3">
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-xs text-gray-400">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="w-full mb-3 flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-100 transition-colors">
        <div className="flex items-center space-x-3">
          <FaPencilAlt className="text-gray-400" />
          <span>Edit Profile</span>
        </div>
      </button>

      <button className="w-full flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-100 transition-colors">
        <div className="flex items-center space-x-3">
          <IoLogOutOutline style={{ fontSize: '20px' }} />
          <span>Logout</span>
        </div>
      </button>
    </div>
  );
};

export default UserProfilePopup;
