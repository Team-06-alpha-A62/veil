import { ChannelCategory } from '../enums/ChannelCategory';
import { Participant } from './Participant';

export interface Team {
  id: string;
  name: string;
  owner: string;
  members: Record<string, Participant>;
  channels?: Record<ChannelCategory, Record<string, boolean>>;
  meetings?: string[];
  createdOn: number;
  isPrivate: boolean;
  imageUrl?: string;
}
