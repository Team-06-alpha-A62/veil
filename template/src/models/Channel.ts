import { ChannelType } from '../enums/ChannelType';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  isPrivate: boolean;
  owner: string;
  participants: string[];
  team?: string;
  messages: string[];
  createdOn: number;
  lastMessageAt?: number;
  activeMeetingId?: string;
}
