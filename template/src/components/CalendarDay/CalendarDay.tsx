import dayjs from 'dayjs';
import React from 'react';

interface CalendarDayProps {
  day: dayjs.Dayjs | null;
  setSelectedDay: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  selectedDay: dayjs.Dayjs;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  setSelectedDay,
  selectedDay,
}) => {
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

  const getCurrentDayClass = () =>
    day?.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
      ? 'bg-primary text-primary-content rounded-full w-7 text-center'
      : '';

  return (
    <div
      className={`${
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
    </div>
  );
};

export default CalendarDay;
