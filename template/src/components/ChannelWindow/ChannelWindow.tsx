import React, { useEffect, useState } from 'react';
import { Channel } from '../../models/Channel.ts';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { createMessage } from '../../services/message.service.ts';

interface ChannelWindowProps {
  channel: Channel;
}

const ChannelWindow: React.FC<ChannelWindowProps> = ({ channel }) => {
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (!newMessage.trim()) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        await createMessage(
          currentUser.userData!.username,
          channel.id,
          newMessage
        );
        setNewMessage('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  //current user
  //messages state =
  //newMessage state

  //sendMessage  =>
  //              validate if message is empty
  //

  return (
    <div className="flex flex-col rounded-3xl border border-gray-700 bg-base-300 bg-opacity-50 p-6 h-full ">
      <header className="basis-1/10 h-auto flex-shrink-0">
        {Object.values(channel?.participants || {}).map(participant => (
          <div key={participant.username}>{participant.username}</div>
        ))}
      </header>
      <main className="basis-8/10 h-auto flex-1"></main>
      <div className="basis-1/10">
        <label className="input px-4 py-2 rounded-full bg-gray-700 bg-opacity-50 focus:outline-none flex items-center gap-2">
          <input
            value={newMessage}
            type="text"
            className="grow"
            placeholder="Type here"
            onChange={e => setNewMessage(e.target.value)}
          />
          <BsArrowReturnLeft />
        </label>
      </div>
    </div>
  );
};

export default ChannelWindow;
