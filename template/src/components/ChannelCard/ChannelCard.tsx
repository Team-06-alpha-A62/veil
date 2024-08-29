import React, { useState, useMemo, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Channel } from '../../models/Channel.ts';
import { useAuth } from '../../providers/AuthProvider';
import { leaveChannel } from '../../services/user.service.ts';
import { ChannelType } from '../../enums/ChannelType.ts';

interface ChannelCardProps {
  channel: Channel;
  handleClick: (channel: Channel) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, handleClick }) => {
  const { currentUser } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const threeDotsButtonRef = useRef<HTMLButtonElement>(null);
  const channelCardMenuRef = useRef<HTMLDivElement>(null);
  const currentUsername = currentUser.userData!.username;

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      threeDotsButtonRef.current &&
      !threeDotsButtonRef.current.contains(event.target as Node) &&
      channelCardMenuRef.current &&
      !channelCardMenuRef.current.contains(event.target as Node)
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

  const onLeaveChannel = async () => {
    await leaveChannel(channel.id, currentUser.userData!.username);
  };

  const popupItems = useMemo(() => {
    const isOwner = channel.owner === currentUsername;
    const isGroup = channel.type === ChannelType.GROUP;

    const actions: Record<string, () => void> = {
      'Change Icon': () => console.log('Change Icon clicked'),
      'Mute Conversation': () => console.log('Mute Conversation clicked'),
    };

    if (isOwner) {
      actions['Edit Channel'] = () => console.log('Edit Channel clicked');
      if (isGroup) {
        actions['Leave Group'] = () => onLeaveChannel();
      }
    }

    return actions;
  }, [channel, currentUsername]);

  const handleMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsMenuVisible(prev => !prev);
  };

  return (
    <div
      className="flex relative items-center p-6 border-b-2 border-base-100 justify-between hover:bg-base-300 hover:bg-opacity-50 cursor-pointer active:bg-opacity-0 transition-colors"
      onClick={() => {
        handleClick(channel);
      }}
    >
      <div className="flex items-center space-x-4">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-14 skeleton rounded-full">
            <span className="text-3xl">D</span>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-m">{channel.name}</h2>
        </div>
      </div>
      <div className="flex space-x-2 relative">
        <button
          className="text-gray-400 hover:text-primary-content"
          onClick={handleMenuToggle}
          ref={threeDotsButtonRef}
        >
          <BsThreeDotsVertical size={20} />
        </button>
        {isMenuVisible && (
          <div
            ref={channelCardMenuRef}
            className="absolute top-6 bg-base-300 text-white shadow-lg rounded-lg w-48 z-10"
          >
            {Object.entries(popupItems).map(([itemName, action]) => (
              <li
                key={itemName}
                className="p-2 hover:bg-base-200 cursor-pointer"
                onClick={action}
              >
                {itemName}
              </li>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelCard;
