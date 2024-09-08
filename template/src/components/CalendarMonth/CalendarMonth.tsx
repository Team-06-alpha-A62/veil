import React, { useState } from 'react';
import dayjs from 'dayjs';
import CalendarDay from '../CalendarDay/CalendarDay.tsx';
import { Meeting } from '../../models/Meeting.ts';
import EditMeetingModal from '../EditMeetingModal/EditMeetingModal.tsx';

interface CalendarMonthProps {
  month: (dayjs.Dayjs | null)[][]; // 2D array allowing null values
  setSelectedDay: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
  selectedDay: dayjs.Dayjs;
  currentMonthIndex: number;
  meetings: Meeting[];
}
const CalendarMonth: React.FC<CalendarMonthProps> = ({
  month,
  setSelectedDay,
  selectedDay,
  currentMonthIndex,
  meetings,
}) => {
  const [showEditMeetingModal, setShowEditMeetingModal] =
    useState<boolean>(false);

  const [selectedDayMeeting, setSelectedDayMeeting] = useState<Meeting | null>(
    null
  );

  const handleOpenModal = (meeting: Meeting): void => {
    setShowEditMeetingModal(prevValue => !prevValue);
    setSelectedDayMeeting(meeting);
  };

  const handleCloseModal = (): void => {
    setShowEditMeetingModal(false);
    setSelectedDayMeeting(null);
  };

  return (
    <>
      <div className={`flex-1 grid grid-cols-7 grid-rows-${month.length}`}>
        {month?.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((day, dayIndex) => (
              <CalendarDay
                day={day}
                key={dayIndex}
                setSelectedDay={setSelectedDay}
                selectedDay={selectedDay}
                handleOpenModal={handleOpenModal}
                currentMonthIndex={currentMonthIndex}
                meetings={meetings}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      {showEditMeetingModal && selectedDayMeeting && (
        <EditMeetingModal
          handleCloseModal={handleCloseModal}
          selectedDay={selectedDay}
          meeting={selectedDayMeeting}
        />
      )}
    </>
  );
};

export default CalendarMonth;
