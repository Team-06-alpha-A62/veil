import { useEffect, useState } from 'react';
import CreateMeetingButton from '../CreateMeetingButton/CreateMeetingButton.tsx';
import dayjs from 'dayjs';
import { FaCheck } from 'react-icons/fa';
import TimeSelector from '../TimeSelector/TimeSelector.tsx';

interface MeetingProps {
  selectedDay: dayjs.Dayjs;
}

interface Meeting {
  title: string;
  description?: string;
  label: string;
  participantsInput: string;
  date: number;
  startTime: number;
  endTime: number;
}

const CreateMeetingModal: React.FC<MeetingProps> = ({ selectedDay }) => {
  const [showMeetingModal, setShowMeetingModal] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([]);

  const labelColors: Record<string, string> = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
  };

  const [selectedLabel, setSelectedLabel] = useState<string>(
    labelColors.indigo
  );
  const [meetingData, setMeetingData] = useState<Meeting>({
    title: '',
    description: '',
    label: selectedLabel,
    participantsInput: '',
    date: selectedDay?.valueOf() ?? 0,
    startTime: 0,
    endTime: 0,
  });

  const handleModalToggle = (): void => {
    setShowMeetingModal(prevValue => !prevValue);
  };

  const handleRemoveParticipant = (participantIndex: number): void => {
    setParticipants(
      participants.filter((_, index) => index !== participantIndex)
    );
  };

  const handleParticipantKeydown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (
      (event.key === 'Enter' || event.key === ' ') &&
      meetingData.participantsInput.trim()
    ) {
      event.preventDefault();
      if (!participants.includes(meetingData.participantsInput.trim())) {
        setParticipants([
          ...participants,
          meetingData.participantsInput.trim(),
        ]);
        setMeetingData({ ...meetingData, participantsInput: '' });
      }
    }
  };

  const handleInputChange =
    (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setMeetingData({
        ...meetingData,
        [key]: event.target.value,
      });
    };

  const handleStartTimeChange = (time: number) => {
    setMeetingData(prevData => ({
      ...prevData,
      startTime: time,
      endTime: Math.max(time, prevData.endTime),
    }));
  };

  const handleEndTimeChange = (time: number) => {
    setMeetingData(prevData => ({
      ...prevData,
      endTime: time,
    }));
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
        <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-200 bg-opacity-75 z-10">
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
            <div className="flex flex-col gap-4">
              <label className="form-control w-full gap-1">
                <div className="label">
                  <span className="label-text">Title</span>
                </div>
                <input
                  autoFocus
                  type="text"
                  className="input input-sm w-full rounded-3xl bg-base-200 bg-opacity-50 focus:border-transparent focus:outline-accent"
                />
              </label>
              <label className="form-control gap-1">
                <div className="label">
                  <span className="label-text">Description</span>
                  <span className="badge badge-accent badge-outline text-accent">
                    Optional
                  </span>
                </div>
                <textarea className="textarea h-24 rounded-3xl bg-base-200 bg-opacity-50 focus:border-transparent focus:outline-accent"></textarea>
              </label>
              <div className="form-control w-full gap-2">
                <label htmlFor="participants" className="label">
                  <span className="label-text">Participants</span>
                  <span className="badge badge-accent badge-outline text-accent">
                    Optional
                  </span>
                </label>

                <div className="flex items-center gap-2 flex-wrap rounded-3xl bg-base-200 bg-opacity-50">
                  {participants.map((participant, index) => (
                    <div key={participant} className="flex items-center gap-1">
                      <span className="badge badge-primary text-primary-content gap-1">
                        {participant}
                        <span
                          onClick={() => handleRemoveParticipant(index)}
                          className="cursor-pointer text-primary-content hover:text-gray-800"
                        >
                          &times;
                        </span>
                      </span>
                    </div>
                  ))}

                  <input
                    type="text"
                    value={meetingData.participantsInput}
                    onChange={handleInputChange('participantsInput')}
                    onKeyDown={handleParticipantKeydown}
                    className="input bg-transparent input-sm flex-grow rounded-3xl border-none focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 flex-col">
                <span className="label-text">Label</span>
                <div className="flex gap-2">
                  {Object.keys(labelColors).map((label, index) => (
                    <span
                      key={index}
                      onClick={() => setSelectedLabel(label)}
                      className={`${labelColors[label]} w-6 h-6 rounded-full flex  items-center justify-center cursor-pointer`}
                    >
                      {selectedLabel === labelColors[label] && (
                        <FaCheck className="text-xs text-primary-content text-opacity-50" />
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <label className="form-control w-full gap-1">
                <div className="label">
                  <span className="label-text">Starts At</span>
                </div>
                <TimeSelector
                  selectedTime={meetingData.startTime}
                  onTimeChange={handleStartTimeChange}
                />
              </label>
              <label className="form-control w-full gap-1">
                <div className="label">
                  <span className="label-text">Ends At</span>
                </div>
                <TimeSelector
                  selectedTime={meetingData.endTime}
                  onTimeChange={handleEndTimeChange}
                  startTime={meetingData.startTime}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateMeetingModal;
