import { useEffect, useRef, useState } from 'react';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';
import { Friend } from '../../models/Friend';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ImBubble } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { createChannel } from '../../services/channel.service';
import { ChannelType } from '../../enums/ChannelType';
import { removeFriend } from '../../services/user.service';

interface FriendCardProps {
  friend: Friend;
  commonChannel: string;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend, commonChannel }) => {
  const { currentUser } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const threeDotsButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      threeDotsButtonRef.current &&
      !threeDotsButtonRef.current.contains(event.target as Node) &&
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setIsMenuVisible(false);
    }
  };

  useEffect(() => {
    if (isMenuVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuVisible]);

  const handleOpenChannelClick = async (friendUsername: string) => {
    if (commonChannel) {
      navigate(`/app/chats/direct/${commonChannel}`);
    } else {
      const myUsername = currentUser.userData!.username;

      const channelId = await createChannel(
        null,
        null,
        [friendUsername, myUsername],
        ChannelType.DIRECT,
        true
      );
      navigate(`/app/chats/direct/${channelId}`);
    }
  };

  const handleRemoveFriendClick = async (friendUsername: string) => {
    try {
      await removeFriend(currentUser.userData!.username, friendUsername);
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };

  const handleMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuVisible(prev => !prev);
  };

  return (
    <div className="flex items-center p-6 border-b border-opacity-25 border-base-content justify-between hover:bg-secondary-focus transition-colors">
      <div className="relative flex items-center space-x-4">
        <div className="avatar placeholder">
          <div className="bg-neutral w-14 rounded-full">
            {friend.avatarUrl ? (
              <img src={friend.avatarUrl} alt="User Avatar" />
            ) : (
              <span className="text-neutral-content">
                {friend.username![0].toLocaleUpperCase()}
              </span>
            )}
          </div>
          <UserStatusIndicator status={friend.status} absolute={true} />
        </div>
        <div>
          <div className="font-semibold text-base-content">
            {friend.username}
          </div>
          <div className="text-sm text-success">
            {friend.status.toLowerCase()}
          </div>
        </div>
      </div>
      <div className="flex space-x-2 relative">
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => handleOpenChannelClick(friend.username)}
        >
          <ImBubble className="text-base-content" />
        </button>
        <button
          ref={threeDotsButtonRef}
          className="text-gray-400 hover:text-white"
          onClick={handleMenuToggle}
        >
          <BsThreeDotsVertical className="text-base-content" size={20} />
        </button>
        {isMenuVisible && (
          <div
            ref={menuRef}
            className="absolute bottom-1 right-5 bg-primary text-primary-content shadow-lg rounded-lg w-48 z-10"
          >
            <li
              onClick={() => handleRemoveFriendClick(friend.username)}
              className="p-2 hover:opacity-60 cursor-pointer list-none no-underline"
            >
              Remove friend
            </li>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendCard;
