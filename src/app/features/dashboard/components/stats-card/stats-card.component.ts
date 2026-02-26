import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stats-card" [class]="'color-' + color">
      <div class="stats-content">
        <div class="stats-info">
          <p class="stats-title">{{ title }}</p>
          <h2 class="stats-value">{{ value }}</h2>
          <p class="stats-subtitle" *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        <div class="stats-icon">
          <mat-icon>{{ icon }}</mat-icon>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .stats-card {
      height: 100%;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }

    .stats-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }

    .stats-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
    }

    .stats-info {
      flex: 1;
    }

    .stats-title {
      margin: 0;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.6);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stats-value {
      margin: 8px 0;
      font-size: 32px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.87);
    }

    .stats-subtitle {
      margin: 0;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.5);
    }

    .stats-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.9);
    }

    .stats-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .color-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .color-primary .stats-title,
    .color-primary .stats-value,
    .color-primary .stats-subtitle {
      color: white;
    }

    .color-primary .stats-icon mat-icon {
      color: #667eea;
    }

    .color-success {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
    }

    .color-success .stats-title,
    .color-success .stats-value,
    .color-success .stats-subtitle {
      color: white;
    }

    .color-success .stats-icon mat-icon {
      color: #f5576c;
    }

    .color-warning {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
    }

    .color-warning .stats-title,
    .color-warning .stats-value,
    .color-warning .stats-subtitle {
      color: white;
    }

    .color-warning .stats-icon mat-icon {
      color: #4facfe;
    }

    .color-info {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      color: white;
    }

    .color-info .stats-title,
    .color-info .stats-value,
    .color-info .stats-subtitle {
      color: white;
    }

    .color-info .stats-icon mat-icon {
      color: #43e97b;
    }
  `]
})
export class StatsCardComponent {
  @Input() title = '';
  @Input() value: string | number = 0;
  @Input() subtitle = '';
  @Input() icon = 'analytics';
  @Input() color: 'primary' | 'success' | 'warning' | 'info' = 'primary';
}
