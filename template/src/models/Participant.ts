import { UserRole } from '../enums/UserRole';

export interface Participant {
  avatarUrl: string;
  username: string;
  role: UserRole;
  active?: boolean;
}
