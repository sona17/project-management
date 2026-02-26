import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { RecentTasksComponent } from '../recent-tasks/recent-tasks.component';
import { TaskActions } from '../../../tasks/store/task.actions';
import { selectAllTasks, selectTasksLoading } from '../../../tasks/store/task.selectors';
import { Task, TaskStatus } from '../../../tasks/models/task.model';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

interface DashboardStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    StatsCardComponent,
    RecentTasksComponent,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Welcome back, {{ currentUser?.name }}!</h1>
        <p>Here's what's happening with your tasks today.</p>
      </div>

      <app-loading-spinner *ngIf="loading$ | async" [message]="'Loading dashboard...'">
      </app-loading-spinner>

      <div class="stats-grid" *ngIf="!(loading$ | async)">
        <app-stats-card
          title="Total Tasks"
          [value]="(stats$ | async)?.total || 0"
          subtitle="All tasks"
          icon="assignment"
          color="primary">
        </app-stats-card>

        <app-stats-card
          title="Completed"
          [value]="(stats$ | async)?.completed || 0"
          subtitle="Tasks completed"
          icon="check_circle"
          color="success">
        </app-stats-card>

        <app-stats-card
          title="In Progress"
          [value]="(stats$ | async)?.inProgress || 0"
          subtitle="Currently working on"
          icon="pending"
          color="warning">
        </app-stats-card>

        <app-stats-card
          title="To Do"
          [value]="(stats$ | async)?.todo || 0"
          subtitle="Tasks pending"
          icon="playlist_add_check"
          color="info">
        </app-stats-card>
      </div>

      <div class="recent-tasks-section" *ngIf="!(loading$ | async)">
        <app-recent-tasks></app-recent-tasks>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 32px;
    }

    .welcome-section h1 {
      margin: 0;
      font-size: 32px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }

    .welcome-section p {
      margin: 8px 0 0;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .recent-tasks-section {
      margin-top: 32px;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .welcome-section h1 {
        font-size: 24px;
      }
    }
  `]
})
export class DashboardContainerComponent implements OnInit {
  currentUser$!: Observable<User | null>;
  currentUser: User | null = null;
  loading$!: Observable<boolean>;
  stats$!: Observable<DashboardStats>;

  constructor(
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Load tasks
    this.store.dispatch(TaskActions.loadTasks());

    // Get current user
    this.currentUser$ = this.authService.currentUser$;
    this.currentUser$.subscribe(user => this.currentUser = user);

    // Get loading state
    this.loading$ = this.store.select(selectTasksLoading);

    // Calculate stats
    this.stats$ = this.store.select(selectAllTasks).pipe(
      map(tasks => this.calculateStats(tasks))
    );
  }

  private calculateStats(tasks: Task[]): DashboardStats {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === TaskStatus.DONE).length,
      inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
      todo: tasks.filter(t => t.status === TaskStatus.TODO).length
    };
  }
}
