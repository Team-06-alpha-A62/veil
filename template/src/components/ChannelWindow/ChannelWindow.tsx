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
import { getChannelName } from '../../utils/TransformDataHelpers.ts';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { MdEmojiEmotions } from 'react-icons/md';

interface ChannelWindowProps {
  channel: Channel;
}

const ChannelWindow: React.FC<ChannelWindowProps> = ({ channel }) => {
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState<string>('');
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (isEmojiPickerOpen) {
      document.addEventListener('mousedown', handleClickOutsideEmojiPicker);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideEmojiPicker);
    }

    return () =>
      document.removeEventListener('mousedown', handleClickOutsideEmojiPicker);
  });
  const getParticipantAvatar = (sender: string): string => {
    return (
      Object.values(channel.participants).find(
        participant => participant.username === sender
      )?.avatarUrl ?? ''
    );
  };

  const handleAddClick = async (): Promise<void> => {
    const currentChannelParticipants = Object.keys(channel.participants);

    if (channel.type === ChannelType.GROUP) {
      participants.forEach(participant =>
        addChannelParticipant(channel.id, participant)
      );
    } else {
      const newChannelParticipants = [
        ...currentChannelParticipants,
        ...participants,
      ];

      await createChannel(
        channel.name || null,
        channel.owner,
        newChannelParticipants,
        ChannelType.GROUP,
        channel.isPrivate,
        channel.team
      );
    }

    setParticipants([]);
  };

  const handleClickOutsideEmojiPicker = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node)
    ) {
      setIsEmojiPickerOpen(false);
    }
  };

  const handleEmojiPickerOpenToggle = () => {
    setIsEmojiPickerOpen(prev => !prev);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev.concat(emojiData.emoji));
  };
  return (
    <div className="flex flex-col h-full">
      <header className="basis-1/10 h-auto flex flex-shrink-0 flex-row-reverse justify-between pb-6">
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
              channelParticipants={Object.keys(channel?.participants || {})}
            />
            <button
              className="mt-6 text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
              onClick={handleAddClick}
            >
              Add
            </button>
          </div>
        </div>
        <div
          className="tooltip tooltip-bottom"
          data-tip={`Channel participants: ${Object.keys(
            channel?.participants || {}
          )
            .filter(p => p !== currentUser.userData!.username)
            .join(', ')
            .concat(` and ${currentUser.userData!.username}`)}`}
        >
          <h2 className="font-semibold">
            {getChannelName(currentUser.userData!.username, channel)}
          </h2>
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
        <div className="sticky flex items-center gap-3 bottom-0 p-5 border-t border-gray-700">
          <div ref={emojiPickerRef}>
            <EmojiPicker
              onEmojiClick={emojiData => handleEmojiClick(emojiData)}
              autoFocusSearch={true}
              theme={Theme.AUTO}
              lazyLoadEmojis={true}
              style={{ position: 'absolute', right: '45px', bottom: '55px' }}
              open={isEmojiPickerOpen}
            />
          </div>
          <label className=" input flex-1 px-4 py-2 rounded-full bg-gray-700 focus:outline-none flex items-center gap-2">
            <input
              value={newMessage}
              type="text"
              className="grow"
              placeholder="Type here"
              onChange={e => setNewMessage(e.target.value)}
            />
            <BsArrowReturnLeft />
          </label>
          <MdEmojiEmotions size={30} onClick={handleEmojiPickerOpenToggle} />
        </div>
      </div>
    </div>
  );
};

export default ChannelWindow;
