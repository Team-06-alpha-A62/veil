import React from 'react';
import dayjs from 'dayjs';
import CalendarDay from '../CalendarDay/CalendarDay.tsx';

interface CalendarMonthProps {
  month: (dayjs.Dayjs | null)[][]; // 2D array allowing null values
  setSelectedDay: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  selectedDay: dayjs.Dayjs;
}
const CalendarMonth: React.FC<CalendarMonthProps> = ({
  month,
  setSelectedDay,
  selectedDay,
}) => {
  return (
    <div className="flex-1 grid grid-cols-7 grid-rows-5">
      {month?.map((row, index) => (
        <React.Fragment key={index}>
          {row.map((day, dayIndex) => (
            <CalendarDay
              day={day}
              key={dayIndex}
              setSelectedDay={setSelectedDay}
              selectedDay={selectedDay}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CalendarMonth;
