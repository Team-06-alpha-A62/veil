import React from 'react';
import dayjs from 'dayjs';
import { generateTimeOptions } from '../../utils/dateUtils.ts';

interface TimeSelectorProps {
  selectedDay: dayjs.Dayjs;
  selectedTime: number; // Time in milliseconds from the start of the day
  onTimeChange: (time: number) => void;
  startTime?: number; // Optional startTime prop for filtering
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedDay,
  selectedTime,
  onTimeChange,
  startTime = 0,
}) => {
  const times = generateTimeOptions(selectedDay).filter(
    time => time >= startTime
  );

  return (
    <select
      className="select w-full bg-base-200 rounded-3xl select-sm focus:border-transparent focus:outline-accent"
      value={selectedTime}
      onChange={e => onTimeChange(Number(e.target.value))}
    >
      <option disabled value="">
        Select a time
      </option>
      {times.map((timestamp: number) => (
        <option key={timestamp} value={timestamp}>
          {dayjs(timestamp).format('HH:mm')}
        </option>
      ))}
    </select>
  );
};

export default TimeSelector;
