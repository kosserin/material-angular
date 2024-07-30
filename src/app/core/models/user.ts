import { Role } from './role';

export interface User {
  firstname: string;
  lastname: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  authorities: { authority: Role }[];
  token: string;
  username: string;
}
