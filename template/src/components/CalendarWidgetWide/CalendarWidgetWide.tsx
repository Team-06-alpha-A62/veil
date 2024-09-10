import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getMonth } from '../../utils/dateUtils.ts';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Meeting } from '../../models/Meeting.ts';
import { getAllUserMeetings } from '../../services/meetings.service.ts'; // Firebase service to fetch meetings
import { useAuth } from '../../providers/AuthProvider.tsx';

type DayMatrix = Array<Array<dayjs.Dayjs | null>>;

const CalendarWidgetWide: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<DayMatrix>(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(
    dayjs().month()
  );
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(dayjs());
  const [meetings, setMeetings] = useState<Meeting[]>([]); // Store all meetings
  const [dayMeetings, setDayMeetings] = useState<Meeting[]>([]); // Meetings for the selected day

  const formattedMonth = dayjs(
    new Date(dayjs().year(), currentMonthIndex)
  ).format('MMMM YYYY');

  useEffect(() => {
    // Fetch meetings from Firebase
    const fetchMeetings = async () => {
      const fetchedMeetings = await getAllUserMeetings(
        currentUser.userData!.username
      ); // Assuming getMeetings fetches all meetings
      setMeetings(fetchedMeetings);
    };

    fetchMeetings();
  }, []);

  useEffect(() => {
    // Update current month's days when month index changes
    setCurrentMonth(getMonth(currentMonthIndex));
  }, [currentMonthIndex]);

  const handlePrevMonth = () =>
    setCurrentMonthIndex(monthIndex => monthIndex - 1);
  const handleNextMonth = () =>
    setCurrentMonthIndex(monthIndex => monthIndex + 1);
  const handleReset = () => {
    setCurrentMonthIndex(dayjs().month());
    setSelectedDay(dayjs());
  };

  const isDayInCurrentMonth = (day: dayjs.Dayjs | null) =>
    day?.month() === currentMonthIndex;
  const getCurrentDayClass = (day: dayjs.Dayjs | null) =>
    day?.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-primary text-primary-content rounded-full w-7 text-center'
      : '';

  const hasMeetings = (day: dayjs.Dayjs) =>
    meetings.some(meeting => dayjs(meeting.startTime).isSame(day, 'day'));

  const handleDayToggle = (day: dayjs.Dayjs | null) => {
    if (!day || day.isBefore(dayjs(), 'day')) return;

    if (selectedDay.format('DD-MM-YY') === day.format('DD-MM-YY')) {
      setSelectedDay(dayjs());
      setDayMeetings([]);
    } else {
      setSelectedDay(day);
      const meetingsForDay = meetings.filter(meeting =>
        dayjs(meeting.startTime).isSame(day, 'day')
      );
      setDayMeetings(meetingsForDay);
    }
  };

  return (
    <div className="h-full flex items-center gap-2">
      <div className="w-1/2 flex flex-col gap-6 items-center">
        <div className="flex flex-col gap-4 items-center">
          <p className="font-bold text-6xl">{formattedMonth.split(' ')[0]}</p>
          <p className="font-semibold text-5xl">{selectedDay.format('D')}</p>
        </div>
        <footer className="w-full flex justify-between items-center gap-2 px-4">
          <div className="flex gap-2 justify-center items-center">
            <button
              className="flex p-2 border rounded-full btn-outline hover:bg-primary hover:border-primary"
              onClick={handlePrevMonth}
            >
              <FaChevronLeft className="text-xs" />
            </button>
            <button
              className="flex justify-center p-2 border rounded-full btn-outline hover:bg-primary hover:border-primary"
              onClick={handleNextMonth}
            >
              <FaChevronRight className="text-xs" />
            </button>
            <p className=" font-bold">{formattedMonth}</p>
          </div>
          <button
            className="px-3 py-1 rounded-3xl border text-sm font-semibold hover:bg-primary hover:border-primary hover:text-neutral"
            onClick={handleReset}
          >
            Today
          </button>
        </footer>
      </div>

      <div className="w-1/2">
        <div className="grid grid-cols-7 grid-rows-6 gap-1">
          {currentMonth[0].map((day, index) => (
            <span
              key={index}
              className="text-md py-1 text-center font-semibold "
            >
              {day?.format('dd').charAt(0)}
            </span>
          ))}
          {currentMonth.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div
                  className="dropdown dropdown-top dropdown-end"
                  key={dayIndex}
                  onClick={() => handleDayToggle(day)}
                >
                  <div
                    tabIndex={0}
                    role="button"
                    className={`relative flex justify-center items-center w-full ${getCurrentDayClass(
                      day
                    )} hover:bg-base-300 text-center rounded-full ${
                      !isDayInCurrentMonth(day) ? 'text-gray-500' : ''
                    }`}
                  >
                    <span className="text-sm p-1">{day?.format('D')}</span>
                    {day && hasMeetings(day) && (
                      <span className="absolute dot bg-warning rounded-full w-1 h-1 top-1 right-2"></span>
                    )}{' '}
                    {/* Add a dot if there are meetings */}
                  </div>
                  <div
                    tabIndex={1}
                    className="dropdown-content rounded-box z-[1] w-52 p-4 bg-primary text-primary-content shadow mt-1"
                  >
                    <h3 className="text-m font-semibold mb-2">
                      Scheduled meetings:
                    </h3>
                    {dayMeetings.length > 0 ? (
                      dayMeetings.map(meeting => (
                        <div key={meeting.id} className="mb-2">
                          <p className="font-semibold">{meeting.title}</p>
                          <p className="text-sm opacity-50">
                            {dayjs(meeting.startTime).format('HH:mm')} -{' '}
                            {dayjs(meeting.endTime).format('HH:mm')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm">No Meetings for this day.</p>
                    )}
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarWidgetWide;
