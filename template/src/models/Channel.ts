import { ChannelType } from '../enums/ChannelType';
import { Message } from './Message';
import { Participant } from './Participant';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  owner: string;
  participants: Record<string, Participant>;
  team?: string;
  messages: Record<string, Message>;
  createdOn: number;
  lastMessageAt?: number;
  activeMeetingId?: string;
}
