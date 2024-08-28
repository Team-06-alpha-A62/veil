import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Channel } from '../../models/Channel.ts';

interface ChannelCardProps {
  channel: Channel;
  handleClick: (channel: Channel) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, handleClick }) => {
  //unseenMessages = useState(channel.participants.find(part=>part.username===currentUser.userData.username).unseenMessages.length);

  return (
    <div
      className="flex items-center p-6 border-b-2 border-base-100 justify-between hover:bg-base-300 hover:bg-opacity-50 cursor-pointer active:bg-opacity-0 transition-colors"
      onClick={() => {
        console.log(channel);
        handleClick(channel);
      }}
    >
      <div className="relative flex items-center space-x-4">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-14 skeleton rounded-full">
            <span className="text-3xl">D</span>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-m">{channel.name}</h2>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="text-gray-400 hover:text-primary-content">
          <BsThreeDotsVertical size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChannelCard;
