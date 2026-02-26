import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="spinner-container" [class.overlay]="overlay">
      <mat-spinner
        [diameter]="size"
        [color]="color">
      </mat-spinner>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .spinner-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.8);
      z-index: 9999;
    }

    .spinner-message {
      margin-top: 16px;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size = 50;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() message = '';
  @Input() overlay = false;
}
