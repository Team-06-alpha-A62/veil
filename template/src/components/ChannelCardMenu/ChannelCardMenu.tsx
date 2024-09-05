import { useMemo } from 'react';

interface ChannelCardMenuProps {
  isTeamChannel: boolean;
  isOwner: boolean;
  isGroup: boolean;
  onLeaveChannel: () => void;
  onChangeIcon: () => void;
}

const ChannelCardMenu: React.FC<ChannelCardMenuProps> = ({
  isTeamChannel,
  isOwner,
  isGroup,
  onLeaveChannel,
  onChangeIcon,
}) => {
  const popupItems = useMemo(() => {
    const actions: Record<string, () => void> = {
      'Mute Conversation': () => console.log('Mute Conversation clicked'),
    };

    if (isOwner && !isTeamChannel) {
      actions['Change Icon'] = onChangeIcon;
    }
    if (isOwner) {
      actions['Edit Channel'] = () => console.log('Edit Channel clicked');
    }
    if (isGroup && !isTeamChannel) {
      actions['Leave Group'] = onLeaveChannel;
    }

    return actions;
  }, [isOwner, isGroup, isTeamChannel, onLeaveChannel, onChangeIcon]);

  return (
    <div className="absolute left-4 bottom-1 bg-base-300 text-white shadow-lg rounded-lg w-48 z-10 list-none">
      {Object.entries(popupItems).map(([itemName, action]) => (
        <li
          key={itemName}
          className="p-2 hover:bg-base-200 cursor-pointer"
          onClick={action}
        >
          {itemName}
        </li>
      ))}
    </div>
  );
};

export default ChannelCardMenu;
