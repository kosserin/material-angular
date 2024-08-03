import { ProjectAndManagementUserResponse } from './project.model';

export interface AnnualLeaveRequest {
  employeeUsername: string;
  start: string;
  end: string;
}

export interface AnnualLeaveByUsernameResponse {
  id: 1;
  start: string;
  end: string;
  verified: boolean;
  employee: ProjectAndManagementUserResponse;
}
