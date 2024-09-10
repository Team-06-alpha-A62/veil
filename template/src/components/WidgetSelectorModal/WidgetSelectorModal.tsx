import React from 'react';

interface WidgetSelectorModalProps {
  handleCloseClick: () => void;
}

const WidgetSelectorModal: React.FC<WidgetSelectorModalProps> = ({
  handleCloseClick,
}) => {
  return (
    <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-200 bg-opacity-75 z-10">
      <div className="w-96 h-auto relative bg-base-300 rounded-3xl flex flex-col gap-5 p-4">
        <button onClick={handleCloseClick} className="absolute top-5 right-5">
          &times;
        </button>
        <h2 className="text-xl font-semibold">Add Widget</h2>
      </div>
    </div>
  );
};

export default WidgetSelectorModal;
