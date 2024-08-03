import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Page404Component } from '../page404/page404.component';
import { AnnualLeaveComponent } from '../annual-leave/annual-leave.component';
export const EMPLOYEE_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'annual-leave',
    component: AnnualLeaveComponent,
  },
  { path: '**', component: Page404Component },
];
