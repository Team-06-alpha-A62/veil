export interface Meeting {
  id: string;
  title: string;
  label: string;
  description?: string;
  organizer: string;
  startTime: number;
  endTime: number;
  meetingChannel: string;
  participants: Record<string, string>;
}
