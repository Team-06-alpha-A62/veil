import { UserRole } from '../enums/UserRole';

export interface Team {
  id: string;
  name: string;
  owner: string;
  members: Record<string, UserRole>;
  channels: string[];
  meetings: string[];
  createdOn: number;
}
