import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Page404Component } from '../page404/page404.component';
import { UsersComponent } from '../users/users.component';
import { ManagementComponent } from '../management/management.component';
import { Mode } from '../core/models/mode.model';
import { UserResolver } from '../core/resolvers/user.resolver';
import { UserFormComponent } from '../user-form/user-form.component';
export const MANAGER_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'management',
    component: ManagementComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/create',
    component: UserFormComponent,
    data: {
      mode: Mode.Insert,
    },
  },
  {
    path: 'users/:username/edit',
    resolve: { user: UserResolver },
    component: UserFormComponent,
    data: {
      mode: Mode.Edit,
    },
  },
  { path: '**', component: Page404Component },
];
