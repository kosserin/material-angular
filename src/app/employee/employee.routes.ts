import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Page404Component } from '../page404/page404.component';
import { UsersComponent } from '../users/users.component';
import { ProjectsComponent } from '../projects/projects.component';
export const EMPLOYEE_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  { path: '**', component: Page404Component },
];
