import { Role } from './role';
import { UserTitle } from './user-title.model';

export interface UserItem {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  city: {
    postalcode: number;
    name: string;
  };
  title: UserTitle;
  roleList: Role[];
}
