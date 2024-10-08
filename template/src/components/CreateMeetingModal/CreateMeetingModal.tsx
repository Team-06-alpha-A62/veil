import { useEffect, useState } from 'react';
import CreateMeetingButton from '../CreateMeetingButton/CreateMeetingButton.tsx';
import dayjs from 'dayjs';
import { FaCheck } from 'react-icons/fa';
import TimeSelector from '../TimeSelector/TimeSelector.tsx';
import { createMeeting } from '../../services/meetings.service.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { createNotification } from '../../services/notification.service.ts';
import { NotificationType } from '../../enums/NotificationType.ts';
import { NotificationMessageType } from '../../enums/NotificationMessageType.ts';
import { addUnreadNotification } from '../../services/user.service.ts';

interface MeetingProps {
  selectedDay: dayjs.Dayjs;
}

interface Meeting {
  title: string;
  description?: string;
  label: string;
  date: number;
  startTime: number;
  endTime: number;
}

const CreateMeetingModal: React.FC<MeetingProps> = ({ selectedDay }) => {
  const { currentUser } = useAuth();
  const [showMeetingModal, setShowMeetingModal] = useState<boolean>(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const [participantsInput, setParticipantsInput] = useState<string>('');

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

  const initialMeetingData = {
    title: '',
    description: '',
    label: selectedLabel,
    date: selectedDay?.valueOf() ?? 0,
    startTime: selectedDay.startOf('day').valueOf(),
    endTime: selectedDay.startOf('day').valueOf() + 3600000,
  };
  const [meetingData, setMeetingData] = useState<Meeting>(initialMeetingData);

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

  const handleModalToggle = (): void => {
    setShowMeetingModal(prevValue => !prevValue);
  };

  const handleRemoveParticipant = async (
    participantIndex: number
  ): Promise<void> => {
    setParticipants(
      participants.filter((_, index) => index !== participantIndex)
    );
    const newNotificationId = await createNotification(
      currentUser.userData!.username,
      participants[participantIndex],
      NotificationType.MEETING,
      `${currentUser.userData!.username} removed you from meeting`,
      NotificationMessageType.ALERT_WARNING
    );

    await addUnreadNotification(
      participants[participantIndex],
      newNotificationId,
      NotificationType.MEETING
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
  const handleScheduleMeetingClick = async (): Promise<void> => {
    await createMeeting(
      meetingData.title,
      selectedLabel,
      currentUser.userData!.username,
      meetingData.startTime,
      meetingData.endTime,
      participants,
      meetingData.description
    );

    participants.forEach(async participants => {
      const newNotificationId = await createNotification(
        currentUser.userData!.username,
        participants,
        NotificationType.MEETING,
        `${currentUser.userData!.username} invited you to a meeting`,
        NotificationMessageType.ALERT_INFO
      );

      await addUnreadNotification(
        participants,
        newNotificationId,
        NotificationType.MEETING
      );
    });

    setMeetingData(initialMeetingData);
    setParticipants([]);
    setParticipantsInput('');
    setSelectedLabel(labelColors.indigo);
    setShowMeetingModal(false);
  };

  return (
    <>
      <CreateMeetingButton handleClick={handleModalToggle} />
      {showMeetingModal && (
        <div className="h-screen w-full fixed top-0 left-0 flex justify-center items-center bg-base-300 bg-opacity-75 z-10">
          <div className="w-96 h-auto relative bg-base-100 rounded-3xl flex flex-col gap-5 p-4 text-base-content">
            <button
              onClick={handleModalToggle}
              className="absolute top-5 right-5 text-base-content"
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
                  <span className="label-text text-base-content">Title</span>
                </div>
                <input
                  autoFocus
                  type="text"
                  value={meetingData.title}
                  onChange={handleInputChange('title')}
                  className="input input-sm w-full rounded-3xl bg-base-200 focus:border-transparent focus:outline-primary caret-primary"
                />
              </label>
              <label className="form-control gap-1">
                <div className="label">
                  <span className="label-text">Description</span>
                  <span className="badge badge-outline text-primary">
                    Optional
                  </span>
                </div>
                <textarea
                  className="textarea h-24 rounded-3xl bg-base-200  focus:border-transparent focus:outline-primary caret-primary"
                  value={meetingData.description}
                  onChange={handleInputChange('description')}
                ></textarea>
              </label>
              <div className="form-control w-full gap-2">
                <label htmlFor="participants" className="label">
                  <span className="label-text">Participants</span>
                  <span className="badge badge-outline text-primary">
                    Optional
                  </span>
                </label>

                <div className="flex items-center gap-2 flex-wrap rounded-3xl bg-base-200 ">
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
                  selectedTime={meetingData.startTime}
                  onTimeChange={handleStartTimeChange}
                />
              </label>
              <label className="form-control w-full gap-1">
                <div className="label">
                  <span className="label-text">Ends At</span>
                </div>
                <TimeSelector
                  selectedDay={selectedDay}
                  selectedTime={meetingData.endTime}
                  onTimeChange={handleEndTimeChange}
                  startTime={meetingData.startTime}
                />
              </label>
            </div>
            <button
              className="text-sm font-semibold px-3 py-1 rounded-full bg-success hover:bg-accent-focus transition-colors text-white"
              onClick={handleScheduleMeetingClick}
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateMeetingModal;
