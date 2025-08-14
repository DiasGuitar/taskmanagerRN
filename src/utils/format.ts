import { format } from 'date-fns';

export function fmtDateTime(ms: number) {
  try {
    return format(ms, 'PPpp'); // e.g., Jan 12, 2025 at 7:30 PM
  } catch {
    return '';
  }
}

export const statusLabel: Record<string, string> = {
  'todo': 'To Do',
  'in_progress': 'In Progress',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
};
