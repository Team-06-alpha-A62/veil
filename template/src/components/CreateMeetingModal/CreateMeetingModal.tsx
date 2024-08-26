import { useEffect, useState } from 'react';
import CreateMeetingButton from '../CreateMeetingButton/CreateMeetingButton.tsx';
import dayjs from 'dayjs';

interface MeetingProps {
  selectedDay: dayjs.Dayjs;
}

const CreateMeetingModal: React.FC<MeetingProps> = ({ selectedDay }) => {
  const [showMeetingModal, setShowMeetingModal] = useState<boolean>(false);

  const handleModalToggle = (): void => {
    setShowMeetingModal(prevValue => !prevValue);
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMeetingModal(false);
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <>
      <CreateMeetingButton handleClick={handleModalToggle} />
      {showMeetingModal && (
        <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-200 bg-opacity-85 z-10">
          <div className="w-96 h-auto relative bg-base-300 rounded-3xl flex flex-col gap-5 p-4">
            <button
              onClick={handleModalToggle}
              className="absolute top-5 right-5"
            >
              &times;
            </button>
            <div>
              <h2 className="text-xl font-semibold">Schedule New Meeting</h2>
              <p className="text-sm">{selectedDay.format('dddd, MMMM DD')}</p>
            </div>
            <div className="flex flex-col gap-3">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Title</span>
                </div>
                <input
                  autoFocus
                  type="text"
                  className="input input-sm input-bordered w-full rounded-3xl bg-base-200 bg-opacity-50"
                />
              </label>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Description</span>
                  <span className="badge badge-info">Optional</span>
                </div>
                <textarea className="textarea textarea-bordered h-24 rounded-3xl bg-base-200 bg-opacity-50"></textarea>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateMeetingModal;
