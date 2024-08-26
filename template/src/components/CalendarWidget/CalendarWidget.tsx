import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getMonth } from '../../utils/dateUtils.ts';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CalendarModal from '../CreateMeetingModal/CreateMeetingModal.tsx';

type DayMatrix = Array<Array<dayjs.Dayjs | null>>;

const CalendarWidget: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<DayMatrix>(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(
    dayjs().month()
  );
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(dayjs());

  const formattedMonth = dayjs(
    new Date(dayjs().year(), currentMonthIndex)
  ).format('MMMM YYYY');

  const handlePrevMonth = () => {
    setCurrentMonthIndex(monthIndex => monthIndex - 1);
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(monthIndex => monthIndex + 1);
  };

  const handleReset = () => {
    setCurrentMonthIndex(dayjs().month());
  };

  const isDayInCurrentMonth = (day: dayjs.Dayjs | null) =>
    day?.month() === currentMonthIndex;

  const getCurrentDayClass = (day: dayjs.Dayjs | null) =>
    day?.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-primary text-primary-content rounded-full w-7 text-center'
      : '';

  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIndex));
  }, [currentMonthIndex]);
  return (
    <div className="mt-9">
      <header className="flex items-center gap-2 mb-2">
        <button
          className="flex justify-center p-2 border rounded-full btn-outline hover:bg-primary hover:border-primary"
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
      </header>
      <div className="flex items-center gap-2 my-2 justify-between">
        <button
          className="px-3 py-1 rounded-3xl border text-sm font-semibold hover:bg-primary hover:border-primary hover:text-neutral"
          onClick={handleReset}
        >
          Today
        </button>
        <CalendarModal selectedDay={selectedDay} />
      </div>
      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonth[0].map((day, index) => (
          <span key={index} className="text-sm py-1 text-center font-semibold">
            {day?.format('dd').charAt(0)}
          </span>
        ))}
        {currentMonth.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => {
              const handleDayToggle = () => {
                if (day && day.isBefore(dayjs(), 'day')) {
                  return;
                }

                if (
                  selectedDay?.format('DD-MM-YY') === day?.format('DD-MM-YY')
                ) {
                  setSelectedDay(dayjs());
                } else {
                  setSelectedDay(day!);
                }
              };

              return (
                <div
                  className="dropdown dropdown-bottom"
                  key={dayIndex}
                  onClick={handleDayToggle}
                >
                  <div
                    tabIndex={0}
                    role="button"
                    className={`p-1 w-full ${getCurrentDayClass(
                      day
                    )} hover:bg-base-300 text-center rounded-full ${
                      !isDayInCurrentMonth(day) ? 'text-gray-500' : ''
                    } ${selectedDay === day && 'bg-base-300'}`}
                  >
                    <span className="text-sm p-1">{day?.format('D')}</span>
                  </div>
                  <div
                    tabIndex={0}
                    className="dropdown-content rounded-box z-[1] w-52 p-4 bg-base-300 bg-opacity-90 shadow mt-1"
                  >
                    <h3 className="text-m font-semibold mb-2">
                      Scheduled meetings:
                    </h3>
                    <p className="text-sm">No Meetings for this day.</p>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarWidget;
