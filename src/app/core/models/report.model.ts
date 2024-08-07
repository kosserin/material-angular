export interface Report {
  id: number;
  entityType: ReportEntityType;
  transmissionType: 'HTTP' | 'KAFKA';
  sendTime: number;
  receivedTime: number;
  objectId: string;
  payload: any;
}

export enum ReportEntityType {
  User = 'USER',
  Project = 'PROJECT',
  Management = 'MANAGEMENT',
  AnnualLeave = 'ANNUAL_LEAVE',
  ProjectWork = 'PROJECT_WORK',
}
