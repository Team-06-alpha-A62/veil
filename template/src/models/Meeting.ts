export interface Meeting {
  id: string;
  title: string;
  label: string;
  description?: string;
  organizer: string;
  startTime: number;
  endTime: number;
  channelId: string;
  participants: Record<string, string>;
  attending?: Record<string, boolean>;
  dyteMeetingId?: string; // Dyte meeting room ID
  dyteAuthToken?: string; // Token for user to join the Dyte meeting
  meetingLink?: string; // Link or URL to start/join the meeting
}
