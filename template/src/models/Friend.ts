import { FriendType } from '../enums/FriendType';
import { UserStatus } from '../enums/UserStatus';

export interface Friend {
  id: string;
  username: string;
  avatarUrl: string;
  friendshipStatus: FriendType;
  status: UserStatus;
}
