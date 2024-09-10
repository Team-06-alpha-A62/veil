import React, { useRef, useState } from 'react';
import SidebarItem from '../SidebarItem/SidebarItem';
import {
  FaTachometerAlt,
  FaUsers,
  FaComments,
  FaStickyNote,
  FaCalendarAlt,
} from 'react-icons/fa';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider'; // Assuming you have a theme provider
import UserProfileCard from '../UserProfileCard/UserProfileCard';
import animationDataRetro from '../../assets/hamburger-menu-button-retro-theme.json';
import animationDataDark from '../../assets/hamburger-menu-button-dark-theme.json';
import animationDataNight from '../../assets/hamburger-menu-button-night-theme.json';
import animationDataLight from '../../assets/hamburger-menu-button-light-theme.json';
import animationDataCupcake from '../../assets/hamburger-menu-button-cupcake-theme.json';
import animationDataHalloween from '../../assets/hamburger-menu-button-halloween-theme.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

const SidebarNavigation: React.FC = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme(); // Assuming the hook returns the current theme
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

  // Select the appropriate animation data based on the current theme
  let animationData;

  switch (theme) {
    case 'dark':
      animationData = animationDataDark;
      break;
    case 'retro':
      animationData = animationDataRetro;
      break;
    case 'night':
      animationData = animationDataNight;
      break;
    case 'halloween':
      animationData = animationDataHalloween;
      break;
    case 'cupcake':
      animationData = animationDataCupcake;
      break;
    default:
      animationData = animationDataLight;
  }

  return (
    <div
      className={`${
        isExpanded ? 'w-[300px] px-8' : 'w-[80px]'
      } flex flex-col items-center bg-base-300 transition-all duration-300 relative rounded-3xl cursor-pointer`}
    >
      <div
        className={`w-24 absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-300 z-10 ${
          isExpanded ? 'left-[calc(100%-85px)] translate-x-0' : ''
        }`}
        onClick={toggleSidebar}
      >
        <div className="relative">
          <Lottie
            lottieRef={hamburgerRef}
            animationData={animationData}
            loop={false}
          />
        </div>
      </div>

      <div className="flex flex-col mt-[75px] flex-grow w-full gap-3">
        <SidebarItem
          icon={<FaTachometerAlt />}
          label="Dashboard"
          isExpanded={isExpanded}
          to="dashboard"
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
