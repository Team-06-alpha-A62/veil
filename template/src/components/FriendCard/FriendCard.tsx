import React from 'react';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';
import { Friend } from '../../models/Friend';

interface FriendCardProps {
  friend: Friend;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  return (
    <div className="flex items-center p-6 border-b-2 border-base-100 justify-between hover:bg-secondary-focus transition-colors">
      <div className="relative flex items-center space-x-4">
        <div className="avatar relative">
          <div className="w-14 rounded-full skeleton">
            <img src={friend.avatarUrl} alt="User Avatar" />
          </div>
          <UserStatusIndicator status={friend.status} absolute={true} />
        </div>
        <div>
          <div className="font-semibold">{friend.username}</div>
          <div className="text-sm text-gray-400">
            {friend.status.toLowerCase()}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="text-gray-400 hover:text-white">💬</button>
        <button className="text-gray-400 hover:text-white">⋮</button>
      </div>
    </div>
  );
};

export default FriendCard;
