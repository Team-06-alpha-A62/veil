import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotificationBadge from '../NotificationBadge/NotificationBadge';
import { NotificationType } from '../../enums/NotificationType';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isExpanded,
  to,
}) => {
  const location = useLocation();
  const [isLabelInUrl, setIsLabelInUrl] = useState(false);

  useEffect(() => {
    const lowerCaseLabel = label.toLowerCase();
    const lowerCasePathname = location.pathname.toLowerCase();
    setIsLabelInUrl(lowerCasePathname.includes(lowerCaseLabel));
  }, [location.pathname, label]);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex rounded-full items-center justify-start h-[30px] px-[28px] py-[30px] transition-colors text-xl ${
          isActive || isLabelInUrl
            ? isExpanded
              ? 'bg-neutral text-neutral-content'
              : 'text-primary'
            : isExpanded
            ? 'hover:bg-base-100'
            : 'hover:text-base-content'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`relative pr-[20px]  ${isExpanded ? 'expanded' : ''}`}
          >
            {icon}

            {label === 'Meetings' && (
              <span className="absolute right-4 top-0 ">
                <NotificationBadge
                  type={NotificationType.MEETING}
                  isViewActive={isLabelInUrl}
                />
              </span>
            )}
            {label === 'Chats' && (
              <span className="absolute right-4 top-0">
                <NotificationBadge
                  type={NotificationType.GLOBAL_MESSAGES}
                  isViewActive={false}
                />
              </span>
            )}
          </div>
          {isExpanded && (
            <span
              className={`overflow-hidden ${
                isActive || isLabelInUrl ? 'text-white' : 'text-base-content'
              } ${isExpanded ? 'expanded' : ''}`}
            >
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
};

export default SidebarItem;
