export interface LoginResponse {
  firstname: string;
  lastname: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  authorities: { authority: string }[];
}

export interface LoginRequest {
  username: string;
  password: string;
}
