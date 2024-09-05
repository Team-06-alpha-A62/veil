import { Participant } from './Participant';

export interface Team {
  id: string;
  name: string;
  owner: string;
  members: Record<string, Participant>;
  channels: string[];
  meetings: string[];
  createdOn: number;
  isPrivate: boolean;
  imageUrl?: string;
}
