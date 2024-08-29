import React, { useEffect, useRef, useState } from 'react';
import { Channel } from '../../models/Channel.ts';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { createMessage } from '../../services/message.service.ts';
import { formatDistanceToNow } from 'date-fns';
import ParticipantsInput from '../ParticipantInput/ParticipantsInput.tsx';
import {
  addChannelParticipant,
  createChannel,
} from '../../services/channel.service.ts';
import { ChannelType } from '../../enums/ChannelType.ts';

interface ChannelWindowProps {
  channel: Channel;
}

// const initialChannelState = {
//   : '',
//   name: '',
//   type: ChannelType.DIRECT,
//   isPrivate: true,
//   owner: '',
//   participants: {},
//   team: '',
//   messages: {},
//   createdOn: 0,
// };

const ChannelWindow: React.FC<ChannelWindowProps> = ({ channel }) => {
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState<string>('');
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<string[]>([]);

  const getParticipantAvatar = (sender: string): string => {
    return (
      Object.values(channel.participants).find(
        participant => participant.username === sender
      )?.avatarUrl ?? ''
    );
  };

  const handleAddClick = async (): Promise<void> => {
    const currentChannelParticipants = Object.keys(channel.participants);

    if (currentChannelParticipants.length > 2) {
      participants.forEach(participant =>
        addChannelParticipant(channel.id, participant)
      );
    } else {
      const newChannelParticipants = [
        ...currentChannelParticipants,
        ...participants,
      ];
      const newChannelName = newChannelParticipants
        .filter(p => p !== currentUser.userData!.username)
        .join(', ')
        .concat(` and ${currentUser.userData!.username}`);

      await createChannel(
        newChannelName,
        channel.owner,
        newChannelParticipants,
        ChannelType.GROUP,
        channel.isPrivate,
        channel.team
      );
    }

    setParticipants([]);
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [channel?.messages]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (newMessage.trim().length === 0) return;
      if (e.key === 'Enter') {
        await createMessage(
          currentUser.userData!.username,
          channel.id,
          newMessage
        );
        setNewMessage('');

        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newMessage, currentUser, channel?.id]);

  return (
    <div className="flex flex-col h-full">
      <header className="basis-1/10 h-auto flex flex-shrink-0 flex-row-reverse pb-6">
        <div className="dropdown dropdown-bottom dropdown-end">
          <button
            tabIndex={0}
            className="text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
          >
            Add Participant
          </button>
          <div
            tabIndex={0}
            className="inline-block dropdown-content menu bg-base-100 rounded-box z-[1] w-96 p-6 shadow"
          >
            <ParticipantsInput
              participants={participants}
              setParticipants={setParticipants}
            />
            <button
              className="mt-6 text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>
        </div>
      </header>
      <div className="relative flex flex-col rounded-3xl border border-gray-700 bg-base-300 bg-opacity-50 h-full">
        <main
          ref={chatWindowRef}
          className="basis-8/10 h-auto flex-1 overflow-y-scroll px-6"
        >
          {Object.values(channel?.messages || {})
            .sort((a, b) => a.sentAt - b.sentAt)
            .map(message => (
              <div
                key={message.id}
                className={`chat ${
                  message.sender === currentUser.userData?.username
                    ? 'chat-end'
                    : 'chat-start'
                } py-4`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src={getParticipantAvatar(message.sender)}
                    />
                  </div>
                </div>
                <div className="chat-header">{message.sender}</div>
                <div
                  className={`chat-bubble my-2 break-words text-primary-content ${
                    message.sender === currentUser.userData?.username
                      ? 'bg-primary text-primary-content'
                      : 'bg-secondary'
                  }`}
                >
                  {message.content}
                </div>
                <time className="mx-2  text-xs chat-footer opacity-50">
                  {formatDistanceToNow(new Date(message.sentAt), {
                    addSuffix: true,
                  })}
                </time>
              </div>
            ))}
        </main>
        <div className="sticky bottom-0 p-5 border-t border-gray-700">
          <label className=" input px-4 py-2 rounded-full bg-gray-700 focus:outline-none flex items-center gap-2">
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
    </div>
  );
};

export default ChannelWindow;
