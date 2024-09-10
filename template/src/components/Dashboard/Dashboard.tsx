import React, { useEffect, useRef, useState } from 'react';
import Muuri from 'muuri';
import './Dashboard.scss'; // Custom SCSS
import { FaPen } from 'react-icons/fa';
import Widget from '../Widget/Widget.tsx';
import WidgetSelectorModal from '../WidgetSelectorModal/WidgetSelectorModal.tsx';
import CalendarWidgetWide from '../CalendarWidgetWide/CalendarWidgetWide.tsx';
import NewNoteWidget from '../NewNoteWidget/NewNoteWidget.tsx';
import PinnedNotesCarouselWidget from '../PinnedNotesCarouselWidget/PinnedNotesCarouselWidget.tsx';

const Dashboard: React.FC = () => {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState<boolean>(false);

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

      // Apply saved layout to muuriGrid
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

  const handleModalToggle = (): void => {
    setShowWidgetModal(prevValue => !prevValue);
  };

  return (
    <>
      {showWidgetModal && (
        <WidgetSelectorModal handleCloseClick={handleModalToggle} />
      )}
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
              handleClick={handleModalToggle}
              widgetComponent={<NewNoteWidget />}
              widgetComponentName={'New Note Widget'}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-2`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-3`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-4`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>

          <div className="item" data-id={`muuriGrid-item-5`}>
            <Widget
              width={2}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
              widgetComponent={<CalendarWidgetWide />}
              widgetComponentName={'Wide Calendar Widget'}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-6`}>
            <Widget
              width={2}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
              widgetComponent={<PinnedNotesCarouselWidget />}
              widgetComponentName={'Pinned Notes Carousel Widget'}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-7`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-8`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-9`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-10`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-11`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-12`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
          <div className="item" data-id={`muuriGrid-item-13`}>
            <Widget
              width={1}
              height={1}
              isInEditMode={isInEditMode}
              handleClick={handleModalToggle}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
