import { UserStatus } from '../enums/UserStatus';
import { UserRole } from '../enums/UserRole';

export interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  status: UserStatus;
  teams: Record<string, UserRole>;
  channels: Record<string, UserRole>;
  friends: string[];
  pendingFriends: string[];
  userSince: number;
  notes: string[];
  activeDyteMeetingId?: string;
  dyteParticipantId?: string;
  lastSeenMessages?: Record<
    string,
    { messageId: string; messagesAfterThat: number }
  >;
  lockedThemes: string[];
}
