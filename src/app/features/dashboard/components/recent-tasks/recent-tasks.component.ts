import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../../../tasks/models/task.model';
import { selectAllTasks } from '../../../tasks/store/task.selectors';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-recent-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    DateFormatPipe
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Recent Tasks</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list *ngIf="(recentTasks$ | async)?.length; else noTasks">
          <mat-list-item *ngFor="let task of recentTasks$ | async">
            <mat-icon matListItemIcon [class]="'priority-' + task.priority">
              {{ getPriorityIcon(task.priority) }}
            </mat-icon>
            <div matListItemTitle>{{ task.title }}</div>
            <div matListItemLine>
              <mat-chip [class]="'status-' + task.status">
                {{ getStatusLabel(task.status) }}
              </mat-chip>
              <span class="task-date">{{ task.createdAt | dateFormat:'relative' }}</span>
            </div>
          </mat-list-item>
        </mat-list>
        <ng-template #noTasks>
          <p class="no-tasks">No tasks yet. Create your first task!</p>
        </ng-template>
      </mat-card-content>
      <mat-card-actions>
        <button mat-button color="primary" (click)="navigateToTasks()">
          View All Tasks
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    mat-card-header {
      margin-bottom: 16px;
    }

    mat-list {
      padding: 0;
    }

    mat-list-item {
      height: auto;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }

    mat-list-item:last-child {
      border-bottom: none;
    }

    mat-icon[matListItemIcon] {
      margin-right: 16px;
    }

    .priority-high {
      color: #f44336;
    }

    .priority-medium {
      color: #ff9800;
    }

    .priority-low {
      color: #4caf50;
    }

    mat-chip {
      font-size: 11px;
      min-height: 24px;
      padding: 4px 8px;
      margin-right: 8px;
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

    .task-date {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
    }

    .no-tasks {
      padding: 32px;
      text-align: center;
      color: rgba(0, 0, 0, 0.5);
    }

    mat-card-actions {
      padding: 16px;
      display: flex;
      justify-content: center;
    }
  `]
})
export class RecentTasksComponent implements OnInit {
  recentTasks$!: Observable<Task[]>;

  constructor(
    private store: Store,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recentTasks$ = this.store.select(selectAllTasks).pipe(
      map(tasks => tasks.slice(0, 5))
    );
  }

  getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      high: 'priority_high',
      medium: 'drag_handle',
      low: 'low_priority'
    };
    return icons[priority] || 'drag_handle';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      todo: 'To Do',
      in_progress: 'In Progress',
      done: 'Done'
    };
    return labels[status] || status;
  }

  navigateToTasks(): void {
    this.router.navigate(['/dashboard/tasks']);
  }
}
