import React from 'react';

interface CreateChannelButtonProps {
  handleClick: () => void;
}

const CreateChannelButton: React.FC<CreateChannelButtonProps> = ({
  handleClick,
}) => {
  return (
    <button
      className="text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75"
      onClick={handleClick}
    >
      Start Conversation
    </button>
  );
};

export default CreateChannelButton;
