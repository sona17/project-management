import { Task, TaskFilters } from '../models/task.model';
import { PaginationParams } from '../../../core/models/api-response.model';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  filters: TaskFilters;
  pagination: PaginationParams;
  total: number;
  loading: boolean;
  error: string | null;
  actionLoading: boolean; // For create/update/delete operations
}

export const initialTaskState: TaskState = {
  tasks: [],
  selectedTask: null,
  filters: {},
  pagination: {
    page: 1,
    pageSize: 10
  },
  total: 0,
  loading: false,
  error: null,
  actionLoading: false
};
