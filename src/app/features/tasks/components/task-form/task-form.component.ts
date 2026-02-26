import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {
  Task,
  TaskStatus,
  TaskPriority,
  TASK_STATUS_OPTIONS,
  TASK_PRIORITY_OPTIONS,
  CreateTaskDto,
  UpdateTaskDto
} from '../../models/task.model';

export interface TaskFormData {
  task?: Task;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditMode ? 'Edit Task' : 'Create New Task' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="taskForm" class="task-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input
            matInput
            formControlName="title"
            placeholder="Enter task title">
          <mat-error *ngIf="taskForm.get('title')?.hasError('required')">
            Title is required
          </mat-error>
          <mat-error *ngIf="taskForm.get('title')?.hasError('minlength')">
            Title must be at least 3 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea
            matInput
            formControlName="description"
            placeholder="Enter task description"
            rows="4">
          </textarea>
          <mat-error *ngIf="taskForm.get('description')?.hasError('required')">
            Description is required
          </mat-error>
          <mat-error *ngIf="taskForm.get('description')?.hasError('minlength')">
            Description must be at least 10 characters
          </mat-error>
        </mat-form-field>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option *ngFor="let option of statusOptions" [value]="option.value">
                {{ option.label }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="taskForm.get('status')?.hasError('required')">
              Status is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option *ngFor="let option of priorityOptions" [value]="option.value">
                {{ option.label }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
              Priority is required
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Due Date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="dueDate"
            [min]="minDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="taskForm.get('dueDate')?.hasError('required')">
            Due date is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="taskForm.invalid">
        {{ isEditMode ? 'Update' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 500px;
      max-width: 600px;
      padding: 24px !important;
    }

    .task-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }

    @media (max-width: 600px) {
      mat-dialog-content {
        min-width: 300px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskFormComponent implements OnInit {
  taskForm!: FormGroup;
  isEditMode = false;
  statusOptions = TASK_STATUS_OPTIONS;
  priorityOptions = TASK_PRIORITY_OPTIONS;
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskFormData
  ) {
    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const task = this.data.task;

    this.taskForm = this.fb.group({
      title: [
        task?.title || '',
        [Validators.required, Validators.minLength(3)]
      ],
      description: [
        task?.description || '',
        [Validators.required, Validators.minLength(10)]
      ],
      status: [
        task?.status || TaskStatus.TODO,
        Validators.required
      ],
      priority: [
        task?.priority || TaskPriority.MEDIUM,
        Validators.required
      ],
      dueDate: [
        task?.dueDate || new Date(),
        Validators.required
      ]
    });
  }

  onSave(): void {
    if (this.taskForm.invalid) {
      return;
    }

    const formValue = this.taskForm.value;

    if (this.isEditMode && this.data.task) {
      const updateDto: UpdateTaskDto = {
        id: this.data.task.id,
        ...formValue,
        dueDate: formValue.dueDate.toISOString()
      };
      this.dialogRef.close(updateDto);
    } else {
      const createDto: CreateTaskDto = {
        ...formValue,
        dueDate: formValue.dueDate.toISOString()
      };
      this.dialogRef.close(createDto);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
