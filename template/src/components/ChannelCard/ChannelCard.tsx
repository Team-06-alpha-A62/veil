import React, { useState, useRef, useEffect } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Channel } from '../../models/Channel.ts';
import { useAuth } from '../../providers/AuthProvider';
import { leaveChannel } from '../../services/user.service.ts';
import { ChannelType } from '../../enums/ChannelType.ts';
import {
  getChannelImage,
  getChannelName,
} from '../../utils/TransformDataHelpers.ts';
import ChannelCardMenu from '../ChannelCardMenu/ChannelCardMenu.tsx';
import { FaUserGroup } from 'react-icons/fa6';
interface ChannelCardProps {
  channel: Channel;
  handleClick: (channel: Channel) => void;
  isTeamChannel?: boolean;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  handleClick,
  isTeamChannel = false,
}) => {
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

  const isOwner = channel.owner === currentUsername;
  const isGroup = channel.type === ChannelType.GROUP;
  const channelImage = getChannelImage(channel, currentUser.userData!.username);
  return (
    <div
      className="flex relative items-center p-6 border-b-2 border-base-100 justify-between hover:bg-base-300 hover:bg-opacity-50 cursor-pointer active:bg-opacity-0 transition-colors"
      onClick={() => handleClick(channel)}
    >
      <div
        className={`flex items-center ${
          isTeamChannel ? 'space-x-1  ' : 'space-x-4'
        }`}
      >
        {!isTeamChannel ? (
          <div className="avatar placeholder">
            <div className="bg-base-300 text-neutral-content w-14  rounded-full">
              {channelImage ? (
                channelImage.startsWith('http') ? (
                  <img src={channelImage} />
                ) : (
                  <span className="text-3xl">{channelImage}</span>
                )
              ) : (
                <span className="text-3xl">
                  <FaUserGroup />
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="space-x-4">#</div>
        )}
        <div>
          <h2 className="font-semibold text-m">
            {getChannelName(currentUser.userData!.username, channel)}
          </h2>
        </div>
      </div>
      <div className="flex space-x-2 relative">
        <button
          className="text-gray-400 hover:text-primary-content"
          onClick={event => {
            event.stopPropagation();
            setIsMenuVisible(prev => !prev);
          }}
          ref={threeDotsButtonRef}
        >
          <BsThreeDotsVertical size={20} />
        </button>
        <div ref={channelCardMenuRef}>
          {isMenuVisible && (
            <ChannelCardMenu
              isTeamChannel={isTeamChannel}
              isOwner={isOwner}
              isGroup={isGroup}
              onLeaveChannel={onLeaveChannel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
