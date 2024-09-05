import { get, off, onValue, ref, set, update } from 'firebase/database';
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
    membersObject[member] = transformTeamMemberData(userData, owner);
  }

  const newTeam: Team = {
    id: teamId,
    name,
    owner,
    members: membersObject,
    channels: [],
    meetings: [],
    createdOn,
    isPrivate,
    imageUrl,
  };

  await set(ref(db, `teams/${teamId}`), newTeam);

  return teamId;
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
  const channelIds = Object.keys(snapshot.val() || {});

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

export const addChannelsToTeam = async (
  teamId: string,
  channelIds: string[]
): Promise<void> => {
  const teamRef = ref(db, `teams/${teamId}/channels`);

  const channelsObject = channelIds.reduce(
    (acc: Record<string, boolean>, channelId) => {
      acc[channelId] = true;
      return acc;
    },
    {}
  );

  await update(teamRef, channelsObject);
};
