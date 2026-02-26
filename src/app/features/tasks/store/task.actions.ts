import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task, CreateTaskDto, UpdateTaskDto, TaskFilters } from '../models/task.model';
import { PaginationParams, PaginatedResponse } from '../../../core/models/api-response.model';

export const TaskActions = createActionGroup({
  source: 'Task',
  events: {
    'Load Tasks': emptyProps(),
    'Load Tasks Success': props<{ response: PaginatedResponse<Task> }>(),
    'Load Tasks Failure': props<{ error: string }>(),

    'Load Task By Id': props<{ id: string }>(),
    'Load Task By Id Success': props<{ task: Task }>(),
    'Load Task By Id Failure': props<{ error: string }>(),

    'Create Task': props<{ task: CreateTaskDto }>(),
    'Create Task Success': props<{ task: Task }>(),
    'Create Task Failure': props<{ error: string }>(),

    'Update Task': props<{ task: UpdateTaskDto }>(),
    'Update Task Success': props<{ task: Task }>(),
    'Update Task Failure': props<{ error: string }>(),

    'Delete Task': props<{ id: string }>(),
    'Delete Task Success': props<{ id: string }>(),
    'Delete Task Failure': props<{ error: string }>(),

    'Set Filters': props<{ filters: TaskFilters }>(),
    'Clear Filters': emptyProps(),

    'Set Pagination': props<{ pagination: PaginationParams }>(),

    'Clear Error': emptyProps()
  }
});
