import { ChannelType } from '../enums/ChannelType';
import { FriendType } from '../enums/FriendType';
import { UserStatus } from '../enums/UserStatus';
import { Channel } from '../models/Channel';
import { Friend } from '../models/Friend';
import { Message } from '../models/Message';
import { Team } from '../models/Team';
import { UserData } from '../models/UserData';

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
    channels: Object.keys(data.channels || {}),
    friends,
    pendingFriends,
    userSince: data.userSince || Date.now(),
    notes: Object.keys(data.notes || {}),
    activeDyteMeetingId: data.activeDyteMeetingId || '',
    dyteParticipantId: data.dyteParticipantId || '',
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

export const transformTeamData = (data: Partial<Team>): Team => {
  return {
    id: data.id || '',
    name: data.name || 'Untitled Team',
    owner: data.owner || '',
    members: data.members || {},
    channels: Object.keys(data.channels || {}),
    meetings: Object.keys(data.meetings || {}),
    createdOn: data.createdOn || Date.now(),
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

export const transformChannelData = (data: Partial<Channel>): Channel => {
  return {
    id: data.id || '',
    name: data.name || Object.keys(data.participants || {}).join(', '),
    type: data.type || ChannelType.DIRECT,
    isPrivate: data.isPrivate || true,
    owner: data.owner || '',
    participants: Object.keys(data.participants || {}),
    team: data.team || '',
    messages: Object.keys(data.messages || {}),
    createdOn: data.createdOn || Date.now(),
    lastMessageAt: data.lastMessageAt || undefined,
    activeMeetingId: data.activeMeetingId || '',
  };
};
