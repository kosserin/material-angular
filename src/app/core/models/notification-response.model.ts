import { EntityType } from './entity-type.model';
import { TransmissionType } from './transmission-type.model';

export interface NotificationResponse {
  entityType: EntityType;
  objectId: string;
  payload: string;
  receivedTime: number;
  sendTime: number;
  transmissionType: TransmissionType;
  frontendReceivedTime: null;
}

export interface NotificationRequest {
  entityType: EntityType;
  objectId: string;
  payload: string;
  receivedTime: number;
  sendTime: number;
  transmissionType: TransmissionType;
  frontendReceivedTime: number;
}
