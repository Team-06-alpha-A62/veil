interface ChannelCardPopupProps {
  onClose: () => void;
}

const ChannelCardPopup: React.FC<ChannelCardPopupProps> = () => {
  return (
    <div>
      <ul className="flex flex-col p-2">
        <li className="p-2 hover:bg-base-200 cursor-pointer">Mark As Read</li>
        <li className="p-2 hover:bg-base-200 cursor-pointer">Change Icon</li>
        <li className="p-2 hover:bg-base-200 cursor-pointer">
          Mute Conversation
        </li>
        <li className="p-2 hover:bg-base-200 cursor-pointer text-red-500">
          Leave Group
        </li>
      </ul>
    </div>
  );
};

export default ChannelCardPopup;
