import React from 'react';
import { FaPlus } from 'react-icons/fa6';

interface WidgetProps {
  width: number;
  height: number;
  isInEditMode: boolean;
}

const Widget: React.FC<WidgetProps> = ({ width, height, isInEditMode }) => {
  return (
    <div
      className={`${
        isInEditMode && 'cursor-pointer bg-base-200 hover:bg-base-300 shadow-l'
      } flex rounded-3xl items-center justify-center`}
      style={{
        width: `${18.75 * width + (width - 1) * 1.25}rem`,
        height: `${18.75 * height + (height - 1) * 1.25}rem`,
      }}
    >
      {isInEditMode ? (
        <div className="rounded-full bg-base-300 p-4">
          <FaPlus />
        </div>
      ) : (
        <div>{/* Widget goes here */}</div>
      )}
    </div>
  );
};

export default Widget;
