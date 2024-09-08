import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactionPicker from '../ReactionPicker/ReactionPicker';
import { Message as MessageType } from '../../models/Message';
import { EmojiClickData } from 'emoji-picker-react';
import ReactionsDisplay from '../ReactionsDisplay/ReactionsDisplay';

interface MessageProps {
  message: MessageType;
  currentUserUsername: string;
  senderAvatar: string;
  onReactionClick: (emojiData: EmojiClickData) => void;
  onEditMessage: (
    channelId: string,
    messageId: string,
    newContent: string
  ) => void;
}

const Message: React.FC<MessageProps> = ({
  message,
  currentUserUsername,
  senderAvatar,
  onReactionClick,
  onEditMessage,
}) => {
  const [isReactionPickerOpen, setIsReactionPickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const pickerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      pickerRef.current &&
      !pickerRef.current.contains(event.target as Node)
    ) {
      setIsReactionPickerOpen(false);
    }
  };

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsReactionPickerOpen(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsReactionPickerOpen(false);
  };

  useEffect(() => {
    if (isReactionPickerOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [isReactionPickerOpen]);

  const isCurrentUser = message.sender === currentUserUsername;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedContent(event.target.value);
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      await onEditMessage(message.channelId, message.id, editedContent);
      setIsEditing(false);
    }
  };

  return (
    <div className={`chat ${isCurrentUser ? 'chat-end' : 'chat-start'} py-4`}>
      <div className="chat-header">{message.sender}</div>
      <div className="chat-image avatar">
        <div className="w-10 h-10 rounded-full">
          {senderAvatar ? (
            <img src={senderAvatar} alt="User Avatar" />
          ) : (
            <span className="w-10 h-10 flex justify-center items-center bg-base-100 ">
              {message.sender![0].toLocaleUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-start">
        {isCurrentUser && (
          <button
            onClick={isEditing ? handleCancelClick : handleEditClick}
            className={`mr-2 text-xs ${isEditing ? 'text-red-500' : ''}`}
            style={{ alignSelf: 'center' }}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        )}
        <div
          className={`chat-bubble relative my-2 break-words text-primary-content ${
            isCurrentUser ? 'bg-primary text-primary-content' : 'bg-secondary'
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {isEditing ? (
            <input
              type="text"
              value={editedContent}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="bg-transparent text-white focus:outline-none"
              style={{ width: `${editedContent.length + 1}ch` }}
              autoFocus
            />
          ) : (
            <p>{message.content}</p>
          )}
          {message.media && (
            <img className="mt-2 rounded-xl" src={message.media} />
          )}
          {isReactionPickerOpen && (
            <div
              ref={pickerRef}
              className={`absolute bottom-2 z-10 ${
                isCurrentUser ? 'right-[230px]' : 'right-[135px]'
              }`}
            >
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
