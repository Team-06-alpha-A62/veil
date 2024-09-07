import { useMemo } from 'react';
import { UserRole } from '../../enums/UserRole';

interface ChannelCardMenuProps {
  isTeamChannel: boolean;
  userRole: UserRole;
  isGroup: boolean;
  onLeaveChannel: () => void;
  onChangeIcon: () => void;
  onManageChannel: () => void;
}

const ChannelCardMenu: React.FC<ChannelCardMenuProps> = ({
  isTeamChannel,
  userRole,
  isGroup,
  onLeaveChannel,
  onChangeIcon,
  onManageChannel,
}) => {
  const popupItems = useMemo(() => {
    const actions: Record<string, () => void> = {
      'Mute Conversation': () => console.log('Mute Conversation clicked'),
    };

    if (userRole === UserRole.OWNER) {
      actions['Change Icon'] = onChangeIcon;

      actions['Manage Channel'] = onManageChannel;

      actions['Leave Group'] = onLeaveChannel;
    }
    if (userRole === UserRole.MODERATOR) {
      actions['Manage Channel'] = onManageChannel;
    }
    if (isGroup && !isTeamChannel) {
      actions['Leave Group'] = onLeaveChannel;
    }

    return actions;
  }, [userRole, isGroup, isTeamChannel, onLeaveChannel, onChangeIcon]);

  return (
    <>
      <div className="absolute right-8 top-0 mt-2 bg-base-100 text-white shadow-lg rounded-lg w-48 z-[1000] list-none">
        {Object.entries(popupItems).map(([itemName, action]) => (
          <li
            key={itemName}
            className="p-2 hover:bg-base-200 cursor-pointer rounded-lg"
            onClick={action}
          >
            {itemName}
          </li>
        ))}
      </div>
    </>
  );
};

export default ChannelCardMenu;
