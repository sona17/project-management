import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>
      <mat-icon [class]="'icon-' + data.type">{{ getIcon() }}</mat-icon>
      {{ data.title }}
    </h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ data.cancelText || 'Cancel' }}
      </button>
      <button
        mat-raised-button
        [color]="data.type === 'danger' ? 'warn' : 'primary'"
        (click)="onConfirm()">
        {{ data.confirmText || 'Confirm' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .icon-warning {
      color: #ff9800;
    }

    .icon-danger {
      color: #f44336;
    }

    .icon-info {
      color: #2196f3;
    }

    mat-dialog-content {
      min-width: 300px;
    }

    mat-dialog-content p {
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.7);
    }

    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {
    this.data.type = this.data.type || 'info';
  }

  getIcon(): string {
    const icons = {
      warning: 'warning',
      danger: 'error',
      info: 'help_outline'
    };
    return icons[this.data.type!];
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
