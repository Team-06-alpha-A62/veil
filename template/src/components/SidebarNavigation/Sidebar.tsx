import React, { useRef, useState } from 'react';
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

const SidebarNavigation: React.FC = () => {
  const { currentUser } = useAuth();
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

  return (
    <div
      className={`${
        isExpanded ? 'w-[300px] px-8' : 'w-[80px]'
      } flex flex-col items-center bg-base-300 bg-opacity-50 transition-all duration-300 relative rounded-3xl cursor-pointer`}
    >
      <div
        className={`w-24 absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 ${
          isExpanded ? 'left-[calc(100%-85px)] translate-x-0' : ''
        }`}
        onClick={toggleSidebar}
      >
        <Lottie
          style={{ width: '100%' }}
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
          to="chats/:id"
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
