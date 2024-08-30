import { ChannelType } from '../enums/ChannelType';
import { Message } from './Message.ts';
import { Participant } from './Participant.ts';

export interface Channel {
  id: string;
  name: string | null;
  type: ChannelType;
  isPrivate: boolean;
  owner: string;
  participants: Record<string, Participant>;
  team?: string;
  messages: Record<string, Message>;
  createdOn: number;
  lastMessageAt?: number;
  activeMeetingId?: string;
}
