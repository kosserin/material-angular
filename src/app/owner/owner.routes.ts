import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Page404Component } from '../page404/page404.component';
import { UsersComponent } from '../users/users.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { Mode } from '../core/models/mode.model';
import { UserResolver } from '../core/resolvers/user.resolver';
import { ManagementComponent } from '../management/management.component';

export const OWNER_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
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
    path: 'users/edit/:username',
    resolve: { user: UserResolver },
    component: UserFormComponent,
    data: {
      mode: Mode.Edit,
    },
  },
  {
    path: 'management',
    component: ManagementComponent,
  },
  { path: '**', component: Page404Component },
];
