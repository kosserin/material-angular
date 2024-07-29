import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { Role } from './core/models/role';
import { AppComponent } from './app.component';
import { Page404Component } from './page404/page404.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      {
        path: 'owner',
        canActivate: [AuthGuard],
        data: {
          role: Role.Owner,
        },
        loadChildren: () =>
          import('./owner/owner.routes').then((m) => m.OWNER_ROUTE),
      },
      {
        path: 'manager',
        canActivate: [AuthGuard],
        data: {
          role: Role.Manager,
        },
        loadChildren: () =>
          import('./manager/manager.routes').then((m) => m.MANAGER_ROUTE),
      },
      {
        path: 'employee',
        canActivate: [AuthGuard],
        data: {
          role: Role.Employee,
        },
        loadChildren: () =>
          import('./employee/employee.routes').then((m) => m.EMPLOYEE_ROUTE),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: '**', component: Page404Component },
];
