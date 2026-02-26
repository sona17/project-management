import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TaskActions } from '../../store/task.actions';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS, TaskFilters } from '../../models/task.model';
import { selectTaskFilters } from '../../store/task.selectors';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="filters-container">
      <form [formGroup]="filtersForm" class="filters-form">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Search</mat-label>
          <input
            matInput
            formControlName="search"
            placeholder="Search tasks...">
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option [value]="null">All</mat-option>
            <mat-option *ngFor="let option of statusOptions" [value]="option.value">
              {{ option.label }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority">
            <mat-option [value]="null">All</mat-option>
            <mat-option *ngFor="let option of priorityOptions" [value]="option.value">
              {{ option.label }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <button
          mat-raised-button
          type="button"
          (click)="clearFilters()"
          class="clear-button">
          <mat-icon>clear</mat-icon>
          Clear
        </button>
      </form>
    </div>
  `,
  styles: [`
    .filters-container {
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 24px;
    }

    .filters-form {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr auto;
      gap: 16px;
      align-items: center;
    }

    .filter-field {
      width: 100%;
    }

    .clear-button {
      height: 56px;
    }

    @media (max-width: 968px) {
      .filters-form {
        grid-template-columns: 1fr 1fr;
      }

      .filter-field:first-child {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 600px) {
      .filters-form {
        grid-template-columns: 1fr;
      }

      .filter-field:first-child {
        grid-column: 1;
      }

      .clear-button {
        width: 100%;
      }
    }
  `]
})
export class TaskFiltersComponent implements OnInit {
  filtersForm!: FormGroup;
  statusOptions = TASK_STATUS_OPTIONS;
  priorityOptions = TASK_PRIORITY_OPTIONS;

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormChanges();
    this.loadCurrentFilters();
  }

  private initializeForm(): void {
    this.filtersForm = this.fb.group({
      search: [''],
      status: [null],
      priority: [null]
    });
  }

  private subscribeToFormChanges(): void {
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe(values => {
        const filters: TaskFilters = {};

        if (values.search) {
          filters.search = values.search;
        }
        if (values.status) {
          filters.status = values.status;
        }
        if (values.priority) {
          filters.priority = values.priority;
        }

        this.store.dispatch(TaskActions.setFilters({ filters }));
      });
  }

  private loadCurrentFilters(): void {
    this.store.select(selectTaskFilters).subscribe(filters => {
      this.filtersForm.patchValue(
        {
          search: filters.search || '',
          status: filters.status || null,
          priority: filters.priority || null
        },
        { emitEvent: false }
      );
    });
  }

  clearFilters(): void {
    this.filtersForm.reset({
      search: '',
      status: null,
      priority: null
    });
    this.store.dispatch(TaskActions.clearFilters());
  }
}
