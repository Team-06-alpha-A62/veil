import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactionPicker from '../ReactionPicker/ReactionPicker';
import { Message as MessageType } from '../../models/Message';
import { EmojiClickData } from 'emoji-picker-react';
import MessageReactions from '../MessageReactions/MessageReactions';
import ReactionsDisplay from '../ReactionsDisplay/ReactionsDisplay';

interface MessageProps {
  message: MessageType;
  currentUserUsername: string;
  senderAvatar: string;
  onReactionClick: (emojiData: EmojiClickData) => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  currentUserUsername,
  senderAvatar,
  onReactionClick,
}) => {
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setIsReactionPickerOpen(false);
    }
  };

  useEffect(() => {
    if (isReactionPickerOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isReactionPickerOpen]);

  return (
    <div
      className={`chat ${
        message.sender === currentUserUsername ? 'chat-end' : 'chat-start'
      } py-4`}
    >
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User Avatar" src={senderAvatar} />
        </div>
      </div>
      <div className="chat-header">{message.sender}</div>
      <div
        className={`chat-bubble my-2 break-words text-primary-content ${
          message.sender === currentUserUsername
            ? 'bg-primary text-primary-content'
            : 'bg-secondary'
        }`}
      >
        {message.content}
        <button onClick={() => setIsReactionPickerOpen(true)}>React</button>
        {isReactionPickerOpen && (
          <div ref={pickerRef}>
            <ReactionPicker
              onReactionClick={emojiData => {
                onReactionClick(emojiData);
                setIsReactionPickerOpen(false);
              }}
              onClose={() => setIsReactionPickerOpen(false)}
            />
          </div>
        )}
        {message.reactions && (
          <ReactionsDisplay reactions={message.reactions} />
        )}
      </div>
      <time className="mx-2 text-xs chat-footer opacity-50">
        {formatDistanceToNow(new Date(message.sentAt), {
          addSuffix: true,
        })}
      </time>
    </div>
  );
};

export default Message;
