import React, { useState } from 'react';
import './Sidebar.scss';
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
    <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
      <div
        className={`toggle-button-container ${isExpanded ? 'expanded' : ''}`}
        onClick={toggleSidebar}
      >
        <span className="toggle-button">{isExpanded ? 'x' : 'o'}</span>
      </div>
      <div className="nav-items">
        <SidebarItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={<FaBell />}
          label="Notifications"
          isExpanded={isExpanded}
        />
        <SidebarItem icon={<FaUsers />} label="Teams" isExpanded={isExpanded} />
        <SidebarItem
          icon={<FaComments />}
          label="Chat"
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={<FaUserFriends />}
          label="Friends"
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={<FaStickyNote />}
          label="Notes"
          isExpanded={isExpanded}
        />
        <SidebarItem
          icon={<FaCalendarAlt />}
          label="Meetings"
          isExpanded={isExpanded}
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
