import { UserStatus } from '../enums/UserStatus';
import { UserTeamRole } from '../enums/UserTeamRole';
import { FriendType } from '../enums/FriendType';

export interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  photoAvatarUrl?: string;
  status: UserStatus;
  teams: Record<string, UserTeamRole>;
  channels: Record<string, boolean>;
  friends: Record<string, FriendType>;
  userSince: number;
  notes: Record<string, boolean>;
  activeDyteMeetingId?: string;
  dyteParticipantId?: string;
}
