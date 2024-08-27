import React, { ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa6';

interface WidgetProps {
  width: number;
  height: number;
  isInEditMode: boolean;
  widgetComponent?: ReactNode;
}

const Widget: React.FC<WidgetProps> = ({
  width,
  height,
  isInEditMode,
  widgetComponent = '',
}) => {
  return (
    <div
      className={`${
        isInEditMode &&
        'cursor-pointer bg-base-300 hover:bg-base-300 bg-opacity-50 shadow-l'
      } rounded-3xl`}
      style={{
        width: `${18.75 * width + (width - 1) * 1.25}rem`,
        height: `${18.75 * height + (height - 1) * 1.25}rem`,
      }}
    >
      {isInEditMode ? (
        <div className="flex items-center justify-center h-full">
          <div className="rounded-full bg-base-200 p-4">
            <FaPlus />
          </div>
        </div>
      ) : (
        <div className="h-full">{widgetComponent}</div>
      )}
    </div>
  );
};

export default Widget;
