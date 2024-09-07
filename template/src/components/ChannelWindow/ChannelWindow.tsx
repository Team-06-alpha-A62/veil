import { useEffect, useRef, useState } from 'react';
import { Channel } from '../../models/Channel.ts';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { useAuth } from '../../providers/AuthProvider.tsx';
import {
  createMessage,
  updateMessageReactions,
} from '../../services/message.service.ts';
import ParticipantsInput from '../ParticipantInput/ParticipantsInput.tsx';
import {
  addChannelParticipant,
  createChannel,
} from '../../services/channel.service.ts';
import { ChannelType } from '../../enums/ChannelType.ts';
import { getChannelName } from '../../utils/TransformDataHelpers.ts';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { MdEmojiEmotions } from 'react-icons/md';
import Message from '../Message/Message.tsx';
import { SiGiphy } from 'react-icons/si';
import GiphySearch from '../GiphySearch/GiphySearch.tsx';
import DragZone from '../DragZone/DragZone.tsx';
import { uploadImage } from '../../services/storage.service.ts';
import { UserRole } from '../../enums/UserRole.ts';
import { createNotification } from '../../services/notification.service.ts';
import { NotificationType } from '../../enums/NotificationType.ts';
import { NotificationMessageType } from '../../enums/NotificationMessageType.ts';
import { addUnreadNotification } from '../../services/user.service.ts';

interface ChannelWindowProps {
  channel: Channel;
  teamMembers?: string[];
}

const ChannelWindow: React.FC<ChannelWindowProps> = ({
  channel,
  teamMembers = [],
}) => {
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState<string>('');
  const [newMessageImage, setNewMessageImage] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState<boolean>(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiesIconRef = useRef<HTMLDivElement>(null);
  const gifPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [channel?.messages]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (newMessage.trim().length === 0 && !newMessageImage) return;
      if (e.key === 'Enter') {
        let finalImageUrl = newMessageImage;
        if (uploadedFile) {
          const fileUrl = await uploadImage(uploadedFile);
          finalImageUrl = fileUrl;
        }
        await createMessage(
          currentUser.userData!.username,
          channel.id,
          newMessage,
          finalImageUrl
        );

        Object.keys(channel.participants).forEach(async participant => {
          await addUnreadNotification(
            participant,
            channel.id,
            NotificationType.MESSAGE
          );
        });

        setNewMessage('');
        setNewMessageImage('');
        setUploadedFile(null);

        setTimeout(() => {
          if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({
              top: chatWindowRef.current.scrollHeight,
              behavior: 'smooth',
            });
          }
        }, 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [newMessage, newMessageImage, currentUser, channel?.id]);

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

  const canAddParticipants = (): boolean => {
    const userRole =
      channel?.participants[currentUser.userData!.username]?.role;

    const isOwnerOrModerator =
      userRole === UserRole.OWNER || userRole === UserRole.MODERATOR;

    if (channel.type === ChannelType.TEAM && channel.isPrivate) {
      if (isOwnerOrModerator) {
        return true;
      } else {
        return false;
      }
    } else if (channel.type === ChannelType.TEAM && !channel.isPrivate) {
      return false;
    }

    return isOwnerOrModerator;
  };

  const handleAddClick = async (): Promise<void> => {
    const currentChannelParticipants = Object.keys(channel.participants);

    if (channel.type === ChannelType.DIRECT) {
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
        channel.teamId
      );
    } else {
      participants.forEach(participant =>
        addChannelParticipant(channel.id, participant)
      );
    }
    participants.forEach(async participant => {
      const newNotificationId = await createNotification(
        currentUser.userData!.username,
        participant,
        NotificationType.CHANNEL,
        `${currentUser.userData!.username} added you to a channel`,
        NotificationMessageType.ALERT_INFO
      );

      await addUnreadNotification(
        participant,
        newNotificationId,
        NotificationType.CHANNEL
      );
    });

    setParticipants([]);
  };

  const handleFileChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setUploadedFile(file);
    setNewMessageImage(previewUrl);
  };

  const handleClickOutsideEmojiPicker = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node) &&
      emojiesIconRef.current &&
      !emojiesIconRef.current.contains(event.target as Node)
    ) {
      setIsEmojiPickerOpen(false);
    }
  };

  const handleEmojiPickerOpenToggle = () => {
    if (isGifPickerOpen) setIsGifPickerOpen(false);
    setIsEmojiPickerOpen(prev => !prev);
  };

  const handleGifPickerOpenToggle = () => {
    if (isEmojiPickerOpen) setIsEmojiPickerOpen(false);
    setIsGifPickerOpen(prev => !prev);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev.concat(emojiData.emoji));
  };

  const handleReactionClick = async (
    messageId: string,
    emojiData: EmojiClickData
  ) => {
    console.log(emojiData);
    try {
      await updateMessageReactions(
        channel.id,
        messageId,
        currentUser.userData!.username,
        emojiData.unified
      );
      console.log(`Reaction ${emojiData.emoji} added to message ${messageId}`);
    } catch (error) {
      console.error('Failed to update reaction:', error);
    }
  };

  return (
    <div className="flex flex-col h-full z-0">
      <header className="basis-2/10 h-auto flex flex-shrink-0 flex-row-reverse justify-between pb-6">
        {canAddParticipants() && (
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
                {...(teamMembers.length > 0
                  ? { teamMembers }
                  : {
                      channelParticipants: Object.keys(
                        channel?.participants || {}
                      ),
                    })}
              />
              <button
                className="mt-6 text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
                onClick={handleAddClick}
              >
                Add
              </button>
            </div>
          </div>
        )}
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
      <div className=" relative flex flex-col rounded-3xl border border-gray-700 bg-base-300 bg-opacity-50 min-h-full">
        <main ref={chatWindowRef} className="flex-1 overflow-y-auto px-6">
          {Object.values(channel?.messages || {})
            .sort((a, b) => a.sentAt - b.sentAt)
            .map(message => (
              <Message
                key={message.id}
                message={message}
                senderAvatar={getParticipantAvatar(message.sender)}
                currentUserUsername={currentUser.userData!.username}
                onReactionClick={emojiData =>
                  handleReactionClick(message.id, emojiData)
                }
              />
            ))}
        </main>
        <div className="sticky flex flex-col gap-3 bottom-0 p-5 border-t border-gray-700">
          {newMessageImage && (
            <div className="relative ml-6 w-36">
              <span
                className="absolute top-2 right-2 cursor-pointer bg-white bg-opacity-90 w-6 h-6 flex justify-center items-center rounded-full text-primary-content"
                onClick={() => setNewMessageImage('')}
              >
                &times;
              </span>
              <img
                src={newMessageImage}
                alt="Selected image"
                className="rounded-3xl w-36"
              />
            </div>
          )}
          <div className="flex items-center w-full">
            <div ref={emojiPickerRef}>
              <EmojiPicker
                onEmojiClick={emojiData => handleEmojiClick(emojiData)}
                autoFocusSearch={true}
                theme={Theme.AUTO}
                lazyLoadEmojis={true}
                style={{ position: 'absolute', right: '100px', bottom: '70px' }}
                open={isEmojiPickerOpen}
              />
            </div>
            {isGifPickerOpen && (
              <div ref={gifPickerRef}>
                <GiphySearch
                  styleProps={{
                    right: '60px',
                    bottom: '70px',
                  }}
                  setNewMessageImage={setNewMessageImage}
                />
              </div>
            )}
            <label className="mr-4 input flex-1 px-4 py-2 rounded-full bg-gray-700 focus:outline-none flex items-center gap-2">
              <input
                value={newMessage}
                type="text"
                className="grow"
                placeholder="Type here"
                onChange={e => setNewMessage(e.target.value)}
              />
              <BsArrowReturnLeft />
            </label>
            <MdEmojiEmotions
              size={30}
              onClick={handleEmojiPickerOpenToggle}
              className="mr-4"
            />
            <SiGiphy
              style={{ fontSize: '25px', marginRight: '16px' }}
              onClick={handleGifPickerOpenToggle}
            />
            <DragZone
              handleFileChange={handleFileChange}
              width={25}
              height={25}
              round={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelWindow;
