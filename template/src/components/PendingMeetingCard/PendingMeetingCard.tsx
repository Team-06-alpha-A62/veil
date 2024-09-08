import React from 'react';
import { Meeting } from '../../models/Meeting';
import dayjs from 'dayjs';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';

interface PendingMeetingCardProps {
  pendingMeeting: Meeting;
  handleMeetingInvitationResponse: (
    meetingId: string,
    accepted: boolean
  ) => Promise<void>;
}

const PendingMeetingCard: React.FC<PendingMeetingCardProps> = ({
  pendingMeeting,
  handleMeetingInvitationResponse,
}) => {
  return (
    <div className="flex items-center p-6 border-b-2 border-base-100 justify-between hover:bg-secondary-focus transition-colors">
      <div className="flex flex-col items-start justify-start">
        <h3>{pendingMeeting.title}</h3>
        <p className="text-xs">
          {dayjs(pendingMeeting.startTime).format('D MMM YYYY - HH:mm')} to{' '}
          {dayjs(pendingMeeting.endTime).format('HH:mm')}
        </p>
      </div>
      <div className="pr-1 flex flex-col gap-2">
        <button
          className="text-success"
          onClick={() =>
            handleMeetingInvitationResponse(pendingMeeting.id, true)
          }
        >
          <BsCheckCircle size={20} />
        </button>
        <button
          className="text-error"
          onClick={() =>
            handleMeetingInvitationResponse(pendingMeeting.id, false)
          }
        >
          <BsXCircle size={20} />
        </button>
      </div>
    </div>
  );
};

export default PendingMeetingCard;
