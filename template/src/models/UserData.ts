import { UserStatus } from '../enums/UserStatus';
import { UserRole } from '../enums/UserRole';
import { FriendType } from '../enums/FriendType';

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
  channels: string[];
  friends: Record<string, FriendType>;
  userSince: number;
  notes: string[];
  activeDyteMeetingId?: string;
  dyteParticipantId?: string;
}
