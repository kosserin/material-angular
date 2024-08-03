export interface Report {
  id: number;
  entityType: 'USER' | 'PROJECT' | 'MANAGEMENT' | 'ANNUAL_LEAVE';
  transmissionType: 'HTTP' | 'Kafka';
  sendTime: number;
  receivedTime: number;
  objectId: string;
  payload: any;
}
