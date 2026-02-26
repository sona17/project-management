import { ActionReducerMap } from '@ngrx/store';
import { TaskState } from '../features/tasks/store/task.state';
import { taskReducer } from '../features/tasks/store/task.reducer';

export interface AppState {
  tasks: TaskState;
}

export const appReducers: ActionReducerMap<AppState> = {
  tasks: taskReducer
};
