import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { Observable } from 'rxjs';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #sidenav
        mode="side"
        opened
        class="sidenav">
        <div class="sidenav-header">
          <mat-icon>dashboard</mat-icon>
          <h2>Smart Admin</h2>
        </div>

        <mat-nav-list>
          <a
            mat-list-item
            *ngFor="let item of navItems"
            [routerLink]="item.route"
            routerLinkActive="active-link">
            <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
            <span matListItemTitle>{{ item.label }}</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button
            mat-icon-button
            (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>

          <span class="spacer"></span>

          <button
            mat-icon-button
            [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>

          <mat-menu #userMenu="matMenu">
            <div class="user-info">
              <p class="user-name">{{ (currentUser$ | async)?.name }}</p>
              <p class="user-email">{{ (currentUser$ | async)?.email }}</p>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        </mat-toolbar>

        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 250px;
      background-color: #fafafa;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .sidenav-header mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .sidenav-header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    mat-nav-list {
      padding-top: 16px;
    }

    a[mat-list-item] {
      margin: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    a[mat-list-item]:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .active-link {
      background-color: rgba(103, 126, 234, 0.1);
      color: #667eea;
    }

    .active-link mat-icon {
      color: #667eea;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .user-info {
      padding: 16px;
      min-width: 200px;
    }

    .user-name {
      margin: 0 0 4px;
      font-weight: 500;
      font-size: 14px;
    }

    .user-email {
      margin: 0;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.6);
    }

    mat-divider {
      margin: 8px 0;
    }

    @media (max-width: 768px) {
      .sidenav {
        width: 200px;
      }
    }
  `]
})
export class DashboardLayoutComponent {
  currentUser$: Observable<User | null>;

  navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Tasks', route: '/dashboard/tasks', icon: 'assignment' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
