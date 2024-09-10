import { get, off, onValue, ref, remove, set, update } from 'firebase/database';
import { db } from '../config/firebase.config';
import { Team } from '../models/Team';
import { v4 as uuidv4 } from 'uuid';
import {
  transformChannelData,
  transformTeamData,
  transformTeamMemberData,
} from '../utils/TransformDataHelpers';

import { getUserByHandle } from './user.service';
import { Participant } from '../models/Participant';
import { Channel } from '../models/Channel';
import { ChannelCategory } from '../enums/ChannelCategory';
import { UserRole } from '../enums/UserRole';

export const createTeam = async (
  name: string,
  owner: string,
  members: string[],
  isPrivate: boolean,
  imageUrl: string
): Promise<string> => {
  const teamId = uuidv4();
  const createdOn = Date.now();

  const membersObject: Record<string, Participant> = {};

  for (const member of members) {
    const userData = await getUserByHandle(member);
    membersObject[member] = transformTeamMemberData(
      userData,
      userData.username === owner ? 'owner' : 'member'
    );
  }

  const newTeam: Team = {
    id: teamId,
    name,
    owner,
    members: membersObject,
    createdOn,
    isPrivate,
    imageUrl,
  };

  await set(ref(db, `teams/${teamId}`), newTeam);

  return teamId;
};
export const getTeamById = async (teamId: string): Promise<Team | null> => {
  const teamRef = ref(db, `teams/${teamId}`);
  const snapshot = await get(teamRef);

  if (snapshot.exists()) {
    const teamData = snapshot.val() as Partial<Team>;
    return await transformTeamData(teamData);
  } else {
    return null;
  }
};
export const fetchAllTeams = async (): Promise<Team[]> => {
  const teamsSnapshot = await get(ref(db, 'teams'));
  if (!teamsSnapshot.exists()) {
    return [];
  }

  const teamsData = teamsSnapshot.val();
  const transformedTeams = await Promise.all(
    Object.values(teamsData || {}).map(teamData =>
      transformTeamData(teamData as Partial<Team>)
    )
  );

  return transformedTeams;
};
export const getTeamChannels = async (teamId: string): Promise<Channel[]> => {
  const teamChannelsRef = ref(db, `teams/${teamId}/channels`);
  const snapshot = await get(teamChannelsRef);
  const channelsData = snapshot.val() || {};

  const channelIds = Object.values(channelsData).flatMap(category =>
    Object.keys(category || {})
  );

  const channels = await Promise.all(
    channelIds.map(async channelId => {
      const channelSnapshot = await get(ref(db, `channels/${channelId}`));
      if (channelSnapshot.exists()) {
        const channel = await transformChannelData(
          channelSnapshot.val() as Channel
        );
        return { ...channel, id: channelId };
      }
      return null;
    })
  );

  return channels.filter(channel => channel !== null) as Channel[];
};
export const listenToTeamsChange = (
  changeTeams: (teams: Team[]) => void
): (() => void) => {
  const teamsRef = ref(db, 'teams');

  const listener = onValue(teamsRef, async snapshot => {
    const teamsData = snapshot.val();
    const teams = await Promise.all(
      Object.values(teamsData || {}).map(teamData =>
        transformTeamData(teamData as Partial<Team>)
      )
    );
    changeTeams(teams);
  });

  return () => off(teamsRef, 'value', listener);
};

export const listenToTeamMemberStatusChanges = (
  teamId: string,
  members: Record<string, Participant>,
  updateActiveMembersCount: (teamId: string, activeCount: number) => void
): (() => void) => {
  const memberRefs = Object.keys(members).map(memberUsername =>
    ref(db, `teams/${teamId}/members/${memberUsername}/active`)
  );

  const unsubscribeFunctions = memberRefs.map((memberRef, index) =>
    onValue(memberRef, snapshot => {
      members[Object.keys(members)[index]].active = snapshot.val() || false;
      const activeMembersCount = Object.values(members).filter(
        member => member.active
      ).length;
      updateActiveMembersCount(teamId, activeMembersCount);
    })
  );

  return () => {
    unsubscribeFunctions.forEach(unsub => unsub());
  };
};

export const listenToTeamChannels = (
  teamId: string,
  onChannelsChange: (channels: Channel[]) => void
): (() => void) => {
  const teamChannelsRef = ref(db, `teams/${teamId}/channels`);

  const unsubscribe = onValue(teamChannelsRef, async () => {
    try {
      const channels = await getTeamChannels(teamId);

      onChannelsChange(channels);
    } catch (error) {
      console.error('Failed to fetch or listen to team channels', error);
    }
  });

  return () => {
    unsubscribe();
  };
};

export const updateMemberRoleIn = async (
  teamId: string,
  username: string,
  newRole: UserRole
) => {
  await updateTeamMemberRole(teamId, username, newRole);
};

export const addChannelsToTeam = async (
  teamId: string,
  channels: { id: string; category: ChannelCategory }[]
): Promise<void> => {
  const updates: Record<string, boolean> = {};

  channels.forEach(({ id, category }) => {
    updates[`teams/${teamId}/channels/${category}/${id}`] = true;
  });

  await update(ref(db), updates);
};

export const changeTeamImage = async (
  teamId: string,
  imageUrl: string
): Promise<void> => {
  const updateObject = {
    [`teams/${teamId}/imageUrl`]: imageUrl,
  };

  await update(ref(db), updateObject);
};

export const updateTeamName = async (
  teamId: string,
  newName: string
): Promise<void> => {
  const teamRef = ref(db, `teams/${teamId}`);
  await update(teamRef, { name: newName });
};

export const updateTeamMemberRole = async (
  teamId: string,
  username: string,
  newRole: UserRole
): Promise<void> => {
  const updateObject = {
    [`teams/${teamId}/members/${username}/role`]: newRole,
  };

  await update(ref(db), updateObject);
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  const teamRef = ref(db, `teams/${teamId}`);
  const teamSnapshot = await get(teamRef);

  if (!teamSnapshot.exists()) {
    throw new Error('Team not found.');
  }

  const teamData = teamSnapshot.val();
  const channels = teamData.channels || {};

  const updateObject: Record<string, null> = {};

  for (const category of Object.keys(channels)) {
    for (const channelId of Object.keys(channels[category])) {
      const channelRef = ref(db, `channels/${channelId}`);
      const channelSnapshot = await get(channelRef);

      if (channelSnapshot.exists()) {
        const channelData = channelSnapshot.val();

        for (const participant in channelData.participants) {
          updateObject[`users/${participant}/channels/${channelId}`] = null;
        }

        updateObject[`channels/${channelId}`] = null;
      }
    }
  }

  updateObject[`teams/${teamId}`] = null;

  // Perform the updates in Firebase
  await update(ref(db), updateObject);
};

export const addMemberToTeam = async (
  teamId: string,
  newMemberHandle: string,
  owner: string
): Promise<void> => {
  const userData = await getUserByHandle(newMemberHandle);
  if (!userData) {
    throw new Error(`User with handle ${newMemberHandle} not found.`);
  }
  const newParticipant: Participant = transformTeamMemberData(
    userData,
    'member'
  );

  const updateObject: Record<string, unknown> = {
    [`teams/${teamId}/members/${newMemberHandle}`]: newParticipant,
  };

  const channelsSnapshot = await get(ref(db, `teams/${teamId}/channels`));
  const channelsData = channelsSnapshot.val() || {};

  Object.values(channelsData).forEach(category => {
    Object.keys(category as Record<string, boolean>).forEach(channelId => {
      updateObject[`channels/${channelId}/participants/${newMemberHandle}`] =
        true;
      updateObject[`users/${newMemberHandle}/channels/${channelId}`] =
        UserRole.MEMBER;
    });
  });

  await update(ref(db), updateObject);
};
export const createJoinRequest = async (
  teamId: string,
  username: string
): Promise<void> => {
  const userData = await getUserByHandle(username);
  const newParticipant: Participant = {
    username: userData.username,
    avatarUrl: userData.avatarUrl || '',
    role: UserRole.MEMBER,
  };

  const updateObject = {
    [`teams/${teamId}/joinRequests/${username}`]: newParticipant,
  };

  await update(ref(db), updateObject);
};
export const acceptJoinRequest = async (
  teamId: string,
  username: string
): Promise<void> => {
  const joinRequestRef = ref(db, `teams/${teamId}/joinRequests/${username}`);
  const snapshot = await get(joinRequestRef);

  if (snapshot.exists()) {
    const participantData = snapshot.val();

    await addMemberToTeam(teamId, username, participantData.username);

    await remove(joinRequestRef);
  }
};
export const declineJoinRequest = async (
  teamId: string,
  username: string
): Promise<void> => {
  const joinRequestRef = ref(db, `teams/${teamId}/joinRequests/${username}`);
  await remove(joinRequestRef);
};
export const getJoinRequests = async (
  teamId: string
): Promise<Participant[]> => {
  const joinRequestsRef = ref(db, `teams/${teamId}/joinRequests`);
  const snapshot = await get(joinRequestsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const requestsData = snapshot.val();
  return Object.values(requestsData) as Participant[];
};
