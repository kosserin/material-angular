import { ProjectAndManagementUserResponse } from './project.model';

export interface AnnualLeaveRequest {
  start: string;
  end: string;
}

export interface AnnualLeaveResponse {
  id: 1;
  start: string;
  end: string;
  verified: boolean;
  employee: ProjectAndManagementUserResponse;
}
