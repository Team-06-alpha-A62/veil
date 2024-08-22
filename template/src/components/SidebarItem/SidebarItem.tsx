import './SidebarItem.scss';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isExpanded,
}) => {
  return (
    <div className="sidebar-item">
      <div className={`sidebar-icon ${isExpanded ? 'expanded' : ''}`}>
        {icon}
      </div>
      {isExpanded && (
        <span className={`label ${isExpanded ? 'expanded' : ''}`}>{label}</span>
      )}
    </div>
  );
};

export default SidebarItem;
