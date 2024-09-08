import { useEffect, useState } from 'react';
import { getMonth } from '../../utils/dateUtils.ts';
import CalendarHeader from '../CalendarHeader/CalendarHeader.tsx';
import CalendarMonth from '../CalendarMonth/CalendarMonth.tsx';
import CalendarWidget from '../CalendarWidget/CalendarWidget.tsx';
import dayjs from 'dayjs';
import { Meeting } from '../../models/Meeting.ts';
import { subscribeToUserMeetings } from '../../services/meetings.service.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';

type DayMatrix = Array<Array<dayjs.Dayjs | null>>;

const Meetings = () => {
  const { currentUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<DayMatrix>(getMonth());
  const [monthIndex, setMonthIndex] = useState<number>(dayjs().month());
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(dayjs());
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  useEffect(() => {
    if (!currentUser) return;

    const handleMeetingsUpdate = (updatedMeetings: Meeting[]) => {
      setMeetings(updatedMeetings);
    };

    return subscribeToUserMeetings(
      currentUser.userData!.username,
      handleMeetingsUpdate
    );
  }, [currentUser, meetings]);

  return (
    <div className="h-full flex flex-col gap-4">
      <CalendarHeader
        monthIndex={monthIndex}
        setMonthIndex={setMonthIndex}
        selectedDay={selectedDay}
      />
      <div className="flex flex-1 gap-4 ">
        <CalendarWidget />
        <CalendarMonth
          month={currentMonth}
          setSelectedDay={setSelectedDay}
          selectedDay={selectedDay}
          currentMonthIndex={monthIndex}
          meetings={meetings}
        />
      </div>
    </div>
  );
};

export default Meetings;
