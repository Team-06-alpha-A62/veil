import { get, onValue, push, ref, update } from 'firebase/database';
import { ChannelType } from '../enums/ChannelType';
import { db } from '../config/firebase.config';
import { Channel } from '../models/Channel';
import { transformChannelData } from '../utils/TransformDataHelpers';
import { ChannelCategory } from '../enums/ChannelCategory';
import { UserRole } from '../enums/UserRole';

export const createChannel = async (
  name: string | null,
  owner: string | null,
  participantsUsernames: string[],
  type: ChannelType,
  isPrivate: boolean,
  teamId: string | null = null,
  category?: ChannelCategory,
  imageUrl?: string
): Promise<string> => {
  const participants: Record<string, boolean> = participantsUsernames.reduce(
    (acc: Record<string, boolean>, participant: string) => {
      acc[participant] = true;
      return acc;
    },
    {}
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newChannel: Record<string, any> = {
    name,
    type,
    owner,
    participants,
    isPrivate,
    teamId,
    createdOn: Date.now(),
  };

  if (imageUrl) {
    newChannel.imageUrl = imageUrl;
  }

  if (category) {
    newChannel.category = category;
  }
  const result = await push(ref(db, 'channels'), newChannel);
  const newChannelId = result.key as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateObject: Record<string, any> = {
    [`channels/${newChannelId}/id`]: newChannelId,
    ...participantsUsernames.reduce(
      (acc: Record<string, UserRole>, participant: string) => {
        acc[`users/${participant}/channels/${newChannelId}`] =
          participant === owner ? UserRole.OWNER : UserRole.MEMBER;
        return acc;
      },
      {}
    ),
  };

  if (teamId && category) {
    updateObject[`teams/${teamId}/channels/${category}/${newChannelId}`] = true;
  }

  await update(ref(db), updateObject);

  return newChannelId;
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

  const transformedChannelsData: Channel[] = await Promise.all(
    Object.values(channelsData).map(channel =>
      transformChannelData(channel as Channel)
    )
  );

  return transformedChannelsData;
};
export const addChannelParticipant = async (
  channelHandle: string,
  newParticipantHandle: string
): Promise<void> => {
  const updateObject = {
    [`channels/${channelHandle}/participants/${newParticipantHandle}`]: true,
    [`users/${newParticipantHandle}/channels/${channelHandle}`]:
      UserRole.MEMBER,
  };

  await update(ref(db), updateObject);
};

export const removeChannelParticipant = async (
  channelHandle: string,
  participantHandle: string
): Promise<void> => {
  const updateObject = {
    [`channels/${channelHandle}/participants/${participantHandle}`]: null,
    [`users/${participantHandle}/channels/${channelHandle}`]: null,
  };

  await update(ref(db), updateObject);
};

export const updateChannelName = async (
  channelHandle: string,
  newName: string
): Promise<void> => {
  const updateObject = {
    [`channels/${channelHandle}/name`]: newName,
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

export const getUserChannels = async (
  userHandle: string
): Promise<Channel[]> => {
  const snapshot = await get(ref(db, `users/${userHandle}/channels`));
  if (!snapshot.exists()) return [];

  const channelsObject = snapshot.val() || {};
  const channels: Channel[] = (
    await Promise.all(
      Object.keys(channelsObject).map(async channelId => {
        const channelSnapshot = await get(ref(db, `channels/${channelId}`));
        if (!channelSnapshot.exists()) return null;
        const transformedChannelData = await transformChannelData(
          channelSnapshot.val() as Channel
        );
        return transformedChannelData;
      })
    )
  ).filter((channel): channel is Channel => channel !== null);
  return channels;
};

export const listenToChannelChange = (
  userHandle: string,
  onChannelsChange: (channels: Channel[]) => void
): (() => void) => {
  const channelsRef = ref(db, `users/${userHandle}/channels`);

  return onValue(channelsRef, async () => {
    try {
      const allChannels = await getUserChannels(userHandle);
      onChannelsChange(allChannels);
    } catch (error) {
      console.error('Failed to fetch Channels data', error);
    }
  });
};

export const listenToIndividualChannel = (
  channelId: string,
  onChannelUpdate: (updatedChannel: Channel) => void
): (() => void) => {
  const channelRef = ref(db, `channels/${channelId}`);

  return onValue(channelRef, async snapshot => {
    if (snapshot.exists()) {
      const updatedChannel = await transformChannelData(
        snapshot.val() as Channel
      );
      onChannelUpdate(updatedChannel);
    }
  });
};

export const changeChannelImage = async (
  channelId: string,
  imageUrl: string
): Promise<string> => {
  const updateObject = {
    [`channels/${channelId}/imageUrl`]: imageUrl,
  };
  await update(ref(db), updateObject);
  return imageUrl;
};

export const updateParticipantRole = async (
  channelId: string,
  participantHandle: string,
  newRole: UserRole
): Promise<void> => {
  const updateObject = {
    [`users/${participantHandle}/channels/${channelId}`]: newRole,
  };

  await update(ref(db), updateObject);
};

export const removeParticipant = async (
  channelId: string,
  participantHandle: string
): Promise<void> => {
  const updateObject = {
    [`channels/${channelId}/participants/${participantHandle}`]: null,
    [`users/${participantHandle}/channels/${channelId}`]: null,
  };

  await update(ref(db), updateObject);
};
