import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/guards/auth.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard-layout/dashboard-layout.component').then(
        m => m.DashboardLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/dashboard-container/dashboard-container.component').then(
            m => m.DashboardContainerComponent
          )
      },
      {
        path: 'tasks',
        loadChildren: () =>
          import('../tasks/tasks.routes').then(m => m.TASKS_ROUTES)
      }
    ]
  }
];
