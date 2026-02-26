import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  map,
  catchError,
  exhaustMap,
  tap,
  withLatestFrom,
  debounceTime,
  switchMap
} from 'rxjs/operators';
import { TaskActions } from './task.actions';
import { TaskApiService } from '../services/task-api.service';
import { selectTaskFilters, selectTaskPagination } from './task.selectors';

@Injectable()
export class TaskEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private taskApiService = inject(TaskApiService);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks, TaskActions.setFilters, TaskActions.setPagination),
      debounceTime(300), // Debounce for filter changes
      withLatestFrom(
        this.store.select(selectTaskFilters),
        this.store.select(selectTaskPagination)
      ),
      switchMap(([, filters, pagination]) =>
        this.taskApiService.getTasks(filters, pagination).pipe(
          map(response => TaskActions.loadTasksSuccess({ response })),
          catchError(error =>
            of(TaskActions.loadTasksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadTaskById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTaskById),
      exhaustMap(({ id }) =>
        this.taskApiService.getTaskById(id).pipe(
          map(task => TaskActions.loadTaskByIdSuccess({ task })),
          catchError(error =>
            of(TaskActions.loadTaskByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      exhaustMap(({ task }) =>
        this.taskApiService.createTask(task).pipe(
          map(createdTask => TaskActions.createTaskSuccess({ task: createdTask })),
          catchError(error =>
            of(TaskActions.createTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      exhaustMap(({ task }) =>
        this.taskApiService.updateTask(task.id, task).pipe(
          map(updatedTask => TaskActions.updateTaskSuccess({ task: updatedTask })),
          catchError(error =>
            of(TaskActions.updateTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      exhaustMap(({ id }) =>
        this.taskApiService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError(error =>
            of(TaskActions.deleteTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
