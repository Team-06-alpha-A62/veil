import { get, push, ref, update } from 'firebase/database';
import { ChannelType } from '../enums/ChannelType';
import { db } from '../config/firebase.config';
import { Channel } from '../models/Channel';
import { transformChannelData } from '../utils/TransformDataHelpers';

export const createChannel = async (
  name: string | null,
  owner: string,
  participantsUsernames: string[],
  type: ChannelType,
  isPrivate: boolean,
  teamId: string | null = null
): Promise<void> => {
  const participants: Record<string, boolean> = participantsUsernames.reduce(
    (acc: Record<string, boolean>, participant: string) => {
      acc[participant] = true;
      return acc;
    },
    {}
  );

  const newChannel = {
    name,
    type,
    owner,
    participants,
    isPrivate,
    teamId,
    createdOn: Date.now(),
  };
  const result = await push(ref(db, 'channels'), newChannel);
  const newChannelId = result.key as string;
  const updateObject = {
    [`channels/${newChannelId}/id`]: newChannelId,
    ...participantsUsernames.reduce(
      (acc: Record<string, boolean>, participant: string) => {
        acc[`users/${participant}/channels/${newChannelId}`] = true;
        return acc;
      },
      {}
    ),
    //ADD CHANNEL FROM TEAM IN FUTURE !!!!!!!!!!!!!!!!!!!!!!!!
  };

  await update(ref(db), updateObject);
};

export const getChannelByHandle = async (handle: string): Promise<Channel> => {
  const snapshot = await get(ref(db, `channels/${handle}`));
  if (!snapshot.exists()) throw new Error('Could not find channel.');

  const channelData = transformChannelData(snapshot.val());
  return channelData;
};

export const getAllChannels = async (): Promise<Channel[]> => {
  const snapshot = await get(ref(db, `channels`));
  if (!snapshot.exists()) throw new Error('No channels found!');

  const channelsData = snapshot.val();
  const transformedChannelsData: Channel[] = Object.values(channelsData).map(
    channel => transformChannelData(channel as Channel)
  );

  return transformedChannelsData;
};

export const addChannelParticipant = async (
  channelHandle: string,
  newParticipantHandle: string
): Promise<void> => {
  const updateObject = {
    [`channels/${channelHandle}/participants/${newParticipantHandle}`]: true,
    [`users/${newParticipantHandle}/channels/${channelHandle}`]: true,
  };

  await update(ref(db), updateObject);
};

export const deleteChannel = async (channelHandle: string): Promise<void> => {
  const participantsSnapshot = await get(
    ref(db, `channels/${channelHandle}/participants`)
  );
  const participantsData = Object.keys(participantsSnapshot.val());

  const updateObject = {
    [`channels/${channelHandle}`]: null,
    ...participantsData.reduce(
      (acc: Record<string, null>, participant: string) => {
        acc[`users/${participant}/channels/${channelHandle}`] = null;
        return acc;
      },
      {}
    ),
    //REMOVE CHANNEL FROM TEAM IN FUTURE !!!!!!!!!!!!!!!!!!!!!!!!
  };

  await update(ref(db), updateObject);
};
