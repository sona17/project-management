import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../../models/task.model';
import { TaskActions } from '../../store/task.actions';
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
  selectTasksActionLoading,
  selectPaginationInfo
} from '../../store/task.selectors';
import { TaskFiltersComponent } from '../task-filters/task-filters.component';
import { TaskFormComponent, TaskFormData } from '../task-form/task-form.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
    TaskFiltersComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
    DateFormatPipe
  ],
  template: `
    <div class="task-list-container">
      <div class="header">
        <h1>Tasks</h1>
        <button
          mat-raised-button
          color="primary"
          (click)="openCreateDialog()"
          [disabled]="actionLoading$ | async">
          <mat-icon>add</mat-icon>
          New Task
        </button>
      </div>

      <app-task-filters></app-task-filters>

      <app-error-message
        *ngIf="error$ | async as error"
        [message]="error"
        [type]="'error'"
        [showRetry]="true"
        (retry)="retryLoad()"
        (dismiss)="dismissError()">
      </app-error-message>

      <div class="table-container" *ngIf="!(loading$ | async); else loadingTemplate">
        <table mat-table [dataSource]="(tasks$ | async) || []" class="tasks-table">
          <!-- Title Column -->
          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef>Title</th>
            <td mat-cell *matCellDef="let task">
              <div class="task-title">
                <strong>{{ task.title }}</strong>
                <p class="task-description">{{ task.description }}</p>
              </div>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let task">
              <mat-chip [class]="'status-' + task.status">
                {{ getStatusLabel(task.status) }}
              </mat-chip>
            </td>
          </ng-container>

          <!-- Priority Column -->
          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef>Priority</th>
            <td mat-cell *matCellDef="let task">
              <mat-chip [class]="'priority-' + task.priority">
                {{ getPriorityLabel(task.priority) }}
              </mat-chip>
            </td>
          </ng-container>

          <!-- Due Date Column -->
          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef>Due Date</th>
            <td mat-cell *matCellDef="let task">
              {{ task.dueDate | dateFormat:'short' }}
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let task">
              <button
                mat-icon-button
                color="primary"
                (click)="openEditDialog(task)"
                [disabled]="actionLoading$ | async"
                matTooltip="Edit task">
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                (click)="deleteTask(task)"
                [disabled]="actionLoading$ | async"
                matTooltip="Delete task">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

          <!-- No data row -->
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell no-data" [attr.colspan]="displayedColumns.length">
              <div class="no-data-content">
                <mat-icon>inbox</mat-icon>
                <p>No tasks found. Create your first task!</p>
              </div>
            </td>
          </tr>
        </table>

        <mat-paginator
          [length]="(paginationInfo$ | async)?.total"
          [pageSize]="(paginationInfo$ | async)?.pageSize"
          [pageSizeOptions]="[5, 10, 25, 50]"
          [pageIndex]="((paginationInfo$ | async)?.page || 1) - 1"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </div>

      <ng-template #loadingTemplate>
        <app-loading-spinner [message]="'Loading tasks...'"></app-loading-spinner>
      </ng-template>

      <app-loading-spinner
        *ngIf="actionLoading$ | async"
        [overlay]="true"
        [message]="'Processing...'">
      </app-loading-spinner>
    </div>
  `,
  styles: [`
    .task-list-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 500;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .tasks-table {
      width: 100%;
    }

    .task-title strong {
      display: block;
      margin-bottom: 4px;
    }

    .task-description {
      margin: 0;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 400px;
    }

    mat-chip {
      font-size: 11px;
      min-height: 24px;
      padding: 4px 8px;
    }

    .status-todo {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-in_progress {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-done {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .priority-high {
      background-color: #ffebee;
      color: #d32f2f;
    }

    .priority-medium {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .priority-low {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .no-data {
      text-align: center;
      padding: 48px 24px !important;
    }

    .no-data-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: rgba(0, 0, 0, 0.5);
    }

    .no-data-content mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }

    mat-paginator {
      border-top: 1px solid rgba(0, 0, 0, 0.12);
    }

    @media (max-width: 768px) {
      .task-list-container {
        padding: 16px;
      }

      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header button {
        width: 100%;
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  loading$!: Observable<boolean>;
  actionLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  paginationInfo$!: Observable<{
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;

  displayedColumns: string[] = ['title', 'status', 'priority', 'dueDate', 'actions'];

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.store.select(selectAllTasks);
    this.loading$ = this.store.select(selectTasksLoading);
    this.actionLoading$ = this.store.select(selectTasksActionLoading);
    this.error$ = this.store.select(selectTasksError);
    this.paginationInfo$ = this.store.select(selectPaginationInfo);

    this.store.dispatch(TaskActions.loadTasks());
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done'
    };
    return labels[status] || status;
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      low: 'Low',
      medium: 'Medium',
      high: 'High'
    };
    return labels[priority] || priority;
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { mode: 'create' } as TaskFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(TaskActions.createTask({ task: result }));
      }
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: { task, mode: 'edit' } as TaskFormData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(TaskActions.updateTask({ task: result }));
      }
    });
  }

  deleteTask(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Task',
        message: `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      } as ConfirmationDialogData
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.store.dispatch(TaskActions.deleteTask({ id: task.id }));
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      TaskActions.setPagination({
        pagination: {
          page: event.pageIndex + 1,
          pageSize: event.pageSize
        }
      })
    );
  }

  retryLoad(): void {
    this.store.dispatch(TaskActions.loadTasks());
  }

  dismissError(): void {
    this.store.dispatch(TaskActions.clearError());
  }
}
