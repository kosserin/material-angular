import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Page404Component } from '../page404/page404.component';
import { UsersComponent } from '../users/users.component';
import { UserFormComponent } from '../user-form/user-form.component';
import { Mode } from '../core/models/mode.model';
import { UserResolver } from '../core/resolvers/user.resolver';
import { ManagementComponent } from '../management/management.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { ProjectResolver } from '../core/resolvers/project.resolver';

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
    path: 'users/:username/edit',
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
  {
    path: 'projects',
    component: ProjectsComponent,
  },
  {
    path: 'projects/create',
    component: ProjectFormComponent,
    data: {
      mode: Mode.Insert,
    },
  },
  {
    path: 'projects/:projectId/edit',
    component: ProjectFormComponent,
    resolve: { project: ProjectResolver },
    data: {
      mode: Mode.Edit,
    },
  },
  { path: '**', component: Page404Component },
];
