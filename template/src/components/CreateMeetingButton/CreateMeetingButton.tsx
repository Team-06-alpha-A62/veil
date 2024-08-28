import React from 'react';

interface CreateMeetingButtonProps {
  handleClick: () => void;
}

const CreateMeetingButton: React.FC<CreateMeetingButtonProps> = ({
  handleClick,
}) => {
  return (
    <button
      className="text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 transition-colors text-white"
      onClick={handleClick}
    >
      New Meeting
    </button>
  );
};

export default CreateMeetingButton;
