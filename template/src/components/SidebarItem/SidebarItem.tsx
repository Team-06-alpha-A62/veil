import styles from './SidebarItem.module.scss';

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
    <div className={styles['sidebar-item']}>
      <div
        className={`${styles['sidebar-icon']} ${
          isExpanded ? styles['expanded'] : ''
        }`}
      >
        {icon}
      </div>
      {isExpanded && (
        <span
          className={`${styles['label']} ${
            isExpanded ? styles['expanded'] : ''
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default SidebarItem;
