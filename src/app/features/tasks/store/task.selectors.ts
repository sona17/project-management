import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './task.state';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

export const selectSelectedTask = createSelector(
  selectTaskState,
  (state: TaskState) => state.selectedTask
);

export const selectTasksLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.loading
);

export const selectTasksActionLoading = createSelector(
  selectTaskState,
  (state: TaskState) => state.actionLoading
);

export const selectTasksError = createSelector(
  selectTaskState,
  (state: TaskState) => state.error
);

export const selectTaskFilters = createSelector(
  selectTaskState,
  (state: TaskState) => state.filters
);

export const selectTaskPagination = createSelector(
  selectTaskState,
  (state: TaskState) => state.pagination
);

export const selectTaskTotal = createSelector(
  selectTaskState,
  (state: TaskState) => state.total
);

export const selectTaskById = (id: string) =>
  createSelector(selectAllTasks, (tasks) =>
    tasks.find(task => task.id === id)
  );

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectTaskFilters,
  (tasks, filters) => {
    let filtered = [...tasks];

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  }
);

export const selectPaginationInfo = createSelector(
  selectTaskTotal,
  selectTaskPagination,
  (total, pagination) => ({
    total,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: Math.ceil(total / pagination.pageSize)
  })
);
