import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Page404Component } from '../page404/page404.component';
import { UsersComponent } from '../users/users.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { Mode } from '../core/models/mode.model';

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
    component: UserFormComponent,
    data: {
      mode: Mode.Edit,
    },
  },
  { path: '**', component: Page404Component },
];
