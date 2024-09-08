import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Meeting } from '../../models/Meeting.ts';
import {
  FaCircleQuestion,
  FaCircleXmark,
  FaCircleCheck,
} from 'react-icons/fa6';
import { MeetingStatus } from '../../enums/MeetingStatus.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';
import { BiSolidEditAlt } from 'react-icons/bi';
import { cancelMeeting } from '../../services/meetings.service.ts';

interface CalendarDayProps {
  day: dayjs.Dayjs | null;
  setSelectedDay: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  selectedDay: dayjs.Dayjs;
  currentMonthIndex: number;
  meetings: Meeting[];
  handleOpenModal: (arg0: Meeting) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  setSelectedDay,
  selectedDay,
  currentMonthIndex,
  meetings,
  handleOpenModal,
}) => {
  const { currentUser } = useAuth();
  const [dayMeetings, setDayMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const filteredMeetings = meetings?.filter(meeting => {
      const meetingDate = dayjs(meeting.startTime).startOf('day');
      const selectedDay = day!.startOf('day');
      console.log(dayjs(meeting.startTime).format('D MMMM HH:mm'));
      return meetingDate.isSame(selectedDay);
    });

    setDayMeetings(filteredMeetings);
  }, [meetings, day]);

  const handleDayToggle = () => {
    if (day && day.isBefore(dayjs(), 'day')) {
      return;
    }

    if (selectedDay?.format('DD-MM-YY') === day?.format('DD-MM-YY')) {
      setSelectedDay(dayjs());
    } else {
      setSelectedDay(day!);
    }
  };

  const handleCancelMeetingClick = async (meetingId: string) => {
    await cancelMeeting(meetingId);
  };

  const isDayInCurrentMonth = (day: dayjs.Dayjs | null) =>
    day?.month() === currentMonthIndex;

  const getCurrentDayClass = () =>
    day?.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-primary text-primary-content rounded-full w-7 text-center'
      : '';

  return (
    <div
      className={` ${
        !isDayInCurrentMonth(day) ? 'bg-base-300 opacity-50' : ''
      } ${
        selectedDay === day && 'bg-base-300 bg-opacity-50'
      } border border-gray-700 border-opacity-50 flex flex-col cursor-pointer hover:bg-base-300 bg-opacity-50 active:bg-opacity-0`}
      onClick={handleDayToggle}
    >
      <header className="flex flex-col items-center">
        <p className="text-sm mt-2">{day?.format('ddd')}</p>
        <p className={`text-sm p-1 my-1 ${getCurrentDayClass()}`}>
          {day?.format('DD')}
        </p>
      </header>
      <div className="p-2 flex flex-col gap-2">
        {dayMeetings
          .sort((a, b) => a.startTime - b.startTime)
          .map((meeting: Meeting) => (
            <div className="dropdown dropdown-bottom">
              <div
                key={meeting.id}
                tabIndex={0}
                role="button"
                className={`${meeting.label} text-sm font-semibold px-3 py-1 rounded-3xl hover:bg-opacity-75 transition-colors text-white`}
              >
                {meeting.title.length > 15
                  ? `${meeting.title.slice(0, 16)}...`
                  : meeting.title}
              </div>
              <div
                tabIndex={0}
                className="flex flex-col gap-2 dropdown-content rounded-box z-[1] w-56 bg-base-300 shadow-md mt-1 py-2"
              >
                <div className=" px-4">
                  <h3 className="text-md font-semibold">{meeting.title}</h3>
                  <p className="text-sm opacity-50 mb-1">
                    {dayjs(meeting.startTime).format('D MMM YYYY - HH:mm')} to{' '}
                    {dayjs(meeting.endTime).format('HH:mm')}
                  </p>
                </div>
                <div className="px-4">
                  <p className="text-sm">{meeting.description}</p>
                </div>
                <hr className="opacity-10" />
                <div className="px-4 text-sm">
                  {Object.entries(meeting.participants).map(
                    ([username, status]) => (
                      <p key={username} className="flex items-center gap-2">
                        {status === MeetingStatus.ACCEPTED ||
                        status === MeetingStatus.ORGANIZER ? (
                          <FaCircleCheck className="text-success" />
                        ) : status === MeetingStatus.DECLINED ? (
                          <FaCircleXmark className="text-error" />
                        ) : (
                          <FaCircleQuestion className="text-warning" />
                        )}
                        <span>{username}</span>
                      </p>
                    )
                  )}
                </div>
                <hr className="opacity-10" />

                <div className="px-4 flex gap-4 justify-between">
                  {currentUser.userData!.username === meeting.organizer && (
                    <>
                      <button
                        className="text-sm font-semibold px-3 py-1 rounded-3xl bg-error hover:bg-opacity-75 transition-colors text-white"
                        onClick={() => handleCancelMeetingClick(meeting.id)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-3xl bg-success hover:bg-opacity-75 transition-colors text-white"
                        onClick={() => handleOpenModal(meeting)}
                      >
                        <span>Edit</span>
                        <BiSolidEditAlt />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CalendarDay;
