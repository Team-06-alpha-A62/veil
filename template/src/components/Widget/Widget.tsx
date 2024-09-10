import React, { ReactNode } from 'react';
// import { FaPlus } from 'react-icons/fa6';

interface WidgetProps {
  width: number;
  height: number;
  isInEditMode: boolean;
  widgetComponent?: ReactNode;
  widgetComponentName?: string;
}

const Widget: React.FC<WidgetProps> = ({
  width,
  height,
  isInEditMode,
  widgetComponent = '',
  // handleClick,
  widgetComponentName = 'Empty Widget',
}) => {
  return (
    <div
      className={`${
        isInEditMode && 'bg-base-200  shadow-l'
      } rounded-3xl cursor-pointer`}
      style={{
        width: `${18.75 * width + (width - 1) * 1.25}rem`,
        height: `${18.75 * height + (height - 1) * 1.25}rem`,
      }}
    >
      {isInEditMode ? (
        <>
          <div className="flex items-center justify-center h-full">
            <div className="rounded-full bg-base-200  p-4">
              <span
                className={`${
                  widgetComponentName === 'Empty Widget'
                    ? 'text-base-content  font-normal'
                    : 'text-primary'
                } font-semibold text-sm`}
              >
                {widgetComponentName}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="h-full">{widgetComponent}</div>
      )}
    </div>
  );
};

export default Widget;
