import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { FaCheck } from 'react-icons/fa';
import TimeSelector from '../TimeSelector/TimeSelector.tsx';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { Meeting } from '../../models/Meeting.ts';
import {
  addMeetingParticipant,
  removeMeetingParticipant,
  updateMeetingDescription,
  updateMeetingEndTime,
  updateMeetingLabel,
  updateMeetingStartTime,
  updateMeetingTitle,
} from '../../services/meetings.service.ts';

interface MeetingProps {
  selectedDay: dayjs.Dayjs;
  meeting: Meeting;
  handleCloseModal: () => void;
}

const EditMeetingModal: React.FC<MeetingProps> = ({
  selectedDay,
  meeting,
  handleCloseModal,
}) => {
  const { currentUser } = useAuth();

  const [participantsInput, setParticipantsInput] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>(() =>
    Object.keys(meeting.participants).filter(
      p => p !== currentUser.userData!.username
    )
  );
  const labelColors: Record<string, string> = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
  };

  const [selectedLabel, setSelectedLabel] = useState<string>(meeting.label);

  const [updatedMeetingData, setUpdatedMeetingData] =
    useState<Meeting>(meeting);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      participantsInput.trim()
    ) {
      event.preventDefault();
      if (!participants.includes(participantsInput.trim())) {
        setParticipants([...participants, participantsInput.trim()]);
        setParticipantsInput('');
      }
    }
  };

  const handleInputChange =
    (key: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setUpdatedMeetingData({
        ...updatedMeetingData,
        [key]: event.target.value,
      });
    };

  const handleStartTimeChange = (time: number) => {
    console.log(dayjs(time).format('YYYY-MM-DD HH:mm:ss'));

    setUpdatedMeetingData(prevData => ({
      ...prevData,
      startTime: time,
      endTime: Math.max(time, prevData.endTime),
    }));
  };

  const handleEndTimeChange = (time: number) => {
    console.log(dayjs(time).format('YYYY-MM-DD HH:mm:ss'));
    setUpdatedMeetingData(prevData => ({
      ...prevData,
      endTime: time,
    }));
  };

  const HandleUpdateMeetingClick = async (): Promise<void> => {
    try {
      if (updatedMeetingData.title !== meeting.title) {
        await updateMeetingTitle(meeting.id, updatedMeetingData.title);
      }

      if (
        updatedMeetingData.description &&
        updatedMeetingData.description !== meeting.description
      ) {
        await updateMeetingDescription(
          meeting.id,
          updatedMeetingData.description
        );
      }

      if (selectedLabel !== meeting.label) {
        await updateMeetingLabel(meeting.id, selectedLabel);
      }

      if (updatedMeetingData.startTime !== meeting.startTime) {
        await updateMeetingStartTime(meeting.id, updatedMeetingData.startTime);
      }

      if (updatedMeetingData.endTime !== meeting.endTime) {
        await updateMeetingEndTime(meeting.id, updatedMeetingData.endTime);
      }

      const currentParticipants = Object.keys(meeting.participants).filter(
        p => p !== currentUser.userData!.username
      );

      for (const participant of participants) {
        if (!currentParticipants.includes(participant)) {
          await addMeetingParticipant(meeting.id, participant);
        }
      }

      for (const participant of currentParticipants) {
        if (!participants.includes(participant)) {
          await removeMeetingParticipant(meeting.id, participant);
        }
      }

      setUpdatedMeetingData({ ...meeting });
      setParticipants([]);
      setParticipantsInput('');
      setSelectedLabel(meeting.label);
      handleCloseModal();
    } catch (error) {
      console.error('Error updating the meeting:', error);
    }
  };

  return (
    <>
      <div className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center bg-base-200 bg-opacity-75 z-10">
        <div className="w-full h-full md:w-96 md:h-auto bg-base-300 rounded-3xl flex flex-col gap-5 p-4 relative">
          <button onClick={handleCloseModal} className="absolute top-5 right-5">
            &times;
          </button>
          <div>
            <h2 className="text-xl font-semibold">Edit Meeting</h2>
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
                value={updatedMeetingData.title}
                onChange={handleInputChange('title')}
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
              <textarea
                className="textarea h-24 rounded-3xl bg-base-200 bg-opacity-50 focus:border-transparent focus:outline-accent"
                value={updatedMeetingData.description}
                onChange={handleInputChange('description')}
              ></textarea>
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
                  value={participantsInput}
                  onChange={event => setParticipantsInput(event.target.value)}
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
                    onClick={() => setSelectedLabel(labelColors[label])}
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
                selectedDay={selectedDay}
                selectedTime={updatedMeetingData.startTime}
                onTimeChange={handleStartTimeChange}
              />
            </label>
            <label className="form-control w-full gap-1">
              <div className="label">
                <span className="label-text">Ends At</span>
              </div>
              <TimeSelector
                selectedDay={selectedDay}
                selectedTime={updatedMeetingData.endTime}
                onTimeChange={handleEndTimeChange}
                startTime={updatedMeetingData.startTime}
              />
            </label>
          </div>
          <div className="flex justify-between">
            <button
              className="text-sm font-semibold px-3 py-1 rounded-full bg-error hover:bg-accent-focus transition-colors text-white"
              onClick={HandleUpdateMeetingClick}
            >
              Cancel
            </button>
            <button
              className="text-sm font-semibold px-3 py-1 rounded-full bg-success hover:bg-accent-focus transition-colors text-white"
              onClick={HandleUpdateMeetingClick}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMeetingModal;
