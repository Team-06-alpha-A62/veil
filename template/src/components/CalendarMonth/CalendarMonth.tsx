import React from 'react';
import dayjs from 'dayjs';
import CalendarDay from '../CalendarDay/CalendarDay.tsx';

interface CalendarMonthProps {
  month: (dayjs.Dayjs | null)[][]; // 2D array allowing null values
  setSelectedDay: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  selectedDay: dayjs.Dayjs;
  currentMonthIndex: number;
}
const CalendarMonth: React.FC<CalendarMonthProps> = ({
  month,
  setSelectedDay,
  selectedDay,
  currentMonthIndex,
}) => {
  return (
    <div className={`flex-1 grid grid-cols-7 grid-rows-${month.length}`}>
      {month?.map((row, index) => (
        <React.Fragment key={index}>
          {row.map((day, dayIndex) => (
            <CalendarDay
              day={day}
              key={dayIndex}
              setSelectedDay={setSelectedDay}
              selectedDay={selectedDay}
              currentMonthIndex={currentMonthIndex}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CalendarMonth;
