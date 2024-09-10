import {
  get,
  onChildChanged,
  onValue,
  push,
  ref,
  update,
} from 'firebase/database';
import { db } from '../config/firebase.config.ts';
import { MeetingStatus } from '../enums/MeetingStatus.ts';
import { Meeting } from '../models/Meeting.ts';

export const createMeeting = async (
  title: string,
  label: string,
  organizer: string,
  startTime: number,
  endTime: number,
  invited: string[],
  description?: string,
  channelId?: string
): Promise<void> => {
  try {
    const participants = invited.reduce(
      (acc: Record<string, string>, user: string) => {
        acc[user] = MeetingStatus.PENDING;
        return acc;
      },
      {}
    );

    participants[organizer] = MeetingStatus.ORGANIZER;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newMeeting: Record<string, any> = {
      title,
      description,
      label,
      organizer,
      startTime,
      endTime,
      participants,
    };

    if (channelId) {
      newMeeting.channelId = channelId;
    }

    const result = await push(ref(db, 'meetings'), newMeeting);
    const newMeetingId = result.key as string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateObject: Record<string, any> = {
      [`meetings/${newMeetingId}/id`]: newMeetingId,
      [`users/${organizer}/meetings/${newMeetingId}`]: true,

      // Change it notify the user when invited instead of directly adding it as a participant
      // ...invited.reduce((acc: Record<string, boolean>, user: string) => {
      //   acc[`users/${user}/meetings/${newMeetingId}`] = true;
      //   return acc;
      // }, {}),
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw new Error('Could not create the meeting.');
  }
};

export const respondToMeetingInvitation = async (
  meetingHandle: string,
  participantHandle: string,
  response: boolean
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/participants/${participantHandle}`]: response
        ? MeetingStatus.ACCEPTED
        : MeetingStatus.DECLINED,

      [`users/${participantHandle}/meetings/${meetingHandle}/participants`]:
        response ? true : null,
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error responding to meeting:', error);
    throw new Error('Could not respond to the meeting.');
  }
};

export const addMeetingParticipant = async (
  meetingHandle: string,
  participantHandle: string
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/participants/${participantHandle}`]:
        MeetingStatus.PENDING,

      // Add a notification for the user
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error adding participant to meeting:', error);
    throw new Error('Could not add participant to the meeting.');
  }
};

export const removeMeetingParticipant = async (
  meetingHandle: string,
  participantHandle: string
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/participants/${participantHandle}`]: null,
      [`users/${participantHandle}/meetings/${meetingHandle}/participants`]:
        null,
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error removing participant from meeting:', error);
    throw new Error('Could not remove participant from the meeting.');
  }
};

export const getAllUserMeetings = async (
  userHandle: string
): Promise<Meeting[]> => {
  try {
    const userRef = ref(db, `users/${userHandle}/meetings`);
    const snapshot = await get(userRef);
    const meetingIds = snapshot.val();

    if (!meetingIds) {
      return [];
    }

    return Promise.all(
      Object.keys(meetingIds).map(async meetingId => {
        const meetingRef = ref(db, `meetings/${meetingId}`);
        return get(meetingRef).then(snapshot => ({
          id: meetingId,
          ...snapshot.val(),
        }));
      })
    );
  } catch (error) {
    console.error('Error fetching user meetings:', error);
    throw new Error('Could not fetch user meetings.');
  }
};

export const cancelMeeting = async (meetingHandle: string): Promise<void> => {
  try {
    const participantsSnapshot = await get(
      ref(db, `meetings/${meetingHandle}/participants`)
    );

    const updateObject: Record<string, null> = {
      [`meetings/${meetingHandle}`]: null,
    };

    if (participantsSnapshot.exists()) {
      const participantsData = participantsSnapshot.val();

      Object.keys(participantsData).forEach(participant => {
        updateObject[`users/${participant}/meetings/${meetingHandle}`] = null;
      });
    }

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error canceling meeting:', error);
    throw new Error('Could not cancel the meeting.');
  }
};

export const subscribeToUserMeetings = (
  userHandle: string,
  callback: (meetings: Meeting[]) => void
): (() => void) => {
  const userRef = ref(db, `users/${userHandle}/meetings`);

  return onValue(userRef, async snapshot => {
    const meetingIds = snapshot.val();
    if (!meetingIds) {
      callback([]);
      return;
    }

    const meetingsPromises = Object.keys(meetingIds).map(async meetingId => {
      const meetingRef = ref(db, `meetings/${meetingId}`);
      const meetingSnapshot = await get(meetingRef);
      const meeting = { id: meetingId, ...meetingSnapshot.val() };

      const participantsRef = ref(db, `meetings/${meetingId}/participants`);
      onChildChanged(participantsRef, participantSnapshot => {
        const participant = participantSnapshot.key;
        const status = participantSnapshot.val();

        meeting.participants[participant!] = status;

        Promise.all(meetingsPromises).then(resolvedMeetings => {
          callback(resolvedMeetings);
        });
      });

      return meeting;
    });

    const meetings = await Promise.all(meetingsPromises);
    callback(meetings);
  });
};

export const getPendingUserMeetings = async (
  userHandle: string
): Promise<Meeting[]> => {
  const snapshot = await get(ref(db, 'meetings'));
  const pendingMeetings: Meeting[] = [];

  if (snapshot.exists()) {
    const meetings = snapshot.val();
    Object.keys(meetings).forEach(meetingId => {
      const participants = meetings[meetingId].participants;
      if (participants[userHandle] === 'pending') {
        pendingMeetings.push({ ...meetings[meetingId] });
      }
    });
  }
  return pendingMeetings;
};

export const updateMeetingTitle = async (
  meetingHandle: string,
  newTitle: string
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/title`]: newTitle,
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error updating meeting title:', error);
    throw new Error('Could not update meeting title.');
  }
};

export const updateMeetingDescription = async (
  meetingHandle: string,
  newDescription: string
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/description`]: newDescription,
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error updating meeting description:', error);
    throw new Error('Could not update meeting description.');
  }
};

export const updateMeetingLabel = async (
  meetingHandle: string,
  newLabel: string
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/label`]: newLabel,
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error updating meeting label:', error);
    throw new Error('Could not update meeting label.');
  }
};

export const updateMeetingStartTime = async (
  meetingHandle: string,
  newStartTIme: number
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/startTime`]: newStartTIme,
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error updating meeting start time:', error);
    throw new Error('Could not update meeting start time.');
  }
};

export const updateMeetingEndTime = async (
  meetingHandle: string,
  newEndTime: number
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/endTime`]: newEndTime,
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error updating meeting end time:', error);
    throw new Error('Could not update meeting end time.');
  }
};

export const updateMeetingChannelId = async (
  meetingHandle: string,
  channelHandle: string
): Promise<void> => {
  try {
    const updateObject = {
      [`meetings/${meetingHandle}/meetingChannel`]: channelHandle,
    };

    await update(ref(db), updateObject);
  } catch (error) {
    console.error('Error updating meeting:', error);
    throw new Error('Could not update meeting.');
  }
};
