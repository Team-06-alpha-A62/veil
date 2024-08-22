import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
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
interface SidebarProps {}

const SidebarNavigation: React.FC<SidebarProps> = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsExpanded(value => !value);
  };

  return (
    <div
      className={`${styles['sidebar']} ${isExpanded ? styles['expanded'] : ''}`}
    >
      <div
        className={`${styles['toggle-button-container']} ${
          isExpanded ? styles['expanded'] : ''
        }`}
        onClick={toggleSidebar}
      >
        <span className={styles['toggle-button']}>
          {isExpanded ? 'x' : 'o'}
        </span>
      </div>
      <div className={styles['nav-items']}>
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
    </div>
  );
};

export default SidebarNavigation;
