import { get, off, onValue, ref, set } from 'firebase/database';
import { db } from '../config/firebase.config';
import { Team } from '../models/Team';
import { v4 as uuidv4 } from 'uuid';
import {
  transformTeamData,
  transformTeamMemberData,
} from '../utils/TransformDataHelpers';

import { getUserByHandle } from './user.service';
import { TeamMember } from '../models/Participant';
import { ChannelCategory } from '../enums/ChannelCategory';

export const createTeam = async (
  name: string,
  owner: string,
  members: string[],
  isPrivate: boolean,
  imageUrl: string,
  channels: string[] = [],
  meetings: string[] = []
): Promise<Team> => {
  const teamId = uuidv4();
  const createdOn = Date.now();

  const membersObject: Record<string, TeamMember> = {};

  for (const member of members) {
    const userData = await getUserByHandle(member);
    membersObject[member] = transformTeamMemberData(userData, owner);
  }

  const newTeam: Team = {
    id: teamId,
    name,
    owner,
    members: membersObject,
    channels: channels.reduce((acc, channelId) => {
      acc[channelId] = ChannelCategory.TEXT_CHANNELS;
      return acc;
    }, {} as Record<string, ChannelCategory>),
    meetings,
    createdOn,
    isPrivate,
    imageUrl, // Assign the imageUrl to the team
  };

  await set(ref(db, `teams/${teamId}`), newTeam);

  return newTeam;
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
  members: Record<string, TeamMember>,
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
