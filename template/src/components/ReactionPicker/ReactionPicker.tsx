import React from 'react';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

interface ReactionPickerProps {
  onReactionClick: (emoji: EmojiClickData) => void;
  onClose: () => void;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onReactionClick,
  onClose,
}) => {
  const handleReactionClick = (
    emojiData: EmojiClickData,
    event: MouseEvent
  ) => {
    onReactionClick(emojiData);
    onClose();
  };

  return (
    <div className="absolute z-10">
      <EmojiPicker
        reactionsDefaultOpen={true}
        onReactionClick={handleReactionClick}
        theme={Theme.AUTO}
        lazyLoadEmojis={true}
      />
    </div>
  );
};

export default ReactionPicker;
