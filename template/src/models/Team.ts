import { ChannelCategory } from '../enums/ChannelCategory';
import { TeamMember } from './Participant';

export interface Team {
  id: string;
  name: string;
  owner: string;
  members: Record<string, TeamMember>;
  channels: Record<string, ChannelCategory>;
  meetings: string[];
  createdOn: number;
  isPrivate: boolean;
  imageUrl?: string;
}
