import { useMemo } from 'react';
import { UserRole } from '../../enums/UserRole';

interface ChannelCardMenuProps {
  isTeamChannel: boolean;
  userRole: UserRole;
  isGroup: boolean;
  onLeaveChannel: () => void;
  onChangeIcon: () => void;
  onManageChannel: () => void;
  isTeamOwner?: boolean;
}

const ChannelCardMenu: React.FC<ChannelCardMenuProps> = ({
  isTeamChannel,
  userRole,
  isGroup,
  onLeaveChannel,
  onChangeIcon,
  onManageChannel,
  isTeamOwner = false,
}) => {
  const popupItems = useMemo(() => {
    const actions: Record<string, () => void> = {
      'Mute Conversation': () => console.log('Mute Conversation clicked'),
    };

    if (userRole === UserRole.OWNER) {
      actions['Manage Channel'] = onManageChannel;
    }
    if (!isTeamChannel) {
      actions['Change Icon'] = onChangeIcon;
    } else {
      if (isTeamOwner) {
        actions['Manage Channel'] = onManageChannel;
      }
    }

    if (userRole === UserRole.MODERATOR || userRole === UserRole.OWNER) {
      actions['Manage Channel'] = onManageChannel;
    }
    if (isGroup && !isTeamChannel && userRole !== UserRole.OWNER) {
      actions['Leave Group'] = onLeaveChannel;
    }

    return actions;
  }, [userRole, isGroup, isTeamChannel, onLeaveChannel, onChangeIcon]);

  return (
    <>
      <div className="absolute right-8 top-0 mt-2 bg-primary text-primary-content shadow-lg rounded-lg w-48 z-[1000] list-none">
        {Object.entries(popupItems).map(([itemName, action]) => (
          <li
            key={itemName}
            className="p-2 hover:opacity-50 cursor-pointer"
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
