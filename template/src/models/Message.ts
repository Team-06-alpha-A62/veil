export interface Message {
  id: string;
  sender: string;
  channelId: string;
  content: string;
  sentAt: number;
  media?: string;
  reactions: Record<string, string>;
  editedAt: number;
}
