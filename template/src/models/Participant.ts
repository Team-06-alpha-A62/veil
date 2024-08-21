import { UserRole } from '../enums/UserRole';

export interface Participant {
  userId: string;
  role: UserRole;
  activce: boolean;
  lastSeenMessage: string;
}
