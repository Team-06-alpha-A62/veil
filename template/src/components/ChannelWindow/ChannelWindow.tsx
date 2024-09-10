import { useEffect, useRef, useState } from 'react';
import { Channel } from '../../models/Channel.ts';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { useAuth } from '../../providers/AuthProvider.tsx';
import {
  createMessage,
  editMessage,
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
import animationData from '../../assets/loading-animation.json';

import Lottie from 'lottie-react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';

import { addDyteMeetingParticipant } from '../../services/dyte.service.ts';
import { DyteParticipantType } from '../../enums/DyteParticipantType.ts';
import DyteMeetingUI from '../DyteMeetingUI/DyteMeetingUI.tsx';

import { FaPhoneAlt } from 'react-icons/fa';

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
  const [channelIsLoading, setChannelIsLoading] = useState<boolean>(true);

  const [call, setCall] = useState<boolean>(false);

  const [meeting, initMeeting] = useDyteClient();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isDyteMeetingReady, setIsDyteMeetingReady] = useState<boolean>(false);

  useEffect(() => {
    if (!channel.activeMeetingId) return;
    const preset =
      currentUser.userData!.username === channel.owner
        ? DyteParticipantType.HOST
        : DyteParticipantType.PARTICIPANT;

    const getTokenAndInitMeeting = async () => {
      try {
        const token = await addDyteMeetingParticipant(
          channel.activeMeetingId!,
          preset,
          currentUser.userData!.username,
          currentUser.userData!.avatarUrl!
        );
        setAuthToken(token);

        // Initialize the Dyte meeting
        await initDyteMeeting(token);
      } catch (error) {
        console.error('Error initializing Dyte meeting:', error);
      }
    };

    getTokenAndInitMeeting();
    // setCall(false);
  }, [channel.activeMeetingId, call]);

  useEffect(() => {
    if (authToken && channel.activeMeetingId) {
      setTimeout(() => setChannelIsLoading(false), 800);
    }
  }, [authToken, channel.activeMeetingId]);

  const initDyteMeeting = async (token: string) => {
    try {
      await initMeeting({
        authToken: token,
        defaults: {
          audio: false,
          video: false,
        },
      });

      // Set Dyte meeting ready state after successful initialization
      setIsDyteMeetingReady(true);
    } catch (error) {
      console.error('Failed to initialize Dyte meeting:', error);
    }
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [channel?.messages, channel]);

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
          if (participant !== currentUser.userData?.username) {
            await addUnreadNotification(
              participant,
              channel.id,
              NotificationType.MESSAGE,
              channel.type
            );
          }
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
  }, [newMessage, newMessageImage, currentUser, channel?.id, channel]);

  const handleEditMessage = async (
    channelId: string,
    messageId: string,
    newContent: string
  ) => {
    await editMessage(channelId, messageId, newContent);
  };

  useEffect(() => {
    if (isEmojiPickerOpen) {
      document.addEventListener('mousedown', handleClickOutsideEmojiPicker);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideEmojiPicker);
    }

    return () =>
      document.removeEventListener('mousedown', handleClickOutsideEmojiPicker);
  }, [isEmojiPickerOpen]);

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
        NotificationType.CHANNEL,
        channel.type
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

  if (channelIsLoading) {
    return <Lottie animationData={animationData} />;
  }

  return (
    <DyteProvider value={meeting}>
      <div className="flex flex-col h-full z-0">
        <header className="basis-2/10 h-auto flex flex-shrink-0 flex-row-reverse justify-between pb-6">
          <div className="flex gap-4">
            {!call && (
              <>
                {channel.meetingParticipants !== 0 && (
                  <span>
                    Current meeting participants: {channel.meetingParticipants}
                  </span>
                )}
                <button
                  className="flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 text-white"
                  onClick={async () => {
                    setCall(prev => !prev);
                  }}
                >
                  <FaPhoneAlt />
                  {channel.meetingParticipants !== 0 ? (
                    <span>Join</span>
                  ) : (
                    <span>Call</span>
                  )}
                </button>
              </>
            )}
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
        <div className=" relative flex flex-col rounded-3xl border border-opacity-25 border-base-content bg-base-200 min-h-full">
          {authToken && isDyteMeetingReady && call && (
            <div className="w-full h-auto rounded-t-3xl">
              <DyteMeetingUI setCall={setCall} channelId={channel.id} />
            </div>
          )}
          <main
            ref={chatWindowRef}
            className="flex-1 overflow-y-auto px-6 pt-4"
          >
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
                  onEditMessage={handleEditMessage}
                />
              ))}
          </main>
          <div className="sticky flex flex-col gap-3 bottom-0 p-5 border-t border-opacity-25 border-base-content">
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
                  style={{
                    position: 'absolute',
                    right: '100px',
                    bottom: '70px',
                  }}
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
              <label className="mr-4 input flex-1 px-4 py-2 rounded-full bg-base-300 focus:outline-none  flex items-center gap-2">
                <input
                  value={newMessage}
                  type="text"
                  className="grow"
                  placeholder="Type here"
                  onChange={e => setNewMessage(e.target.value)}
                />
                <BsArrowReturnLeft className="text-base-content" />
              </label>
              <MdEmojiEmotions
                size={30}
                onClick={handleEmojiPickerOpenToggle}
                className="mr-4 text-base-content"
              />
              <SiGiphy
                style={{ fontSize: '25px', marginRight: '16px' }}
                onClick={handleGifPickerOpenToggle}
                className="text-base-content"
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
    </DyteProvider>
  );
};

export default ChannelWindow;
