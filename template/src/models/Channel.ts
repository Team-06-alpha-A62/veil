import { ChannelCategory } from '../enums/ChannelCategory.ts';
import { ChannelType } from '../enums/ChannelType';
import { Message } from './Message.ts';
import { TeamMember as Participant } from './Participant.ts';

export interface Channel {
  id: string;
  name: string | null;
  imageUrl?: string;
  type: ChannelType;
  isPrivate: boolean;
  owner: string;
  participants: Record<string, Participant>;
  teamId?: string;
  messages: Record<string, Message>;
  createdOn: number;
  lastMessageAt?: number;
  activeMeetingId?: string;
  category?: ChannelCategory;
}
