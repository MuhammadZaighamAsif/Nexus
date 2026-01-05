export interface Meeting {
  id: string;
  title: string;
  start: string;
  end: string;
  participants: string[];
  type: 'meeting';
}

export const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Meeting with TechCorp Investors',
    start: '2026-01-15T14:00:00',
    end: '2026-01-15T15:00:00',
    participants: ['John Doe', 'Jane Smith'],
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Product Demo Session',
    start: '2026-01-20T10:00:00',
    end: '2026-01-20T11:30:00',
    participants: ['Alice Johnson'],
    type: 'meeting'
  }
];