import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type MessageType = 'error' | 'warning' | 'info' | 'success';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="message-container" [class]="'message-' + type" *ngIf="message">
      <div class="message-content">
        <mat-icon class="message-icon">{{ getIcon() }}</mat-icon>
        <div class="message-text">
          <strong *ngIf="title">{{ title }}</strong>
          <p>{{ message }}</p>
        </div>
      </div>
      <div class="message-actions">
        <button
          *ngIf="showRetry"
          mat-button
          (click)="onRetry()">
          Retry
        </button>
        <button
          *ngIf="dismissible"
          mat-icon-button
          (click)="onDismiss()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .message-container {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 16px;
      border-radius: 4px;
      margin: 16px 0;
      border-left: 4px solid;
    }

    .message-content {
      display: flex;
      align-items: flex-start;
      flex: 1;
    }

    .message-icon {
      margin-right: 12px;
      flex-shrink: 0;
    }

    .message-text {
      flex: 1;
    }

    .message-text strong {
      display: block;
      margin-bottom: 4px;
    }

    .message-text p {
      margin: 0;
      font-size: 14px;
    }

    .message-actions {
      display: flex;
      align-items: center;
      margin-left: 16px;
    }

    .message-error {
      background-color: #ffebee;
      border-left-color: #f44336;
      color: #c62828;
    }

    .message-warning {
      background-color: #fff3e0;
      border-left-color: #ff9800;
      color: #e65100;
    }

    .message-info {
      background-color: #e3f2fd;
      border-left-color: #2196f3;
      color: #1565c0;
    }

    .message-success {
      background-color: #e8f5e9;
      border-left-color: #4caf50;
      color: #2e7d32;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() message = '';
  @Input() title = '';
  @Input() type: MessageType = 'error';
  @Input() showRetry = false;
  @Input() dismissible = true;

  @Output() retry = new EventEmitter<void>();
  @Output() dismiss = new EventEmitter<void>();

  getIcon(): string {
    const icons: Record<MessageType, string> = {
      error: 'error',
      warning: 'warning',
      info: 'info',
      success: 'check_circle'
    };
    return icons[this.type];
  }

  onRetry(): void {
    this.retry.emit();
  }

  onDismiss(): void {
    this.dismiss.emit();
  }
}
