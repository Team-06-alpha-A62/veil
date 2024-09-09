import React, { useRef, useState, useEffect } from 'react';
import SidebarItem from '../SidebarItem/SidebarItem';
import {
  FaTachometerAlt,
  FaBell,
  FaUsers,
  FaComments,
  FaStickyNote,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useAuth } from '../../providers/AuthProvider';
import UserProfileCard from '../UserProfileCard/UserProfileCard';
import animationData from '../../assets/hamburger-menu-button.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useTheme } from '../../providers/ThemeProvider'; // Assuming you have a useTheme hook

const SidebarNavigation: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme(); // Get the current theme from the ThemeProvider
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const hamburgerRef = useRef<LottieRefCurrentProps>(null);

  const toggleSidebar = () => {
    setIsExpanded(value => !value);

    if (hamburgerRef.current) {
      if (isExpanded) {
        hamburgerRef.current.playSegments([45, 70], true);
      } else {
        hamburgerRef.current.playSegments([5, 25], true);
      }
    }
  };

  const themeFilterMap: Record<string, string> = {
    default:
      'invert(70%) sepia(50%) saturate(500%) hue-rotate(180deg) contrast(100%)',
    light:
      'invert(0%) sepia(100%) saturate(500%) hue-rotate(180deg) contrast(100%)',
    dark: 'invert(100%) sepia(100%) saturate(500%) hue-rotate(180deg) contrast(100%)',
    cyberpunk:
      'invert(80%) sepia(100%) saturate(200%) hue-rotate(300deg) contrast(150%)',
    retro:
      'invert(40%) sepia(80%) saturate(600%) hue-rotate(90deg) contrast(100%)',
  };
  const themeFilter = themeFilterMap[theme] || themeFilterMap['default'];

  return (
    <div
      className={`${
        isExpanded ? 'w-[300px] px-8' : 'w-[80px]'
      } flex flex-col items-center bg-base-300  transition-all duration-300 relative rounded-3xl cursor-pointer`}
    >
      <div
        className={`w-24  absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 ${
          isExpanded ? 'left-[calc(100%-85px)] translate-x-0' : ''
        }`}
        onClick={toggleSidebar}
      >
        <Lottie
          style={{
            filter: themeFilter,
            width: '100%',
          }}
          lottieRef={hamburgerRef}
          animationData={animationData}
          loop={false}
        />
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
