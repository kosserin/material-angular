import { EntityType } from "./entity-type.model";
import { TransmissionType } from "./transmission-type.model";

export interface Report {
  id: number;
  entityType: EntityType;
  transmissionType: TransmissionType;
  sendTime: number;
  receivedTime: number;
  objectId: string;
  payload: any;
}
