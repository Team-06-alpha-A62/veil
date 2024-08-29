import { NavLink } from 'react-router-dom';

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
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex rounded-full items-center justify-start h-[30px] px-[28px] py-[30px] transition-colors ${
          isActive
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
            className={`text-[24px] pr-[20px] ${isExpanded ? 'expanded' : ''}`}
          >
            {icon}
          </div>
          {isExpanded && (
            <span
              className={`overflow-hidden ${
                isActive ? 'text-primary-content' : 'text-white'
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
