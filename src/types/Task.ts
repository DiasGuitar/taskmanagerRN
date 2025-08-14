export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;               // uuid
  title: string;
  description?: string;
  datetime: number;         // epoch ms
  location?: string;        // manual address input
  status: TaskStatus;
  createdAt: number;        // for sort by date added
  updatedAt: number;
}