import React from 'react';
import { Friend } from '../../models/Friend';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

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
    <div className="flex items-center p-6 text-base-content border-b border-opacity-25 border-base-content justify-between hover:bg-secondary-focus transition-colors">
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
      <div className="flex text-success space-x-2">
        <button onClick={() => onAccept(pendingFriend.username)}>
          <BsCheckCircle size={20} />
        </button>
        <button
          className="text-error"
          onClick={() => onDecline(pendingFriend.username)}
        >
          <BsXCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default PendingFriendCard;
