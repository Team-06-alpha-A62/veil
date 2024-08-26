import React from 'react';
import dayjs from 'dayjs';
import { generateTimeOptions } from '../../utils/dateUtils.ts';

interface TimeSelectorProps {
  selectedTime: number; // Expecting timestamp in milliseconds
  onTimeChange: (time: number) => void;
  startTime?: number; // Optional startTime prop
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onTimeChange,
  startTime = 0, // Default startTime to 0 if not provided
}) => {
  const times = generateTimeOptions().filter(time => time >= startTime);

  return (
    <select
      className="select w-full bg-base-200 bg-opacity-50 rounded-3xl select-sm focus:border-transparent focus:outline-accent"
      value={selectedTime}
      onChange={e => onTimeChange(Number(e.target.value))}
    >
      <option disabled value="">
        Select a time
      </option>
      {times.map((timestamp: number) => (
        <option key={timestamp} value={timestamp}>
          {dayjs(timestamp).format('HH:mm')} {/* Displaying formatted time */}
        </option>
      ))}
    </select>
  );
};

export default TimeSelector;
