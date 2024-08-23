import React, { useState } from 'react';
import SidebarItem from '../SidebarItem/SidebarItem';
import {
  FaTachometerAlt,
  FaBell,
  FaUsers,
  FaComments,
  FaUserFriends,
  FaStickyNote,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useAuth } from '../../providers/AuthProvider';
import UserProfileCard from '../UserProfileCard/UserProfileCard';

interface SidebarProps {}

const SidebarNavigation: React.FC<SidebarProps> = () => {
  const { currentUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsExpanded(value => !value);
  };

  return (
    <div
      className={`${
        isExpanded ? 'w-[300px] px-8' : 'w-[80px]'
      } mt-8 mb-8 ml-8 flex flex-col items-center bg-base-300 bg-opacity-50 transition-all duration-300 relative rounded-3xl `}
    >
      <div
        className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 ${
          isExpanded ? 'left-[calc(100%-50px)] translate-x-0' : ''
        }`}
        onClick={toggleSidebar}
      >
        <span className="text-[1.5rem] cursor-pointer text-gray-300 flex items-center justify-center w-[30px] h-[30px]">
          {isExpanded ? 'x' : 'o'}
        </span>
      </div>

      <div className="flex flex-col mt-[75px] flex-grow w-full gap-3">
        <SidebarItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          isExpanded={isExpanded}
          to="dashboard"
        />
        <SidebarItem
          icon={<FaBell />}
          label="Notifications"
          isExpanded={isExpanded}
          to="notifications"
        />
        <SidebarItem
          icon={<FaUsers />}
          label="Teams"
          isExpanded={isExpanded}
          to="teams"
        />
        <SidebarItem
          icon={<FaComments />}
          label="Chats"
          isExpanded={isExpanded}
          to="chats"
        />
        <SidebarItem
          icon={<FaStickyNote />}
          label="Notes"
          isExpanded={isExpanded}
          to="notes"
        />
        <SidebarItem
          icon={<FaCalendarAlt />}
          label="Meetings"
          isExpanded={isExpanded}
          to="meetings"
        />
      </div>
      <UserProfileCard
        avatarUrl={currentUser.userData?.avatarUrl}
        username={currentUser.userData?.username}
        status={currentUser.userData?.status}
        isExpanded={isExpanded}
      />
    </div>
  );
};

export default SidebarNavigation;
