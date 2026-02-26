import { createReducer, on } from '@ngrx/store';
import { TaskActions } from './task.actions';
import { initialTaskState } from './task.state';

export const taskReducer = createReducer(
  initialTaskState,

  // Load Tasks
  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTasksSuccess, (state, { response }) => ({
    ...state,
    tasks: response.data,
    total: response.total,
    pagination: {
      page: response.page,
      pageSize: response.pageSize
    },
    loading: false,
    error: null
  })),
  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Load Task By Id
  on(TaskActions.loadTaskById, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TaskActions.loadTaskByIdSuccess, (state, { task }) => ({
    ...state,
    selectedTask: task,
    loading: false,
    error: null
  })),
  on(TaskActions.loadTaskByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Create Task
  on(TaskActions.createTask, (state) => ({
    ...state,
    actionLoading: true,
    error: null
  })),
  on(TaskActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [task, ...state.tasks],
    total: state.total + 1,
    actionLoading: false,
    error: null
  })),
  on(TaskActions.createTaskFailure, (state, { error }) => ({
    ...state,
    actionLoading: false,
    error
  })),

  // Update Task
  on(TaskActions.updateTask, (state) => ({
    ...state,
    actionLoading: true,
    error: null
  })),
  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => t.id === task.id ? task : t),
    selectedTask: state.selectedTask?.id === task.id ? task : state.selectedTask,
    actionLoading: false,
    error: null
  })),
  on(TaskActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    actionLoading: false,
    error
  })),

  // Delete Task
  on(TaskActions.deleteTask, (state) => ({
    ...state,
    actionLoading: true,
    error: null
  })),
  on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== id),
    total: state.total - 1,
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    actionLoading: false,
    error: null
  })),
  on(TaskActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    actionLoading: false,
    error
  })),

  // Filters
  on(TaskActions.setFilters, (state, { filters }) => ({
    ...state,
    filters,
    pagination: { ...state.pagination, page: 1 } // Reset to first page
  })),
  on(TaskActions.clearFilters, (state) => ({
    ...state,
    filters: {},
    pagination: { ...state.pagination, page: 1 }
  })),

  // Pagination
  on(TaskActions.setPagination, (state, { pagination }) => ({
    ...state,
    pagination
  })),

  // Clear Error
  on(TaskActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
