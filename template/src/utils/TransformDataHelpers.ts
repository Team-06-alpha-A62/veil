import { ChannelType } from '../enums/ChannelType';
import { FriendType } from '../enums/FriendType';
import { NotificationMessageType } from '../enums/NotificationMessageType.ts';
import { NotificationType } from '../enums/NotificationType.ts';
import { UserRole } from '../enums/UserRole';
import { UserStatus } from '../enums/UserStatus';
import { Channel } from '../models/Channel';
import { Friend } from '../models/Friend';
import { Message } from '../models/Message';
import { Note } from '../models/Note.ts';
import { Notification } from '../models/Notification.ts';
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
    membersObject[member] = transformTeamMemberData(
      userData,
      data?.members![member].role
    );
  }

  const teamImageUrl = getTeamImage(data as Team);

  return {
    id: data.id || '',
    name: data.name || 'Untitled Team',
    owner: data.owner || '',
    members: membersObject,
    channels: data.channels || undefined,
    meetings: data.meetings || [],
    createdOn: data.createdOn || Date.now(),
    isPrivate: data.isPrivate || false,
    imageUrl: teamImageUrl,
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

export const transformNotificationData = (
  data: Partial<Notification>
): Notification => {
  return {
    id: data.id || '',
    type: data.type || NotificationType.FRIEND,
    message: data.message || '',
    createdAt: data.createdAt || Date.now(),
    sender: data.sender || 'Unknown',
    receiver: data.receiver || 'Unknown',
    messageType: data.messageType || NotificationMessageType.ALERT_INFO,
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
        role: user.channels[data.id!],
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
    meetingParticipants: data.meetingParticipants || 0,
  };
};

export const transformTeamMemberData = (
  userData: Partial<UserData>,
  role: string
): Participant => {
  let userRole: UserRole;

  switch (role) {
    case 'member':
      userRole = UserRole.MEMBER;
      break;
    case 'moderator':
      userRole = UserRole.MODERATOR;
      break;
    case 'owner':
      userRole = UserRole.OWNER;
      break;
    default:
      throw new Error(`Invalid role: ${role}`);
  }

  return {
    avatarUrl: userData.avatarUrl || '',
    username: userData.username || 'Unknown Username',
    role: userRole,
    active: role === UserRole.OWNER,
  };
};

export const transformNoteData = (
  data: Partial<Note> & { tags?: Record<string, boolean> }
): Note => {
  return {
    title: data.title || '',
    username: data.username || 'Unknown Username',
    id: data.id || '',
    createdOn: data.createdOn || 0,
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
    return (
      otherParticipant?.avatarUrl ||
      otherParticipant!.username[0].toLocaleUpperCase()
    );
  }
  return null;
};

export const getTeamImage = (team: Team): string => {
  const DEFAULT_TEAM_IMAGE_URL =
    'https://firebasestorage.googleapis.com/v0/b/veil-35640.appspot.com/o/images%2Fdefault.png?alt=media&token=04df62b9-eb09-4aef-bfc6-2a4088d467cd';
  return team.imageUrl || DEFAULT_TEAM_IMAGE_URL;
};
