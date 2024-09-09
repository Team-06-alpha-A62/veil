import React, { useEffect, useRef, useState } from 'react';
import Muuri from 'muuri';
import './Dashboard.scss';
import { FaPen } from 'react-icons/fa';
import CalendarWidget from '../CalendarWidget/CalendarWidget.tsx';
import Widget from '../Widget/Widget.tsx';

const Dashboard: React.FC = () => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const muuriGridRef = useRef<HTMLDivElement | null>(null);

  const muuriGridInstanceRef = useRef<Muuri | null>(null);

  const toggleEditDashboard = (): void => {
    if (isInEditMode) {
      setIsInEditMode(false);
    } else {
      setIsInEditMode(true);
    }
  };

  const handleSaveChanges = (): void => {
    const muuriGridState = muuriGridInstanceRef.current
      ?.getItems()
      .map((item: any) => item.getElement().dataset.id);
    const layout = { muuriGrid: muuriGridState };
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    setIsInEditMode(false);
  };

  const loadSavedLayout = (muuriGrid: Muuri): void => {
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      const { muuriGrid: savedmuuriGrid } = JSON.parse(savedLayout);

      if (savedmuuriGrid) {
        const muuriGridItems = savedmuuriGrid.map((id: string) =>
          muuriGrid.getItems().find(item => item.getElement().dataset.id === id)
        );
        muuriGrid.sort(muuriGridItems.filter(Boolean));
      }
    }
  };

  useEffect(() => {
    if (muuriGridInstanceRef.current) {
      muuriGridInstanceRef.current?.destroy();
    }

    const muuriGrid = new Muuri(muuriGridRef.current!, {
      dragEnabled: isInEditMode,
      dragContainer: document.body,
      dragSort: true,
    });

    muuriGridInstanceRef.current = muuriGrid;

    loadSavedLayout(muuriGrid);

    return () => {
      muuriGrid.destroy();
    };
  }, [isInEditMode]);

  return (
    <div className=" rounded-3xl p-6 bg-base-300 h-full z-0">
      <div className="flex flex-row-reverse gap-4">
        {!isInEditMode ? (
          <button
            className="btn btn-outline btn-primary"
            onClick={toggleEditDashboard}
          >
            <FaPen /> Edit Dashboard
          </button>
        ) : (
          <>
            <button className="btn btn-outline" onClick={toggleEditDashboard}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </>
        )}
      </div>

      <div className="flex justify-evenly mt-5 gap-8">
        <div
          className="muuri-grid grid-2 p-5 border-4 border-transparent"
          ref={muuriGridRef}
        >
          <div className="item" data-id={`muuriGrid-item-1`}>
            <Widget
              width={2}
              height={2}
              isInEditMode={isInEditMode}
              widgetComponent={<CalendarWidget />}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-2`}>
            <Widget
              width={1}
              height={2}
              isInEditMode={isInEditMode}
              widgetComponent={<CalendarWidget />}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-3`}>
            <Widget
              width={2}
              height={1}
              isInEditMode={isInEditMode}
              widgetComponent={<CalendarWidget />}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-4`}>
            <Widget width={2} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-5`}>
            <Widget width={1} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-6`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              widgetComponent={<CalendarWidget />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
