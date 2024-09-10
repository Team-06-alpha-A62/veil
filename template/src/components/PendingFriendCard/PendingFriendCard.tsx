import React from 'react';
import { Friend } from '../../models/Friend';

interface PendingFriendCardProps {
  pendingFriend: Friend;
  onAccept: (username: string) => void;
  onDecline: (username: string) => void;
}

const PendingFriendCard: React.FC<PendingFriendCardProps> = ({
  pendingFriend,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="flex items-center p-6 border-b-2 border-base-100 justify-between hover:bg-secondary-focus transition-colors">
      <div className="relative flex items-center space-x-4">
        <div className="avatar placeholder">
          <div className="bg-neutral w-14 rounded-full">
            {pendingFriend.avatarUrl ? (
              <img src={pendingFriend.avatarUrl} alt="User Avatar" />
            ) : (
              <span className="text-neutral-content">
                {pendingFriend.username![0].toLocaleUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="font-semibold">{pendingFriend.username}</div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          className="text-green-400 hover:text-green-600"
          onClick={() => onAccept(pendingFriend.username)}
        >
          ✅
        </button>
        <button
          className="text-red-400 hover:text-red-600"
          onClick={() => onDecline(pendingFriend.username)}
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default PendingFriendCard;
