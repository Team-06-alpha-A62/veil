import { ChannelType } from '../enums/ChannelType';
import { FriendType } from '../enums/FriendType';
import { UserRole } from '../enums/UserRole';
import { UserStatus } from '../enums/UserStatus';
import { Channel } from '../models/Channel';
import { Friend } from '../models/Friend';
import { Message } from '../models/Message';
import { Note } from '../models/Note.ts';
import { Participant } from '../models/Participant';
import { Team } from '../models/Team';
import { UserData } from '../models/UserData';
import { getUserByHandle } from '../services/user.service';

export const transformUserData = (data: Partial<UserData>): UserData => {
  const friends: string[] = [];
  const pendingFriends: string[] = [];

  if (data.friends) {
    for (const [friendUsername, status] of Object.entries(data.friends)) {
      if (status === FriendType.FRIEND) {
        friends.push(friendUsername);
      } else if (status === FriendType.PENDING) {
        pendingFriends.push(friendUsername);
      }
    }
  }

  return {
    id: data.id || '',
    username: data.username || 'Unknown Username',
    firstName: data.firstName || 'First Name',
    lastName: data.lastName || 'Last Name',
    email: data.email || 'No Email',
    phoneNumber: data.phoneNumber || '',
    avatarUrl: data.avatarUrl || '',
    status: data.status || UserStatus.OFFLINE,
    teams: data.teams || {},
    channels: data.channels || {},
    friends,
    pendingFriends,
    userSince: data.userSince || Date.now(),
    notes: Object.keys(data.notes || {}),
    activeDyteMeetingId: data.activeDyteMeetingId || '',
    dyteParticipantId: data.dyteParticipantId || '',
    lastSeenMessages: data.lastSeenMessages || {},
  };
};

export const transformMessageData = (data: Partial<Message>): Message => {
  return {
    id: data.id || '',
    sender: data.sender || 'Unknown Sender',
    channelId: data.channelId || '',
    content: data.content || '',
    sentAt: data.sentAt || Date.now(),
    media: data.media || '',
    reactions: data.reactions || {},
    editedAt: data.editedAt || 0,
  };
};

export const transformTeamData = async (data: Partial<Team>): Promise<Team> => {
  const membersObject: Record<string, Participant> = {};

  for (const member of Object.keys(data.members || {})) {
    const userData = await getUserByHandle(member);
    membersObject[member] = transformTeamMemberData(userData, data.owner || '');
  }

  return {
    id: data.id || '',
    name: data.name || 'Untitled Team',
    owner: data.owner || '',
    members: membersObject,
    channels: data.channels || undefined,
    meetings: data.meetings || [],
    createdOn: data.createdOn || Date.now(),
    isPrivate: data.isPrivate || false,
    imageUrl: data.imageUrl || '',
  };
};

export const transformUserToFriend = (
  userData: UserData,
  friendshipStatus: FriendType
): Friend => {
  return {
    id: userData.id,
    username: userData.username,
    avatarUrl: userData.avatarUrl || '',
    friendshipStatus,
    status: userData.status || UserStatus.OFFLINE,
  };
};

export const transformChannelData = async (
  data: Partial<Channel>
): Promise<Channel> => {
  const participants = await Promise.all(
    Object.keys(data.participants || {}).map(async participant =>
      getUserByHandle(participant)
    )
  ).then(usersData =>
    usersData.reduce((acc: Record<string, Participant>, user: UserData) => {
      acc[user.username] = {
        avatarUrl: user.avatarUrl || '',
        username: user.username,
        role: data.owner === user.username ? UserRole.OWNER : UserRole.MEMBER,
        active: false,
      };
      return acc;
    }, {})
  );

  return {
    id: data.id || '',
    name: data.name || null,
    type: data.type || ChannelType.DIRECT,
    isPrivate: data.isPrivate ?? true,
    owner: data.owner || '',
    participants: participants,
    teamId: data.teamId || '',
    messages: data.messages || {},
    createdOn: data.createdOn || Date.now(),
    lastMessageAt: data.lastMessageAt || undefined,
    activeMeetingId: data.activeMeetingId || '',
    category: data.category,
    imageUrl: data.imageUrl,
  };
};

export const transformTeamMemberData = (
  userData: Partial<UserData>,
  owner: string
): Participant => {
  return {
    avatarUrl: userData.avatarUrl || '',
    username: userData.username || 'Unknown Username',
    role: userData.username === owner ? UserRole.OWNER : UserRole.MEMBER,
    active: userData.username === owner ? true : false,
  };
};

export const transformNoteData = (
  data: Partial<Note> & { tagsObject?: Record<string, boolean> }
): Note => {
  return {
    title: data.title || '',
    username: data.username || 'Unknown Username',
    id: data.id || '',
    createdOn: data.createdOn || 0,
    tags: Object.keys(data.tagsObject || {}),
    content: data.content || '',
    label: data.label || '',
  };
};

export const getChannelName = (
  myUsername: string,
  channel: Channel
): string => {
  if (channel?.name) {
    return channel?.name;
  } else {
    const filteredParticipants = Object.keys(
      channel?.participants || {}
    ).filter(p => p !== myUsername);

    if (channel?.type === ChannelType.DIRECT) {
      return filteredParticipants[0];
    } else {
      return filteredParticipants.join(', ').concat(` and ${myUsername}`);
    }
  }
};
export const getChannelImage = (
  channel: Channel,
  currentUsername: string
): string | null => {
  if (channel.type === ChannelType.GROUP) {
    return channel.imageUrl || null;
  } else if (channel.type === ChannelType.DIRECT) {
    const otherParticipant = Object.values(channel.participants).find(
      participant => participant.username !== currentUsername
    );
    return otherParticipant?.avatarUrl || otherParticipant!.username;
  }
  return null;
};
