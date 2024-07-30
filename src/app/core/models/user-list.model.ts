import { Role } from './role';
import { UserTitle } from './user-title.model';

export interface UserItem {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  city: City;
  title: UserTitle;
  roleList: Role[];
}

export interface City {
  postalcode: number;
  name: string;
}
