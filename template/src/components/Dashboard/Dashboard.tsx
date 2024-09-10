import React, { useEffect, useRef, useState } from 'react';
import Muuri from 'muuri';
import './Dashboard.scss';
import { FaPen } from 'react-icons/fa';
import Widget from '../Widget/Widget.tsx';
import CalendarWidgetWide from '../CalendarWidgetWide/CalendarWidgetWide.tsx';
import NewNoteWidget from '../NewNoteWidget/NewNoteWidget.tsx';
import PinnedNotesCarouselWidget from '../PinnedNotesCarouselWidget/PinnedNotesCarouselWidget.tsx';
import PomodoroWidget from '../PomodoroWidget/PomodoroWidget.tsx';
import WeatherCarouselWidget from '../WeatherCarouselWidget/WeatherCarouselWidget.tsx';

const Dashboard: React.FC = () => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  // const [showWidgetModal, setShowWidgetModal] = useState<boolean>(false);

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          muuriGrid
            .getItems()
            .find(item => item.getElement()!.dataset.id === id)
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

  // const handleModalToggle = (): void => {
  //   setShowWidgetModal(prevValue => !prevValue);
  // };

  return (
    <div className="bg-base-300 h-full rounded-3xl p-6">
      <div className="flex flex-row-reverse gap-4">
        {!isInEditMode ? (
          <button
            className="flex items-center gap-2 px-3 py-1 rounded-3xl bg-primary text-white text-sm font-semibold  hover:bg-opacity-80"
            onClick={toggleEditDashboard}
          >
            <FaPen /> Edit Dashboard
          </button>
        ) : (
          <>
            <button
              className="px-3 py-1 rounded-3xl border border-error text-error text-sm font-semibold  hover:bg-error hover:text-white"
              onClick={toggleEditDashboard}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 rounded-3xl bg-success text-white text-sm font-semibold  hover:bg-opacity-80"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          </>
        )}
      </div>

      <div className="mt-5">
        <div
          className="muuri-grid grid-2 p-5 border-4 border-transparent"
          ref={muuriGridRef}
        >
          <div className="item" data-id={`muuriGrid-item-1`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              widgetComponent={<NewNoteWidget />}
              widgetComponentName={'New Note Widget'}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-2`}>
            <Widget width={1} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-3`}>
            <Widget width={1} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-4`}>
            <Widget
              width={1}
              height={1}
              widgetComponent={<PomodoroWidget />}
              isInEditMode={isInEditMode}
            />
          </div>

          <div className="item" data-id={`muuriGrid-item-5`}>
            <Widget
              width={2}
              height={1}
              isInEditMode={isInEditMode}
              widgetComponent={<CalendarWidgetWide />}
              widgetComponentName={'Wide Calendar Widget'}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-6`}>
            <Widget
              width={2}
              height={1}
              isInEditMode={isInEditMode}
              widgetComponent={<PinnedNotesCarouselWidget />}
              widgetComponentName={'Pinned Notes Carousel Widget'}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-7`}>
            <Widget width={1} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-8`}>
            <Widget width={1} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-9`}>
            <Widget width={1} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-10`}>
            <Widget width={1} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-11`}>
            <Widget width={1} height={1} isInEditMode={isInEditMode} />
          </div>
          <div className="item" data-id={`muuriGrid-item-12`}>
            <Widget
              width={2}
              height={1}
              isInEditMode={isInEditMode}
              widgetComponent={<WeatherCarouselWidget />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
