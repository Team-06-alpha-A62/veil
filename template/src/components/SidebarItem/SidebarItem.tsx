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
        `flex rounded-full items-center justify-start h-[30px] px-[28px] py-[30px] transition-colors ${
          isActive || isLabelInUrl
            ? isExpanded
              ? 'bg-primary text-neutral'
              : 'text-primary'
            : isExpanded
            ? 'hover:bg-base-300'
            : 'hover:text-primary'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div
            className={`relative text-[24px] pr-[20px] ${
              isExpanded ? 'expanded' : ''
            }`}
          >
            {icon}

            {label === 'Meetings' && (
              <span className="absolute right-4 top-0">
                <NotificationBadge
                  type={NotificationType.MEETING}
                  isViewActive={isLabelInUrl}
                />
              </span>
            )}
          </div>
          {isExpanded && (
            <span
              className={`overflow-hidden ${
                isActive || isLabelInUrl ? 'text-primary-content' : 'text-white'
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
