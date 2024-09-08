import { useEffect, useState } from 'react';
import { getMonth } from '../../utils/dateUtils.ts';
import CalendarHeader from '../CalendarHeader/CalendarHeader.tsx';
import CalendarMonth from '../CalendarMonth/CalendarMonth.tsx';
import dayjs from 'dayjs';
import { Meeting } from '../../models/Meeting.ts';
import {
  getPendingUserMeetings,
  respondToMeetingInvitation,
  subscribeToUserMeetings,
} from '../../services/meetings.service.ts';
import { useAuth } from '../../providers/AuthProvider.tsx';
import PendingMeetingCard from '../PendingMeetingCard/PendingMeetingCard.tsx';

type DayMatrix = Array<Array<dayjs.Dayjs | null>>;

const Meetings = () => {
  const { currentUser } = useAuth();
  const [currentMonth, setCurrentMonth] = useState<DayMatrix>(getMonth());
  const [monthIndex, setMonthIndex] = useState<number>(dayjs().month());
  const [selectedDay, setSelectedDay] = useState<dayjs.Dayjs>(dayjs());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [pendingMeetings, setPendingMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  useEffect(() => {
    const fetchPendingMeetings = async () => {
      const pendingMeetingsData = await getPendingUserMeetings(
        currentUser.userData!.username
      );
      setPendingMeetings(pendingMeetingsData);
    };
    fetchPendingMeetings();
  }, []);

  const handleMeetingInvitationResponse = async (
    meetingId: string,
    response: boolean
  ) => {
    await respondToMeetingInvitation(
      meetingId,
      currentUser.userData!.username,
      response
    );

    setPendingMeetings(prevPendingMeetins =>
      prevPendingMeetins.filter(
        pendingMeeting => pendingMeeting.id !== meetingId
      )
    );
  };

  useEffect(() => {
    if (!currentUser) return;

    const handleMeetingsUpdate = (updatedMeetings: Meeting[]) => {
      setMeetings(updatedMeetings);
    };

    return subscribeToUserMeetings(
      currentUser.userData!.username,
      handleMeetingsUpdate
    );
  }, [currentUser]);

  return (
    <div className="h-full flex flex-col gap-4">
      <CalendarHeader
        monthIndex={monthIndex}
        setMonthIndex={setMonthIndex}
        selectedDay={selectedDay}
      />
      <div className="flex flex-1 gap-4 ">
        <div className="w-1/6">
          {pendingMeetings.length > 0 && (
            <div>
              {pendingMeetings.map(pendingMeeting => (
                <PendingMeetingCard
                  pendingMeeting={pendingMeeting}
                  handleMeetingInvitationResponse={
                    handleMeetingInvitationResponse
                  }
                />
              ))}
            </div>
          )}
        </div>

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
