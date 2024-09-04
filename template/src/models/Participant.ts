import { UserRole } from '../enums/UserRole';

export interface TeamMember {
  avatarUrl: string;
  username: string;
  role: UserRole;
  active: boolean;
}
