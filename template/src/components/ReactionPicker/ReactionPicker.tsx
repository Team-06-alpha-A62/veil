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
  const handleReactionClick = (emojiData: EmojiClickData) => {
    onReactionClick(emojiData);
    onClose();
  };

  return (
    <>
      <style>{`
        button[aria-label="Show all Emojis"],
        button[title="Show all Emojis"] {
          display: none;
        }
      `}</style>
      <div className="absolute z-10" style={{ transform: 'scale(0.6)' }}>
        <EmojiPicker
          reactionsDefaultOpen={true}
          onEmojiClick={handleReactionClick}
          lazyLoadEmojis={true}
          theme={Theme.DARK}
          searchDisabled={true}
          skinTonesDisabled={true}
        />
      </div>
    </>
  );
};

export default ReactionPicker;
