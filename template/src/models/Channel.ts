import { ChannelType } from '../enums/ChannelType';
import { Message } from './Message.ts';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  isPrivate: boolean;
  owner: string;
  participants: string[];
  team?: string;
  messages: Record<string, Message>;
  createdOn: number;
  lastMessageAt?: number;
  activeMeetingId?: string;
}
