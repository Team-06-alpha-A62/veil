import React, { ReactNode } from 'react';
import { FaPlus } from 'react-icons/fa6';
import Modal from '../Modal/Modal.tsx';

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
      } flex rounded-3xl items-center justify-center`}
      style={{
        width: `${18.75 * width + (width - 1) * 1.25}rem`,
        height: `${18.75 * height + (height - 1) * 1.25}rem`,
      }}
    >
      {isInEditMode ? (
        <div className="rounded-full bg-base-200 p-4">
          <FaPlus />
        </div>
      ) : (
        <div>{widgetComponent}</div>
      )}
    </div>
  );
};

export default Widget;
