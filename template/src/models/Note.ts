export interface Note {
  id: string;
  title: string;
  createdOn: number;
  tags: string[];
  username: string;
  content: string | null;
  label: string;
}
